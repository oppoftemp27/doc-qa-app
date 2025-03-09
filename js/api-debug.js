/**
 * API Debug Helper
 * Provides tools to debug and verify OpenAI API integration
 */

// Create a debug div to show API interactions
function createApiDebugPanel() {
    // Check if it already exists
    if (document.getElementById('api-debug-panel')) {
        return document.getElementById('api-debug-panel');
    }
    
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'api-debug-panel';
    debugPanel.style.position = 'fixed';
    debugPanel.style.bottom = '10px';
    debugPanel.style.right = '10px';
    debugPanel.style.width = '350px';
    debugPanel.style.padding = '10px';
    debugPanel.style.background = 'rgba(0,0,0,0.8)';
    debugPanel.style.color = 'white';
    debugPanel.style.zIndex = '9999';
    debugPanel.style.maxHeight = '350px';
    debugPanel.style.overflowY = 'auto';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.fontFamily = 'monospace';
    debugPanel.style.fontSize = '12px';
    
    // Add header
    const header = document.createElement('div');
    header.textContent = 'API Debug Panel';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '10px';
    header.style.borderBottom = '1px solid #666';
    header.style.paddingBottom = '5px';
    debugPanel.appendChild(header);
    
    // Add status display
    const statusDiv = document.createElement('div');
    statusDiv.id = 'api-debug-status';
    statusDiv.innerHTML = `
        <div><strong>API Key:</strong> <span id="api-debug-key-status">Checking...</span></div>
        <div><strong>API Mode:</strong> <span id="api-debug-mode">Checking...</span></div>
        <div><strong>Model:</strong> <span id="api-debug-model">Unknown</span></div>
        <div><strong>Calls:</strong> <span id="api-debug-calls">0</span></div>
    `;
    debugPanel.appendChild(statusDiv);
    
    // Add log area
    const logArea = document.createElement('div');
    logArea.id = 'api-debug-log';
    logArea.style.marginTop = '10px';
    logArea.style.borderTop = '1px solid #666';
    logArea.style.paddingTop = '5px';
    logArea.style.maxHeight = '200px';
    logArea.style.overflowY = 'auto';
    debugPanel.appendChild(logArea);
    
    // Add controls
    const controlsDiv = document.createElement('div');
    controlsDiv.style.marginTop = '10px';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.justifyContent = 'space-between';
    
    // Clear log button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Log';
    clearBtn.style.padding = '3px 8px';
    clearBtn.style.backgroundColor = '#444';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '3px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.onclick = function() {
        document.getElementById('api-debug-log').innerHTML = '';
    };
    
    // Test API button
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test API';
    testBtn.style.padding = '3px 8px';
    testBtn.style.backgroundColor = '#007bff';
    testBtn.style.color = 'white';
    testBtn.style.border = 'none';
    testBtn.style.borderRadius = '3px';
    testBtn.style.cursor = 'pointer';
    testBtn.onclick = testApiConnection;
    
    // Hide button
    const hideBtn = document.createElement('button');
    hideBtn.textContent = 'Hide';
    hideBtn.style.padding = '3px 8px';
    hideBtn.style.backgroundColor = '#dc3545';
    hideBtn.style.color = 'white';
    hideBtn.style.border = 'none';
    hideBtn.style.borderRadius = '3px';
    hideBtn.style.cursor = 'pointer';
    hideBtn.onclick = function() {
        debugPanel.style.display = 'none';
    };
    
    controlsDiv.appendChild(clearBtn);
    controlsDiv.appendChild(testBtn);
    controlsDiv.appendChild(hideBtn);
    debugPanel.appendChild(controlsDiv);
    
    // Add to document
    document.body.appendChild(debugPanel);
    
    // Update status immediately
    updateApiDebugStatus();
    
    return debugPanel;
}

// Log message to debug panel
function logApiDebug(message, type = 'info') {
    const debugLog = document.getElementById('api-debug-log') || 
                    createApiDebugPanel().querySelector('#api-debug-log');
    
    // Create log entry
    const entry = document.createElement('div');
    entry.style.marginBottom = '5px';
    entry.style.borderLeft = '3px solid';
    entry.style.paddingLeft = '5px';
    
    // Set color based on type
    if (type === 'error') {
        entry.style.borderColor = '#dc3545';
        entry.style.color = '#ff8d8d';
    } else if (type === 'success') {
        entry.style.borderColor = '#28a745';
        entry.style.color = '#8dff8d';
    } else {
        entry.style.borderColor = '#007bff';
    }
    
    // Add timestamp
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${
        now.getMinutes().toString().padStart(2, '0')}:${
        now.getSeconds().toString().padStart(2, '0')}`;
    
    entry.innerHTML = `<span style="color: #888;">[${time}]</span> ${message}`;
    
    // Add to log
    debugLog.appendChild(entry);
    
    // Scroll to bottom
    debugLog.scrollTop = debugLog.scrollHeight;
    
    // Also log to console
    console.log(`[API Debug] ${message}`);
}

// Update API debug status
function updateApiDebugStatus() {
    // Get DOM elements
    const keyStatus = document.getElementById('api-debug-key-status');
    const modeStatus = document.getElementById('api-debug-mode');
    const modelStatus = document.getElementById('api-debug-model');
    const callsStatus = document.getElementById('api-debug-calls');
    
    if (!keyStatus || !modeStatus || !modelStatus || !callsStatus) {
        return;
    }
    
    // Check if LLM_CONFIG exists
    if (typeof LLM_CONFIG === 'undefined') {
        keyStatus.textContent = 'ERROR: LLM_CONFIG not found';
        keyStatus.style.color = '#ff8d8d';
        return;
    }
    
    // Check API key
    const apiKey = LLM_CONFIG.openai?.apiKey;
    if (!apiKey || apiKey === 'your-openai-api-key') {
        keyStatus.textContent = 'Not configured';
        keyStatus.style.color = '#ff8d8d';
    } else {
        const maskedKey = apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 4);
        keyStatus.textContent = maskedKey;
        keyStatus.style.color = '#8dff8d';
    }
    
    // Check mode
    const mockModeToggle = document.getElementById('mock-mode-toggle');
    if (mockModeToggle) {
        modeStatus.textContent = mockModeToggle.checked ? 
            'Document Analysis Mode (API disabled)' : 'OpenAI API Mode';
        
        if (mockModeToggle.checked) {
            modeStatus.style.color = '#ffc107';
        } else {
            modeStatus.style.color = '#8dff8d';
        }
    } else {
        modeStatus.textContent = 'Toggle not found';
        modeStatus.style.color = '#ff8d8d';
    }
    
    // Show model
    if (LLM_CONFIG.openai?.model) {
        modelStatus.textContent = LLM_CONFIG.openai.model;
    } else {
        modelStatus.textContent = 'Unknown';
    }
    
    // Show call count
    if (typeof apiUsageMonitor !== 'undefined' && 
        typeof apiUsageMonitor.getUsageCount === 'function') {
        callsStatus.textContent = apiUsageMonitor.getUsageCount();
    } else {
        callsStatus.textContent = 'Counter not available';
    }
}

// Test API connection
async function testApiConnection() {
    // Get API debug panel
    const debugPanel = document.getElementById('api-debug-panel') || createApiDebugPanel();
    
    // Update status first
    updateApiDebugStatus();
    
    // Check if LLM_CONFIG exists
    if (typeof LLM_CONFIG === 'undefined') {
        logApiDebug('ERROR: LLM_CONFIG not found', 'error');
        return;
    }
    
    // Check API key
    const apiKey = LLM_CONFIG.openai?.apiKey;
    if (!apiKey || apiKey === 'your-openai-api-key') {
        logApiDebug('API key not configured. Please add your API key in settings.', 'error');
        return;
    }
    
    // Log test start
    logApiDebug('Testing API connection...', 'info');
    
    try {
        // Make a simple API call
        const apiUrl = LLM_CONFIG.openai.apiUrl || 'https://api.openai.com/v1/chat/completions';
        const model = LLM_CONFIG.openai.model || 'gpt-3.5-turbo';
        
        // Start timer
        const startTime = performance.now();
        
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
                        role: 'user',
                        content: 'Hello, this is a test message. Please respond with "API connection successful"'
                    }
                ],
                max_tokens: 20
            })
        });
        
        // Calculate response time
        const responseTime = Math.round(performance.now() - startTime);
        
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
            
            logApiDebug(`API connection failed: ${errorMessage}`, 'error');
            return;
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Log success
        logApiDebug(`API connection successful! Response time: ${responseTime}ms`, 'success');
        logApiDebug(`Response content: "${content}"`, 'success');
        
        // Update counter if API usage monitor exists
        if (typeof apiUsageMonitor !== 'undefined' && 
            typeof apiUsageMonitor.recordAPICall === 'function') {
            apiUsageMonitor.recordAPICall();
            updateApiDebugStatus();
        }
        
    } catch (error) {
        logApiDebug(`API connection failed: ${error.message}`, 'error');
    }
}

// Initialize debug panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add debug toggle button to the header
    const headerControls = document.querySelector('.header-controls');
    
    if (headerControls) {
        const debugBtn = document.createElement('button');
        debugBtn.className = 'icon-button';
        debugBtn.title = 'API Debug';
        debugBtn.innerHTML = '<span style="font-size: 20px;">🐞</span>';
        debugBtn.style.marginLeft = '10px';
        
        debugBtn.onclick = function() {
            const debugPanel = document.getElementById('api-debug-panel');
            
            if (debugPanel) {
                // Toggle visibility
                if (debugPanel.style.display === 'none') {
                    debugPanel.style.display = 'block';
                    updateApiDebugStatus();
                } else {
                    debugPanel.style.display = 'none';
                }
            } else {
                // Create new panel
                createApiDebugPanel();
            }
        };
        
        headerControls.appendChild(debugBtn);
    }
    
    // Monkey patch the OpenAI API call function to log interactions
    if (typeof window.callOpenAiApi === 'function') {
        const originalCallOpenAiApi = window.callOpenAiApi;
        
        window.callOpenAiApi = async function(query, documentText) {
            logApiDebug(`API call initiated: "${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"`, 'info');
            updateApiDebugStatus();
            
            try {
                const result = await originalCallOpenAiApi(query, documentText);
                logApiDebug('API call completed successfully', 'success');
                updateApiDebugStatus();
                return result;
            } catch (error) {
                logApiDebug(`API call failed: ${error.message}`, 'error');
                updateApiDebugStatus();
                throw error;
            }
        };
    }
    
    // Add style for debug panel
    const style = document.createElement('style');
    style.textContent = `
        #api-debug-panel button:hover {
            opacity: 0.9;
        }
        #api-debug-panel button:active {
            transform: translateY(1px);
        }
        #api-debug-log {
            scrollbar-width: thin;
            scrollbar-color: #666 #333;
        }
        #api-debug-log::-webkit-scrollbar {
            width: 8px;
        }
        #api-debug-log::-webkit-scrollbar-track {
            background: #333;
        }
        #api-debug-log::-webkit-scrollbar-thumb {
            background-color: #666;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
});

// Helper function to copy API key to clipboard
function copyApiKey() {
    if (typeof LLM_CONFIG === 'undefined' || !LLM_CONFIG.openai?.apiKey || 
        LLM_CONFIG.openai.apiKey === 'your-openai-api-key') {
        logApiDebug('No API key configured to copy', 'error');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(LLM_CONFIG.openai.apiKey)
        .then(() => {
            logApiDebug('API key copied to clipboard', 'success');
        })
        .catch(err => {
            logApiDebug(`Failed to copy API key: ${err}`, 'error');
        });
}

// Make functions globally available
window.createApiDebugPanel = createApiDebugPanel;
window.logApiDebug = logApiDebug;
window.updateApiDebugStatus = updateApiDebugStatus;
window.testApiConnection = testApiConnection;
window.copyApiKey = copyApiKey;