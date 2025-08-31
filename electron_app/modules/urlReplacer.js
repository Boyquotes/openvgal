/**
 * URL Replacement Module
 * Handles URL search and replacement functionality
 */

// ===== URL REPLACEMENT TOOL =====
const path = require('path');

class URLReplacer {
    constructor() {
        this.statusDiv = null;
        this.searchInput = null;
        this.replacementInput = null;
        this.convertButton = null;
    }

    /**
     * Initializes the URL replacer UI elements and event listeners
     */
    initialize() {
        this.convertButton = document.getElementById('convert-button');
        this.statusDiv = document.getElementById('replacement-status');
        this.searchInput = document.getElementById('search-url');
        this.replacementInput = document.getElementById('replacement-url');

        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for the URL replacement functionality
     */
    setupEventListeners() {
        this.convertButton.addEventListener('click', () => this.handleConvertClick());
        document.getElementById('clear-url-status').addEventListener('click', () => this.clearStatus());
    }
    
    /**
     * Clears all status messages
     */
    clearStatus() {
        if (this.statusDiv) {
            this.statusDiv.innerHTML = '';
        }
    }

    /**
     * Handles the convert button click event
     */
    handleConvertClick() {
        const searchText = this.searchInput.value.trim();
        const replacementText = this.replacementInput.value.trim();

        if (!this.validateInputs(searchText, replacementText)) {
            return;
        }

        const contentDir = path.join(__dirname, '..', '..', 'web_server', 'content', 'materials');
        const jsonHandler = require('./jsonFileHandler');
        
        try {
            const results = jsonHandler.replaceInJSONFiles(
                contentDir,
                searchText,
                replacementText,
                (message, color) => this.setStatus(message, color)
            );

            if (!results.success && results.errors.length > 0) {
                console.error('Errors during replacement:', results.errors);
            }
        } catch (error) {
            this.setStatus(`Error: ${error.message}`, 'red');
            console.error('Error during replacement:', error);
        }
    }

    /**
     * Validates the search and replacement inputs
     * @param {string} searchText - The text to search for
     * @param {string} replacementText - The text to replace with
     * @returns {boolean} - Whether the inputs are valid
     */
    validateInputs(searchText, replacementText) {
        if (!searchText) {
            this.setStatus('Please enter text to search for', 'red');
            return false;
        }

        if (!replacementText) {
            this.setStatus('Please enter replacement text', 'red');
            return false;
        }

        return true;
    }

    /**
     * Sets the status message with the specified color
     * @param {string} message - The message to display
     * @param {string} color - The color of the message
     */
    setStatus(message, color) {
        // Create a new paragraph element for the message
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        paragraph.style.color = color;
        paragraph.style.margin = '0 0 5px 0';
        
        // Append the new message to the status div
        this.statusDiv.appendChild(paragraph);
        
        // Scroll to the bottom to show the latest message
        this.statusDiv.scrollTop = this.statusDiv.scrollHeight;
    }
}

module.exports = URLReplacer;