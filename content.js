let shortcuts = {};

function loadShortcuts() {
  chrome.storage.local.get("shortcuts", (data) => {
    shortcuts = data.shortcuts || {};
    console.log("Shortcuts loaded:", shortcuts);
    applyToAllFrames();
  });
}

function applyToAllFrames() {
  document.querySelectorAll("iframe").forEach((frame) => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (doc) {
        setupInputListener(doc);
      }
    } catch (e) {
      console.log("Cannot access iframe:", e);
    }
  });
}

function setupInputListener(doc) {
  const inputs = doc.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", handleInput);
  });

  // Handle shadow DOM (e.g., Google Docs)
  const shadowRoots = doc.querySelectorAll("*").map(el => el.shadowRoot).filter(sr => sr);
  shadowRoots.forEach((shadowRoot) => {
    const shadowInputs = shadowRoot.querySelectorAll("input, textarea");
    shadowInputs.forEach((input) => {
      input.addEventListener("input", handleInput);
    });
  });
}

function handleInput(event) {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    const input = event.target;
    let text = input.value;
    for (const [shortcut, expanded] of Object.entries(shortcuts)) {
      if (text.includes(shortcut) && (text.length === shortcut.length || text.slice(-shortcut.length - 1, -shortcut.length) === " ")) {
        const expandedText = expanded.replace("{date}", new Date().toLocaleDateString());
        const start = text.slice(0, text.lastIndexOf(shortcut));
        input.value = start + expandedText;
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

let timeoutId;
document.addEventListener("input", (event) => {
  console.log("Input event triggered on main document");
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => handleInput(event), 100);
});

// Initial setup and listen for updates
loadShortcuts();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateShortcuts") {
    shortcuts = message.shortcuts || {};
    console.log("Shortcuts updated:", shortcuts);
    applyToAllFrames();
  }
});

// Handle dynamic frame additions
new MutationObserver((mutations) => {
  applyToAllFrames();
}).observe(document.body, { childList: true, subtree: true });