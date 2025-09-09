let shortcuts = {};
let expanderEnabled = true;
let caseSensitive = false;
let lastExpansion = null;
let facebookExpansionMap = new WeakMap(); // Track expansions for Facebook elements
let whatsappExpansionMap = new WeakMap(); // Track expansions for WhatsApp elements

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
  const selectors = `
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
    .CodeMirror textarea,
    /* Facebook-specific selectors */
    div[data-contents="true"],
    div[role="textbox"],
    div[aria-label*="message"],
    div[aria-label*="comment"],
    div[aria-label*="post"],
    div[aria-label*="write"],
    .notranslate,
    ._1mf._1mj,
    /* Additional common Facebook classes */
    ._5rpu,
    ._1p1t,
    ._1osq,
    ._1osr,
    ._1ost,
    ._1p1v,
    /* WhatsApp Web selectors */
    [contenteditable="true"][data-tab],
    [contenteditable="true"][title="Type a message"],
    ._2S1VP
  `;
  
  return document.querySelectorAll(selectors);
}

function applyListeners() {
  getTextInputElements().forEach((input) => {
    if (!input.dataset.expanderListener) {
      if (input.contentEditable === 'true' || 
          input.matches('div[role="textbox"], div[data-contents="true"]') ||
          input.getAttribute('aria-label')?.includes('message') ||
          input.getAttribute('aria-label')?.includes('comment') ||
          input.getAttribute('aria-label')?.includes('post') ||
          input.matches('[contenteditable="true"][data-tab], [contenteditable="true"][title="Type a message"]')) {
        input.addEventListener("input", handleContentEditableInput);
        input.addEventListener("keydown", handleContentEditableKeyDown);
        
        // Add platform-specific event listeners
        if (window.location.hostname.includes('facebook.com') || 
            window.location.hostname.includes('messenger.com')) {
          input.addEventListener("blur", handleFacebookBlur);
          input.addEventListener("focus", handleFacebookFocus);
          monitorFacebookActions(input);
        }
        else if (window.location.hostname.includes('web.whatsapp.com')) {
          input.addEventListener("blur", handleWhatsAppBlur);
          input.addEventListener("focus", handleWhatsAppFocus);
          monitorWhatsAppActions(input);
        }
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
    .replace(/\{timestamp\}/g, now.getTime().toString());
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
  'facebook.com': {
    includeSelectors: ['div[role="textbox"]', 'div[data-contents="true"]', 'div[aria-label*="message"]']
  },
  'messenger.com': {
    includeSelectors: ['div[role="textbox"]', 'div[aria-label*="message"]']
  },
  'www.facebook.com': {
    includeSelectors: ['div[role="textbox"]', 'div[data-contents="true"]', 'div[aria-label*="message"]']
  },
  'web.whatsapp.com': {
    includeSelectors: ['[contenteditable="true"][data-tab]', '[contenteditable="true"][title="Type a message"]']
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

// Facebook-specific handlers
function handleFacebookBlur(event) {
  const element = event.target;
  if (facebookExpansionMap.has(element)) {
    const { originalText, expandedText } = facebookExpansionMap.get(element);
    if (element.textContent === originalText) {
      element.textContent = expandedText;
      facebookExpansionMap.delete(element);
    }
  }
}

function handleFacebookFocus(event) {
  const element = event.target;
  if (facebookExpansionMap.has(element)) {
    facebookExpansionMap.delete(element);
  }
}

function monitorFacebookActions(inputElement) {
  const container = inputElement.closest('form, [role="dialog"], [data-pagelet]') || document;
  
  const sendButtons = container.querySelectorAll('[aria-label*="Send"], [data-testid*="send"], div[role="button"][tabindex="0"]');
  
  sendButtons.forEach(button => {
    if (!button.dataset.expanderListener) {
      button.addEventListener('click', () => {
        if (facebookExpansionMap.has(inputElement)) {
          const { expandedText } = facebookExpansionMap.get(inputElement);
          inputElement.textContent = expandedText;
          facebookExpansionMap.delete(inputElement);
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      button.dataset.expanderListener = "true";
    }
  });
  
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (facebookExpansionMap.has(inputElement)) {
        const { expandedText } = facebookExpansionMap.get(inputElement);
        inputElement.textContent = expandedText;
        facebookExpansionMap.delete(inputElement);
        setTimeout(() => {
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }, 50);
      }
    }
  });
}

// WhatsApp-specific handlers
function handleWhatsAppBlur(event) {
  const element = event.target;
  if (whatsappExpansionMap.has(element)) {
    const { originalText, expandedText } = whatsappExpansionMap.get(element);
    if (element.textContent === originalText) {
      element.textContent = expandedText;
      whatsappExpansionMap.delete(element);
    }
  }
}

function handleWhatsAppFocus(event) {
  const element = event.target;
  if (whatsappExpansionMap.has(element)) {
    whatsappExpansionMap.delete(element);
  }
}

function monitorWhatsAppActions(inputElement) {
  // WhatsApp Web uses a different structure - look for send button near the input
  const container = inputElement.closest('[data-testid="conversation-panel-wrapper"]') || 
                    inputElement.closest('.two') || 
                    document;
  
  // WhatsApp send button selectors
  const sendButtons = container.querySelectorAll('[data-testid="send"], [data-icon="send"], button[aria-label*="Send"]');
  
  sendButtons.forEach(button => {
    if (!button.dataset.expanderListener) {
      button.addEventListener('click', () => {
        if (whatsappExpansionMap.has(inputElement)) {
          const { expandedText } = whatsappExpansionMap.get(inputElement);
          inputElement.textContent = expandedText;
          whatsappExpansionMap.delete(inputElement);
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      button.dataset.expanderListener = "true";
    }
  });
  
  // WhatsApp also uses Enter key to send
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (whatsappExpansionMap.has(inputElement)) {
        const { expandedText } = whatsappExpansionMap.get(inputElement);
        inputElement.textContent = expandedText;
        whatsappExpansionMap.delete(inputElement);
        setTimeout(() => {
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }, 50);
      }
    }
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
      
      lastExpansion = {
        element: input,
        originalText: text,
        shortcut: match.shortcut,
        timestamp: Date.now()
      };
      
      if (expandedText.includes('{cursor}')) {
        const cursorIndex = expandedText.indexOf('{cursor}');
        const finalExpandedText = expandedText.replace('{cursor}', '');
        const newText = beforeShortcut + finalExpandedText + afterCursor;
        input.value = newText;
        
        const newCursorPos = beforeShortcut.length + cursorIndex;
        input.setSelectionRange(newCursorPos, newCursorPos);
      } else {
        const newText = beforeShortcut + expandedText + afterCursor;
        input.value = newText;
        
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
        
        if (expandedText.includes('{cursor}')) {
          const cursorIndex = expandedText.indexOf('{cursor}');
          const finalExpandedText = expandedText.replace('{cursor}', '');
          const newText = beforeShortcut + finalExpandedText + triggerChar + afterCursor;
          input.value = newText;
          
          const newCursorPos = beforeShortcut.length + cursorIndex;
          input.setSelectionRange(newCursorPos, newCursorPos);
        } else {
          const newText = beforeShortcut + expandedText + triggerChar + afterCursor;
          input.value = newText;
          
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
      
      const isFacebook = window.location.hostname.includes('facebook.com') || 
                         window.location.hostname.includes('messenger.com');
      
      const isWhatsApp = window.location.hostname.includes('web.whatsapp.com');
      
      if (isFacebook) {
        facebookExpansionMap.set(element, {
          originalText: text,
          expandedText: beforeShortcut + expandedText + afterCursor,
          shortcut: match.shortcut
        });
      }
      else if (isWhatsApp) {
        whatsappExpansionMap.set(element, {
          originalText: text,
          expandedText: beforeShortcut + expandedText + afterCursor,
          shortcut: match.shortcut
        });
      }
      
      if (expandedText.includes('{cursor}')) {
        const cursorIndex = expandedText.indexOf('{cursor}');
        const finalExpandedText = expandedText.replace('{cursor}', '');
        const newText = beforeShortcut + finalExpandedText + afterCursor;
        textNode.textContent = newText;
        
        const newCursorPos = beforeShortcut.length + cursorIndex;
        range.setStart(textNode, newCursorPos);
        range.setEnd(textNode, newCursorPos);
      } else {
        const newText = beforeShortcut + expandedText + afterCursor;
        textNode.textContent = newText;
        
        const newCursorPos = beforeShortcut.length + expandedText.length;
        range.setStart(textNode, newCursorPos);
        range.setEnd(textNode, newCursorPos);
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      if (isFacebook || isWhatsApp) {
        element.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => {
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }, 10);
      }
      
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
        
        const isFacebook = window.location.hostname.includes('facebook.com') || 
                           window.location.hostname.includes('messenger.com');
        
        const isWhatsApp = window.location.hostname.includes('web.whatsapp.com');
        
        if (isFacebook) {
          facebookExpansionMap.set(element, {
            originalText: text,
            expandedText: beforeShortcut + expandedText + triggerChar + afterCursor,
            shortcut: match.shortcut
          });
        }
        else if (isWhatsApp) {
          whatsappExpansionMap.set(element, {
            originalText: text,
            expandedText: beforeShortcut + expandedText + triggerChar + afterCursor,
            shortcut: match.shortcut
          });
        }
        
        if (expandedText.includes('{cursor}')) {
          const cursorIndex = expandedText.indexOf('{cursor}');
          const finalExpandedText = expandedText.replace('{cursor}', '');
          const newText = beforeShortcut + finalExpandedText + triggerChar + afterCursor;
          textNode.textContent = newText;
          
          const newCursorPos = beforeShortcut.length + cursorIndex;
          range.setStart(textNode, newCursorPos);
          range.setEnd(textNode, newCursorPos);
        } else {
          const newText = beforeShortcut + expandedText + triggerChar + afterCursor;
          textNode.textContent = newText;
          
          const newCursorPos = beforeShortcut.length + expandedText.length + 1;
          range.setStart(textNode, newCursorPos);
          range.setEnd(textNode, newCursorPos);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
        
        if (isFacebook || isWhatsApp) {
          element.dispatchEvent(new Event('change', { bubbles: true }));
          setTimeout(() => {
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }, 10);
        }
        
        trackExpansion(match.shortcut, match.expanded);
      }
    } catch (error) {
      console.log("Error handling contenteditable keydown:", error);
    }
  }
}

function handleFacebookEditors() {
  if (!window.location.hostname.includes('facebook.com') && 
      !window.location.hostname.includes('messenger.com')) {
    return;
  }
  
  const commentBoxes = document.querySelectorAll('div[aria-label*="comment"], div[aria-label*="Comment"]');
  commentBoxes.forEach(box => {
    if (!box.dataset.expanderListener) {
      box.addEventListener("input", handleContentEditableInput);
      box.addEventListener("keydown", handleContentEditableKeyDown);
      box.addEventListener("blur", handleFacebookBlur);
      box.addEventListener("focus", handleFacebookFocus);
      monitorFacebookActions(box);
      box.dataset.expanderListener = "true";
    }
  });
  
  const postComposers = document.querySelectorAll('div[aria-label*="post"], div[aria-label*="Post"], div[aria-label*="create post"]');
  postComposers.forEach(composer => {
    if (!composer.dataset.expanderListener) {
      composer.addEventListener("input", handleContentEditableInput);
      composer.addEventListener("keydown", handleContentEditableKeyDown);
      composer.addEventListener("blur", handleFacebookBlur);
      composer.addEventListener("focus", handleFacebookFocus);
      monitorFacebookActions(composer);
      composer.dataset.expanderListener = "true";
    }
  });
  
  const messengerInputs = document.querySelectorAll('div[aria-label*="message"], div[aria-label*="Message"], div[role="textbox"]');
  messengerInputs.forEach(input => {
    if (!input.dataset.expanderListener) {
      input.addEventListener("input", handleContentEditableInput);
      input.addEventListener("keydown", handleContentEditableKeyDown);
      input.addEventListener("blur", handleFacebookBlur);
      input.addEventListener("focus", handleFacebookFocus);
      monitorFacebookActions(input);
      input.dataset.expanderListener = "true";
    }
  });
}

function handleWhatsAppEditors() {
  if (!window.location.hostname.includes('web.whatsapp.com')) {
    return;
  }
  
  const whatsappInputs = document.querySelectorAll('[contenteditable="true"][data-tab], [contenteditable="true"][title="Type a message"], ._2S1VP');
  whatsappInputs.forEach(input => {
    if (!input.dataset.expanderListener) {
      input.addEventListener("input", handleContentEditableInput);
      input.addEventListener("keydown", handleContentEditableKeyDown);
      input.addEventListener("blur", handleWhatsAppBlur);
      input.addEventListener("focus", handleWhatsAppFocus);
      monitorWhatsAppActions(input);
      input.dataset.expanderListener = "true";
    }
  });
}

// Handle dynamically added elements
const observer = new MutationObserver((mutations) => {
  let shouldReapply = false;
  
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (isTextInput(node) || 
              (node.querySelector && node.querySelectorAll('input, textarea, [contenteditable], div[role="textbox"], div[data-contents="true"]').length > 0)) {
            shouldReapply = true;
          }
          
          if ((window.location.hostname.includes('facebook.com') || 
               window.location.hostname.includes('messenger.com')) &&
              (node.matches('div[role="textbox"], div[data-contents="true"], div[aria-label*="message"]') ||
               node.querySelector('div[role="textbox"], div[data-contents="true"], div[aria-label*="message"]'))) {
            shouldReapply = true;
          }
          
          if (window.location.hostname.includes('web.whatsapp.com') &&
              (node.matches('[contenteditable="true"][data-tab], [contenteditable="true"][title="Type a message"]') ||
               node.querySelector('[contenteditable="true"][data-tab], [contenteditable="true"][title="Type a message"]'))) {
            shouldReapply = true;
          }
        }
      });
    }
  });
  
  if (shouldReapply) {
    clearTimeout(observer.debounceTimer);
    observer.debounceTimer = setTimeout(() => {
      applyListeners();
      if (window.location.hostname.includes('facebook.com') || 
          window.location.hostname.includes('messenger.com')) {
        handleFacebookEditors();
      }
      if (window.location.hostname.includes('web.whatsapp.com')) {
        handleWhatsAppEditors();
      }
    }, 100);
  }
});

function isTextInput(element) {
  const tagName = element.tagName;
  const type = element.type;
  
  return (tagName === 'INPUT' && ['text', 'search', 'email', 'url', 'password'].includes(type)) ||
         (tagName === 'INPUT' && !type) ||
         tagName === 'TEXTAREA' ||
         element.contentEditable === 'true' ||
         element.matches('div[role="textbox"], div[data-contents="true"]') ||
         element.matches('[contenteditable="true"][data-tab], [contenteditable="true"][title="Type a message"]');
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
      handleWhatsAppEditors();
    }, 3000);
    
    // Also check periodically for new editors
    setInterval(handleWhatsAppEditors, 5000);
  }
  
  // Facebook handling
  if (window.location.hostname.includes('facebook.com') || 
      window.location.hostname.includes('messenger.com')) {
    setTimeout(() => {
      handleFacebookEditors();
    }, 3000);
    
    // Also check periodically for new editors
    setInterval(handleFacebookEditors, 5000);
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