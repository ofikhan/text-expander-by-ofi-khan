const defaultShortcuts = {
  "/ty": "Thank you",
  "brb": "Be right back",
  "omw": "On my way",
  "lmk": "Let me know",
  "sig": "Best regards,\nYour Name\n{date}"
};

const defaultSettings = {
  expanderEnabled: true,
  caseSensitive: false
};

chrome.runtime.onInstalled.addListener(() => {
  // Always ensure default shortcuts are available (helps users understand how to use the extension)
  chrome.storage.local.get("shortcuts", (data) => {
    const existingShortcuts = data.shortcuts || {};
    
    // Start with existing shortcuts, then add any missing defaults
    const finalShortcuts = { ...existingShortcuts };
    
    // Add default shortcuts only if they don't already exist
    for (const [key, value] of Object.entries(defaultShortcuts)) {
      if (!finalShortcuts.hasOwnProperty(key)) {
        finalShortcuts[key] = value;
      }
    }
    
    chrome.storage.local.set({ shortcuts: finalShortcuts });
  });
  
  // Initialize settings
  chrome.storage.local.get(["expanderEnabled", "caseSensitive"], (data) => {
    const settings = {};
    if (data.expanderEnabled === undefined) settings.expanderEnabled = defaultSettings.expanderEnabled;
    if (data.caseSensitive === undefined) settings.caseSensitive = defaultSettings.caseSensitive;
    
    if (Object.keys(settings).length > 0) {
      chrome.storage.local.set(settings);
    }
  });
  
  // Initialize stats
  chrome.storage.local.get("expansionStats", (data) => {
    if (!data.expansionStats) {
      chrome.storage.local.set({ expansionStats: {} });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reloadShortcuts") {
    chrome.storage.local.get(["shortcuts", "expanderEnabled", "caseSensitive"], (data) => {
      const shortcuts = data.shortcuts || {};
      const settings = {
        expanderEnabled: data.expanderEnabled !== false,
        caseSensitive: data.caseSensitive || false
      };
      
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { 
            action: "updateShortcuts", 
            shortcuts,
            ...settings
          }, () => {
            if (chrome.runtime.lastError) {
              console.log("Message failed for tab:", tab.id, chrome.runtime.lastError);
            }
          });
        });
      });
    });
  }
  
  if (message.action === "getStats") {
    chrome.storage.local.get("expansionStats", (data) => {
      sendResponse({ stats: data.expansionStats || {} });
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.action === "clearStats") {
    chrome.storage.local.set({ expansionStats: {} }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.action === "exportData") {
    chrome.storage.local.get(["shortcuts", "expansionStats", "expanderEnabled", "caseSensitive"], (data) => {
      const exportData = {
        shortcuts: data.shortcuts || {},
        stats: data.expansionStats || {},
        settings: {
          expanderEnabled: data.expanderEnabled !== false,
          caseSensitive: data.caseSensitive || false
        },
        exportDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version
      };
      sendResponse({ data: exportData });
    });
    return true;
  }
  
  if (message.action === "importData") {
    const importData = message.data;
    const dataToSave = {};
    
    if (importData.shortcuts) dataToSave.shortcuts = importData.shortcuts;
    if (importData.stats) dataToSave.expansionStats = importData.stats;
    if (importData.settings) {
      dataToSave.expanderEnabled = importData.settings.expanderEnabled;
      dataToSave.caseSensitive = importData.settings.caseSensitive;
    }
    
    chrome.storage.local.set(dataToSave, () => {
      // Notify all tabs about the update
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: "updateSettings" }, () => {
            if (chrome.runtime.lastError) {
              console.log("Settings update failed for tab:", tab.id);
            }
          });
        });
      });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    chrome.action.openPopup();
  }
});

// Context menu (optional)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-expander",
    title: "Open Text Expander",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-expander") {
    chrome.action.openPopup();
  }
});