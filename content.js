let shortcuts = {};

function loadShortcuts() {
  chrome.storage.local.get("shortcuts", (data) => {
    shortcuts = data.shortcuts || {};
  });
}

loadShortcuts();

// Listen for shortcut updates from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateShortcuts") {
    shortcuts = message.shortcuts || {};
  }
});

// Debounced input handler to improve performance
function handleInput(event) {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    const input = event.target;
    let text = input.value;
    for (const [shortcut, expanded] of Object.entries(shortcuts)) {
      if (text.endsWith(shortcut)) {
        const expandedText = expanded.replace("{date}", new Date().toLocaleDateString());
        const start = text.slice(0, -shortcut.length);
        input.value = start + expandedText;
        // Move cursor to end
        const end = input.value.length;
        if (input.setSelectionRange) {
          input.setSelectionRange(end, end);
        } else if (input.createTextRange) {
          const range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', end);
          range.moveStart('character', end);
          range.select();
        }
        break;
      }
    }
  }
}

// Use a debouncer to limit frequent calls
let timeoutId;
document.addEventListener("input", (event) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => handleInput(event), 100); // 100ms debounce
});