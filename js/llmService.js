/**
 * Improved LLM Service Module
 * Handles API interactions with OpenAI
 */

/**
 * Get a response based on the query and document content
 * @param {string} query - The user's question
 * @param {string} documentText - The document text content
 * @returns {Promise<string>} - Promise resolving to the response
 */
async function getLLMResponse(query, documentText) {
    console.log("getLLMResponse called with document length:", documentText ? documentText.length : 0);
    
    // Check if document text is available
    if (!documentText || documentText.trim() === '') {
        return "Error: No document content available. Please upload a document first.";
    }
    
    // Check for OpenAI API configuration
    const useApi = document.getElementById('mock-mode-toggle') ? 
                  !document.getElementById('mock-mode-toggle').checked : false;
    
    if (useApi && typeof LLM_CONFIG !== 'undefined' && 
        LLM_CONFIG.openai && 
        LLM_CONFIG.openai.apiKey && 
        LLM_CONFIG.openai.apiKey !== 'your-openai-api-key') {
        
        try {
            // Record API call if usage monitor exists
            if (typeof apiUsageMonitor !== 'undefined' && 
                typeof apiUsageMonitor.recordAPICall === 'function') {
                apiUsageMonitor.recordAPICall();
            }
            
            // Update UI to show API usage
            updateApiUsageUI();
            
            // Call the OpenAI API
            const apiResponse = await callOpenAiApi(query, documentText);
            console.log("Received API response");
            
            return apiResponse;
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            showNotification(`Error calling OpenAI API: ${error.message}. Check your API key and try again.`, 'error');
            return `Error calling OpenAI API: ${error.message}. Using document content instead.\n\n${getDocumentContent(documentText)}`;
        }
    } else {
        console.log("Using document content display mode");
        // If API mode is disabled or API not configured, return document content
        return getDocumentContent(documentText);
    }
}

/**
 * Call OpenAI API for a response
 * @param {string} query - The user's question
 * @param {string} documentText - The document text
 * @returns {Promise<string>} - API response
 */
async function callOpenAiApi(query, documentText) {
    // Get configuration
    const apiUrl = LLM_CONFIG.openai.apiUrl || 'https://api.openai.com/v1/chat/completions';
    const apiKey = LLM_CONFIG.openai.apiKey;
    const model = LLM_CONFIG.openai.model || 'gpt-3.5-turbo';
    const temperature = LLM_CONFIG.openai.temperature || 0.3;
    const maxTokens = LLM_CONFIG.openai.maxTokens || 800;
    
    console.log(`Calling OpenAI API with model: ${model}, temperature: ${temperature}`);
    
    // Truncate document to avoid token limits (approx 4 chars per token)
    const maxChars = 8000; // Safe limit for most models
    const truncatedText = documentText.length > maxChars ? 
                        documentText.substring(0, maxChars) + "... [truncated for token limit]" : 
                        documentText;
    
    // Create prompt
    const prompt = `
Document content:
${truncatedText}

Question: ${query}

Please answer based only on the document content above. If the answer cannot be found in the document, say so clearly.`;
    
    // Show loading notification
    showNotification('Calling OpenAI API...', 'info');
    
    // Call API
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that answers questions about documents with precision and clarity.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: temperature,
            max_tokens: maxTokens
        })
    });
    
    // Check for HTTP errors
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
            // Try to parse error JSON
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error?.message || `API responded with status ${response.status}`;
        } catch (e) {
            // If parsing fails, use status and text
            errorMessage = `API responded with status ${response.status}: ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Show success notification
    showNotification('API response received successfully', 'success');
    
    return data.choices[0].message.content;
}

/**
 * Get formatted document content
 * @param {string} documentText - The document text
 * @returns {string} - Formatted document content
 */
function getDocumentContent(documentText) {
    // Get document size information
    const lines = documentText.split('\n');
    const wordCount = documentText.split(/\s+/).length;
    
    // Create a preview with the first part of the document
    const previewLength = Math.min(800, documentText.length);
    const preview = documentText.substring(0, previewLength) + 
                  (documentText.length > previewLength ? '...' : '');
    
    return `## Document Content Analysis

This document contains ${lines.length} lines and approximately ${wordCount} words.

### Document Preview:

\`\`\`
${preview}
\`\`\`

To use the OpenAI API to analyze this document, uncheck "Document Analysis Mode" below the question input, and ensure your API key is configured in settings.`;
}

/**
 * Update API usage UI
 */
function updateApiUsageUI() {
    const apiCallCount = document.getElementById('api-call-count');
    
    if (apiCallCount && typeof apiUsageMonitor !== 'undefined' && 
        typeof apiUsageMonitor.getUsageCount === 'function') {
        
        const count = apiUsageMonitor.getUsageCount();
        apiCallCount.textContent = `API Calls: ${count}`;
    }
}

/**
 * Setup API usage UI
 * This should be called during initialization
 */
function setupAPIUsageUI() {
    // Get DOM elements
    const apiCallCount = document.getElementById('api-call-count');
    const resetApiUsage = document.getElementById('reset-api-usage');
    
    // Exit if elements don't exist
    if (!apiCallCount || !resetApiUsage) {
        console.warn('API usage UI elements not found');
        return;
    }
    
    // Update initial count
    if (typeof apiUsageMonitor !== 'undefined' && 
        typeof apiUsageMonitor.getUsageCount === 'function') {
        const count = apiUsageMonitor.getUsageCount();
        apiCallCount.textContent = `API Calls: ${count}`;
    }
    
    // Setup reset button
    resetApiUsage.addEventListener('click', function() {
        if (typeof apiUsageMonitor !== 'undefined' && 
            typeof apiUsageMonitor.resetUsage === 'function') {
            apiUsageMonitor.resetUsage();
            apiCallCount.textContent = 'API Calls: 0';
            showNotification('API usage counter reset', 'info');
        }
    });
    
    console.log('API usage UI initialized');
}

// Expose functions globally
window.getLLMResponse = getLLMResponse;
window.setupAPIUsageUI = setupAPIUsageUI;