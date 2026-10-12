# Text Expander By Ofi Khan
A powerful and lightweight Chrome extension designed to streamline text expansion across all websites. Perfect for customer support, developers, writers, and anyone who wants to eliminate repetitive typing. This tool allows you to create, manage, export, and import shortcuts with advanced features like variable support, usage statistics, site control, and universal compatibility.

## ✨ Key Features

### 🚀 Universal Compatibility
- **Works on ALL websites** - Gmail, WhatsApp Web, social media, and more
- **Smart input detection** - Supports regular text fields, rich text editors, and contenteditable elements
- **Real-time expansion** - Text expands as you type or when you press space/tab/enter
- **Password fields are always protected** - Text expansion never runs in password inputs

### ☁️ Google Account Sync
- **Same experience on every computer**: Sign in to Chrome with your Google account on your office PC and your home PC, and your shortcuts follow you
- **Syncs everything**: Shortcuts, categories, settings (including the prefix character and site control), and usage statistics
- **Smart merging**: Changes made on two computers are combined instead of one overwriting the other (usage counts from both computers add up)
- **Deletions sync too**: Delete a shortcut on one computer and it disappears from the others
- **On by default, easy to turn off**: Use the "Sync with Google Account" toggle in the Settings tab
- **Status at a glance**: See when you last synced and how much sync storage you are using, with a "Sync Now" button
- **Built on Chrome Sync**: No extra account or server; your data travels through your own Google account

### 🌐 Site Control (Whitelist / Blacklist)
- **Choose one mode**: Work on all sites, Whitelist, or Blacklist
- **Whitelist mode**: The extension works ONLY on the sites you list and is disabled everywhere else
- **Blacklist mode**: The extension is disabled on the sites you list and works everywhere else
- **Subdomains included**: Adding `facebook.com` also covers `www.facebook.com`, `m.facebook.com`, and so on
- **Paste any URL**: `https://www.ofikhan.com/page` is automatically saved as `ofikhan.com`
- **Separate lists per mode**: Switching modes never erases the other mode's list
- **Instant effect**: Changes apply immediately, with no page reload needed
- **Included in backups**: Site control settings are saved in export/import files

### 🔤 Optional Prefix Character
- **Off by default**: Shortcuts work exactly as before until you turn it on
- **Your own character**: Choose any single character (e.g., `/` or `_`) in the Settings tab
- **Prefix required when on**: With `/` as the prefix, `/brb` expands to "Be right back" while plain `brb` stays as typed
- **Clean replacement**: The prefix is removed when the shortcut expands
- **Works with existing shortcuts**: Shortcuts that already start with the prefix character (like `/ty`) work as they are
- **Instant effect**: Changes apply immediately, with no page reload needed
- **Included in backups**: The prefix setting is saved in export/import files

### 🔒 Password Field Protection
- **Never expands in password fields**: Typing a shortcut like `brb` in a password box stays exactly as typed
- **Show-password toggles handled**: Fields marked with `autocomplete="current-password"` or `"new-password"` are also skipped, even if the site switches them to plain text
- **No listeners attached**: Password inputs are not monitored at all

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
- **Google Account Sync** - Keep shortcuts, settings, and stats in sync across your computers
- **Prefix character** - Optionally require a character like `/` before shortcuts
- **Site control** - Whitelist or blacklist websites from the Settings tab
- **Visual status indicators** - Clear indication of extension status with improved positioning
- **Real-time settings sync** - Changes apply immediately across all tabs
- **Clean tabbed interface** - Streamlined navigation without redundant titles

### 💾 Complete Data Management
- **Enhanced Export/Import** - Backup shortcuts, settings, statistics, categories, site control, and prefix settings in JSON format
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

**Method 2: From Selected Text**
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

### Using Google Account Sync
1. **Sign in to Chrome** with your Google account and make sure **Chrome sync is turned on** (Chrome Settings → You and Google → Sync)
2. **Install the extension** on each computer where you want your shortcuts
3. **Open the Settings tab**: the **Sync with Google Account** toggle is on by default
4. **Use it normally**: changes upload automatically a few seconds after you make them
5. **On a new computer**: install the extension, sign in, and give it a minute. Your shortcuts and settings arrive on their own
6. **Check status or force a sync**: the status line shows the last sync time and storage used; click **Sync Now** to sync immediately

**Good to know**
- Chrome limits sync storage to about 100 KB. Data is compressed, so this fits hundreds of shortcuts
- If sync storage is full, the extension keeps working and shows a warning; your data stays safe on your computer
- Turning sync off keeps your data on this computer and stops uploading and downloading changes
- Don't store passwords or other secrets in shortcuts, since synced data passes through your Google account
- "Delete All" and "Clear Stats" sync to your other computers too, so back up with Export Data first

### Using the Prefix Character
1. **Open the Settings tab** and turn on **Require Prefix Character**
2. **Choose your character** in the box that appears (it starts as `/`; you can use `_` or any other single character)
3. **Type the prefix before a shortcut**: `/brb` expands to "Be right back"
4. **Plain shortcuts no longer expand**: typing `brb` on its own stays as `brb`
5. **Turn the toggle off** at any time to go back to typing shortcuts without a prefix

**Good to know**
- The prefix is off by default
- The prefix character is removed when the shortcut expands
- Shortcuts that already start with the prefix (like `/ty`) work as they are, with no double prefix
- The prefix must be a single character and cannot be a space

### Using Site Control (Whitelist / Blacklist)

**Option A: Use the extension only on specific sites (Whitelist)**
1. **Open the Settings tab** and find the **Site Control** section
2. **Select "Whitelist: work only on these sites"**
3. **Type a site** (e.g., `facebook.com`) and click **Add**
4. **Repeat** for every site where you want text expansion (e.g., `ofikhan.com`)
5. The extension is now **disabled on all other sites**

**Option B: Turn the extension off on specific sites (Blacklist)**
1. **Open the Settings tab** and find the **Site Control** section
2. **Select "Blacklist: disable on these sites"**
3. **Type a site** and click **Add**
4. The extension is now **disabled on the listed sites** and works everywhere else

**Good to know**
- Only one mode can be active at a time, but each mode remembers its own list
- Listed sites include all subdomains
- An empty whitelist means the extension works nowhere
- Different domains must be added separately (e.g., `facebook.com` and `messenger.com`)
- Select **"Work on all sites"** to turn site control off at any time

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
- **Settings Tab**: Configure case sensitivity, enable/disable, prefix character, and site control
- **Statistics Tab**: View usage patterns and most-used shortcuts
- **Export/Import**: Backup your complete configuration including categories, site control, and prefix settings
- **Search Feature**: Quickly find shortcuts in large collections with real-time search
- **Filter by Category**: View shortcuts by category with shortcut counts

### Site-Specific Behavior
The extension intelligently adapts to different websites:
- **Gmail**: Works in compose windows and replies
- **WhatsApp Web**: Expands in chat input
- **Social Media**: Compatible with Facebook, X, LinkedIn, etc.
- **Password fields**: Never expanded, on any site

## 📁 Project Structure
```
text-expander-by-ofi-khan/
├── manifest.json         # Extension configuration and permissions
├── popup.html            # Main popup interface with tabbed layout
├── popup.js              # Popup logic with settings and statistics
├── popup.css             # Modern styling for popup interface
├── sitecontrol.js        # Whitelist/blacklist logic for the popup
├── sitecontrol.css       # Styling for the Site Control section
├── prefix.js             # Prefix character setting logic for the popup
├── prefix.css            # Styling for the prefix character setting
├── sync.js               # Google Account Sync engine (runs in the background)
├── syncui.js             # Sync toggle, status, and Sync Now button in the popup
├── syncui.css            # Styling for the sync section
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
- **ContextMenus**: Right-click menu access in text fields and on selected text

**🔒 Privacy Guarantee**: No data is ever sent to the developer or to any third-party server. Your shortcuts, statistics, and settings stay on your device. If Google Account Sync is on (you can turn it off in Settings), your data is also stored in your own Google account through Chrome Sync, the same way Chrome syncs your bookmarks and passwords.

**Password fields are never touched**: The extension is disabled on all password inputs, so nothing you type there is read or changed.

## 📋 Changelog

### Version 4.0 (Latest)

🆕 **Major Release: Google Account Sync, Privacy Controls, Site Management & Prefix Trigger**

✅ **Google Account Sync**
- **Sync across computers**: Shortcuts, categories, settings, prefix character, site control, and usage statistics follow your Google account, so your office PC and home PC give the same experience
- **Automatic**: Changes upload a few seconds after you make them and download on your other computers without any action
- **Settings toggle**: "Sync with Google Account" is on by default and can be turned off any time
- **Status and manual sync**: See the last sync time and sync storage used, and click "Sync Now" to sync immediately
- **Smart three-way merge**: Edits made on two computers are combined; deletions propagate; usage counts from both computers add up
- **First sync is safe**: When a second computer syncs for the first time, existing shortcuts on both are merged, and default examples never override your synced data
- **Compact storage**: Data is compressed and split into small pieces to fit Chrome's sync limits (about 100 KB total), which is enough for hundreds of shortcuts
- **Friendly limits handling**: If sync storage is full or Chrome's write limit is hit, a clear message appears and the extension retries; local data is never lost
- **Default shortcuts only on fresh install**: Deleted example shortcuts no longer come back after extension updates

✅ **Site Control: Whitelist & Blacklist**
- **Whitelist mode**: Text expansion works only on the sites you add and is disabled everywhere else
- **Blacklist mode**: Text expansion is disabled on the sites you add and works everywhere else
- **One mode at a time**: Choose "Work on all sites", "Whitelist", or "Blacklist" in the Settings tab
- **Subdomain support**: Adding `example.com` also covers `www.example.com`, `app.example.com`, etc.
- **Smart input**: Paste a full URL or just a domain; it is cleaned up automatically (protocol, `www.`, path, and port are removed)
- **Separate lists**: Whitelist and blacklist are stored independently, so switching modes never loses your lists
- **Duplicate and invalid entry detection**: Clear alerts when a site is already listed or isn't a valid website
- **Helpful guidance**: Context-aware help text, plus a notice when the whitelist is empty
- **Instant effect**: Changes apply immediately to open tabs without reloading
- **Backup support**: Site control is included in export/import (older backup files still import normally)

✅ **Optional Prefix Character**
- **New setting**: "Require Prefix Character" toggle in the Settings tab, off by default
- **Custom character**: Pick any single character (e.g., `/` or `_`) as the prefix
- **Strict triggering when on**: `/brb` expands to "Be right back"; plain `brb` does not
- **Prefix removed on expansion**: The prefix is not left behind in the expanded text
- **Existing shortcuts supported**: Shortcuts that already start with the prefix (like `/ty`) keep working without a double prefix
- **Safe input**: The prefix must be one non-space character; invalid entries revert to the last valid character
- **Instant effect and backups**: Applies immediately in open tabs and is included in export/import (older backup files still import normally)

✅ **Password Field Protection**
- Text expansion is now completely disabled in password fields
- Typing a shortcut like `brb` in a password box stays exactly as typed
- Also skips fields marked with `autocomplete="current-password"` / `"new-password"`, including fields switched to plain text by a "show password" toggle
- No listeners are attached to password inputs at all

🔧 **Technical Enhancements**
- **New files**: `sync.js`, `syncui.js`, `syncui.css`, `sitecontrol.js`, `sitecontrol.css`, `prefix.js`, and `prefix.css` keep the new features self-contained
- **Real-time settings sync**: Content scripts now listen to storage changes, so the Enable toggle, case sensitivity, shortcuts, prefix, and site control all take effect instantly in open tabs
- **Central site check**: Site rules are enforced in one place, covering every input type, including Facebook and WhatsApp Web editors
- **Background script**: Loads the sync engine; defaults initialized for site control; export/import extended for site control and the prefix setting

### Version 3.1

🆕 **Support & Community Features**

✅ **Support Me Link**
- **Support link in popup**: Direct link to support the developer (https://www.supportkori.com/ofikhan)
- **Easy access**: Conveniently placed in the popup header next to the title
- **Styled integration**: Matches extension's green color theme (#00594c)
- **External link**: Opens in new tab without disrupting workflow
- **Community support**: Help sustain development and new features
- **Pointer emoji**: Visual indicator (👉) to draw attention to support option

### Version 3.0

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
- Google Account Sync depends on Chrome Sync: you must be signed in to Chrome with sync turned on, and changes can take from a few seconds to a few minutes to reach another computer
- Chrome limits sync storage to about 100 KB; if you hit the limit the extension shows a warning and keeps working locally
- If two computers change the same shortcut at nearly the same time, the most recent edit wins
- Site control checks the address of each frame, so a cross-origin iframe embedded on a whitelisted site needs its own domain added to the whitelist

## 📞 Support & Community
- **In-App Support**: Click "Support Me" link in the extension popup
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
8. **Regular backups**: Use the export feature to create regular backups of your shortcuts, categories, and site control settings
9. **Monitor statistics**: Keep an eye on your most-used shortcuts using the statistics tab
10. **Edit instead of delete**: Use edit feature to modify shortcuts and preserve statistics
11. **Delete unused shortcuts**: Regularly clean up your list by deleting unused shortcuts
12. **Avoid accidental expansions**: Turn on the prefix character (e.g., `/brb`) so short shortcuts never expand inside ordinary words you type
13. **Back up before bulk deletes**: With sync on, "Delete All" and "Clear Stats" affect all your computers, so use Export Data first
14. **Limit where it runs**: Use a whitelist to restrict the extension to a few trusted sites, or a blacklist to switch it off on sites where it gets in the way

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
