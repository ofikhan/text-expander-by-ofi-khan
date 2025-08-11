let currentSettings = {
  expanderEnabled: true,
  caseSensitive: false
};

// Tab Management
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Remove active from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
      
      // Load data for specific tabs
      if (targetTab === 'stats') {
        loadStats();
      }
    });
  });
}

// Settings Management
function loadSettings() {
  chrome.storage.local.get(['expanderEnabled', 'caseSensitive'], (data) => {
    currentSettings.expanderEnabled = data.expanderEnabled !== false;
    currentSettings.caseSensitive = data.caseSensitive || false;
    
    updateSettingsUI();
    updateStatusIndicator();
  });
}

function updateSettingsUI() {
  const enableToggle = document.getElementById('enable-toggle');
  const caseToggle = document.getElementById('case-toggle');
  
  enableToggle.classList.toggle('active', currentSettings.expanderEnabled);
  caseToggle.classList.toggle('active', currentSettings.caseSensitive);
}

function updateStatusIndicator() {
  const indicator = document.getElementById('status-indicator');
  indicator.className = `status-indicator ${currentSettings.expanderEnabled ? 'status-enabled' : 'status-disabled'}`;
}

function saveSettings() {
  chrome.storage.local.set(currentSettings, () => {
    // Notify all tabs about settings change
    chrome.runtime.sendMessage({ action: "reloadShortcuts" });
  });
}

// Shortcuts Management - Updated to be scrollable
function loadShortcuts() {
  const shortcutList = document.getElementById("shortcut-list");
  
  chrome.storage.local.get("shortcuts", (data) => {
    shortcutList.innerHTML = "";
    const shortcuts = data.shortcuts || {};
    const shortcutEntries = Object.entries(shortcuts);
    
    // Update total shortcuts in stats (always update this regardless of count)
    document.getElementById('total-shortcuts').textContent = shortcutEntries.length;
    
    if (shortcutEntries.length === 0) {
      shortcutList.innerHTML = '<p>No shortcuts added yet. Add your first shortcut below!</p>';
      // Don't return early, we still need to notify background
    } else {
      // Create all shortcut elements
      shortcutEntries.forEach(([shortcut, expanded]) => {
        const div = document.createElement("div");
        div.className = "shortcut-item";
        
        // Truncate long expanded text for display
        const displayExpanded = expanded.length > 50 
          ? expanded.substring(0, 50) + '...' 
          : expanded;
        
        div.innerHTML = `
          <div style="flex: 1;">
            <strong>${shortcut}</strong>: ${displayExpanded.replace(/\n/g, "<br>")}
          </div>
          <button style="margin-left: 10px;" data-shortcut="${shortcut}" title="Delete ${shortcut}">Delete</button>
        `;
        
        shortcutList.appendChild(div);
      });
    }
    
    // Notify background to reload shortcuts in all tabs
    chrome.runtime.sendMessage({ action: "reloadShortcuts" });
  });
}

// Statistics Management
function loadStats() {
  chrome.runtime.sendMessage({ action: "getStats" }, (response) => {
    if (response && response.stats) {
      displayStats(response.stats);
    }
  });
}

function displayStats(stats) {
  const statsList = document.getElementById('stats-list');
  const totalExpansions = document.getElementById('total-expansions');
  const mostUsed = document.getElementById('most-used');
  
  // Convert stats object to array and sort by usage
  const statsArray = Object.entries(stats).map(([key, count]) => {
    const [shortcut, expanded] = key.split(':');
    return { shortcut, expanded, count };
  }).sort((a, b) => b.count - a.count);
  
  // Clear and populate stats list
  statsList.innerHTML = '';
  
  if (statsArray.length === 0) {
    statsList.innerHTML = '<p>No usage statistics available yet. Start using shortcuts to see data here!</p>';
    totalExpansions.textContent = '0';
    mostUsed.textContent = 'None';
    return;
  }
  
  // Show top 10 most used shortcuts
  const topStats = statsArray.slice(0, 10);
  topStats.forEach((stat, index) => {
    const div = document.createElement('div');
    div.className = 'stats-item';
    div.innerHTML = `
      <span>#${index + 1} <strong>${stat.shortcut}</strong></span>
      <span>${stat.count} uses</span>
    `;
    statsList.appendChild(div);
  });
  
  // Update summary
  const total = statsArray.reduce((sum, stat) => sum + stat.count, 0);
  totalExpansions.textContent = total;
  mostUsed.textContent = statsArray[0] ? `${statsArray[0].shortcut} (${statsArray[0].count} uses)` : 'None';
}

// Export/Import Functions
function exportData() {
  chrome.runtime.sendMessage({ action: "exportData" }, (response) => {
    if (response && response.data) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `text-expander-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // Validate import data
      if (!data || typeof data !== 'object') {
        alert('Invalid import file format');
        return;
      }
      
      let message = 'Import data:\n';
      if (data.shortcuts) message += `- ${Object.keys(data.shortcuts).length} shortcuts\n`;
      if (data.stats) message += `- ${Object.keys(data.stats).length} usage statistics\n`;
      if (data.settings) message += `- Settings configuration\n`;
      
      message += '\nThis will replace your current data. Continue?';
      
      if (confirm(message)) {
        chrome.runtime.sendMessage({ action: "importData", data }, (response) => {
          if (response && response.success) {
            alert('Data imported successfully!');
            loadShortcuts();
            loadSettings();
            loadStats();
          } else {
            alert('Import failed. Please try again.');
          }
        });
      }
    } catch (error) {
      alert('Error reading import file. Please check the file format.');
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
}

// Check if keyboard shortcuts are enabled
function checkKeyboardShortcuts() {
  chrome.commands.getAll((commands) => {
    const executeCommand = commands.find(cmd => cmd.name === '_execute_action');
    if (!executeCommand || !executeCommand.shortcut) {
      // Show warning message to user
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = `
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 10px;
        margin: 10px 0;
        border-radius: 3px;
        font-size: 12px;
        color: #856404;
      `;
      warningDiv.innerHTML = `
        <strong>⚠️ Keyboard shortcut not enabled!</strong><br>
        Go to <a href="chrome://extensions/shortcuts" target="_blank">chrome://extensions/shortcuts</a> 
        to enable the popup shortcut.
      `;
      document.body.insertBefore(warningDiv, document.body.firstChild);
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const shortcutList = document.getElementById("shortcut-list");
  const shortcutInput = document.getElementById("shortcut");
  const expandedInput = document.getElementById("expanded");
  const addButton = document.getElementById("add");
  const exportButton = document.getElementById("export");
  const importInput = document.getElementById("import");
  const enableToggle = document.getElementById("enable-toggle");
  const caseToggle = document.getElementById("case-toggle");
  const clearStatsButton = document.getElementById("clear-stats");

  // Initialize tabs
  initTabs();

  // Settings Toggle Handlers
  enableToggle.addEventListener("click", () => {
    currentSettings.expanderEnabled = !currentSettings.expanderEnabled;
    updateSettingsUI();
    updateStatusIndicator();
    saveSettings();
  });

  caseToggle.addEventListener("click", () => {
    currentSettings.caseSensitive = !currentSettings.caseSensitive;
    updateSettingsUI();
    saveSettings();
  });

  // Add new shortcut
  addButton.addEventListener("click", () => {
    const shortcut = shortcutInput.value.trim();
    const expanded = expandedInput.value.trim();
    
    if (!shortcut || !expanded) {
      alert('Please enter both shortcut and expanded text');
      return;
    }
    
    // Validate shortcut format (no spaces)
    if (shortcut.includes(' ')) {
      alert('Shortcuts cannot contain spaces');
      return;
    }
    
    chrome.storage.local.get("shortcuts", (data) => {
      const shortcuts = data.shortcuts || {};
      
      // Check if shortcut already exists
      if (shortcuts[shortcut]) {
        if (!confirm(`Shortcut "${shortcut}" already exists. Replace it?`)) {
          return;
        }
      }
      
      shortcuts[shortcut] = expanded;
      chrome.storage.local.set({ shortcuts }, () => {
        shortcutInput.value = "";
        expandedInput.value = "";
        loadShortcuts();
        
        // Show success message
        const originalText = addButton.textContent;
        addButton.textContent = "Added!";
        addButton.style.background = "#4CAF50";
        setTimeout(() => {
          addButton.textContent = originalText;
          addButton.style.background = "";
        }, 1000);
      });
    });
  });

  // Allow Enter key to add shortcut
  expandedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      addButton.click();
    }
  });

  // Delete shortcut
  shortcutList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const shortcut = event.target.dataset.shortcut;
      if (confirm(`Delete shortcut "${shortcut}"?`)) {
        chrome.storage.local.get("shortcuts", (data) => {
          const shortcuts = data.shortcuts || {};
          delete shortcuts[shortcut];
          chrome.storage.local.set({ shortcuts }, loadShortcuts);
        });
      }
    }
  });

  // Export data
  exportButton.addEventListener("click", exportData);

  // Import data
  importInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      importData(file);
      event.target.value = ''; // Reset file input
    }
  });

  // Clear statistics
  clearStatsButton.addEventListener("click", () => {
    if (confirm('This will permanently delete all usage statistics. Continue?')) {
      chrome.runtime.sendMessage({ action: "clearStats" }, (response) => {
        if (response && response.success) {
          loadStats();
          alert('Statistics cleared successfully!');
        }
      });
    }
  });

  // Delete all shortcuts
  const deleteAllButton = document.getElementById("delete-all");
  deleteAllButton.addEventListener("click", () => {
    if (confirm('Warning: Deleting all shortcuts is irreversible. Please back up your shortcuts before clicking "OK."')) {
      chrome.storage.local.set({ shortcuts: {} }, () => {
        loadShortcuts(); // This will update the total shortcuts count to 0
        // Also clear the statistics
        chrome.runtime.sendMessage({ action: "clearStats" }, (response) => {
          if (response && response.success) {
            loadStats();
            alert('All shortcuts have been deleted and statistics cleared.');
          } else {
            alert('All shortcuts have been deleted.');
          }
        });
      });
    }
  });

  // Initial loads 
  loadShortcuts();
  loadSettings();
});