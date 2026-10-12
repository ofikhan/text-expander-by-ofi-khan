// Site Control: whitelist / blacklist management for the popup.
// Self-contained: reads and writes chrome.storage.local and re-renders on storage changes.
(function () {
  const state = { mode: 'off', whitelist: [], blacklist: [] };

  // Turns "https://www.Facebook.com/some/page?x=1" into "facebook.com".
  // Returns null if the input is not a valid website.
  function normalizeDomain(input) {
    let value = input.trim();
    if (!value) return null;

    value = value.replace(/^\*\./, ''); // allow "*.example.com"
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
      value = 'https://' + value;
    }

    let hostname;
    try {
      hostname = new URL(value).hostname.toLowerCase();
    } catch (e) {
      return null;
    }

    hostname = hostname.replace(/^www\./, '').replace(/\.$/, '');

    if (!/^(localhost|([a-z0-9-]+\.)+[a-z0-9-]{2,})$/.test(hostname)) return null;
    return hostname;
  }

  function load() {
    chrome.storage.local.get(['siteFilterMode', 'whitelist', 'blacklist'], (data) => {
      state.mode = ['whitelist', 'blacklist'].includes(data.siteFilterMode) ? data.siteFilterMode : 'off';
      state.whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
      state.blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
      render();
    });
  }

  function render() {
    document.querySelectorAll('input[name="site-mode"]').forEach((radio) => {
      radio.checked = radio.value === state.mode;
    });

    const panel = document.getElementById('site-list-panel');
    panel.style.display = state.mode === 'off' ? 'none' : 'block';
    if (state.mode === 'off') return;

    const list = state[state.mode];
    const help = document.getElementById('site-mode-help');

    if (state.mode === 'whitelist') {
      help.textContent = 'Text expansion works ONLY on the sites below (including their subdomains). It is disabled everywhere else.';
      if (list.length === 0) {
        help.textContent += ' The list is empty, so the extension is currently disabled on every site.';
      }
    } else {
      help.textContent = 'Text expansion is DISABLED on the sites below (including their subdomains). It works on all other sites.';
    }

    const container = document.getElementById('site-list');
    container.innerHTML = '';

    if (list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'site-empty';
      empty.textContent = 'No sites added yet.';
      container.appendChild(empty);
      return;
    }

    list.forEach((domain) => {
      const item = document.createElement('div');
      item.className = 'site-item';

      const name = document.createElement('span');
      name.textContent = domain;

      const remove = document.createElement('button');
      remove.className = 'site-remove';
      remove.dataset.domain = domain;
      remove.title = 'Remove ' + domain;
      remove.textContent = '\u2715';

      item.appendChild(name);
      item.appendChild(remove);
      container.appendChild(item);
    });
  }

  function addSite() {
    if (state.mode === 'off') return;

    const input = document.getElementById('site-input');
    const domain = normalizeDomain(input.value);

    if (!domain) {
      alert('Please enter a valid website, e.g. facebook.com or https://www.ofikhan.com');
      return;
    }

    const list = state[state.mode].slice();
    if (list.includes(domain)) {
      alert('"' + domain + '" is already in the ' + state.mode + '.');
      return;
    }

    list.push(domain);
    list.sort();
    chrome.storage.local.set({ [state.mode]: list }, () => {
      input.value = '';
      input.focus();
    });
  }

  function removeSite(domain) {
    const list = state[state.mode].filter((d) => d !== domain);
    chrome.storage.local.set({ [state.mode]: list });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="site-mode"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          chrome.storage.local.set({ siteFilterMode: radio.value });
        }
      });
    });

    document.getElementById('add-site').addEventListener('click', addSite);

    document.getElementById('site-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSite();
      }
    });

    document.getElementById('site-list').addEventListener('click', (e) => {
      const button = e.target.closest('.site-remove');
      if (button) removeSite(button.dataset.domain);
    });

    load();
  });

  // Keeps the UI in sync after import, or if settings change elsewhere
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.siteFilterMode || changes.whitelist || changes.blacklist)) {
      load();
    }
  });
})();
