const defaultShortcuts = {
  "ty": "Thank you"
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("shortcuts", (data) => {
    const shortcuts = data.shortcuts || {};
    if (Object.keys(shortcuts).length === 0) {
      chrome.storage.local.set({ shortcuts: defaultShortcuts });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reloadShortcuts") {
    chrome.storage.local.get("shortcuts", (data) => {
      const shortcuts = data.shortcuts || {};
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: "updateShortcuts", shortcuts }, () => {
            if (chrome.runtime.lastError) {
              console.log("Message failed for tab:", tab.id, chrome.runtime.lastError);
            }
          });
        });
      });
    });
  }
});