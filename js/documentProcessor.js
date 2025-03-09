/**
 * Document Processor Module
 * Enhanced version with robust PDF text extraction
 */

// URL for PDF.js CDN
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// Flag to track if PDF.js is loaded
let pdfJsLoaded = false;

/**
 * Process uploaded document
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - Promise resolving to extracted text
 */
async function processDocument(file) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        console.log("Processing file:", file.name, "Type:", file.type);

        // Check file type
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        // Handle PDF files with PDF.js
        if (fileExt === 'pdf') {
            // Load PDF.js if needed
            if (!pdfJsLoaded) {
                await loadPdfJs();
            }
            
            // Process PDF with PDF.js
            const text = await processPdfWithPdfJs(file);
            saveDocumentText(text);
            return text;
        }
        
        // For DOCX files
        else if (fileExt === 'docx' || fileExt === 'doc') {
            return processDocFile(file);
        }
        
        // For text files
        else if (fileExt === 'txt') {
            const text = await readTextFile(file);
            saveDocumentText(text);
            return text;
        }
        
        // Unsupported file type
        else {
            throw new Error(`Unsupported file type: .${fileExt}. Please upload PDF, DOCX/DOC, or TXT files.`);
        }
    }
    catch (error) {
        console.error('Error in processDocument:', error);
        throw error;
    }
}

/**
 * Save document text to global variables
 * @param {string} text - Document text
 */
function saveDocumentText(text) {
    window.documentText = text;
    window.lastProcessedDocumentText = text;
}

/**
 * Load PDF.js library
 * @returns {Promise<void>}
 */
async function loadPdfJs() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.pdfjsLib) {
            pdfJsLoaded = true;
            resolve();
            return;
        }
        
        // Create script element
        const script = document.createElement('script');
        script.src = PDFJS_CDN;
        script.onload = () => {
            // Set worker source
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
            pdfJsLoaded = true;
            console.log("PDF.js loaded successfully");
            resolve();
        };
        script.onerror = () => {
            console.error("Failed to load PDF.js");
            reject(new Error("Failed to load PDF processing library"));
        };
        
        // Add to document
        document.head.appendChild(script);
    });
}

/**
 * Process PDF file using PDF.js
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function processPdfWithPdfJs(file) {
    try {
        // Read file as array buffer
        const arrayBuffer = await readFileAsArrayBuffer(file);
        
        // Load document with PDF.js
        const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
        console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
        
        // Start with document title
        let extractedText = `# ${file.name}\n\n`;
        extractedText += `PDF Document - ${pdf.numPages} pages\n\n`;
        
        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
            try {
                // Status update for large documents
                if (i === 1 || i % 10 === 0 || i === pdf.numPages) {
                    console.log(`Processing page ${i} of ${pdf.numPages}`);
                }
                
                // Get page
                const page = await pdf.getPage(i);
                
                // Extract text content
                const textContent = await page.getTextContent();
                
                // Process text items
                let pageText = '';
                let lastY = null;
                
                for (const item of textContent.items) {
                    if (item.str.trim().length === 0) continue;
                    
                    // Add newlines when Y position changes significantly (new paragraph)
                    if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
                        pageText += '\n';
                    }
                    
                    // Add space or newline between items
                    if (pageText.length > 0 && !pageText.endsWith('\n')) {
                        pageText += ' ';
                    }
                    
                    // Add text
                    pageText += item.str;
                    
                    // Update last Y position
                    lastY = item.transform[5];
                }
                
                // Add page text to result
                if (pageText.trim().length > 0) {
                    extractedText += `## Page ${i}\n\n${pageText.trim()}\n\n`;
                }
            }
            catch (pageError) {
                console.error(`Error processing page ${i}:`, pageError);
                extractedText += `## Page ${i}\n\nError extracting text from this page.\n\n`;
            }
        }
        
        // Check if we got meaningful content
        if (extractedText.split('\n').length <= 3) {
            // Try alternative approach
            return await processPdfWithFallback(file, arrayBuffer);
        }
        
        return extractedText;
    }
    catch (error) {
        console.error("Error processing PDF with PDF.js:", error);
        // Try fallback method
        return processPdfWithFallback(file);
    }
}

/**
 * Process PDF with fallback method when PDF.js fails
 * @param {File} file - PDF file
 * @param {ArrayBuffer} [arrayBuffer] - Optional buffer if already loaded
 * @returns {Promise<string>} - Extracted text
 */
async function processPdfWithFallback(file, arrayBuffer = null) {
    try {
        // Read file content if not provided
        const content = arrayBuffer ? 
            new TextDecoder().decode(arrayBuffer) : 
            await readTextFile(file);
        
        // Format output
        let extractedText = `# ${file.name}\n\n`;
        extractedText += "PDF Document (processed with alternative method)\n\n";
        
        // Extract text using pattern matching - multiple approaches
        
        // Approach 1: Find text between BT and ET markers (Basic Text objects)
        let textFound = false;
        const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
        let btEtMatches = [];
        let match;
        
        while ((match = btEtRegex.exec(content)) !== null) {
            // Extract text inside parentheses within each BT/ET block
            const textBlock = match[1];
            const textRegex = /\(\s*([^\)]+)\s*\)\s*Tj/g;
            let textMatch;
            
            while ((textMatch = textRegex.exec(textBlock)) !== null) {
                if (textMatch[1] && textMatch[1].trim().length > 0) {
                    btEtMatches.push(textMatch[1].trim());
                    textFound = true;
                }
            }
        }
        
        if (textFound) {
            extractedText += btEtMatches.join(' ').replace(/\s+/g, ' ').trim();
            return extractedText;
        }
        
        // Approach 2: Find readable ASCII sequences
        const asciiRegex = /[\x20-\x7E]{5,}/g;
        const asciiMatches = [];
        
        while ((match = asciiRegex.exec(content)) !== null) {
            const text = match[0].trim();
            // Filter out common PDF syntax
            if (text.length > 5 && 
                !/^[0-9\s]+$/.test(text) && 
                !text.includes('obj') &&
                !text.includes('endobj') &&
                !text.includes('stream') &&
                !text.includes('endstream') &&
                !text.includes('xref') &&
                !text.includes('startxref') &&
                !text.includes('/Type') &&
                !text.includes('/Length') &&
                !text.includes('/Filter')) {
                    
                asciiMatches.push(text);
            }
        }
        
        if (asciiMatches.length > 0) {
            extractedText += asciiMatches.join('\n');
            return extractedText;
        }
        
        // If no text found with any method
        return `# ${file.name}\n\nThis PDF document appears to contain primarily non-text content such as images or scanned pages, or uses an encoding that cannot be directly extracted in the browser.\n\nFor best results, please use a PDF with searchable text content.`;
    }
    catch (error) {
        console.error("Error in PDF fallback processing:", error);
        return `# ${file.name}\n\nUnable to extract text from this PDF. The file may be damaged, encrypted, or using an unsupported format.`;
    }
}

/**
 * Process DOC/DOCX file
 * @param {File} file - DOC/DOCX file
 * @returns {Promise<string>} - Extracted text
 */
async function processDocFile(file) {
    try {
        // Read as text and look for content
        const content = await readTextFile(file);
        
        // Parse DOCX content (simplified approach)
        let extractedText = `# ${file.name}\n\n`;
        
        // Look for text content in DOCX XML
        const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
        const textParts = [];
        let match;
        
        while ((match = textRegex.exec(content)) !== null) {
            if (match[1] && match[1].trim()) {
                textParts.push(match[1]);
            }
        }
        
        if (textParts.length > 0) {
            // Format text with reasonable spacing
            let formattedText = '';
            let lastPart = '';
            
            for (const part of textParts) {
                // Add spacing between parts as needed
                if (lastPart.endsWith('.') || lastPart.endsWith('?') || lastPart.endsWith('!')) {
                    formattedText += part + ' ';
                } else if (lastPart.endsWith('-')) {
                    formattedText += part;
                } else {
                    formattedText += ' ' + part;
                }
                
                lastPart = part;
            }
            
            extractedText += formattedText.trim();
            saveDocumentText(extractedText);
            return extractedText;
        }
        
        // Fallback to general text extraction if XML parsing fails
        const lines = content.split('\n')
            .map(line => line.trim())
            .filter(line => {
                return line.length > 5 && 
                       /[a-zA-Z]{3,}/.test(line) && 
                       !line.startsWith('<') && 
                       !line.includes('<?xml') && 
                       !line.includes('xmlns:');
            });
        
        if (lines.length > 0) {
            extractedText += lines.join('\n');
            saveDocumentText(extractedText);
            return extractedText;
        }
        
        // If no text found
        const fallbackText = `# ${file.name}\n\nThis document appears to contain primarily non-text content or uses an encoding that cannot be directly extracted in the browser.`;
        saveDocumentText(fallbackText);
        return fallbackText;
    }
    catch (error) {
        console.error("Error processing DOC file:", error);
        const errorText = `# ${file.name}\n\nError extracting text: ${error.message}`;
        saveDocumentText(errorText);
        return errorText;
    }
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} - File content as text
 */
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file as text'));
        reader.readAsText(file);
    });
}

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} - File content as array buffer
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file as array buffer'));
        reader.readAsArrayBuffer(file);
    });
}