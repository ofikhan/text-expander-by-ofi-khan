# Text Expander By Ofi Khan

A powerful and lightweight Chrome extension designed to streamline text expansion across all websites. Perfect for customer support, developers, writers, and anyone who wants to eliminate repetitive typing. This tool allows you to create, manage, export, and import shortcuts with advanced features like variable support, usage statistics, and universal compatibility.

## ✨ Key Features

### 🚀 Universal Compatibility
- **Works on ALL websites** - Gmail, WhatsApp Web, social media, and more
- **Smart input detection** - Supports regular text fields, rich text editors, and contenteditable elements
- **Real-time expansion** - Text expands as you type or when you press space/tab/enter

### 📝 Shortcut Management
- **Add and Delete Shortcuts**: Create custom shortcuts (e.g., `ty` → "Thank you")
- **Default shortcuts included**: Ready-to-use examples (`ty`, `brb`, `omw`, `lmk`, `sig`)
- **Case sensitivity options**: Choose between case-sensitive or case-insensitive matching
- **Smart expansion**: Expands on space, tab, or enter key press

### 🔧 Advanced Variables
Support for dynamic content insertion:
- `{date}` - Current date (e.g., 25/07/2025)
- `{time}` - Current time (e.g., 2:30:45 PM)
- `{datetime}` - Full date and time
- `{year}` - Current year (e.g., 2025)
- `{month}` - Current month (e.g., 07)
- `{day}` - Current day (e.g., 25)
- `{timestamp}` - Unix timestamp
- `{cursor}` - Cursor positioning after expansion

### 📊 Usage Statistics
- **Track expansion usage** - See which shortcuts you use most
- **Detailed statistics** - Total expansions, most popular shortcuts
- **Performance insights** - Understand your typing patterns

### 🎛️ Settings & Controls
- **Enable/Disable toggle** - Turn the extension on/off without uninstalling
- **Case sensitivity control** - Match shortcuts exactly or ignore case
- **Tabbed interface** - Organized settings, shortcuts, and statistics

### 💾 Data Management
- **Enhanced Export/Import** - Backup shortcuts, settings, and statistics
- **Complete data backup** - Never lose your configurations
- **Easy migration** - Transfer settings between devices/browsers

### ⌨️ Keyboard Integration
- **Popup shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)
- **Right-click access** - Context menu in text fields

## 🔧 Installation

### Chrome Web Store (Recommended)
Search on chrome web store: [Text Expander By Ofi Khan](https://chromewebstore.google.com/detail/text-expander-by-ofi-khan/ofdlmmadalaoceafcekkkanigmdehbig)

## 🚀 Usage Guide

### Getting Started
1. **Open the extension** by clicking the icon or using `Ctrl+Shift+O`
2. **Try default shortcuts**: Type `ty` and press space - it expands to "Thank you"
3. **Explore other defaults**: `brb`, `omw`, `lmk`, `sig`

### Adding Custom Shortcuts
1. **Navigate to Shortcuts tab** in the popup
2. **Enter shortcut** (e.g., `addr`) and expanded text (e.g., your address)
3. **Use variables** for dynamic content: `Hello! Today is {date}`
4. **Click "Add Shortcut"** to save

### Using Variables
Create dynamic shortcuts with variables:
```
Shortcut: meeting
Expanded: Hi team, let's meet on {date} at {time}
Result: Hi team, let's meet on 12/25/2024 at 2:30:45 PM
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

The extension requests minimal permissions:
- **Storage**: Save your shortcuts and settings locally
- **ActiveTab**: Work on the current webpage only
- **ContextMenus**: Right-click menu access

**No data is sent to external servers** - everything stays on your device.

## 📋 Changelog

### Version 2.0 (Latest)
- ✅ Universal website compatibility
- ✅ Advanced variable support ({date}, {time}, {cursor}, etc.)
- ✅ Usage statistics tracking
- ✅ Settings panel with toggles
- ✅ Enhanced export/import with complete data backup
- ✅ Tabbed interface for better organization
- ✅ Default shortcuts for immediate usability
- ✅ Improved text expansion engine
- ✅ ContentEditable element support

### Version 1.2
- ✅ Basic text expansion
- ✅ Export/import shortcuts
- ✅ Simple popup interface

## 🐛 Known Issues & Limitations

- Some complex web applications may require page refresh after installation
- Rich text editors with custom implementations might need special handling
- Extension works best with standard HTML input elements

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/ofikhan/text-expander-by-ofi-khan/issues)
- **Email**: [Contact developer](mailto:ofi.khan051@gmail.com)
- **Website**: [Ofi Khan](https://www.ofikhan.com)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- **Built by**: [Ofi Khan](https://www.ofikhan.com)
- **Inspired by**: The need for efficient text expansion in customer support workflows
- **Special thanks**: To the community for feature requests and feedback

---

**⭐ If you find this extension helpful, please consider starring the repository and leaving a review!**