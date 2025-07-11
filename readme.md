# Text Expander By Ofi Khan

A lightweight Chrome extension designed to streamline text expansion, perfect for quick responses in Customer Support. This tool allows you to create, manage, export, and import shortcuts to save time on repetitive typing tasks.

## Features
- **Add and Delete Shortcuts**: Easily create and remove custom shortcuts (e.g., `ty` expands to "Thank you").
- **Export Shortcuts**: Save your shortcuts as a JSON file for backup or sharing.
- **Import Shortcuts**: Load shortcuts from a JSON file to quickly restore or transfer settings.
- **Custom Icon**: Features a vibrant "TE by Ofi" icon with a digital art design.
- **User-Friendly Popup**: Intuitive interface to manage shortcuts directly from the browser.

## Installation
1. **Clone the Repository**:
   git clone https://github.com/ofikhan/text-expander-by-ofi-khan.git

2. Load the Extension in Chrome:
    - Open Chrome and go to `chrome://extensions/`.
    - Enable "Developer mode" (top right toggle).
    - Click "Load unpacked" and select the cloned `text-expander-by-ofi-khan` folder. 
3. Verify:
    - The extension icon should appear in your Chrome toolbar. Click it to open the popup and start using it.

## Usage
1. **Add a Shortcut**:
    - Open the popup by clicking the extension icon.
    - Enter a shortcut (e.g., `ty`) and its expanded text (e.g., "Thank you").
    - Click "Add Shortcut" to save it.
2. **Use a Shortcut**:
    - Type the shortcut (e.g., `ty`) in any text field, and the extension will expand it automatically.
3. **Manage Shortcuts**:
    - View all shortcuts in the popup and delete any by clicking the "Delete" button next to them.
4. **Backup and Restore**:
    - Click "Export Shortcuts" to download a JSON file. 
    - Use the "Import Shortcuts" option to upload a previously exported file.

## Project Structure
- `manifest.json`: Configuration file for the Chrome extension.
- `popup.html`: The popup interface for managing shortcuts.
- `popup.js`: JavaScript logic for adding, deleting, exporting, and importing shortcuts.
- `popup.css`: Styles for the popup interface.
- `icons/`: Directory containing the "TE by Ofi" icon in various sizes.

## Contributing
Feel free to fork this repository and submit pull requests if you’d like to contribute! Suggestions for new features (e.g., cloud sync, more styling options) are welcome.

## License
This project is open-source and available under the MIT License.

## Acknowledgements
Built by Ofi Khan.
Inspired by the need for efficient text expansion in customer support workflows.