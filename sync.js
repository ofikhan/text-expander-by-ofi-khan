// Google Account Sync engine.
// Loaded by background.js with importScripts('sync.js').
//
// How it works
// - chrome.storage.local stays the working copy (fast, used by content.js and the popup).
// - Data is mirrored to chrome.storage.sync, which Chrome syncs through the user's Google account.
// - Three independent sections are synced: content (shortcuts + categories), settings, stats.
// - Each section is compressed (gzip + base64) and split into small chunks, because
//   chrome.storage.sync allows only ~8 KB per item and ~100 KB in total.
// - Changes are merged with a three-way merge against the last synced snapshot, so edits made
//   on two computers are combined instead of one overwriting the other.
const SyncEngine = (() => {
  const SECTIONS = {
    content: ['shortcuts', 'categories', 'shortcutCategories'],
    settings: ['expanderEnabled', 'caseSensitive', 'prefixEnabled', 'prefixChar', 'siteFilterMode', 'whitelist', 'blacklist'],
    stats: ['expansionStats']
  };
  const SECTION_NAMES = Object.keys(SECTIONS);

  const SETTING_DEFAULTS = {
    expanderEnabled: true,
    caseSensitive: false,
    prefixEnabled: false,
    prefixChar: '/',
    siteFilterMode: 'off',
    whitelist: [],
    blacklist: []
  };

  const CHUNK_SIZE = 7000; // characters (base64 is plain ASCII, so 1 char = 1 byte)

  let delays = { content: 3000, settings: 3000, stats: 20000, remote: 1500, retry: 30000, rateLimitRetry: 61000 };
  let defaults = { shortcuts: {}, categories: {}, shortcutCategories: {} };
  let chain = Promise.resolve();
  const timers = {};

  // ---------- Small helpers ----------

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }

  function bytesToBase64(bytes) {
    let binary = '';
    const step = 0x8000;
    for (let i = 0; i < bytes.length; i += step) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
    }
    return btoa(binary);
  }

  function base64ToBytes(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function compress(text) {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
    const buffer = await new Response(stream).arrayBuffer();
    return bytesToBase64(new Uint8Array(buffer));
  }

  async function decompress(b64) {
    const stream = new Blob([base64ToBytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }

  function splitChunks(text, size) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks.length ? chunks : [''];
  }

  // ---------- Local section read / write ----------

  function emptySection(section) {
    if (section === 'content') return { shortcuts: {}, categories: {}, shortcutCategories: {} };
    if (section === 'stats') return { expansionStats: {} };
    return {};
  }

  async function readLocalSection(section) {
    const data = await chrome.storage.local.get(SECTIONS[section]);
    const out = {};
    for (const key of SECTIONS[section]) {
      if (section === 'settings') {
        if (data[key] !== undefined) out[key] = data[key];
      } else {
        out[key] = data[key] || {};
      }
    }
    return clone(out);
  }

  async function applyLocalSection(section, merged) {
    const toSet = {};
    for (const key of SECTIONS[section]) {
      if (merged[key] !== undefined) toSet[key] = merged[key];
    }
    if (Object.keys(toSet).length > 0) {
      await chrome.storage.local.set(toSet);
    }
  }

  // True when the local data is just the untouched defaults (e.g. a fresh install).
  // Untouched data is never pushed, and it never overrides data that is already in the cloud.
  function isUntouched(section, local) {
    if (section === 'content') {
      const empty = Object.values(local).every((v) => Object.keys(v || {}).length === 0);
      const isDefault =
        deepEqual(local.shortcuts || {}, defaults.shortcuts) &&
        deepEqual(local.categories || {}, defaults.categories) &&
        deepEqual(local.shortcutCategories || {}, defaults.shortcutCategories);
      return empty || isDefault;
    }
    if (section === 'settings') {
      return Object.keys(SETTING_DEFAULTS).every(
        (k) => local[k] === undefined || deepEqual(local[k], SETTING_DEFAULTS[k])
      ) && Object.keys(local).every((k) => k in SETTING_DEFAULTS);
    }
    return Object.keys(local.expansionStats || {}).length === 0;
  }

  // ---------- Remote (chrome.storage.sync) read / write ----------

  const metaKey = (section) => `ts_${section}_meta`;
  const chunkKey = (section, i) => `ts_${section}_${i}`;

  async function readRemoteSection(section) {
    const metaResult = await chrome.storage.sync.get(metaKey(section));
    const meta = metaResult[metaKey(section)];
    if (!meta) return { status: 'none' };

    const keys = Array.from({ length: meta.n }, (_, i) => chunkKey(section, i));
    const got = await chrome.storage.sync.get(keys);
    if (keys.some((k) => typeof got[k] !== 'string')) return { status: 'incomplete' };

    try {
      const json = await decompress(keys.map((k) => got[k]).join(''));
      return { status: 'ok', t: meta.t, data: JSON.parse(json) };
    } catch (e) {
      // Chunks from two different versions mixed together, or data still arriving
      return { status: 'incomplete' };
    }
  }

  async function pushRemoteSection(section, data) {
    const previous = (await chrome.storage.sync.get(metaKey(section)))[metaKey(section)];
    const chunks = splitChunks(await compress(JSON.stringify(data)), CHUNK_SIZE);

    const items = {};
    chunks.forEach((chunk, i) => { items[chunkKey(section, i)] = chunk; });
    items[metaKey(section)] = { t: Date.now(), n: chunks.length, v: 1 };
    await chrome.storage.sync.set(items);

    if (previous && previous.n > chunks.length) {
      const stale = [];
      for (let i = chunks.length; i < previous.n; i++) stale.push(chunkKey(section, i));
      await chrome.storage.sync.remove(stale);
    }
  }

  // ---------- Three-way merge ----------

  // Merges key/value maps. A key changed on only one side takes that side's value.
  // If both sides changed the same key differently, preferLocal decides.
  function mergeMaps(base, local, remote, preferLocal) {
    const out = {};
    const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
    for (const key of keys) {
      const b = base[key];
      const l = local[key];
      const r = remote[key];
      const localChanged = !deepEqual(l, b);
      const remoteChanged = !deepEqual(r, b);

      let value;
      if (!localChanged && !remoteChanged) value = b;
      else if (localChanged && !remoteChanged) value = l;
      else if (!localChanged && remoteChanged) value = r;
      else if (deepEqual(l, r)) value = l;
      else value = preferLocal ? l : r;

      if (value !== undefined) out[key] = value;
    }
    return out;
  }

  // Merges usage counters: base + changes made locally + changes made remotely.
  function mergeCounters(base, local, remote) {
    const out = {};
    const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
    for (const key of keys) {
      const value = (local[key] || 0) + (remote[key] || 0) - (base[key] || 0);
      if (value > 0) out[key] = value;
    }
    return out;
  }

  function mergeSection(section, base, local, remote, preferLocal) {
    if (section === 'content') {
      const out = {};
      for (const key of SECTIONS.content) {
        out[key] = mergeMaps(base[key] || {}, local[key] || {}, remote[key] || {}, preferLocal);
      }
      return out;
    }
    if (section === 'settings') {
      return mergeMaps(base, local, remote, preferLocal);
    }
    return {
      expansionStats: mergeCounters(
        base.expansionStats || {},
        local.expansionStats || {},
        remote.expansionStats || {}
      )
    };
  }

  // ---------- State ----------

  async function isEnabled() {
    const { syncEnabled } = await chrome.storage.local.get('syncEnabled');
    return syncEnabled !== false;
  }

  async function loadState() {
    const { syncState } = await chrome.storage.local.get('syncState');
    const state = syncState || {};
    return { base: state.base || {}, changedAt: state.changedAt || {} };
  }

  async function saveState(state) {
    await chrome.storage.local.set({ syncState: state });
  }

  async function setStatus(patch) {
    const { syncStatus } = await chrome.storage.local.get('syncStatus');
    await chrome.storage.local.set({ syncStatus: { ...(syncStatus || {}), ...patch } });
  }

  function describeError(error) {
    const message = String((error && error.message) || error);
    if (/MAX_WRITE_OPERATIONS/i.test(message)) {
      return { text: 'Sync is briefly paused because of Chrome\'s write limit. It will retry automatically.', transient: true };
    }
    if (/QUOTA|MAX_ITEMS/i.test(message)) {
      return {
        text: 'Google sync storage is full, so some changes are not syncing. Your data is safe on this computer. Delete unused shortcuts or clear stats to free space.',
        transient: false
      };
    }
    return { text: 'Sync problem: ' + message, transient: true };
  }

  // ---------- Reconcile ----------

  async function reconcileSection(section, state) {
    const local = await readLocalSection(section);
    const base = state.base[section]; // undefined = this computer has never synced this section
    const remote = await readRemoteSection(section);

    if (remote.status === 'incomplete') return 'incomplete';

    const untouched = base === undefined && isUntouched(section, local);

    if (remote.status === 'none') {
      if (untouched) return 'ok'; // nothing worth uploading yet
      await pushRemoteSection(section, local);
      state.base[section] = clone(local);
      return 'ok';
    }

    // Already in sync
    if (base !== undefined && deepEqual(local, base) && deepEqual(remote.data, base)) return 'ok';
    if (deepEqual(local, remote.data)) {
      state.base[section] = clone(local);
      return 'ok';
    }

    const preferLocal = (state.changedAt[section] || 0) > (remote.t || 0);
    const baseForMerge = base === undefined ? emptySection(section) : base;
    const localForMerge = untouched ? emptySection(section) : local;
    const merged = mergeSection(section, baseForMerge, localForMerge, remote.data, preferLocal);

    if (!deepEqual(merged, local)) await applyLocalSection(section, merged);
    if (!deepEqual(merged, remote.data)) await pushRemoteSection(section, merged);

    state.base[section] = clone(merged);
    return 'ok';
  }

  function enqueue(task) {
    const result = chain.then(task);
    chain = result.catch((e) => console.warn('[sync]', e));
    return result.catch(() => {});
  }

  function schedule(section, delay) {
    clearTimeout(timers[section]);
    timers[section] = setTimeout(() => run([section]), delay);
  }

  function run(sections) {
    return enqueue(async () => {
      if (!(await isEnabled())) return;

      const state = await loadState();
      let error = null;
      let waiting = false;

      for (const section of sections) {
        try {
          const result = await reconcileSection(section, state);
          if (result === 'incomplete') {
            waiting = true;
            schedule(section, delays.retry);
          }
        } catch (e) {
          const info = describeError(e);
          error = info.text;
          if (info.transient) {
            schedule(section, /MAX_WRITE/i.test(String(e && e.message)) ? delays.rateLimitRetry : delays.retry);
          }
        }
        await saveState(state);
      }

      let used = null;
      try { used = await chrome.storage.sync.getBytesInUse(null); } catch (e) { /* ignore */ }

      const patch = { error, waiting, used, quota: chrome.storage.sync.QUOTA_BYTES || 102400 };
      if (!error && !waiting) patch.lastSync = Date.now();
      await setStatus(patch);
    });
  }

  function onLocalChange(section) {
    enqueue(async () => {
      // Track the change time even while sync is off, so "newest edit wins" stays accurate
      const state = await loadState();
      const local = await readLocalSection(section);
      const base = state.base[section];
      const changed = base === undefined ? !isUntouched(section, local) : !deepEqual(local, base);
      if (changed) {
        state.changedAt[section] = Date.now();
        await saveState(state);
      }
    }).then(() => schedule(section, delays[section]));
  }

  // ---------- Wiring ----------

  function init(config = {}) {
    if (config.defaults) defaults = config.defaults;
    if (config.delays) delays = { ...delays, ...config.delays };

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.syncEnabled) run(SECTION_NAMES);
        SECTION_NAMES
          .filter((section) => SECTIONS[section].some((key) => key in changes))
          .forEach(onLocalChange);
      } else if (area === 'sync') {
        SECTION_NAMES
          .filter((section) => metaKey(section) in changes)
          .forEach((section) => schedule(section, delays.remote));
      }
    });

    chrome.runtime.onStartup.addListener(() => run(SECTION_NAMES));

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message && message.action === 'syncNow') {
        run(SECTION_NAMES).then(() => sendResponse({ ok: true }));
        return true;
      }
    });

    // The service worker may have been asleep: always catch up when it starts.
    run(SECTION_NAMES);
  }

  return { init, syncNow: () => run(SECTION_NAMES) };
})();
