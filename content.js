document.addEventListener("input", (event) => {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    chrome.storage.sync.get("shortcuts", (data) => {
      const shortcuts = data.shortcuts || {};
      const input = event.target;
      let text = input.value;
      for (const [shortcut, expanded] of Object.entries(shortcuts)) {
        if (text.endsWith(shortcut)) {
          let expandedText = expanded
            .replace("{date}", new Date().toLocaleDateString());
          input.value = text.slice(0, -shortcut.length) + expandedText;
          break;
        }
      }
    });
  }
});