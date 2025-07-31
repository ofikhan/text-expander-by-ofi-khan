# Text Expander By Ofi Khan
A powerful and lightweight Chrome extension designed to streamline text expansion across all websites. Perfect for customer support, developers, writers, and anyone who wants to eliminate repetitive typing. This tool allows you to create, manage, export, and import shortcuts with advanced features like variable support, usage statistics, and universal compatibility.

## ✨ Key Features

### 🚀 Universal Compatibility
- **Works on ALL websites** - Gmail, WhatsApp Web, social media, and more
- **Smart input detection** - Supports regular text fields, rich text editors, and contenteditable elements
- **Real-time expansion** - Text expands as you type or when you press space/tab/enter

### 📝 Advanced Shortcut Management
- **Add and Delete Shortcuts**: Create custom shortcuts (e.g., `ty` → "Thank you")
- **Default shortcuts included**: Ready-to-use examples (`ty`, `brb`, `omw`, `lmk`, `sig`)
- **Case sensitivity options**: Choose between case-sensitive or case-insensitive matching
- **Smart expansion**: Expands on space, tab, or enter key press
- **Scrollable shortcut list**: Organized display with smooth scrolling for large collections
- **Duplicate detection**: Warns when adding existing shortcuts with replace option

### 🔧 Enhanced Variables System
Support for dynamic content insertion with cursor positioning:
- `{date}` - Current date (e.g., 31/07/2025)
- `{time}` - Current time (e.g., 2:30:45 PM)
- `{datetime}` - Full date and time
- `{year}` - Current year (e.g., 2025)
- `{month}` - Current month (e.g., 07)
- `{day}` - Current day (e.g., 31)
- `{timestamp}` - Unix timestamp
- `{cursor}` - Advanced cursor positioning after expansion

### 📊 Comprehensive Usage Statistics
- **Track expansion usage** - See which shortcuts you use most frequently
- **Top 10 most used shortcuts** - Ranked list with usage counts
- **Detailed statistics dashboard** - Total expansions, most popular shortcuts
- **Performance insights** - Understand your typing patterns and productivity gains
- **Usage summary** - Complete overview of shortcut performance

### 🎛️ Enhanced Settings & Controls
- **Enable/Disable toggle** - Turn the extension on/off without uninstalling
- **Case sensitivity control** - Match shortcuts exactly or ignore case
- **Visual status indicators** - Clear indication of extension status
- **Real-time settings sync** - Changes apply immediately across all tabs
- **Tabbed interface** - Organized settings, shortcuts, and statistics

### 💾 Complete Data Management
- **Enhanced Export/Import** - Backup shortcuts, settings, and statistics in JSON format
- **Complete data backup** - Never lose your configurations, includes version info
- **Easy migration** - Transfer settings between devices/browsers seamlessly
- **Clear statistics option** - Reset usage data when needed
- **Data validation** - Import validation with detailed feedback

### ⌨️ Keyboard Integration & Accessibility
- **Popup shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)
- **Right-click access** - Context menu in text fields
- **Keyboard navigation** - Tab through interface elements
- **Shortcut key warnings** - Alerts if keyboard shortcuts aren't configured

### 🎨 Modern User Interface
- **Tabbed interface** - Clean organization with Shortcuts, Settings, and Stats tabs
- **Visual feedback** - Success confirmations and status indicators
- **Color-coded elements** - Professional green theme throughout

## 🔧 Installation

### Chrome Web Store (Recommended)
Search on chrome web store: [Text Expander By Ofi Khan](https://chromewebstore.google.com/detail/text-expander-by-ofi-khan/ofdlmmadalaoceafcekkkanigmdehbig)

## 🚀 Usage Guide

### Getting Started
1. **Open the extension** by clicking the icon or using `Ctrl+Shift+O`
2. **Try default shortcuts**: Type `ty` and press space - it expands to "Thank you"
3. **Explore other defaults**: `brb`, `omw`, `lmk`, `sig`
4. **Check the status indicator** - Green dot means extension is active

### Adding Custom Shortcuts
1. **Navigate to Shortcuts tab** in the popup
2. **Enter shortcut** (e.g., `addr`) and expanded text (e.g., your address)
3. **Use variables** for dynamic content: `Hello! Today is {date}`
4. **Position cursor** with `{cursor}` variable for precise placement
5. **Click "Add Shortcut"** to save with visual confirmation

### Using Advanced Variables
Create dynamic shortcuts with variables and cursor positioning:
```
Shortcut: meeting
Expanded: Hi team, let's meet on {date} at {time}. {cursor}
Result: Hi team, let's meet on 31/07/2025 at 2:30:45 PM. [cursor here]
```
```
Shortcut: sig
Expanded: Best regards,\n{cursor}\n{date}
Result: Best regards,
[cursor here]
31/07/2025
```

### Advanced Features
- **Settings Tab**: Configure case sensitivity and enable/disable
- **Statistics Tab**: View usage patterns and most-used shortcuts
- **Export/Import**: Backup your complete configuration

### Site-Specific Behavior
The extension intelligently adapts to different websites:
- **Gmail**: Works in compose windows and replies
- **WhatsApp Web**: Expands in chat input
- **Social Media**: Compatible with Facebook, X, LinkedIn, etc.

## 📁 Project Structure
```
text-expander-by-ofi-khan/
├── manifest.json         # Extension configuration and permissions
├── popup.html            # Main popup interface with tabbed layout
├── popup.js              # Popup logic with settings and statistics
├── popup.css             # Modern styling for popup interface
├── content.js            # Universal text expansion engine
├── content.css           # Minimal content script styles
├── background.js         # Background script with default shortcuts
├── icons/                # Extension icons (16x16 to 128x128)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── LICENSE               # MIT License
└── README.md            # This file
```

## 🔒 Privacy & Permissions
The extension requests minimal permissions for maximum privacy:
- **Storage**: Save your shortcuts and settings locally on your device
- **ActiveTab**: Work on the current webpage only (optional permission)
- **ContextMenus**: Right-click menu access in text fields
**🔒 Privacy Guarantee**: No data is sent to external servers - everything stays on your device. Your shortcuts, statistics, and settings are completely private.

## 📋 Changelog

### Version 2.1 (Latest)

- ✅ **Enhanced settings panel** with visual toggles
- ✅ **Complete data backup system** with validation
- ✅ **Custom scrollbar styling** for consistent UI
- ✅ **Keyboard shortcut integration** with status warnings
- ✅ **Real-time settings sync** across browser tabs
- ✅ **Visual status indicators** and feedback
- ✅ **Enhanced error handling** and site compatibility

### Version 2.0
- ✅ Universal website compatibility with site-specific optimizations
- ✅ Advanced variable support ({date}, {time}, {cursor}, etc.)
- ✅ Comprehensive usage statistics with top 10 rankings
- ✅ Settings panel with toggles
- ✅ Enhanced export/import with complete data backup
- ✅ Modern tabbed interface for better organization
- ✅ Default shortcuts for immediate usability
- ✅ Improved text expansion engine with better reliability
- ✅ ContentEditable element support for rich text editors

### Version 1.2
- ✅ Basic text expansion
- ✅ Export/import shortcuts
- ✅ Simple popup interface

## 🐛 Known Issues & Limitations
- Some complex web applications may require page refresh after installation
- Rich text editors with custom implementations might need special handling
- Extension works best with standard HTML input elements
- Keyboard shortcuts require manual configuration in Chrome extensions settings
- Some websites with heavy JavaScript may need initialization delays

## 📞 Support & Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/ofikhan/text-expander-by-ofi-khan/issues)
- **Email Support**: [Contact developer](mailto:ofi.khan051@gmail.com)
- **Developer Website**: [Ofi Khan](https://www.ofikhan.com)
- **Chrome Web Store**: [Leave reviews and ratings](https://chromewebstore.google.com/detail/text-expander-by-ofi-khan/ofdlmmadalaoceafcekkkanigmdehbig)

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements
- **Built by**: [Ofi Khan](https://www.ofikhan.com) 
- **Inspired by**: The need for efficient text expansion in customer support workflows and daily productivity
- **Special thanks**: To the community for feature requests, bug reports, and valuable feedback
- **Design inspiration**: Modern Chrome extension best practices and user experience guidelines

---

**⭐ If you find this extension helpful, then please consider:**
- Leaving a positive review on the Chrome Web Store
- Sharing with colleagues and friends
- Contributing to the project development

**Made with ❤️ for productivity enthusiasts worldwide!**