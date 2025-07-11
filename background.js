// Store default shortcuts
const defaultShortcuts = {
  "ty": "Thank you"
};

// Initialize or update storage with default shortcuts
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("shortcuts", (data) => {
    const shortcuts = data.shortcuts || {};
    if (Object.keys(shortcuts).length === 0) {
      chrome.storage.local.set({ shortcuts: defaultShortcuts });
    }
  });
});

// Listen for messages to reload shortcuts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reloadShortcuts") {
    chrome.storage.local.get("shortcuts", (data) => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: "updateShortcuts", shortcuts: data.shortcuts || {} });
        });
      });
    });
  }
});