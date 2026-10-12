let currentSettings = {
  expanderEnabled: true,
  caseSensitive: false
};

let allShortcuts = {}; // Store all shortcuts for searching
let filteredShortcuts = {}; // Store filtered results
let categories = {}; // Store categories
let shortcutCategories = {}; // Store shortcut-to-category mappings
let currentCategoryFilter = 'all'; // Current category filter
let editingShortcut = null; // Track which shortcut is being edited
let editingCategory = null; // Track which category is being edited

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
      } else if (targetTab === 'categories') {
        loadCategories();
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

  // Get shortcuts based on current category filter
  const shortcutsToSearch = currentCategoryFilter === 'all' 
    ? allShortcuts 
    : getShortcutsByCategory(currentCategoryFilter);

  // Search through shortcuts and expanded text
  for (const [shortcut, expanded] of Object.entries(shortcutsToSearch)) {
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
  
  // Apply category filter when clearing search
  if (currentCategoryFilter === 'all') {
    filteredShortcuts = allShortcuts;
    displayShortcuts(allShortcuts);
  } else {
    filteredShortcuts = getShortcutsByCategory(currentCategoryFilter);
    displayShortcuts(filteredShortcuts);
  }
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
  
  chrome.storage.local.get(["shortcuts", "categories", "shortcutCategories"], (data) => {
    allShortcuts = data.shortcuts || {};
    categories = data.categories || {};
    shortcutCategories = data.shortcutCategories || {};
    
    // Apply current category filter
    if (currentCategoryFilter === 'all') {
      filteredShortcuts = allShortcuts;
    } else {
      filteredShortcuts = getShortcutsByCategory(currentCategoryFilter);
    }
    
    displayShortcuts(filteredShortcuts);
    populateCategorySelects();
    
    // Update total shortcuts in stats
    document.getElementById('total-shortcuts').textContent = Object.keys(allShortcuts).length;
    
    // Notify background to reload shortcuts in all tabs
    chrome.runtime.sendMessage({ action: "reloadShortcuts" });
  });
}

function getShortcutsByCategory(categoryId) {
  const result = {};
  for (const [shortcut, expanded] of Object.entries(allShortcuts)) {
    const shortcutCategory = shortcutCategories[shortcut] || 'uncategorized';
    if (categoryId === 'uncategorized' && !shortcutCategories[shortcut]) {
      result[shortcut] = expanded;
    } else if (shortcutCategory === categoryId) {
      result[shortcut] = expanded;
    }
  }
  return result;
}

function populateCategorySelects() {
  const categoryFilter = document.getElementById('category-filter');
  const shortcutCategory = document.getElementById('shortcut-category');
  
  // Clear existing options (except "All Categories" for filter)
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  shortcutCategory.innerHTML = '<option value="">Select Category</option>';
  
  // Add categories with counts
  const sortedCategories = Object.entries(categories).sort((a, b) => 
    a[1].name.localeCompare(b[1].name)
  );
  
  sortedCategories.forEach(([id, category]) => {
    // Count shortcuts in this category
    const categoryCount = Object.values(shortcutCategories).filter(catId => catId === id).length;
    
    // Filter dropdown - with count
    const filterOption = document.createElement('option');
    filterOption.value = id;
    filterOption.textContent = `${category.name} (${categoryCount})`;
    categoryFilter.appendChild(filterOption);
    
    // Shortcut category selector - without count (cleaner for selection)
    const shortcutOption = document.createElement('option');
    shortcutOption.value = id;
    shortcutOption.textContent = category.name;
    shortcutCategory.appendChild(shortcutOption);
  });
  
  // Add uncategorized option to filter
  const uncategorizedCount = Object.keys(allShortcuts).filter(
    shortcut => !shortcutCategories[shortcut]
  ).length;
  
  if (uncategorizedCount > 0) {
    const uncatOption = document.createElement('option');
    uncatOption.value = 'uncategorized';
    uncatOption.textContent = `Uncategorized (${uncategorizedCount})`;
    categoryFilter.appendChild(uncatOption);
  }
  
  // Set current filter
  categoryFilter.value = currentCategoryFilter;
}

function displayShortcuts(shortcuts, searchTerm = '') {
  const shortcutList = document.getElementById("shortcut-list");
  const shortcutEntries = Object.entries(shortcuts);
  
  shortcutList.innerHTML = "";
  
  if (shortcutEntries.length === 0) {
    if (!searchTerm && currentCategoryFilter === 'all') {
      shortcutList.innerHTML = '<p>No shortcuts added yet. Add your first shortcut below!</p>';
    } else if (currentCategoryFilter !== 'all') {
      shortcutList.innerHTML = '<p>No shortcuts in this category.</p>';
    }
    return;
  }

  // Create shortcut elements with search highlighting and category badges
  shortcutEntries.forEach(([shortcut, expanded]) => {
    const div = document.createElement("div");
    div.className = "shortcut-item search-result";
    
    // Get category info
    const categoryId = shortcutCategories[shortcut];
    const category = categoryId ? categories[categoryId] : null;
    
    // Truncate long expanded text for display
    let displayExpanded = expanded.length > 50 
      ? expanded.substring(0, 50) + '...' 
      : expanded;
    
    // Apply search highlighting
    const highlightedShortcut = highlightSearchTerm(shortcut, searchTerm);
    const highlightedExpanded = highlightSearchTerm(displayExpanded.replace(/\n/g, "<br>"), searchTerm);
    
    // Create category badge
    const categoryBadge = category 
      ? `<span class="category-badge" style="background-color: ${category.color}">${category.name}</span>`
      : '<span class="category-badge uncategorized">Uncategorized</span>';
    
    div.innerHTML = `
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <strong>${highlightedShortcut}</strong>
          ${categoryBadge}
        </div>
        <div style="font-size: 13px; color: #666;">${highlightedExpanded}</div>
      </div>
      <div class="shortcut-actions">
        <button class="icon-button edit-button" data-shortcut="${shortcut}" title="Edit ${shortcut}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="icon-button delete-button" data-shortcut="${shortcut}" title="Delete ${shortcut}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    
    shortcutList.appendChild(div);
  });
}

// Category Management
function loadCategories() {
  chrome.storage.local.get(["categories", "shortcutCategories", "shortcuts"], (data) => {
    categories = data.categories || {};
    shortcutCategories = data.shortcutCategories || {};
    allShortcuts = data.shortcuts || {};
    displayCategories();
  });
}

function displayCategories() {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';
  
  const categoryEntries = Object.entries(categories).sort((a, b) => 
    a[1].name.localeCompare(b[1].name)
  );
  
  if (categoryEntries.length === 0) {
    categoryList.innerHTML = '<p>No categories yet. Add your first category below!</p>';
    return;
  }
  
  categoryEntries.forEach(([id, category]) => {
    // Count shortcuts in this category
    const shortcutCount = Object.values(shortcutCategories).filter(catId => catId === id).length;
    
    const div = document.createElement('div');
    div.className = 'category-item';
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
        <div class="category-color-indicator" style="background-color: ${category.color}"></div>
        <div style="flex: 1;">
          <strong>${category.name}</strong>
          <span style="font-size: 12px; color: #666; margin-left: 8px;">(${shortcutCount} shortcuts)</span>
        </div>
      </div>
      <div class="shortcut-actions">
        <button class="icon-button edit-button" data-category-id="${id}" title="Edit ${category.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="icon-button delete-button" data-category-id="${id}" title="Delete ${category.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    categoryList.appendChild(div);
  });
}

// Edit Shortcut
function editShortcut(shortcut) {
  const expanded = allShortcuts[shortcut];
  const categoryId = shortcutCategories[shortcut] || '';
  
  // Populate form fields
  document.getElementById('shortcut').value = shortcut;
  document.getElementById('expanded').value = expanded;
  document.getElementById('shortcut-category').value = categoryId;
  
  // Keep shortcut input enabled (allow editing the key)
  document.getElementById('shortcut').disabled = false;
  
  // Change button text and style
  const addButton = document.getElementById('add');
  addButton.textContent = 'Update Shortcut';
  addButton.style.background = '#ff9800';
  
  // Show cancel button
  document.getElementById('cancel-edit').style.display = 'block';
  
  // Hide delete all button
  document.getElementById('delete-all').style.display = 'none';
  
  // Store the shortcut being edited
  editingShortcut = shortcut;
  
  // Scroll to form
  document.getElementById('shortcut').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('shortcut').focus();
}

function cancelEdit() {
  document.getElementById('shortcut').value = '';
  document.getElementById('expanded').value = '';
  document.getElementById('shortcut-category').value = '';
  document.getElementById('shortcut').disabled = false;
  
  const addButton = document.getElementById('add');
  addButton.textContent = 'Add Shortcut';
  addButton.style.background = '';
  
  // Hide cancel button
  document.getElementById('cancel-edit').style.display = 'none';
  
  // Show delete all button
  document.getElementById('delete-all').style.display = 'block';
  
  editingShortcut = null;
}

// Category Management
function loadCategories() {
  chrome.storage.local.get(["categories", "shortcutCategories", "shortcuts"], (data) => {
    categories = data.categories || {};
    shortcutCategories = data.shortcutCategories || {};
    allShortcuts = data.shortcuts || {};
    displayCategories();
  });
}

function addCategory() {
  const nameInput = document.getElementById('category-name');
  const colorInput = document.getElementById('category-color');
  
  const name = nameInput.value.trim();
  const color = colorInput.value;
  
  if (!name) {
    alert('Please enter a category name');
    return;
  }
  
  // Generate ID from name (or use existing ID if editing)
  const id = editingCategory || name.toLowerCase().replace(/\s+/g, '-');
  
  chrome.storage.local.get("categories", (data) => {
    const categories = data.categories || {};
    
    // Check if category already exists (only if not editing)
    if (!editingCategory && categories[id]) {
      alert(`Category "${name}" already exists`);
      return;
    }
    
    categories[id] = { name, color };
    
    chrome.storage.local.set({ categories }, () => {
      nameInput.value = '';
      colorInput.value = '#00594c';
      
      // Reset edit mode
      if (editingCategory) {
        cancelCategoryEdit();
      }
      
      loadCategories();
      loadShortcuts(); // Refresh shortcuts to update category selects
      
      // Show success message
      const addButton = document.getElementById('add-category');
      const originalText = editingCategory ? 'Add Category' : addButton.textContent;
      const successText = editingCategory ? 'Updated!' : 'Added!';
      addButton.textContent = successText;
      addButton.style.background = '#4CAF50';
      setTimeout(() => {
        addButton.textContent = originalText;
        addButton.style.background = '';
      }, 1000);
    });
  });
}

function editCategory(categoryId) {
  const category = categories[categoryId];
  
  if (!category) return;
  
  // Populate form fields
  document.getElementById('category-name').value = category.name;
  document.getElementById('category-color').value = category.color;
  
  // Change button text and style
  const addButton = document.getElementById('add-category');
  addButton.textContent = 'Update Category';
  addButton.style.background = '#ff9800';
  
  // Show cancel button
  document.getElementById('cancel-category-edit').style.display = 'block';
  
  // Store the category being edited
  editingCategory = categoryId;
  
  // Scroll to form
  document.getElementById('category-name').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('category-name').focus();
}

function cancelCategoryEdit() {
  document.getElementById('category-name').value = '';
  document.getElementById('category-color').value = '#00594c';
  
  const addButton = document.getElementById('add-category');
  addButton.textContent = 'Add Category';
  addButton.style.background = '';
  
  // Hide cancel button
  document.getElementById('cancel-category-edit').style.display = 'none';
  
  editingCategory = null;
}

function deleteCategory(categoryId) {
  const category = categories[categoryId];
  
  if (!category) return;
  
  // Count shortcuts in this category
  const affectedShortcuts = Object.entries(shortcutCategories)
    .filter(([_, catId]) => catId === categoryId)
    .map(([shortcut, _]) => shortcut);
  
  let message = `Delete category "${category.name}"?`;
  if (affectedShortcuts.length > 0) {
    message += `\n\n${affectedShortcuts.length} shortcut(s) will become uncategorized.`;
  }
  
  if (!confirm(message)) return;
  
  chrome.storage.local.get(["categories", "shortcutCategories"], (data) => {
    const categories = data.categories || {};
    const shortcutCategories = data.shortcutCategories || {};
    
    // Delete category
    delete categories[categoryId];
    
    // Remove category assignments
    affectedShortcuts.forEach(shortcut => {
      delete shortcutCategories[shortcut];
    });
    
    chrome.storage.local.set({ categories, shortcutCategories }, () => {
      // Cancel edit if deleting the category being edited
      if (editingCategory === categoryId) {
        cancelCategoryEdit();
      }
      
      loadCategories();
      loadShortcuts();
    });
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
    // Get category info for this shortcut
    const categoryId = shortcutCategories[stat.shortcut];
    const category = categoryId ? categories[categoryId] : null;
    
    // Create category badge
    const categoryBadge = category 
      ? `<span class="category-badge" style="background-color: ${category.color}">${category.name}</span>`
      : '<span class="category-badge uncategorized">Uncategorized</span>';
    
    const div = document.createElement('div');
    div.className = 'stats-item';
    div.innerHTML = `
      <span>
        #${index + 1} <strong>${stat.shortcut}</strong>
        ${categoryBadge}
      </span>
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

// Check for pending shortcut text from context menu
function checkPendingShortcutText() {
  chrome.storage.local.get("pendingShortcutText", (data) => {
    if (data.pendingShortcutText) {
      // Fill the expanded text field with selected text
      document.getElementById('expanded').value = data.pendingShortcutText;
      
      // Focus on the shortcut field so user can type the shortcut key
      document.getElementById('shortcut').focus();
      
      // Clear the pending text
      chrome.storage.local.remove("pendingShortcutText");
      
      // Make sure we're on the shortcuts tab
      const shortcutsTab = document.querySelector('[data-tab="shortcuts"]');
      const shortcutsContent = document.getElementById('shortcuts-tab');
      
      // Remove active from all tabs and contents
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Activate shortcuts tab
      shortcutsTab.classList.add('active');
      shortcutsContent.classList.add('active');
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
  const categoryFilter = document.getElementById("category-filter");
  const shortcutCategorySelect = document.getElementById("shortcut-category");
  const addCategoryButton = document.getElementById("add-category");
  const categoryList = document.getElementById("category-list");
  const cancelEditButton = document.getElementById("cancel-edit");
  const cancelCategoryEditButton = document.getElementById("cancel-category-edit");

  // Initialize all functionality
  initTabs();
  initSearch();

  // Cancel edit button
  cancelEditButton.addEventListener('click', cancelEdit);
  
  // Cancel category edit button
  cancelCategoryEditButton.addEventListener('click', cancelCategoryEdit);

  // Category filter handler
  categoryFilter.addEventListener('change', (e) => {
    currentCategoryFilter = e.target.value;
    
    // Clear search when changing category
    const searchBox = document.getElementById('search-shortcuts');
    searchBox.value = '';
    document.getElementById('clear-search').style.display = 'none';
    document.getElementById('search-icon').style.display = 'block';
    
    // Apply filter
    if (currentCategoryFilter === 'all') {
      filteredShortcuts = allShortcuts;
      displayShortcuts(allShortcuts);
    } else {
      filteredShortcuts = getShortcutsByCategory(currentCategoryFilter);
      displayShortcuts(filteredShortcuts);
    }
    updateSearchResults(0);
  });

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
    const categoryId = shortcutCategorySelect.value;
    
    if (!shortcut || !expanded) {
      alert('Please enter both shortcut and expanded text');
      return;
    }
    
    // Validate shortcut format (no spaces)
    if (shortcut.includes(' ')) {
      alert('Shortcuts cannot contain spaces');
      return;
    }
    
    chrome.storage.local.get(["shortcuts", "shortcutCategories", "expansionStats"], (data) => {
      const shortcuts = data.shortcuts || {};
      const shortcutCategories = data.shortcutCategories || {};
      const stats = data.expansionStats || {};
      
      // If editing and shortcut key changed
      if (editingShortcut && editingShortcut !== shortcut) {
        // Check if new shortcut key already exists
        if (shortcuts[shortcut]) {
          if (!confirm(`Shortcut "${shortcut}" already exists. Replace it?`)) {
            return;
          }
        }
        
        // Delete old shortcut and its data
        delete shortcuts[editingShortcut];
        delete shortcutCategories[editingShortcut];
        
        // Delete old stats
        const oldStatsKeys = Object.keys(stats).filter(key => key.startsWith(editingShortcut + ':'));
        oldStatsKeys.forEach(key => delete stats[key]);
      }
      // If not editing, check if shortcut already exists
      else if (!editingShortcut && shortcuts[shortcut]) {
        if (!confirm(`Shortcut "${shortcut}" already exists. Replace it?`)) {
          return;
        }
      }
      
      // Save the shortcut
      shortcuts[shortcut] = expanded;
      
      // Assign category if selected
      if (categoryId) {
        shortcutCategories[shortcut] = categoryId;
      } else {
        // Remove category assignment if "Select Category" is chosen
        delete shortcutCategories[shortcut];
      }
      
      chrome.storage.local.set({ shortcuts, shortcutCategories, expansionStats: stats }, () => {
        shortcutInput.value = "";
        expandedInput.value = "";
        shortcutCategorySelect.value = "";
        shortcutInput.disabled = false;
        
        // Hide cancel button
        document.getElementById('cancel-edit').style.display = 'none';
        
        // Show delete all button
        document.getElementById('delete-all').style.display = 'block';
        
        loadShortcuts();
        
        // Clear search to show updated shortcut
        clearSearch();
        
        // Show success message
        const originalText = editingShortcut ? 'Add Shortcut' : addButton.textContent;
        const successText = editingShortcut ? 'Updated!' : 'Added!';
        addButton.textContent = successText;
        addButton.style.background = "#4CAF50";
        
        editingShortcut = null;
        
        setTimeout(() => {
          addButton.textContent = originalText;
          addButton.style.background = "";
        }, 1000);
      });
    });
  });

  // Add category
  addCategoryButton.addEventListener('click', addCategory);
  
  // Edit and delete category
  categoryList.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    
    // Handle edit button
    if (target.classList.contains('edit-button')) {
      const categoryId = target.dataset.categoryId;
      editCategory(categoryId);
      return;
    }
    
    // Handle delete button
    if (target.classList.contains('delete-button')) {
      const categoryId = target.dataset.categoryId;
      deleteCategory(categoryId);
    }
  });

  // Allow Enter key to add shortcut
  expandedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      addButton.click();
    }
  });

  // Delete shortcut
  shortcutList.addEventListener("click", (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    
    // Handle edit button
    if (target.classList.contains('edit-button')) {
      const shortcut = target.dataset.shortcut;
      editShortcut(shortcut);
      return;
    }
    
    // Handle delete button
    if (target.classList.contains('delete-button')) {
      const shortcut = target.dataset.shortcut;
      if (confirm(`Delete shortcut "${shortcut}"?`)) {
        chrome.storage.local.get(["shortcuts", "expansionStats", "shortcutCategories"], (data) => {
          const shortcuts = data.shortcuts || {};
          const stats = data.expansionStats || {};
          const shortcutCategories = data.shortcutCategories || {};
          
          // Get the expanded text for this shortcut before deleting
          const expandedText = shortcuts[shortcut];
          
          // Delete the shortcut
          delete shortcuts[shortcut];
          
          // Delete category assignment
          delete shortcutCategories[shortcut];
          
          // Delete all stats for this shortcut
          const keysToDelete = Object.keys(stats).filter(key => key.startsWith(shortcut + ':'));
          keysToDelete.forEach(key => delete stats[key]);
          
          chrome.storage.local.set({ shortcuts, expansionStats: stats, shortcutCategories }, () => {
            // Cancel edit if deleting the shortcut being edited
            if (editingShortcut === shortcut) {
              cancelEdit();
            }
            
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
      // Clear shortcuts, stats, and category assignments in one operation
      chrome.storage.local.set({ shortcuts: {}, expansionStats: {}, shortcutCategories: {} }, () => {
        loadShortcuts();
        loadStats();
        clearSearch(); // Clear search when deleting all
      });
    }
  });

  // Initial loads 
  loadShortcuts();
  loadSettings();
  
  // Check for pending shortcut text from context menu
  checkPendingShortcutText();
});