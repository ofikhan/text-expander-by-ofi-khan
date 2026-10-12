// Trigger prefix: optional character that must be typed before a shortcut.
// Self-contained: reads and writes chrome.storage.local and re-renders on storage changes.
(function () {
  const DEFAULT_CHAR = '/';
  const state = { enabled: false, char: DEFAULT_CHAR };

  function load() {
    chrome.storage.local.get(['prefixEnabled', 'prefixChar'], (data) => {
      state.enabled = data.prefixEnabled === true;
      state.char = (typeof data.prefixChar === 'string' && data.prefixChar) ? data.prefixChar : DEFAULT_CHAR;
      render();
    });
  }

  function render() {
    const toggle = document.getElementById('prefix-toggle');
    const options = document.getElementById('prefix-options');
    const input = document.getElementById('prefix-char');
    const help = document.getElementById('prefix-help');

    toggle.classList.toggle('active', state.enabled);
    options.style.display = state.enabled ? 'block' : 'none';

    // Don't overwrite what the user is typing
    if (document.activeElement !== input) {
      input.value = state.char;
    }

    help.textContent =
      'Shortcuts expand only when typed with the prefix: type ' + state.char + 'brb to expand "brb". ' +
      'Typing "brb" on its own will not expand. ' +
      'Shortcuts that already start with ' + state.char + ' (like ' + state.char + 'ty) work as they are.';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('prefix-toggle');
    const input = document.getElementById('prefix-char');

    toggle.addEventListener('click', () => {
      const enabled = !state.enabled;
      // Store the character too, so it is always defined once the feature is on
      chrome.storage.local.set({ prefixEnabled: enabled, prefixChar: state.char });
    });

    input.addEventListener('input', () => {
      const value = input.value;
      if (!value || /\s/.test(value)) {
        input.classList.add('invalid');
        return;
      }
      input.classList.remove('invalid');
      chrome.storage.local.set({ prefixChar: value });
    });

    // Restore the last valid character if the field is left empty or invalid
    input.addEventListener('blur', () => {
      input.classList.remove('invalid');
      input.value = state.char;
    });

    load();
  });

  // Keeps the UI in sync after import, or if settings change elsewhere
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.prefixEnabled || changes.prefixChar)) {
      load();
    }
  });
})();
