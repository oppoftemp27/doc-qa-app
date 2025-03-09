/**
 * Integration Fixes for Document Q&A Application
 * This file contains patches and fixes for integrating with external services
 */

/**
 * Initialize OpenAI Integration
 * Sets up necessary components for OpenAI API integration
 */
function initializeOpenAIIntegration() {
    console.log("Initializing OpenAI integration");
    
    // Check if LLM_CONFIG exists
    if (typeof LLM_CONFIG === 'undefined') {
        console.error('LLM_CONFIG is not defined. API integration will not work.');
        return false;
    }
    
    // Check if API key is configured
    const apiKey = LLM_CONFIG.openai?.apiKey;
    const mockModeToggle = document.getElementById('mock-mode-toggle');
    
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey && savedApiKey !== 'your-openai-api-key') {
        console.log('Using API key from localStorage');
        LLM_CONFIG.openai.apiKey = savedApiKey;
    }
    
    if (!apiKey || apiKey === 'your-openai-api-key') {
        console.warn('OpenAI API key not configured. Document Analysis Mode will be used by default.');
        
        // Force enable mock mode if no API key is set
        if (LLM_CONFIG) {
            LLM_CONFIG.openai.mockModeEnabled = true;
        }
        
        // Ensure mock mode toggle is checked and disabled
        if (mockModeToggle) {
            mockModeToggle.checked = true;
            
            // Update the toggle tooltip
            const tooltipText = mockModeToggle.closest('label')?.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.textContent = 'API key needed to use OpenAI API. Configure it in settings.';
            }
            
            // Create a label indicating API configuration is needed
            const configLabel = document.createElement('span');
            configLabel.className = 'api-config-needed';
            configLabel.textContent = '(API key needed)';
            configLabel.style.fontSize = '0.8em';
            configLabel.style.color = '#ff6b6b';
            configLabel.style.marginLeft = '5px';
            
            // Add label after the toggle's parent label
            const toggleLabel = mockModeToggle.closest('label');
            if (toggleLabel && !toggleLabel.querySelector('.api-config-needed')) {
                toggleLabel.appendChild(configLabel);
            }
        }
        
        return false;
    }
    
    // API key is configured, setup is successful
    console.log('OpenAI integration initialized successfully');
    
    // If mock mode was forced, but we now have a valid API key, allow using the API
    if (mockModeToggle) {
        // Remove any "API key needed" label
        const apiConfigNeeded = document.querySelector('.api-config-needed');
        if (apiConfigNeeded) {
            apiConfigNeeded.remove();
        }
        
        // Update the toggle tooltip
        const tooltipText = mockModeToggle.closest('label')?.querySelector('.tooltip-text');
        if (tooltipText) {
            tooltipText.textContent = 'When checked, shows document content analysis. When unchecked, uses OpenAI API.';
        }
    }
    
    // Show notification about API availability
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = `OpenAI API is configured and ready to use (${LLM_CONFIG.openai.model})`;
        notification.className = 'notification show success';
        setTimeout(() => {
            notification.className = notification.className.replace('show', '');
        }, 3000);
    }
    
    return true;
}

/**
 * Monitor API Usage
 * Tracks usage of the OpenAI API to prevent exceeding quotas
 */
function monitorAPIUsage() {
    // Initialize usage counter in sessionStorage if not exists
    if (!sessionStorage.getItem('openai_api_calls')) {
        sessionStorage.setItem('openai_api_calls', '0');
    }
    
    // Return functions to track and check usage
    return {
        /**
         * Record an API call
         */
        recordAPICall: function() {
            const currentCalls = parseInt(sessionStorage.getItem('openai_api_calls') || '0');
            sessionStorage.setItem('openai_api_calls', (currentCalls + 1).toString());
            console.log(`OpenAI API call recorded (total: ${currentCalls + 1})`);
        },
        
        /**
         * Check if usage limit is reached
         * @param {number} limit - The maximum number of calls to allow
         * @returns {boolean} - Whether the limit has been reached
         */
        isLimitReached: function(limit = 50) {
            const currentCalls = parseInt(sessionStorage.getItem('openai_api_calls') || '0');
            const limitReached = currentCalls >= limit;
            
            if (limitReached) {
                console.warn(`OpenAI API call limit reached (${currentCalls}/${limit})`);
                
                // Show notification about limit
                const notification = document.getElementById('notification');
                if (notification) {
                    notification.textContent = `API call limit reached (${currentCalls}/${limit}). Using document analysis mode.`;
                    notification.className = 'notification show warning';
                    setTimeout(() => {
                        notification.className = notification.className.replace('show', '');
                    }, 5000);
                }
                
                // Force enable mock mode
                const mockModeToggle = document.getElementById('mock-mode-toggle');
                if (mockModeToggle) {
                    mockModeToggle.checked = true;
                }
            }
            
            return limitReached;
        },
        
        /**
         * Get the current usage count
         * @returns {number} - The current number of API calls
         */
        getUsageCount: function() {
            return parseInt(sessionStorage.getItem('openai_api_calls') || '0');
        },
        
        /**
         * Reset the usage counter
         */
        resetUsage: function() {
            sessionStorage.setItem('openai_api_calls', '0');
            console.log('OpenAI API usage counter reset');
        }
    };
}

// Export API usage monitor as a global object
const apiUsageMonitor = monitorAPIUsage();
window.apiUsageMonitor = apiUsageMonitor;

/**
 * Set up token count estimation
 * Provides rough estimation of token usage for OpenAI API
 * @param {string} text - Text to estimate tokens for
 * @returns {number} - Estimated token count
 */
function estimateTokenCount(text) {
    if (!text) return 0;
    
    // Very rough estimation: ~4 characters per token for English text
    // This is a simple approximation and not accurate for all cases
    const charCount = text.length;
    return Math.ceil(charCount / 4);
}

/**
 * Check if text exceeds token limit
 * @param {string} text - Text to check
 * @param {number} limit - Token limit to check against
 * @returns {boolean} - Whether the text exceeds the limit
 */
function exceedsTokenLimit(text, limit = 3000) {
    const estimatedTokens = estimateTokenCount(text);
    return estimatedTokens > limit;
}