let currentSettings = {
  expanderEnabled: true,
  caseSensitive: false
};

let allShortcuts = {}; // Store all shortcuts for searching
let filteredShortcuts = {}; // Store filtered results

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

// Search Functionality
function initSearch() {
  const searchBox = document.getElementById('search-shortcuts');
  const clearButton = document.getElementById('clear-search');
  const searchIcon = document.getElementById('search-icon');
  const resultsInfo = document.getElementById('search-results-info');

  searchBox.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      clearButton.style.display = 'flex';
      searchIcon.style.display = 'none';
      performSearch(query);
    } else {
      clearButton.style.display = 'none';
      searchIcon.style.display = 'block';
      clearSearch();
    }
  });

  clearButton.addEventListener('click', () => {
    searchBox.value = '';
    clearSearch();
    searchBox.focus();
  });

  // Handle keyboard navigation
  searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearch();
      searchBox.blur();
    }
  });
}

function performSearch(query) {
  const searchTerm = query.toLowerCase();
  const results = {};
  let matchCount = 0;

  // Search through shortcuts and expanded text
  for (const [shortcut, expanded] of Object.entries(allShortcuts)) {
    const shortcutMatch = shortcut.toLowerCase().includes(searchTerm);
    const expandedMatch = expanded.toLowerCase().includes(searchTerm);
    
    if (shortcutMatch || expandedMatch) {
      results[shortcut] = expanded;
      matchCount++;
    }
  }

  filteredShortcuts = results;
  displayShortcuts(results, query);
  updateSearchResults(matchCount, query);
}

function clearSearch() {
  const searchBox = document.getElementById('search-shortcuts');
  const clearButton = document.getElementById('clear-search');
  const searchIcon = document.getElementById('search-icon');
  
  searchBox.value = '';
  clearButton.style.display = 'none';
  searchIcon.style.display = 'block';
  
  filteredShortcuts = allShortcuts;
  displayShortcuts(allShortcuts);
  updateSearchResults(0);
}

function updateSearchResults(count, query = '') {
  const resultsInfo = document.getElementById('search-results-info');
  
  if (query && count > 0) {
    resultsInfo.textContent = `Found ${count} shortcut${count === 1 ? '' : 's'} matching "${query}"`;
    resultsInfo.style.display = 'block';
  } else if (query && count === 0) {
    resultsInfo.textContent = `No shortcuts found matching "${query}"`;
    resultsInfo.style.display = 'block';
  } else {
    resultsInfo.textContent = '';
    resultsInfo.style.display = 'none';
  }
}

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
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

// Enhanced Shortcuts Management with Search Support
function loadShortcuts() {
  const shortcutList = document.getElementById("shortcut-list");
  
  chrome.storage.local.get("shortcuts", (data) => {
    allShortcuts = data.shortcuts || {};
    filteredShortcuts = allShortcuts;
    
    displayShortcuts(allShortcuts);
    
    // Update total shortcuts in stats
    document.getElementById('total-shortcuts').textContent = Object.keys(allShortcuts).length;
    
    // Notify background to reload shortcuts in all tabs
    chrome.runtime.sendMessage({ action: "reloadShortcuts" });
  });
}

function displayShortcuts(shortcuts, searchTerm = '') {
  const shortcutList = document.getElementById("shortcut-list");
  const shortcutEntries = Object.entries(shortcuts);
  
  shortcutList.innerHTML = "";
  
  if (shortcutEntries.length === 0) {
    if (!searchTerm) {
      shortcutList.innerHTML = '<p>No shortcuts added yet. Add your first shortcut below!</p>';
    }
    return;
  }

  // Create shortcut elements with search highlighting
  shortcutEntries.forEach(([shortcut, expanded]) => {
    const div = document.createElement("div");
    div.className = "shortcut-item search-result";
    
    // Truncate long expanded text for display
    let displayExpanded = expanded.length > 50 
      ? expanded.substring(0, 50) + '...' 
      : expanded;
    
    // Apply search highlighting
    const highlightedShortcut = highlightSearchTerm(shortcut, searchTerm);
    const highlightedExpanded = highlightSearchTerm(displayExpanded.replace(/\n/g, "<br>"), searchTerm);
    
    div.innerHTML = `
      <div style="flex: 1;">
        <strong>${highlightedShortcut}</strong>: ${highlightedExpanded}
      </div>
      <button style="margin-left: 10px;" data-shortcut="${shortcut}" title="Delete ${shortcut}">Delete</button>
    `;
    
    shortcutList.appendChild(div);
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

  // Initialize all functionality
  initTabs();
  initSearch();

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
        
        // Clear search to show new shortcut
        clearSearch();
        
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
        chrome.storage.local.get(["shortcuts", "expansionStats"], (data) => {
          const shortcuts = data.shortcuts || {};
          const stats = data.expansionStats || {};
          
          // Get the expanded text for this shortcut before deleting
          const expandedText = shortcuts[shortcut];
          
          // Delete the shortcut
          delete shortcuts[shortcut];
          
          // Delete all stats for this shortcut
          const keysToDelete = Object.keys(stats).filter(key => key.startsWith(shortcut + ':'));
          keysToDelete.forEach(key => delete stats[key]);
          
          chrome.storage.local.set({ shortcuts, expansionStats: stats }, () => {
            loadShortcuts();
            loadStats(); // Refresh stats display
            clearSearch(); // Clear search input and results after deletion
          });
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
    chrome.runtime.sendMessage({ action: "getStats" }, (response) => {
      if (response && response.stats) {
        const stats = response.stats;
        
        // Check if there are any statistics to clear
        if (Object.keys(stats).length === 0) {
          alert('No stats to delete.');
          return;
        }
        
        if (confirm('This will permanently delete all usage statistics. Continue?')) {
          chrome.runtime.sendMessage({ action: "clearStats" }, (response) => {
            if (response && response.success) {
              loadStats();
            }
          });
        }
      }
    });
  });

  // Delete all shortcuts - FIXED VERSION
  const deleteAllButton = document.getElementById("delete-all");
  deleteAllButton.addEventListener("click", () => {
    // Check if there are any shortcuts to delete
    if (Object.keys(allShortcuts).length === 0) {
      alert('No shortcuts to delete.');
      return;
    }
    
    if (confirm('Warning: Deleting all shortcuts is irreversible. Please back up your shortcuts before clicking "OK."')) {
      // Clear both shortcuts and stats in one operation
      chrome.storage.local.set({ shortcuts: {}, expansionStats: {} }, () => {
        loadShortcuts();
        loadStats();
        clearSearch(); // Clear search when deleting all
      });
    }
  });

  // Initial loads 
  loadShortcuts();
  loadSettings();
});