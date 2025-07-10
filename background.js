// Store default shortcuts
const defaultShortcuts = {
    "ty": "Thank you"
};

// Initialize storage with default shortcuts
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ shortcuts: defaultShortcuts });
});