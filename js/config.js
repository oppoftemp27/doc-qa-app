/**
 * Configuration Module for Document Q&A Application
 * Contains centralized configuration settings for the application
 */

/**
 * LLM configuration settings
 */
const LLM_CONFIG = {
    // OpenAI API settings
    openai: {
        apiKey: 'your-openai-api-key', // Replace with your actual API key
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo', // Options: 'gpt-3.5-turbo', 'gpt-4'
        temperature: 0.3,
        maxTokens: 800,
        mockModeEnabled: true // Will be false when API key is configured
    },

    // Document processing settings
    document: {
        maxFileSize: 20 * 1024 * 1024, // 20MB in bytes
        supportedFileTypes: ['.pdf', '.docx', '.doc', '.txt'],
        maxCharacterLimit: 12000 // Approximate limit for context window
    },
    
    // API usage limits
    apiUsage: {
        maxCallsPerSession: 50, // Maximum API calls per session
        warningThreshold: 45, // Show warning when this many calls are reached
    }
};

/**
 * UI configuration settings
 */
const UI_CONFIG = {
    notification: {
        duration: 5000, // Duration to display notifications (ms)
        errorClass: 'error',
        successClass: 'success',
        infoClass: 'info'
    },
    
    // Default recommendations when no document is loaded
    defaultRecommendations: [
        'What is this document about?',
        'Can you summarize the main points?',
        'What are the key findings?',
        'Are there any recommendations?'
    ]
};

/**
 * Application version information
 */
const APP_VERSION = {
    version: '1.0.1',
    buildDate: '2025-03-09',
    environment: 'development' // Options: 'development', 'staging', 'production'
};

// Load saved settings from localStorage on startup
document.addEventListener('DOMContentLoaded', function() {
    // Load API key
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey && savedApiKey !== 'your-openai-api-key') {
        LLM_CONFIG.openai.apiKey = savedApiKey;
        // If valid API key is found, we could use it as default
        LLM_CONFIG.openai.mockModeEnabled = false;
    }
    
    // Load model preference
    const savedModel = localStorage.getItem('openai_model');
    if (savedModel) {
        LLM_CONFIG.openai.model = savedModel;
    }
    
    // Load temperature setting
    const savedTemperature = localStorage.getItem('openai_temperature');
    if (savedTemperature) {
        LLM_CONFIG.openai.temperature = parseFloat(savedTemperature);
    }
    
    console.log('Configuration loaded from localStorage');
});