/**
 * Debug script to check if libraries are loading properly
 */

// Create a debug div to show results
function createDebugDiv() {
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-info';
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '10px';
    debugDiv.style.right = '10px';
    debugDiv.style.padding = '10px';
    debugDiv.style.background = 'rgba(0,0,0,0.7)';
    debugDiv.style.color = 'white';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.maxHeight = '300px';
    debugDiv.style.overflowY = 'auto';
    debugDiv.style.maxWidth = '400px';
    document.body.appendChild(debugDiv);
    return debugDiv;
}

function logDebug(message) {
    console.log(message);
    const debugDiv = document.getElementById('debug-info') || createDebugDiv();
    const msgEl = document.createElement('div');
    msgEl.textContent = message;
    debugDiv.appendChild(msgEl);
}

// Check library loading on window load
window.addEventListener('load', function() {
    logDebug('Debug: Checking library loading...');
    
    // Check PDF.js
    if (typeof pdfjsLib !== 'undefined') {
        logDebug('PDF.js loaded: Version ' + (pdfjsLib.version || 'unknown'));
    } else {
        logDebug('ERROR: PDF.js not loaded!');
    }
    
    // Check Mammoth.js
    if (typeof mammoth !== 'undefined') {
        logDebug('Mammoth.js loaded!');
    } else {
        logDebug('ERROR: Mammoth.js not loaded!');
    }
    
    // Check SheetJS
    if (typeof XLSX !== 'undefined') {
        logDebug('SheetJS loaded: Version ' + (XLSX.version || 'unknown'));
    } else {
        logDebug('ERROR: SheetJS not loaded!');
    }
    
    // Hook document processing
    hookDocumentProcessor();
});

// Hook into the document processor to see what's happening
function hookDocumentProcessor() {
    if (typeof processDocument === 'function') {
        logDebug('Found processDocument function, hooking...');
        
        // Store the original function
        const originalProcessDocument = processDocument;
        
        // Replace with hooked version
        window.processDocument = function(file) {
            logDebug(`Hooking processDocument call for ${file.name} (${file.type})`);
            
            // Call original and return result
            return originalProcessDocument(file).then(result => {
                logDebug(`Received result from processDocument: ${result.substring(0, 50)}...`);
                return result;
            }).catch(error => {
                logDebug(`ERROR in processDocument: ${error.message}`);
                throw error;
            });
        };
    } else {
        logDebug('ERROR: processDocument function not found!');
    }
}