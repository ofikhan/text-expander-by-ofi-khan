let shortcuts = {};
let expanderEnabled = true;
let caseSensitive = false;
let lastExpansion = null;

// Load all settings
function loadSettings() {
  // Load shortcuts and settings from storage.  If the expander is disabled,
  // expansions will be no-ops.  We intentionally avoid attaching event
  // listeners to individual elements here; instead we register global
  // listeners (see below) that handle any text input or contenteditable
  // element.  This avoids missing dynamically created inputs and works
  // across a wider range of editors.
  chrome.storage.local.get(["shortcuts", "expanderEnabled", "caseSensitive"], (data) => {
    shortcuts = data.shortcuts || {};
    expanderEnabled = data.expanderEnabled !== false;
    caseSensitive = data.caseSensitive || false;
  });
}

function getTextInputElements() {
  return document.querySelectorAll(`
    input[type='text'], 
    input[type='search'], 
    input[type='email'], 
    input[type='url'], 
    input[type='password'],
    input:not([type]),
    textarea,
    [contenteditable='true'],
    [contenteditable=''],
    .ql-editor,
    .ace_text-input,
    .CodeMirror textarea
  `);
}

// `applyListeners` is retained for backwards compatibility but does nothing.
// Global listeners are registered at the bottom of this file instead.
function applyListeners() {
  // No-op: event handlers are attached globally via document listeners.
}

// Enhanced variable expansion
function expandVariables(text) {
  const now = new Date();
  
  return text
    .replace(/\{date\}/g, now.toLocaleDateString())
    .replace(/\{time\}/g, now.toLocaleTimeString())
    .replace(/\{datetime\}/g, now.toLocaleString())
    .replace(/\{year\}/g, now.getFullYear().toString())
    .replace(/\{month\}/g, (now.getMonth() + 1).toString().padStart(2, '0'))
    .replace(/\{day\}/g, now.getDate().toString().padStart(2, '0'))
    .replace(/\{timestamp\}/g, now.getTime().toString());
    // Note: {cursor} is handled separately in the expansion functions
}

// Enhanced matching function
function findMatchingShortcut(word, shortcuts) {
  if (!expanderEnabled) return null;
  
  for (const [shortcut, expanded] of Object.entries(shortcuts)) {
    const matchWord = caseSensitive ? word : word.toLowerCase();
    const matchShortcut = caseSensitive ? shortcut : shortcut.toLowerCase();
    
    if (matchWord === matchShortcut) {
      return { shortcut, expanded };
    }
  }
  return null;
}

// Site-specific rules
const siteRules = {
  'github.com': {
    excludeSelectors: ['.CodeMirror', '.ace_editor'],
    includeSelectors: ['[name="commit_message"]', '#issue_body']
  },
  'stackoverflow.com': {
    includeSelectors: ['#wmd-input', '.s-textarea']
  },
  'joomshaper.com': {
    disableCustomSelectAll: true  // Disable custom CMD/CTRL+A handling for JoomShaper
  }
};

function shouldExpandOnSite(element) {
  const hostname = window.location.hostname;
  const rules = siteRules[hostname];
  
  if (!rules) return true;
  
  if (rules.excludeSelectors) {
    for (const selector of rules.excludeSelectors) {
      if (element.matches(selector) || element.closest(selector)) {
        return false;
      }
    }
  }
  
  if (rules.includeSelectors) {
    for (const selector of rules.includeSelectors) {
      if (element.matches(selector) || element.closest(selector)) {
        return true;
      }
    }
    return false;
  }
  
  return true;
}

// Track expansion statistics
function trackExpansion(shortcut, expanded) {
  chrome.storage.local.get("expansionStats", (data) => {
    const stats = data.expansionStats || {};
    const key = `${shortcut}:${expanded}`;
    stats[key] = (stats[key] || 0) + 1;
    chrome.storage.local.set({ expansionStats: stats });
  });
}

function handleInput(event) {
  const input = event.target;
  if (!shouldExpandOnSite(input)) return;
  
  if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
    let text = input.value;
    const cursorPos = input.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPos);
    const words = textBeforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    const match = findMatchingShortcut(lastWord, shortcuts);
    if (match) {
      const expandedText = expandVariables(match.expanded);
      
      const beforeShortcut = textBeforeCursor.slice(0, -lastWord.length);
      const afterCursor = text.substring(cursorPos);
      
      // Save for undo
      lastExpansion = {
        element: input,
        originalText: text,
        shortcut: match.shortcut,
        timestamp: Date.now()
      };
      
      // Handle cursor positioning
      if (expandedText.includes('{cursor}')) {
        const cursorIndex = expandedText.indexOf('{cursor}');
        const finalExpandedText = expandedText.replace('{cursor}', '');
        const newText = beforeShortcut + finalExpandedText + afterCursor;
        input.value = newText;
        
        // Set cursor position
        const newCursorPos = beforeShortcut.length + cursorIndex;
        input.setSelectionRange(newCursorPos, newCursorPos);
      } else {
        const newText = beforeShortcut + expandedText + afterCursor;
        input.value = newText;
        
        // Set cursor at end of expanded text
        const newCursorPos = beforeShortcut.length + expandedText.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
      
      input.dispatchEvent(new Event('input', { bubbles: true }));
      trackExpansion(match.shortcut, match.expanded);
    }
  }
}

function handleKeyDown(event) {
  if (event.key === ' ' || event.key === 'Tab' || event.key === 'Enter') {
    const input = event.target;
    if (!shouldExpandOnSite(input)) return;
    
    if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
      let text = input.value;
      const cursorPos = input.selectionStart;
      const textBeforeCursor = text.substring(0, cursorPos);
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];
      
      const match = findMatchingShortcut(lastWord, shortcuts);
      if (match) {
        event.preventDefault();
        
        const expandedText = expandVariables(match.expanded);
        const beforeShortcut = textBeforeCursor.slice(0, -lastWord.length);
        const afterCursor = text.substring(cursorPos);
        const triggerChar = event.key === 'Tab' ? '\t' : (event.key === 'Enter' ? '\n' : ' ');
        
        // Handle cursor positioning
        if (expandedText.includes('{cursor}')) {
          const cursorIndex = expandedText.indexOf('{cursor}');
          const finalExpandedText = expandedText.replace('{cursor}', '');
          const newText = beforeShortcut + finalExpandedText + triggerChar + afterCursor;
          input.value = newText;
          
          // Set cursor position (before the trigger character)
          const newCursorPos = beforeShortcut.length + cursorIndex;
          input.setSelectionRange(newCursorPos, newCursorPos);
        } else {
          const newText = beforeShortcut + expandedText + triggerChar + afterCursor;
          input.value = newText;
          
          // Set cursor after trigger character
          const newCursorPos = beforeShortcut.length + expandedText.length + 1;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
        
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trackExpansion(match.shortcut, match.expanded);
      }
    }
  }
}

function handleContentEditableInput(event) {
  const element = event.target;
  if (!shouldExpandOnSite(element)) return;
  
  try {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (textNode.nodeType !== Node.TEXT_NODE) return;
    
    const text = textNode.textContent;
    const cursorPos = range.startOffset;
    const textBeforeCursor = text.substring(0, cursorPos);
    const words = textBeforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    const match = findMatchingShortcut(lastWord, shortcuts);
    if (match) {
      const expandedText = expandVariables(match.expanded);
      
      const beforeShortcut = textBeforeCursor.slice(0, -lastWord.length);
      const afterCursor = text.substring(cursorPos);
      
      // Handle cursor positioning for contenteditable
      if (expandedText.includes('{cursor}')) {
        const cursorIndex = expandedText.indexOf('{cursor}');
        const finalExpandedText = expandedText.replace('{cursor}', '');
        const newText = beforeShortcut + finalExpandedText + afterCursor;
        textNode.textContent = newText;
        
        // Set cursor position
        const newCursorPos = beforeShortcut.length + cursorIndex;
        range.setStart(textNode, newCursorPos);
        range.setEnd(textNode, newCursorPos);
      } else {
        const newText = beforeShortcut + expandedText + afterCursor;
        textNode.textContent = newText;
        
        // Set cursor at end of expanded text
        const newCursorPos = beforeShortcut.length + expandedText.length;
        range.setStart(textNode, newCursorPos);
        range.setEnd(textNode, newCursorPos);
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      trackExpansion(match.shortcut, match.expanded);
    }
  } catch (error) {
    console.log("Error handling contenteditable input:", error);
  }
}

function handleContentEditableKeyDown(event) {
  if (event.key === ' ' || event.key === 'Tab' || event.key === 'Enter') {
    const element = event.target;
    if (!shouldExpandOnSite(element)) return;
    
    try {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      
      if (textNode.nodeType !== Node.TEXT_NODE) return;
      
      const text = textNode.textContent;
      const cursorPos = range.startOffset;
      const textBeforeCursor = text.substring(0, cursorPos);
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];
      
      const match = findMatchingShortcut(lastWord, shortcuts);
      if (match) {
        event.preventDefault();
        
        const expandedText = expandVariables(match.expanded);
        const beforeShortcut = textBeforeCursor.slice(0, -lastWord.length);
        const afterCursor = text.substring(cursorPos);
        const triggerChar = event.key === 'Tab' ? '\t' : (event.key === 'Enter' ? '\n' : ' ');
        
        // Handle cursor positioning for contenteditable
        if (expandedText.includes('{cursor}')) {
          const cursorIndex = expandedText.indexOf('{cursor}');
          const finalExpandedText = expandedText.replace('{cursor}', '');
          const newText = beforeShortcut + finalExpandedText + triggerChar + afterCursor;
          textNode.textContent = newText;
          
          // Set cursor position (before the trigger character)
          const newCursorPos = beforeShortcut.length + cursorIndex;
          range.setStart(textNode, newCursorPos);
          range.setEnd(textNode, newCursorPos);
        } else {
          const newText = beforeShortcut + expandedText + triggerChar + afterCursor;
          textNode.textContent = newText;
          
          // Set cursor after trigger character
          const newCursorPos = beforeShortcut.length + expandedText.length + 1;
          range.setStart(textNode, newCursorPos);
          range.setEnd(textNode, newCursorPos);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
        
        trackExpansion(match.shortcut, match.expanded);
      }
    } catch (error) {
      console.log("Error handling contenteditable keydown:", error);
    }
  }
}

// Handle dynamically added elements
const observer = new MutationObserver((mutations) => {
  let shouldReapply = false;
  
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (isTextInput(node) || (node.querySelector && node.querySelectorAll('input, textarea, [contenteditable]').length > 0)) {
            shouldReapply = true;
          }
        }
      });
    }
  });
  
  if (shouldReapply) {
    clearTimeout(observer.debounceTimer);
    observer.debounceTimer = setTimeout(applyListeners, 100);
  }
});

function isTextInput(element) {
  const tagName = element.tagName;
  const type = element.type;
  
  return (tagName === 'INPUT' && ['text', 'search', 'email', 'url', 'password'].includes(type)) ||
         (tagName === 'INPUT' && !type) ||
         tagName === 'TEXTAREA' ||
         element.contentEditable === 'true';
}

observer.observe(document.body, { childList: true, subtree: true });

// Handle special cases for popular websites
function handleSpecialCases() {
  // Gmail compose
  if (window.location.hostname.includes('mail.google.com')) {
    setTimeout(() => {
      const gmailEditor = document.querySelector('[contenteditable="true"][role="textbox"]');
      if (gmailEditor && !gmailEditor.dataset.expanderListener) {
        gmailEditor.addEventListener("input", handleContentEditableInput);
        gmailEditor.addEventListener("keydown", handleContentEditableKeyDown);
        gmailEditor.dataset.expanderListener = "true";
      }
    }, 2000);
  }
  
  // WhatsApp Web
  if (window.location.hostname.includes('web.whatsapp.com')) {
    setTimeout(() => {
      const whatsappInput = document.querySelector('[contenteditable="true"][data-tab="10"]');
      if (whatsappInput && !whatsappInput.dataset.expanderListener) {
        whatsappInput.addEventListener("input", handleContentEditableInput);
        whatsappInput.addEventListener("keydown", handleContentEditableKeyDown);
        whatsappInput.dataset.expanderListener = "true";
      }
    }, 3000);
  }
}

// Initialize
loadSettings();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleSpecialCases);
} else {
  handleSpecialCases();
}

// Listen for updates from popup/background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateShortcuts") {
    shortcuts = message.shortcuts || {};
  } else if (message.action === "updateSettings") {
    loadSettings();
  }
});

// -----------------------------------------------------------------------------
// Global event listeners
//
// To ensure the expander works across all types of inputs (including
// dynamically created fields and rich text editors), we attach a pair of
// listeners to the document itself.  These listeners delegate to the
// appropriate handlers based on the target element.  By listening in the
// capture phase, we catch events before other handlers have a chance to
// interfere.  This eliminates the need to scan and register listeners on
// every potential input individually.

/**
 * Handle any input event bubbled to the document.  Delegates to the
 * appropriate function based on the target.  Only runs when the expander
 * feature is enabled and the target is a text input, textarea, or
 * contenteditable element.
 * @param {Event} event
 */
function globalInputListener(event) {
  if (!expanderEnabled) return;
  const target = event.target;
  if (!shouldExpandOnSite(target)) return;
  // Determine if this event originated within a contenteditable region.  Some
  // editors (e.g., TinyMCE) place text inside descendants of the element
  // marked as contenteditable, so checking only the immediate target isn't
  // sufficient.
  let editableAncestor = null;
  try {
    if (target.isContentEditable) {
      editableAncestor = target;
    } else if (target.getAttribute && (target.getAttribute('contenteditable') === 'true' || target.getAttribute('contentEditable') === 'true')) {
      editableAncestor = target;
    } else if (target.closest) {
      editableAncestor = target.closest('[contenteditable]');
    }
  } catch (e) {
    // ignore errors from closest on non-element nodes
  }
  if (editableAncestor) {
    handleContentEditableInput(event);
  } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    handleInput(event);
  }
}

/**
 * Handle keydown events bubbled to the document.  Delegates to the
 * appropriate function based on the target and key.  It also fixes an
 * issue where the built‑in select all shortcut (Ctrl/Cmd + A) would
 * sometimes only select the abbreviation used to trigger an expansion.
 * When we detect the select all key combo we explicitly select the
 * contents of the input or contenteditable element.  This ensures the
 * expanded text is fully selected.
 * @param {KeyboardEvent} event
 */
function globalKeyDownListener(event) {
  const target = event.target;
  // Fix select all: ensure full selection when meta/ctrl+A is pressed
  if ((event.metaKey || event.ctrlKey) && event.key && event.key.toLowerCase() === 'a') {
    // Check if we should skip custom handling for this site
    const hostname = window.location.hostname;
    
    // Check if the hostname contains joomshaper.com (to handle subdomains)
    if (hostname.includes('joomshaper.com')) {
      return; // Let the browser handle CMD/CTRL+A natively for any joomshaper.com domain
    }
    
    const rules = siteRules[hostname];
    if (rules && rules.disableCustomSelectAll) {
      return; // Let the browser handle CMD/CTRL+A natively
    }
    
    // Only act on elements that support selection
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      event.preventDefault();
      const length = target.value ? target.value.length : 0;
      setTimeout(() => {
        try {
          target.setSelectionRange(0, length);
        } catch (e) {
          // Some input types (e.g. number) don't support selectionRange
        }
      }, 0);
      return;
    }
    // Determine the editable ancestor for contenteditable elements
    let editableAncestor = null;
    try {
      if (target.isContentEditable || (target.getAttribute && (target.getAttribute('contenteditable') === 'true' || target.getAttribute('contentEditable') === 'true'))) {
        editableAncestor = target;
      } else if (target.closest) {
        editableAncestor = target.closest('[contenteditable]');
      }
    } catch (e) {}
    if (editableAncestor) {
      event.preventDefault();
      const selection = editableAncestor.ownerDocument.getSelection();
      const range = editableAncestor.ownerDocument.createRange();
      range.selectNodeContents(editableAncestor);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
  }
  // For expansion triggers (space/tab/enter) delegate to specific handlers
  if (!shouldExpandOnSite(target)) return;
  // Determine if the event originated within a contenteditable region (see above)
  let editableAncestor = null;
  try {
    if (target.isContentEditable) {
      editableAncestor = target;
    } else if (target.getAttribute && (target.getAttribute('contenteditable') === 'true' || target.getAttribute('contentEditable') === 'true')) {
      editableAncestor = target;
    } else if (target.closest) {
      editableAncestor = target.closest('[contenteditable]');
    }
  } catch (e) {}
  if (editableAncestor) {
    handleContentEditableKeyDown(event);
  } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    handleKeyDown(event);
  }
}

// Register global listeners in the capture phase so that we process the
// events before other handlers.  This helps prevent conflicts with other
// scripts that might stop propagation or change the input value.
document.addEventListener('input', globalInputListener, true);
document.addEventListener('keydown', globalKeyDownListener, true);