/**
 * Document Q&A Application
 * Main application logic for document upload, processing, and Q&A functionality
 */

// Global variables
let documentText = '';
let isProcessing = false;
let currentResponse = '';

// DOM elements
let fileInput;
let uploadStatus;
let documentPreview;
let qaSection;
let queryInput;
let askButton;
let responseContainer;
let responseContent;
let mockModeToggle;
let charCount;
let recommendationChips;
let notification;
let apiSettingsButton;
let configPanel;
let uploadSection;
let themeToggle;

/**
 * Initialize the application
 * Set up event listeners and UI components
 */
function initializeApp() {
    // Get DOM elements
    fileInput = document.getElementById('file-input');
    uploadStatus = document.getElementById('upload-status');
    documentPreview = document.getElementById('document-preview');
    qaSection = document.getElementById('qa-section');
    queryInput = document.getElementById('query-input');
    askButton = document.getElementById('ask-button');
    responseContainer = document.getElementById('response-container');
    responseContent = document.getElementById('response-content');
    mockModeToggle = document.getElementById('mock-mode-toggle');
    charCount = document.getElementById('char-count');
    recommendationChips = document.getElementById('recommendation-chips');
    notification = document.getElementById('notification');
    uploadSection = document.getElementById('upload-section');
    themeToggle = document.getElementById('theme-toggle');
    
    // Set up event listeners
    if (fileInput) fileInput.addEventListener('change', handleFileUpload);
    if (queryInput) queryInput.addEventListener('input', updateCharCount);
    if (askButton) askButton.addEventListener('click', handleAskQuestion);
    
    // Initialize UI state
    
    if(themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    updateUIState();
    
    // Initialize OpenAI integration
    if (typeof initializeOpenAIIntegration === 'function') {
        initializeOpenAIIntegration();
    }
    
    // Set up API usage UI
    if (typeof setupAPIUsageUI === 'function') {
        setupAPIUsageUI();
    }
    
    // Set up API configuration panel
    setupAPIConfigPanel();
    
    // Set up full preview functionality
    if (typeof setupFullPreviewFunctionality === 'function') {
        setupFullPreviewFunctionality();
    }
    
    console.log('Document Q&A Application initialized');
}

function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
}

// Check for user's preference on load
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark-mode';
    }
};
/**
 * Update the UI state based on current application state
 */
function updateUIState() {
    console.log("updateUIState function is running");
    
    // Show/hide sections based on whether a document is uploaded
    if (uploadSection && qaSection && recommendationChips) {
        if (documentText) {
            // Document uploaded: show QA and recommendation, hide upload
            uploadSection.style.display = 'none';
            qaSection.style.display = 'block';
            recommendationChips.style.display = 'block';
        } else {
            // No document: show upload, hide others
            uploadSection.style.display = 'block';
            qaSection.style.display = 'none';
            recommendationChips.style.display = 'none';
        }
    }


    
    // Disable ask button if no document or no query
    if (askButton && queryInput) {
        askButton.disabled = !documentText || !queryInput.value.trim() || isProcessing;
    }
    
    // Update character count
    updateCharCount();
}

/**
 * Handle file upload
 * @param {Event} event - The change event from file input
 */
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log("File upload started:", file.name);
    
    // Check file size
    const maxSize = LLM_CONFIG?.document?.maxFileSize || 20 * 1024 * 1024; // 20MB default
    if (file.size > maxSize) {
        showNotification(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`, 'error');
        fileInput.value = '';
        return;
    }
    
    // Check file type
    const fileExt = file.name.split('.').pop().toLowerCase();
    const supportedTypes = LLM_CONFIG?.document?.supportedFileTypes || ['.pdf', '.docx', '.xlsx', '.txt'];
    
    if (!supportedTypes.includes(`.${fileExt}`)) {
        showNotification(`Unsupported file type. Please upload ${supportedTypes.join(', ')}`, 'error');
        fileInput.value = '';
        return;
    }
    
    // Update UI to show processing
    isProcessing = true;
    updateUIState();
    
    if (uploadStatus) {
        uploadStatus.textContent = 'Processing document...';
        uploadStatus.className = 'status-processing';
    }
    
    try {
        // Process the document
        documentText = await processDocument(file);
        console.log("Document processed with length:", documentText.length);
        
        // Make sure documentText is also available as a global variable
        window.documentText = documentText;
        window.lastProcessedDocumentText = documentText;
        
        // Update UI for successful upload
        if (uploadStatus) {
            uploadStatus.textContent = 'Document processed successfully';
            uploadStatus.className = 'status-success';
        }
        
        // Update document preview with the actual content
        if (documentPreview) {
            // Update the preview title
            const previewTitle = document.getElementById('preview-title');
            if (previewTitle) {
                previewTitle.textContent = file.name || 'Document Preview';
            }
            
            // Use the updateDocumentPreview function from preview.js
            if (typeof updateDocumentPreview === 'function') {
                updateDocumentPreview(documentText, file.name);
            } else {
                // Fallback preview if the function isn't available
                const previewContent = document.getElementById('preview-content');
                if (previewContent) {
                    const previewLength = Math.min(500, documentText.length);
                    const preview = documentText.substring(0, previewLength) + 
                                  (documentText.length > previewLength ? '...' : '');
                    
                    previewContent.innerHTML = `
                        <h3>${file.name}</h3>
                        <p><strong>Document Preview:</strong></p>
                        <pre style="max-height: 200px; overflow-y: auto; white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 5px;">${preview}</pre>
                    `;
                }
            }
            
            // Show the preview section
            documentPreview.classList.remove('hidden');
            
            // Make sure the full preview button is visible 
            const fullPreviewButton = document.getElementById('full-preview-button');
            if (fullPreviewButton) {
                fullPreviewButton.style.display = 'block';
            }
        }
        
        // Reinitialize the full preview functionality
        if (typeof setupFullPreviewFunctionality === 'function') {
            setupFullPreviewFunctionality();
        }
        
        // Show Q&A section
        if (qaSection) {
            qaSection.classList.remove('hidden');
        }
        
        // Generate recommendation chips
        generateRecommendationChips();
        
        // Show success notification
        showNotification('Document processed successfully', 'success');
        
    } catch (error) {
        console.error('Error processing document:', error);
        
        // Update UI for failed upload
        if (uploadStatus) {
            uploadStatus.textContent = `Error: ${error.message}`;
            uploadStatus.className = 'status-error';
        }
        
        // Show error notification
        showNotification(`Error processing document: ${error.message}`, 'error');
        
        // Reset document text
        documentText = '';
    }
    
    // Update UI state
    isProcessing = false;
    updateUIState();
}

/**
 * Handle ask question button click
 */
async function handleAskQuestion() {
    const query = queryInput.value.trim();
    
    // Validate query
    if (!query) {
        showNotification('Please enter a question', 'error');
        return;
    }
    
    // Validate document
    if (!documentText) {
        showNotification('Please upload a document first', 'error');
        return;
    }
    
    // Update UI to show processing
    isProcessing = true;
    updateUIState();
    
    if (responseContainer) {
        responseContainer.classList.remove('hidden');
    }
    
    if (responseContent) {
        responseContent.innerHTML = '<div class="loading">Processing your question...</div>';
    }
    
    try {
        console.log("Processing question:", query);
        console.log("Document text length:", documentText.length);
        
        // Use document content directly or get response
        let response;
        if (mockModeToggle && mockModeToggle.checked) {
            // Generate a response based on actual document content
            response = generateDocumentResponse(query, documentText);
        } else {
            // Get response from LLM
            response = await getLLMResponse(query, documentText);
        }
        
        currentResponse = response;
        
        // Update UI with response
        if (responseContent) {
            responseContent.innerHTML = `<div class="response-text">${response}</div>`;
        }
        
        // Generate new recommendation chips based on the response
        generateRecommendationChips(response);
        
    } catch (error) {
        console.error('Error getting response:', error);
        
        // Update UI for failed request
        if (responseContent) {
            responseContent.innerHTML = `<div class="error-text">Error: ${error.message}</div>`;
        }
        
        // Show error notification
        showNotification(`Error: ${error.message}`, 'error');
    }
    
    // Update UI state
    isProcessing = false;
    updateUIState();
}

/**
 * Generate a response based on document content
 * @param {string} query - The user's question
 * @param {string} documentText - The document content
 * @returns {string} - A response based on document content
 */
function generateDocumentResponse(query, documentText) {
    // Get statistics about the document
    const lines = documentText.split('\n').filter(line => line.trim());
    const words = documentText.split(/\s+/).filter(word => word.trim());
    const chars = documentText.length;
    
    // Try to determine document title (first line or significant line)
    const title = lines[0] || "Untitled Document";
    
    // Get a reasonable preview
    const previewLength = Math.min(600, documentText.length);
    const preview = documentText.substring(0, previewLength) + 
                  (documentText.length > previewLength ? '...' : '');
    
    const queryLower = query.toLowerCase();
    
    // Format based on query type
    if (queryLower.includes('summary') || queryLower.includes('about')) {
        return generateSummaryResponse(documentText);
    } else if (queryLower.includes('find') || queryLower.includes('search')) {
        return generateSearchResponse(query, documentText);
    } else {
        return `## Document Content

**Document Title/First Line**: ${title}

**Document Statistics**:
- ${lines.length} lines of text
- Approximately ${words.length} words
- ${chars} total characters

**Document Preview**:
\`\`\`
${preview}
\`\`\`

This is showing the actual content of your document. To see specific information, try asking more specific questions like:
- "What is this document about?"
- "Find mentions of [specific term]"
- "Give me a summary of this document"`;
    }
}

/**
 * Generate a summary response for the document
 * @param {string} documentText - The document content
 * @returns {string} - A summary response
 */
function generateSummaryResponse(documentText) {
    // Get document statistics
    const lines = documentText.split('\n').filter(line => line.trim());
    const words = documentText.split(/\s+/).filter(word => word.trim());
    
    // Get title or first line
    const title = lines[0] || "Untitled Document";
    
    // Try to identify important lines (potential headings or key content)
    const importantLines = lines
        .filter(line => 
            line === line.toUpperCase() || // ALL CAPS lines
            (line.length < 50 && line.length > 10) || // Short lines (potential headings)
            line.endsWith(':') || // Lines ending with colon
            /^[A-Z0-9]/.test(line) // Lines starting with capital letter or number
        )
        .slice(0, 5);
    
    // Get document preview
    const preview = documentText.substring(0, 400) + (documentText.length > 400 ? '...' : '');
    
    return `## Document Summary

**Document Title/First Line**: ${title}

**Document Statistics**:
- Contains ${lines.length} lines of text
- Contains approximately ${words.length} words
- Total length: ${documentText.length} characters

**Key Content**:
${importantLines.map(line => `- ${line}`).join('\n')}

**Document Preview**:
\`\`\`
${preview}
\`\`\`

This is based on the actual content of your document.`;
}

/**
 * Generate a search response for the document
 * @param {string} query - The user's question
 * @param {string} documentText - The document content
 * @returns {string} - A search response
 */
function generateSearchResponse(query, documentText) {
    // Extract search terms from query
    const searchTerms = query.toLowerCase()
        .replace(/find|search|for|about|where|is|are|show|me/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
    
    if (searchTerms.length === 0) {
        return `I couldn't identify specific search terms in your query. Please try again with more specific terms to search for in the document.`;
    }
    
    // Find matching lines
    const lines = documentText.split('\n');
    const matchingLines = [];
    
    for (const line of lines) {
        if (line.trim() && searchTerms.some(term => line.toLowerCase().includes(term))) {
            matchingLines.push(line.trim());
        }
    }
    
    if (matchingLines.length === 0) {
        return `I couldn't find any content matching "${searchTerms.join(', ')}" in your document. Please try different search terms.`;
    }
    
    return `## Search Results for "${searchTerms.join(', ')}"

Found ${matchingLines.length} matching lines in your document:

${matchingLines.slice(0, 10).map((line, i) => `${i+1}. ${line}`).join('\n')}
${matchingLines.length > 10 ? `\n...and ${matchingLines.length - 10} more matches.` : ''}

This search was performed on the actual content of your document.`;
}

/**
 * Update character count for query input
 */
function updateCharCount() {
    if (!queryInput || !charCount) return;
    
    const count = queryInput.value.length;
    charCount.textContent = count.toString();
    
    // Update button state
    if (askButton) {
        askButton.disabled = count === 0 || !documentText || isProcessing;
    }
}

/**
 * Generate recommendation chips based on document content or response
 * @param {string} [response] - Optional response to generate recommendations from
 */
function generateRecommendationChips(response = null) {
    if (!recommendationChips) return;
    
    // Clear existing chips
    recommendationChips.innerHTML = '';
    
    // Generate recommendations
    let recommendations = [];
    
    if (response) {
        // If we have a response, generate follow-up questions
        recommendations = generateFollowUpQuestions(response);
    } else if (documentText) {
        // If we have a document, generate initial questions based on actual content
        recommendations = generateInitialQuestions(documentText);
    } else {
        // Default recommendations
        recommendations = UI_CONFIG?.defaultRecommendations || [
            'What is this document about?',
            'Can you summarize the main points?',
            'What are the key findings?',
            'Are there any recommendations?'
        ];
    }
    
    // Create and add chip elements
    recommendations.forEach(recommendation => {
        const chip = document.createElement('div');
        chip.className = 'recommendation-chip';
        chip.textContent = recommendation;
        chip.addEventListener('click', () => {
            queryInput.value = recommendation;
            updateCharCount();
            queryInput.focus();
        });
        recommendationChips.appendChild(chip);
    });
}

/**
 * Generate initial questions based on document content
 * @param {string} documentText - Document content
 * @returns {string[]} - Array of recommended questions
 */
function generateInitialQuestions(documentText) {
    // Base questions that work for any document
    const baseQuestions = [
        'What is this document about?',
        'Give me a summary of this document',
        'Show me the content of this document'
    ];
    
    // Additional questions based on actual document content
    const additionalQuestions = [];
    
    // Look for specific content to generate relevant questions
    if (documentText.includes('sales') || documentText.includes('revenue') || 
        documentText.includes('profit') || documentText.includes('$')) {
        additionalQuestions.push(
            'Find financial information in the document',
            'What is the total revenue mentioned?'
        );
    }
    
    if (documentText.includes('project') || documentText.includes('timeline') || 
        documentText.includes('schedule') || documentText.includes('plan')) {
        additionalQuestions.push(
            'What is the project timeline?',
            'Find information about project planning'
        );
    }
    
    if (documentText.includes('recommend') || documentText.includes('conclusion') || 
        documentText.includes('summary')) {
        additionalQuestions.push(
            'What are the key recommendations?',
            'Find the conclusions in the document'
        );
    }
    
    // Combine and return up to 5 questions
    return [...baseQuestions, ...additionalQuestions].slice(0, 5);
}

/**
 * Generate follow-up questions based on previous response
 * @param {string} response - Previous response
 * @returns {string[]} - Array of follow-up questions
 */
function generateFollowUpQuestions(response) {
    // Add more specific follow-up questions
    const followUps = [
        'Show me more of the document content',
        'Find specific information in the document'
    ];
    
    // Look for specific content in the response to generate relevant follow-ups
    if (response.includes('financial') || response.includes('revenue') || 
        response.includes('sales') || response.includes('profit')) {
        followUps.push('Find all financial figures in the document');
    }
    
    if (response.includes('project') || response.includes('timeline')) {
        followUps.push('What are the project milestones?');
    }
    
    if (response.includes('search') || response.includes('found')) {
        followUps.push('Show me the complete document content');
    }
    
    // Return up to 5 follow-up questions
    return followUps.slice(0, 5);
}

/**
 * Set up API configuration panel
 */
function setupAPIConfigPanel() {
    // Get DOM elements
    const configPanel = document.getElementById('api-config-panel');
    const settingsButton = document.getElementById('api-settings-button');
    const saveConfigButton = document.getElementById('save-api-config');
    const closeConfigButton = document.getElementById('close-api-config');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelSelect = document.getElementById('model-select');
    const temperatureSlider = document.getElementById('temperature-slider');
    const temperatureValue = document.getElementById('temperature-value');
    
    console.log('API config elements:', { 
        configPanel, 
        settingsButton, 
        saveConfigButton, 
        closeConfigButton 
    });
    
    // Skip if elements don't exist
    if (!configPanel || !settingsButton) {
        console.error('API config panel or settings button not found');
        return;
    }
    
    // Load current config into UI
    function loadCurrentConfig() {
        if (apiKeyInput && LLM_CONFIG?.openai?.apiKey && 
            LLM_CONFIG.openai.apiKey !== 'your-openai-api-key') {
            apiKeyInput.value = LLM_CONFIG.openai.apiKey;
        }
        
        if (modelSelect && LLM_CONFIG?.openai?.model) {
            modelSelect.value = LLM_CONFIG.openai.model;
        }
        
        if (temperatureSlider && LLM_CONFIG?.openai?.temperature !== undefined) {
            temperatureSlider.value = LLM_CONFIG.openai.temperature;
            if (temperatureValue) {
                temperatureValue.textContent = LLM_CONFIG.openai.temperature;
            }
        }
    }
    
    // Ensure settings button works with direct onclick
    settingsButton.onclick = function() {
        console.log('Settings button clicked');
        configPanel.classList.remove('hidden');
        loadCurrentConfig();
    };
    
    // Close config panel
    if (closeConfigButton) {
        closeConfigButton.onclick = function() {
            console.log('Close button clicked');
            configPanel.classList.add('hidden');
        };
    }
    
    // Save configuration
    if (saveConfigButton) {
        saveConfigButton.onclick = function() {
            if (!LLM_CONFIG || !LLM_CONFIG.openai) {
                console.error('LLM_CONFIG not initialized');
                showNotification('Configuration error', 'error');
                return;
            }
            
            const newApiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
            const newModel = modelSelect ? modelSelect.value : 'gpt-3.5-turbo';
            const newTemperature = temperatureSlider ? 
                parseFloat(temperatureSlider.value) : 0.3;
            
            // Update configuration
            if (newApiKey) {
                LLM_CONFIG.openai.apiKey = newApiKey;
            }
            
            LLM_CONFIG.openai.model = newModel;
            LLM_CONFIG.openai.temperature = newTemperature;
            
            // Re-initialize OpenAI integration with new settings
            const success = typeof initializeOpenAIIntegration === 'function' ? 
                initializeOpenAIIntegration() : true;
            
            // Save to localStorage for persistence
            localStorage.setItem('openai_api_key', newApiKey);
            localStorage.setItem('openai_model', newModel);
            localStorage.setItem('openai_temperature', newTemperature);
            
            // Show notification
            if (success) {
                showNotification('API settings saved successfully', 'success');
            } else {
                showNotification('API settings saved, but API key may be invalid', 'warning');
            }
            
            // Close panel
            configPanel.classList.add('hidden');
        };
    }
    
    // Update temperature display when slider changes
    if (temperatureSlider && temperatureValue) {
        temperatureSlider.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
        });
    }
    
    // Load saved settings from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedModel = localStorage.getItem('openai_model');
    const savedTemperature = localStorage.getItem('openai_temperature');
    
    if (savedApiKey && typeof LLM_CONFIG !== 'undefined') {
        LLM_CONFIG.openai.apiKey = savedApiKey;
    }
    
    if (savedModel && typeof LLM_CONFIG !== 'undefined') {
        LLM_CONFIG.openai.model = savedModel;
    }
    
    if (savedTemperature && typeof LLM_CONFIG !== 'undefined') {
        LLM_CONFIG.openai.temperature = parseFloat(savedTemperature);
    }
    
    // Re-initialize with saved settings
    if (typeof initializeOpenAIIntegration === 'function' && typeof LLM_CONFIG !== 'undefined') {
        initializeOpenAIIntegration();
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} [type='info'] - Notification type (info, success, error, warning)
 */
function showNotification(message, type = 'info') {
    if (!notification) {
        notification = document.getElementById('notification');
        if (!notification) return;
    }
    
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Clear previous timeout if exists
    if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
    }
    
    // Auto-hide after duration
    const duration = UI_CONFIG?.notification?.duration || 5000;
    notification.timeoutId = setTimeout(() => {
        notification.className = notification.className.replace('show', '');
    }, duration);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);