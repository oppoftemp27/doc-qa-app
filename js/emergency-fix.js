/**
 * EMERGENCY FIX - ADD THIS AS A SEPARATE FILE AND INCLUDE IT LAST
 * This completely bypasses the problematic logic and shows actual document content
 */

// Wait for page to be fully loaded
window.addEventListener('load', function() {
    console.log("⚠️ EMERGENCY FIX APPLIED ⚠️");
  
    // Store original document processing function before it gets overwritten
    const originalProcessDocument = window.processDocument;
    
    // Override the document processor
    window.processDocument = async function(file) {
      console.log("🔄 Processing document:", file.name);
      
      try {
        // Call the original function to get the text
        const extractedText = await originalProcessDocument(file);
        
        // Store the extracted text globally so it's accessible everywhere
        window.documentText = extractedText;
        window.lastProcessedDocumentText = extractedText;
        
        // Log the extracted text for debugging
        console.log("📄 Document text length:", extractedText.length);
        console.log("📄 First 100 chars:", extractedText.substring(0, 100));
        
        return extractedText;
      } catch (error) {
        console.error("❌ Error processing document:", error);
        throw error;
      }
    };
    
    // Completely replace handleAskQuestion
    window.handleAskQuestion = async function() {
      console.log("❓ Question asked - using direct document display");
      
      // Get input value
      const query = document.getElementById('query-input').value.trim();
      
      // Check query
      if (!query) {
        showNotification('Please enter a question', 'error');
        return;
      }
      
      // Get document text (try all possible sources)
      const docText = window.documentText || window.lastProcessedDocumentText || "";
      console.log("📄 Using document text of length:", docText.length);
      
      if (!docText) {
        showNotification('No document content available. Please upload a document first.', 'error');
        return;
      }
      
      // Show loading state
      const responseContainer = document.getElementById('response-container');
      const responseContent = document.getElementById('response-content');
      
      if (responseContainer) {
        responseContainer.classList.remove('hidden');
      }
      
      if (responseContent) {
        responseContent.innerHTML = '<div class="loading">Processing your question...</div>';
      }
      
      // Set processing state
      window.isProcessing = true;
      updateUIState();
      
      // Generate response directly from document content
      try {
        const response = generateDocumentResponse(query, docText);
        
        // Show response
        if (responseContent) {
          responseContent.innerHTML = `<div class="response-text">${response}</div>`;
        }
        
        // Update recommendations
        if (typeof generateRecommendationChips === 'function') {
          generateRecommendationChips(response);
        }
      } catch (error) {
        console.error("❌ Error generating response:", error);
        
        if (responseContent) {
          responseContent.innerHTML = `<div class="error-text">Error: ${error.message}</div>`;
        }
        
        showNotification(`Error: ${error.message}`, 'error');
      }
      
      // Reset processing state
      window.isProcessing = false;
      updateUIState();
    };
    
    // Replace getLLMResponse to bypass mock responses
    window.getLLMResponse = async function(query, documentText) {
      console.log("🤖 getLLMResponse intercepted");
      return generateDocumentResponse(query, documentText);
    };
    
    // Generate a response based on document content
    function generateDocumentResponse(query, documentText) {
      console.log("🔍 Generating response for query:", query);
      
      // Get statistics about the document
      const lines = documentText.split('\n').filter(line => line.trim());
      const words = documentText.split(/\s+/).filter(word => word.trim());
      const chars = documentText.length;
      
      const queryLower = query.toLowerCase();
      
      // Format based on query type
      if (queryLower.includes('summary') || queryLower.includes('about')) {
        return generateSummaryResponse(documentText);
      } else if (queryLower.includes('find') || queryLower.includes('search')) {
        return generateSearchResponse(query, documentText);
      } else {
        return generateDefaultResponse(documentText);
      }
    }
    
    // Generate a summary of the document
    function generateSummaryResponse(documentText) {
      const lines = documentText.split('\n').filter(line => line.trim());
      const words = documentText.split(/\s+/).filter(word => word.trim());
      
      // Get title or first line
      const title = lines[0] || "Untitled Document";
      
      // Get significant lines (might be headings or important content)
      const significantLines = lines
        .filter(line => 
          line === line.toUpperCase() || // ALL CAPS lines
          (line.length < 50 && line.length > 10) || // Short lines (potential headings)
          line.endsWith(':') || // Lines ending with colon
          /^[A-Z0-9]/.test(line) // Lines starting with capital letter or number
        )
        .slice(0, 5);
      
      // Create a preview with the first part of the document
      const preview = documentText.substring(0, 300) + 
                    (documentText.length > 300 ? '...' : '');
      
      return `## Document Summary
  
  **Document Title/First Line**: ${title}
  
  **Document Statistics**:
  - Contains ${lines.length} lines of text
  - Contains approximately ${words.length} words
  - Total length: ${documentText.length} characters
  
  **Key Content**:
  ${significantLines.map(line => `- ${line}`).join('\n')}
  
  **Document Preview**:
  \`\`\`
  ${preview}
  \`\`\`
  
  This is the actual content from your document, not a mock response.`;
    }
    
    // Search for specific content in the document
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
    
    // Default response showing document content
    function generateDefaultResponse(documentText) {
      const lines = documentText.split('\n').filter(line => line.trim());
      const words = documentText.split(/\s+/).filter(word => word.trim());
      
      // Determine a reasonable preview length based on document size
      const previewLength = Math.min(500, Math.max(documentText.length, 100));
      const preview = documentText.substring(0, previewLength) + 
                    (documentText.length > previewLength ? '...' : '');
      
      return `## Document Content Analysis
  
  Your document contains ${lines.length} lines and approximately ${words.length} words.
  
  **Document Preview**:
  \`\`\`
  ${preview}
  \`\`\`
  
  This is showing the actual content of your document. To see specific information, try asking more specific questions like:
  - "What is this document about?"
  - "Find mentions of [specific term]"
  - "Give me a summary of this document"`;
    }
    
    // Make sure the settings button works
    setupSettingsButton();
    
    function setupSettingsButton() {
      const settingsBtn = document.getElementById('api-settings-button');
      const configPanel = document.getElementById('api-config-panel');
      
      if (settingsBtn && configPanel) {
        // Remove any existing click handlers
        settingsBtn.onclick = null;
        
        // Add a direct click handler
        settingsBtn.onclick = function() {
          console.log("⚙️ Settings button clicked");
          configPanel.classList.remove('hidden');
        };
        
        // Handle close button
        const closeBtn = document.getElementById('close-api-config');
        if (closeBtn) {
          closeBtn.onclick = function() {
            configPanel.classList.add('hidden');
          };
        }
        
        console.log("⚙️ Settings button handler installed");
      } else {
        console.error("❌ Could not find settings button or config panel");
      }
    }
    
    // Make sure notification works
    if (typeof showNotification !== 'function') {
      window.showNotification = function(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
          notification.className = notification.className.replace('show', '');
        }, 5000);
      };
    }
    
    console.log("✅ EMERGENCY FIX COMPLETE ✅");
  });