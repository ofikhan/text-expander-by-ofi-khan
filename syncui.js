// Google Account Sync: popup UI (toggle, status line, "Sync Now" button).
// The sync itself runs in the background (sync.js); this file only shows status and sends commands.
(function () {
  let notice = null; // temporary message shown instead of the normal status line
  let noticeTimer = null;

  function formatKB(bytes) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }

  function showNotice(text, isError, ms) {
    notice = { text, isError };
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { notice = null; render(); }, ms || 6000);
    render();
  }

  function render() {
    chrome.storage.local.get(['syncEnabled', 'syncStatus'], (data) => {
      const enabled = data.syncEnabled !== false;
      const status = data.syncStatus || {};

      const toggle = document.getElementById('sync-toggle');
      const line = document.getElementById('sync-status');
      const button = document.getElementById('sync-now');

      toggle.classList.toggle('active', enabled);
      if (!button.dataset.busy) button.disabled = !enabled;
      line.classList.remove('sync-error');

      if (!enabled) {
        line.textContent = 'Sync is off. Your shortcuts stay on this computer only.';
        return;
      }

      if (notice) {
        line.textContent = notice.text;
        if (notice.isError) line.classList.add('sync-error');
        return;
      }

      if (status.error) {
        line.textContent = '\u26A0 ' + status.error;
        line.classList.add('sync-error');
        return;
      }

      if (status.waiting) {
        line.textContent = 'Waiting for your synced data to arrive from your Google account\u2026';
        return;
      }

      if (status.lastSync) {
        let text = 'Last synced: ' + new Date(status.lastSync).toLocaleString();
        if (typeof status.used === 'number') {
          text += ' \u00B7 Sync storage used: ' + formatKB(status.used) + ' of ' + formatKB(status.quota || 102400);
        }
        line.textContent = text;
        return;
      }

      line.textContent = 'Not synced yet.';
    });
  }

  function syncNow() {
    const button = document.getElementById('sync-now');
    let finished = false;

    button.dataset.busy = 'true';
    button.disabled = true;
    button.textContent = 'Syncing\u2026';

    function finish(ok) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      delete button.dataset.busy;
      button.disabled = false;

      if (ok) {
        button.textContent = '\u2713 Synced';
        setTimeout(() => { button.textContent = 'Sync Now'; }, 2000);
        render();
      } else {
        button.textContent = 'Sync Now';
        showNotice(
          '\u26A0 Could not reach the sync service. Go to chrome://extensions, click Reload on this extension, and check that sync.js is in the extension folder.',
          true,
          12000
        );
      }
    }

    const timer = setTimeout(() => finish(false), 15000);

    chrome.runtime.sendMessage({ action: 'syncNow' }, (response) => {
      const failed = chrome.runtime.lastError || !response || !response.ok;
      finish(!failed);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('sync-toggle');
    const button = document.getElementById('sync-now');

    toggle.addEventListener('click', () => {
      chrome.storage.local.get('syncEnabled', (data) => {
        const enabled = data.syncEnabled !== false;
        chrome.storage.local.set({ syncEnabled: !enabled });
      });
    });

    button.addEventListener('click', syncNow);

    render();
  });

  // Live updates while the popup is open
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.syncEnabled || changes.syncStatus)) render();
  });
})();
