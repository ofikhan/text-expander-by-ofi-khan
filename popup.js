function loadShortcuts() {
  const shortcutList = document.getElementById("shortcut-list");
  chrome.storage.local.get("shortcuts", (data) => {
    shortcutList.innerHTML = "";
    const shortcuts = data.shortcuts || {};
    for (const [shortcut, expanded] of Object.entries(shortcuts)) {
      const div = document.createElement("div");
      div.className = "shortcut-item";
      div.innerHTML = `<strong>${shortcut}</strong>: ${expanded.replace(/\n/g, "<br>")}<button style="margin:5px;" data-shortcut="${shortcut}">Delete</button>`;
      shortcutList.appendChild(div);
    }
    // Notify background to reload shortcuts in all tabs
    chrome.runtime.sendMessage({ action: "reloadShortcuts" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const shortcutList = document.getElementById("shortcut-list");
  const shortcutInput = document.getElementById("shortcut");
  const expandedInput = document.getElementById("expanded");
  const addButton = document.getElementById("add");
  const exportButton = document.getElementById("export");
  const importInput = document.getElementById("import");

  // Add new shortcut
  addButton.addEventListener("click", () => {
    const shortcut = shortcutInput.value.trim();
    const expanded = expandedInput.value.trim();
    if (shortcut && expanded) {
      chrome.storage.local.get("shortcuts", (data) => {
        const shortcuts = data.shortcuts || {};
        shortcuts[shortcut] = expanded;
        chrome.storage.local.set({ shortcuts }, () => {
          shortcutInput.value = "";
          expandedInput.value = "";
          loadShortcuts();
        });
      });
    }
  });

  // Delete shortcut
  shortcutList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const shortcut = event.target.dataset.shortcut;
      chrome.storage.local.get("shortcuts", (data) => {
        const shortcuts = data.shortcuts || {};
        delete shortcuts[shortcut];
        chrome.storage.local.set({ shortcuts }, loadShortcuts);
      });
    }
  });

  // Export shortcuts
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      chrome.storage.local.get("shortcuts", (data) => {
        const blob = new Blob([JSON.stringify(data.shortcuts || {}, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "shortcuts.json";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }

  // Import shortcuts
  if (importInput) {
    importInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const shortcuts = JSON.parse(e.target.result);
            if (shortcuts && typeof shortcuts === 'object') {
              chrome.storage.local.set({ shortcuts }, loadShortcuts);
            } else {
              console.error("Invalid shortcut data format");
            }
          } catch (error) {
            console.error("Error parsing JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  loadShortcuts(); // Initial load
});