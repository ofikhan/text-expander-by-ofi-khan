let shortcuts = {};
let expanderEnabled = true;
let caseSensitive = false;
let lastExpansion = null;

// Load all settings
function loadSettings() {
  chrome.storage.local.get(["shortcuts", "expanderEnabled", "caseSensitive"], (data) => {
    shortcuts = data.shortcuts || {};
    expanderEnabled = data.expanderEnabled !== false;
    caseSensitive = data.caseSensitive || false;
    applyListeners();
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

function applyListeners() {
  getTextInputElements().forEach((input) => {
    if (!input.dataset.expanderListener) {
      if (input.contentEditable === 'true') {
        input.addEventListener("input", handleContentEditableInput);
        input.addEventListener("keydown", handleContentEditableKeyDown);
      } else {
        input.addEventListener("input", handleInput);
        input.addEventListener("keydown", handleKeyDown);
      }
      input.dataset.expanderListener = "true";
    }
  });
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
    .replace(/\{timestamp\}/g, now.getTime().toString())
    .replace(/\{cursor\}/g, '|CURSOR|');
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

// Handle cursor positioning
function setCursorPosition(element, expandedText) {
  const cursorMarker = '|CURSOR|';
  if (expandedText.includes(cursorMarker)) {
    const cursorIndex = expandedText.indexOf(cursorMarker);
    const newText = expandedText.replace(cursorMarker, '');
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const currentValue = element.value;
      element.value = currentValue.replace(expandedText, newText);
      const textStart = element.value.lastIndexOf(newText);
      const cursorPos = textStart + cursorIndex;
      element.setSelectionRange(cursorPos, cursorPos);
    }
    
    return newText;
  }
  return expandedText;
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
      
      const finalExpandedText = setCursorPosition(input, expandedText);
      const newText = beforeShortcut + finalExpandedText + afterCursor;
      input.value = newText;
      
      if (!expandedText.includes('|CURSOR|')) {
        const newCursorPos = beforeShortcut.length + finalExpandedText.length;
        if (input.setSelectionRange) {
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
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
        const finalExpandedText = setCursorPosition(input, expandedText);
        const newText = beforeShortcut + finalExpandedText + triggerChar + afterCursor;
        
        input.value = newText;
        
        if (!expandedText.includes('|CURSOR|')) {
          const newCursorPos = beforeShortcut.length + finalExpandedText.length + 1;
          if (input.setSelectionRange) {
            input.setSelectionRange(newCursorPos, newCursorPos);
          }
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
      const newText = beforeShortcut + expandedText + afterCursor;
      
      textNode.textContent = newText;
      
      const newCursorPos = beforeShortcut.length + expandedText.length;
      range.setStart(textNode, newCursorPos);
      range.setEnd(textNode, newCursorPos);
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
        const newText = beforeShortcut + expandedText + triggerChar + afterCursor;
        
        textNode.textContent = newText;
        
        const newCursorPos = beforeShortcut.length + expandedText.length + 1;
        range.setStart(textNode, newCursorPos);
        range.setEnd(textNode, newCursorPos);
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