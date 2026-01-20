# Text Expander By Ofi Khan
A powerful and lightweight Chrome extension designed to streamline text expansion across all websites. Perfect for customer support, developers, writers, and anyone who wants to eliminate repetitive typing. This tool allows you to create, manage, export, and import shortcuts with advanced features like variable support, usage statistics, and universal compatibility.

## ✨ Key Features

### 🚀 Universal Compatibility
- **Works on ALL websites** - Gmail, WhatsApp Web, social media, and more
- **Smart input detection** - Supports regular text fields, rich text editors, and contenteditable elements
- **Real-time expansion** - Text expands as you type or when you press space/tab/enter

### 📝 Advanced Shortcut Management
- **Add and Delete Shortcuts**: Create custom shortcuts (e.g., `asap` → "As Soon As Possible")
- **Edit Shortcuts**: Modify existing shortcuts including shortcut key, expanded text, and category
- **Default shortcuts included**: Ready-to-use examples (`/ty`, `brb`, `omw`, `lmk`, `sig`)
- **Case sensitivity options**: Choose between case-sensitive or case-insensitive matching
- **Smart expansion**: Expands on space, tab, or enter key press
- **Scrollable shortcut list**: Organized display with smooth scrolling for large collections
- **Duplicate detection**: Warns when adding existing shortcuts with replace option
- **Bulk deletion**: Delete all shortcuts at once with confirmation dialog
- **Search Option**: Quickly find shortcuts in large lists with real-time search
- **Icon-based interface**: Modern edit and delete icons for cleaner UI

### 📁 Category Management
- **Organize shortcuts**: Create custom categories to organize your shortcuts
- **Color-coded categories**: Assign colors to categories for visual identification
- **Filter by category**: Quickly filter shortcuts by category with shortcut counts
- **Category badges**: Visual indicators showing which category each shortcut belongs to
- **Edit categories**: Modify category names and colors without losing shortcuts
- **Default categories**: Pre-configured General, Work, and Personal categories
- **Uncategorized tracking**: Automatically tracks shortcuts without categories

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
- **Auto-sync statistics** - Statistics update immediately when shortcuts are modified

### 🎛️ Enhanced Settings & Controls
- **Enable/Disable toggle** - Turn the extension on/off without uninstalling
- **Case sensitivity control** - Match shortcuts exactly or ignore case
- **Visual status indicators** - Clear indication of extension status with improved positioning
- **Real-time settings sync** - Changes apply immediately across all tabs
- **Clean tabbed interface** - Streamlined navigation without redundant titles

### 💾 Complete Data Management
- **Enhanced Export/Import** - Backup shortcuts, settings, statistics, and categories in JSON format
- **Complete data backup** - Never lose your configurations, includes version info and categories
- **Easy migration** - Transfer settings between devices/browsers seamlessly
- **Clear statistics option** - Reset usage data when needed
- **Data validation** - Import validation with detailed feedback
- **Bulk operations** - Delete all shortcuts with confirmation for quick reset

### ⌨️ Keyboard Integration & Accessibility
- **Popup shortcut**: `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)
- **Right-click access** - Context menu in text fields and on selected text
- **Context menu options**: "Open Text Expander" and "Add New Shortcut"
- **Keyboard navigation** - Tab through interface elements
- **Search shortcuts** - Use Escape key to clear search and exit
- **Shortcut key warnings** - Alerts if keyboard shortcuts aren't configured

### 🎨 Modern User Interface
- **Consistent design system** - Universal borders, colors, and typography
- **Optimized layout** - Full-width flex layouts for better space utilization
- **Visual feedback** - Success confirmations and status indicators
- **Color-coded elements** - Professional green theme throughout
- **Search functionality** - Real-time filtering with highlighted results
- **Responsive design** - Clean, modern interface that's easy to navigate
- **Custom scrollbars** - Consistent styling throughout the interface
- **Improved accessibility** - Better focus states and keyboard navigation
- **Icon-based actions** - Modern edit (pencil) and delete (trash) icons
- **Category badges** - Color-coded visual indicators for shortcuts
- **Tabbed interface** - Organized tabs for Shortcuts, Categories, Settings, and Stats

## 🔧 Installation

### Chrome Web Store
Search on chrome web store: [Text Expander By Ofi Khan](https://chromewebstore.google.com/detail/text-expander-by-ofi-khan/ofdlmmadalaoceafcekkkanigmdehbig)

## 🚀 Usage Guide

### Getting Started
1. **Open the extension** by clicking the icon or using `Ctrl+Shift+O`
2. **Try default shortcuts**: Type `brb` and press space - it expands to "Be right back"
3. **Explore other defaults**: `omw`, `lmk`, `sig`
4. **Check the status indicator**: Green dot means extension is active

### Adding Custom Shortcuts

**Method 1: Manual Entry**
1. **Navigate to Shortcuts tab** in the popup
2. **Enter shortcut** (e.g., `addr`) and expanded text (e.g., your address)
3. **Select a category** (optional) to organize your shortcut
4. **Use variables** for dynamic content: `Hello! Today is {date}`
5. **Position cursor** with `{cursor}` variable for precise placement
6. **Click "Add Shortcut"** to save with visual confirmation

**Method 2: From Selected Text (NEW!)**
1. **Select any text** on any webpage
2. **Right-click** and choose "Add New Shortcut"
3. **Extension opens** with selected text in expanded field
4. **Type shortcut key** (e.g., `addr`) - cursor is ready
5. **Select category** (optional)
6. **Click "Add Shortcut"** to save

### Editing Shortcuts
1. **Click the edit icon** (pencil) next to any shortcut
2. **Modify the shortcut key**, expanded text, or category
3. **Click "Update Shortcut"** to save changes
4. **Click "Cancel"** to exit without saving

### Managing Categories
1. **Navigate to Categories tab** in the popup
2. **Create categories** with custom names and colors
3. **Edit categories** by clicking the edit icon (pencil)
4. **Delete categories** by clicking the delete icon (trash)
5. **Filter shortcuts** by category using the dropdown in Shortcuts tab

### Searching & Managing Shortcuts

1. **Use the search box** at the top of the Shortcuts tab 
2. **Type to filter** shortcuts by name or expanded text
3. **Clear search** using the X button or Escape key
4. **View results count** to see how many shortcuts match your query
5. **Delete individual shortcuts** with red delete buttons
6. **Delete all shortcuts** using the "Delete All" button (requires confirmation)

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
- **Categories Tab**: Organize shortcuts into color-coded categories
- **Settings Tab**: Configure case sensitivity and enable/disable
- **Statistics Tab**: View usage patterns and most-used shortcuts
- **Export/Import**: Backup your complete configuration including categories
- **Search Feature**: Quickly find shortcuts in large collections with real-time search
- **Filter by Category**: View shortcuts by category with shortcut counts

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
│   ├── icon48.png
│   └── icon128.png
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🔒 Privacy & Permissions
The extension requests minimal permissions for maximum privacy:
- **Storage**: Save your shortcuts and settings locally on your device
- **ActiveTab**: Work on the current webpage only (optional permission)
- **ContextMenus**: Right-click menu access in text fields
**🔒 Privacy Guarantee**: No data is sent to external servers - everything stays on your device. Your shortcuts, statistics, and settings are completely private.

## 📋 Changelog

### Version 3.0 (Latest)

🆕 **Context Menu Integration**

✅ **Add New Shortcut from Selected Text**
- **Right-click context menu**: Select any text on any webpage and right-click
- **"Add New Shortcut" option**: Appears in context menu when text is selected
- **Auto-fill expanded text**: Selected text automatically fills the expanded text field
- **Smart popup opening**: Extension opens with Shortcuts tab active
- **Focus on shortcut field**: Cursor ready for typing the shortcut key
- **Seamless workflow**: Create shortcuts without manual copy/paste
- **Universal compatibility**: Works on all websites with any selectable text

✅ **Enhanced Context Menu System**
- **Two context menu options**: "Open Text Expander" (in text fields) and "Add New Shortcut" (on selected text)
- **Intelligent context detection**: Different options based on user action
- **Temporary storage**: Selected text stored securely until shortcut creation
- **Auto-cleanup**: Pending text cleared after use or popup close

✅ **Category Management System**
- **Create categories**: Organize shortcuts with custom categories and colors
- **Edit categories**: Modify category names and colors without losing shortcuts
- **Delete categories**: Remove categories with automatic shortcut cleanup
- **Filter by category**: Dropdown filter with shortcut counts for each category
- **Category badges**: Color-coded visual indicators on each shortcut
- **Default categories**: Pre-configured General, Work, and Personal categories
- **Uncategorized tracking**: Automatically tracks shortcuts without categories

✅ **Edit Functionality**
- **Edit shortcuts**: Modify shortcut key, expanded text, and category assignment
- **Edit categories**: Change category names and colors
- **Icon-based UI**: Modern pencil (edit) and trash (delete) icons
- **Cancel option**: Exit edit mode without saving changes
- **Smart conflict detection**: Warns when new shortcut key already exists
- **Data preservation**: Category assignments and statistics handled intelligently

🔧 **Technical Enhancements**
- **Background script improvements**: Enhanced context menu handling
- **Popup initialization**: Automatic detection of pending shortcut text
- **Tab switching**: Auto-switch to Shortcuts tab when creating from selection
- **Storage optimization**: Efficient temporary storage for selected text
- **Editable shortcut keys**: Change shortcut keys during edit (with data cleanup)
- **Category data structure**: Efficient storage and retrieval of categories
- **Export/Import enhancement**: Categories included in backup files
- **Real-time updates**: Category changes reflect immediately across all shortcuts
- **Conflict handling**: Smart detection and user confirmation for duplicates

### Version 2.3

🆕 **Major UX/UI Improvements**

✅ **Enhanced User Interface Design**
- **Universal design system**: Consistent borders, colors, typography, and spacing across all elements
- **Improved status indicator**: Repositioned extension on/off indicator to the top for better visibility
- **Cleaner tab interface**: Removed redundant "Settings" and "Usage Statistics" titles from tab content
- **Full-width button layout**: Add Shortcut and Delete All buttons now use optimized flex layouts

✅ **Smart Action Handling**
- **Delete All validation**: Checks if shortcuts exist before showing confirmation - alerts "No shortcuts to delete" if empty
- **Clear Stats validation**: Checks if statistics exist before showing confirmation - alerts "No statistics to delete" if empty
- **Streamlined confirmations**: Removed redundant second confirmation alerts for cleaner user experience
- **Import optimization**: Simplified import process with single confirmation dialog

🔧 **Technical Enhancements**
- **Fixed scrollbar issues**: Resolved body scrollbar display problems for smoother navigation
- **Fixed Delete All and Clear Stats confirmation**: Resolved issue where Delete All and Clear Stats required multiple clicks to execute
- **Text selection fix**: Resolved CMD+A/CTRL+A selection issues after text expansion
- **Facebook editor compatibility**: Fixed text expansion issues on Facebook posts, comments, and messages
- **WhatsApp Web compatibility**: Ensured proper text expansion and sending on WhatsApp Web
- **Improved accessibility**: Better focus states and keyboard navigation throughout

🎨 **Visual Polish**
- **Enhanced typography**: Improved font sizes and weights for better readability
- **Better spacing**: Optimized margins and padding for professional appearance
- **Responsive elements**: All interface components adapt better to different screen sizes

### Version 2.2
🆕 **New Features**

✅ **Search & Filter Shortcuts**: Real-time search functionality with highlighting
- Search by shortcut name or expanded text
- Clear search with X button or Escape key
- Results counter shows matching shortcuts
- Search highlighting for easy identification

✅ **Delete All Shortcuts**: Bulk deletion with confirmation dialog
- Removes all shortcuts and associated statistics
- Double confirmation to prevent accidental deletion
- Complete data cleanup in one action

✅ **Real-time Statistics Updates**: Statistics now update instantly
- Shortcut counts reflect changes immediately
- No need to close/reopen extension for updated stats
- Automatic synchronization across all tabs 

🎨 **UI/UX Improvements**
- ✅ **Red Delete Buttons**: Color-coded deletion actions for better visual hierarchy
- ✅ **Enhanced Search UI**: Professional search box with icons and animations
- ✅ **Improved Feedback**: Better visual confirmations and status indicators
- ✅ **Responsive Interface**: Optimized layout for better user experience

### Version 2.1

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
- Keyboard shortcuts might require manual configuration in Chrome extensions settings
- Some websites with heavy JavaScript may need initialization delays

## 📞 Support & Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/ofikhan/text-expander-by-ofi-khan/issues)
- **Email Support**: [Contact developer](mailto:ofi.khan051@gmail.com)
- **Developer Website**: [Ofi Khan](https://www.ofikhan.com)
- **Chrome Web Store**: [Leave reviews and ratings](https://chromewebstore.google.com/detail/text-expander-by-ofi-khan/ofdlmmadalaoceafcekkkanigmdehbig)

## 💡 Tips & Best Practices
1. **Use descriptive shortcuts**: Create shortcuts that are easy to remember (e.g., addr for address)
2. **Use context menu**: Select text on any webpage and right-click "Add New Shortcut" for quick creation
3. **Organize with categories**: Group related shortcuts together (e.g., Work, Personal, Code)
4. **Use color coding**: Assign meaningful colors to categories for quick visual identification
5. **Leverage variables**: Use variables for dynamic content like dates and time
6. **Use the search feature**: Quickly find shortcuts in large collections using the search box
7. **Filter by category**: Use category filter to focus on specific shortcut groups
8. **Regular backups**: Use the export feature to create regular backups of your shortcuts and categories
9. **Monitor statistics**: Keep an eye on your most-used shortcuts using the statistics tab
10. **Edit instead of delete**: Use edit feature to modify shortcuts and preserve statistics
11. **Delete unused shortcuts**: Regularly clean up your list by deleting unused shortcuts

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
- Suggesting new features via GitHub issues

**Made with ❤️ for productivity enthusiasts worldwide!**