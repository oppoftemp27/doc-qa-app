/**
 * Document Preview Module
 * Provides full document preview functionality
 */

// Variables to store DOM elements
let fullPreviewButton;
let fullPreviewModal;
let fullPreviewContent;
let closeModalButton;
let previewContent;

// Event listener functions
function setupFullPreviewFunctionality() {
    console.log('Setting up full preview functionality');
    
    // Get DOM elements
    fullPreviewButton = document.getElementById('full-preview-button');
    fullPreviewModal = document.getElementById('full-preview-modal');
    fullPreviewContent = document.getElementById('full-preview-content');
    closeModalButton = document.getElementById('close-modal-button');
    previewContent = document.getElementById('preview-content');
    
    // Check if elements exist
    if (!fullPreviewButton) {
        console.error('Full preview button not found in the DOM');
    }
    
    if (!fullPreviewModal) {
        console.error('Full preview modal not found in the DOM');
    }
    
    if (!fullPreviewContent) {
        console.error('Full preview content not found in the DOM');
    }
    
    if (!closeModalButton) {
        console.error('Close modal button not found in the DOM');
    }
    
    // If any of the required elements are missing, return
    if (!fullPreviewButton || !fullPreviewModal || !fullPreviewContent || !closeModalButton) {
        console.error('Full preview elements not found in the DOM');
        return;
    }
    
    console.log('All required elements for full preview found in the DOM');
    
    // Set up event listeners
    fullPreviewButton.addEventListener('click', showFullPreview);
    closeModalButton.addEventListener('click', hideFullPreview);
    
    // Close modal when clicking outside the content
    fullPreviewModal.addEventListener('click', function(event) {
        if (event.target === fullPreviewModal) {
            hideFullPreview();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !fullPreviewModal.classList.contains('hidden')) {
            hideFullPreview();
        }
    });
    
    // Make sure button is visible (could be hidden in CSS)
    fullPreviewButton.style.display = 'block';
    
    console.log('Full preview functionality set up successfully');
}

/**
 * Show full preview of the document
 */
function showFullPreview() {
    console.log('Show full preview clicked');
    
    // Get document text from global variables
    const docText = window.documentText || window.lastProcessedDocumentText || '';
    
    if (!docText) {
        if (typeof showNotification === 'function') {
            showNotification('No document content available to preview', 'error');
        } else {
            alert('No document content available to preview');
        }
        console.error('No document content available to preview');
        return;
    }
    
    // Get the current file name
    const fileName = getCurrentFileName();
    
    // Update modal title
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = fileName || 'Document Preview';
    }
    
    // Format the content based on file type
    const formattedContent = formatDocumentContent(docText, fileName);
    
    // Update modal content
    fullPreviewContent.innerHTML = formattedContent;
    
    // Show modal
    fullPreviewModal.classList.remove('hidden');
    
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
    
    console.log('Displaying full preview modal');
}

/**
 * Hide full preview modal
 */
function hideFullPreview() {
    console.log('Hiding full preview modal');
    
    fullPreviewModal.classList.add('hidden');
    
    // Restore scrolling
    document.body.style.overflow = '';
}

/**
 * Format document content for display
 * @param {string} content - Document content
 * @param {string} fileName - File name (used to determine format)
 * @returns {string} - Formatted HTML content
 */
function formatDocumentContent(content, fileName) {
    // Determine file type from name
    const fileExt = fileName ? fileName.split('.').pop().toLowerCase() : '';
    
    // Prepare content based on file type
    let formattedContent = '';
    
    if (fileExt === 'pdf') {
        formattedContent = formatPdfContent(content);
    } else if (fileExt === 'docx' || fileExt === 'doc') {
        formattedContent = formatDocContent(content);
    } else {
        // Default formatting for other file types
        formattedContent = `<div class="document-text">${formatPlainText(content)}</div>`;
    }
    
    return formattedContent;
}

/**
 * Format PDF content with page breaks and structure
 * @param {string} content - PDF content
 * @returns {string} - Formatted HTML
 */
function formatPdfContent(content) {
    // Check if content has already been processed with markdown-like syntax
    if (content.includes('# ') || content.includes('## Page')) {
        // Split by page markers
        const parts = content.split(/## Page \d+/);
        let pages = [];
        
        // First part is the header
        const header = parts[0];
        
        // Process each page
        for (let i = 1; i < parts.length; i++) {
            if (parts[i].trim()) {
                pages.push(`<div class="document-page">${formatPlainText(parts[i])}</div>`);
            }
        }
        
        // Combine with header and page breaks
        return `
            <div class="document-text">
                ${formatPlainText(header)}
                ${pages.join('<div class="page-break"></div>')}
            </div>
        `;
    }
    
    // If not processed, just format as plain text
    return `<div class="document-text">${formatPlainText(content)}</div>`;
}

/**
 * Format DOC/DOCX content with structure
 * @param {string} content - DOCX content
 * @returns {string} - Formatted HTML
 */
function formatDocContent(content) {
    // Check if content has already been processed with markdown-like syntax
    if (content.includes('# ')) {
        const lines = content.split('\n');
        let formattedLines = [];
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Handle headers
            if (line.startsWith('# ')) {
                formattedLines.push(`<h1>${line.substring(2)}</h1>`);
            } else if (line.startsWith('## ')) {
                formattedLines.push(`<h2>${line.substring(3)}</h2>`);
            } else if (line.startsWith('### ')) {
                formattedLines.push(`<h3>${line.substring(4)}</h3>`);
            } else if (line.trim() === '') {
                formattedLines.push('<br>');
            } else {
                formattedLines.push(escapeHtml(line));
            }
        }
        
        return `<div class="document-text">${formattedLines.join('\n')}</div>`;
    }
    
    // If not processed, format as plain text
    return `<div class="document-text">${formatPlainText(content)}</div>`;
}

/**
 * Format plain text with proper line breaks and escaping
 * @param {string} text - Plain text content
 * @returns {string} - HTML formatted text
 */
function formatPlainText(text) {
    // Handle markdown-like syntax
    const lines = text.split('\n');
    let formattedLines = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle headers
        if (line.startsWith('# ')) {
            formattedLines.push(`<h1>${escapeHtml(line.substring(2))}</h1>`);
        } else if (line.startsWith('## ')) {
            formattedLines.push(`<h2>${escapeHtml(line.substring(3))}</h2>`);
        } else if (line.startsWith('### ')) {
            formattedLines.push(`<h3>${escapeHtml(line.substring(4))}</h3>`);
        } else if (line.trim() === '') {
            formattedLines.push('<br>');
        } else {
            formattedLines.push(escapeHtml(line));
        }
    }
    
    return formattedLines.join('\n');
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} html - Text that might contain HTML
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Get current file name from the preview title or fallback
 * @returns {string} - File name
 */
function getCurrentFileName() {
    // Try to get file name from preview title
    const previewTitle = document.getElementById('preview-title');
    if (previewTitle && previewTitle.textContent && previewTitle.textContent !== 'Document Preview') {
        return previewTitle.textContent;
    }
    
    // Try to get from the preview content
    if (previewContent && previewContent.textContent) {
        const match = previewContent.textContent.match(/^(.*\.(pdf|docx|doc|txt))/i);
        if (match) {
            return match[1];
        }
    }
    
    // Default
    return 'Document';
}

/**
 * Update the preview content when document is processed
 * This function should be called from your document processing flow
 * @param {string} content - Document content
 * @param {string} fileName - File name
 */
function updateDocumentPreview(content, fileName) {
    console.log('Updating document preview for', fileName);
    
    // Store full document content
    window.documentText = content;
    window.lastProcessedDocumentText = content;
    
    // Get preview element
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) {
        console.error('Preview content element not found');
        return;
    }
    
    // Update preview title
    const previewTitle = document.getElementById('preview-title');
    if (previewTitle) {
        previewTitle.textContent = fileName || 'Document Preview';
    }
    
    // Create a shortened preview
    const previewLength = 500;
    const shortContent = content.length > previewLength ? 
        content.substring(0, previewLength) + '...' : 
        content;
    
    // Format the preview content
    let formattedPreview = '';
    
    // Keep the first few lines including any headers
    const lines = shortContent.split('\n');
    const previewLines = [];
    
    // Include the first header and a few lines
    let foundHeader = false;
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        if (!foundHeader && (lines[i].startsWith('# ') || lines[i].startsWith('## '))) {
            previewLines.push(lines[i]);
            foundHeader = true;
        } else if (previewLines.length < 5) {
            previewLines.push(lines[i]);
        }
    }
    
    // Create the formatted preview with a message to view full content
    formattedPreview = `
        <div class="document-text">
            ${formatPlainText(previewLines.join('\n'))}
        </div>
        <div class="preview-footer">
            <p class="preview-message">This is a preview. Click "Show full preview of the document" to see the entire content.</p>
        </div>
    `;
    
    // Update the preview
    previewContent.innerHTML = formattedPreview;
    
    // Show the preview section
    const previewSection = document.getElementById('document-preview');
    if (previewSection) {
        previewSection.classList.remove('hidden');
    }
    
    // Make sure the full preview button is visible
    const fullPreviewButton = document.getElementById('full-preview-button');
    if (fullPreviewButton) {
        fullPreviewButton.style.display = 'block';
    }
    
    console.log('Document preview updated successfully');
}

// Set up full preview functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up full preview functionality');
    setupFullPreviewFunctionality();
});

// Make functions globally available
window.setupFullPreviewFunctionality = setupFullPreviewFunctionality;
window.updateDocumentPreview = updateDocumentPreview;
window.showFullPreview = showFullPreview;
window.hideFullPreview = hideFullPreview;