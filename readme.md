# Document Q&A Application

A full-stack web application that allows users to upload documents (PDF, Word, Excel), extract text with OCR, and interact with the document content through natural language questions using an integrated LLM.

## Features

- **Document Upload**: Support for PDF, Word, and Excel files up to 20MB
- **Intelligent Text Extraction**: OCR processing for image-based PDFs and text extraction from various formats
- **Interactive Q&A**: Ask questions about your document content in natural language
- **Full Document Preview**: View the entire document content in a modal window
- **Smart Recommendations**: Dynamic question suggestions based on document content
- **Mock Mode**: Test the application without making actual API calls
- **Responsive Design**: Optimized for desktop and mobile devices
- **Performance Monitoring**: Built-in metrics for response times
- **Comprehensive Testing**: Automated test suite for functionality and performance

## Architecture

The application uses a client-side architecture with minimal dependencies for easy deployment and maintenance:

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│  User Interface   ├─────►│  Document         ├─────►│  LLM Service      │
│  (HTML/CSS/JS)    │      │  Processor (OCR)  │      │  (API/Mock)       │
│                   │      │                   │      │                   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
        ▲                         ▲                           ▲
        │                         │                           │
        │                         │                           │
        │                         │                           │
        └─────────────────────────┼───────────────────────────┘
                                  │
                                  │
                            ┌─────▼─────┐
                            │           │
                            │  Storage  │
                            │ (Session) │
                            │           │
                            └───────────┘
```

### Component Details

1. **User Interface Layer**
   - Handles all user interactions and document rendering
   - Built with semantic HTML5, modern CSS, and vanilla JavaScript
   - Manages application state and UI transitions
   - Provides document preview functionality with full-content modal

2. **Document Processing Layer**
   - Processes uploaded documents and extracts readable text
   - Supports various file formats through specialized libraries
   - Optimizes extracted text for LLM consumption
   - Formats document content for optimal display in previews

3. **LLM Service Layer**
   - Integrates with configurable LLM endpoints
   - Processes document content and user questions
   - Provides intelligent responses based on document context
   - Includes mock functionality for development/testing

4. **Storage Layer**
   - Session-based storage for document data
   - Caches processing results to improve performance
   - No server-side storage required

## File Structure

Based on the actual project organization:

```
doc-qa-app/
├── index.html                   # Main application HTML
├── setup.sh                     # Setup script for dependencies and directories
├── run.sh                       # Script to run the application
├── readme.md                    # Project documentation
├── css/
│   └── styles.css               # Main stylesheet
├── js/
│   ├── app.js                   # Main application controller
│   ├── app-integration-fixes.js # Integration fixes and patches
│   ├── debug.js                 # Debugging utilities
│   ├── documentProcessor.js     # Document processing module
│   ├── llmService.js            # LLM integration module
│   ├── preview.js               # Document preview functionality 
│   └── mockData.js              # Mock responses for testing
├── docs/
│   └── user-guide.md            # User documentation
└── test/
    └── selenium/                # Selenium test scripts
        ├── get-pip.py           # Python pip installer
        ├── requirements.txt     # Python dependencies
        ├── test_suite.py        # Test suite implementation
        ├── test_suite.log       # Test execution logs
        ├── test_files/          # Test document files
        │   ├── sample.pdf       # Sample PDF for testing
        │   ├── text_as_pdf.pdf  # Text file saved as PDF
        │   ├── sample_text.txt  # Sample text file
        │   └── invalid.txt      # Invalid file for testing
        └── test/                # Test output directory
            └── results/         # Test result storage
                ├── charts/      # Performance charts
                │   ├── performance_20250307_115159.png
                │   └── performance_20250307_211124.png
                ├── screenshots/ # Failure screenshots
                │   └── Ask_question_fail_20250307_211124.png
                └── test_report_20250307_211124.pdf # Generated test report
```

## Components

### Automation Scripts

- **setup.sh**: Automated setup script that:
  - Creates the necessary directory structure
  - Checks for and installs required dependencies (http-server)
  - Sets up Python testing environment
  - Creates sample test files
  - Provides clear instructions for next steps
  
- **run.sh**: Application launcher script that:
  - Verifies http-server is installed
  - Starts the application on port 8000
  - Provides clear user instructions
  
These scripts streamline the setup and execution process, making it easier for users to get started without manual configuration steps. They include proper error handling and informative colored output for better user experience.

### Frontend Components

#### HTML Structure
- **index.html**: Main application interface containing:
  - Header Section: Application title and controls
  - Upload Section: File input controls and document preview
  - Q&A Section: Question input, submit controls, and response display
  - Recommendation Section: Dynamic question suggestions
  - Notification Component: User feedback and status messages
  - Preview Modal: Full document content viewer

#### CSS Organization
- **styles.css**: Complete styling for the application, including:
  - Base styles for typography and layout
  - Component-specific styling
  - Modal and preview component styling
  - Responsive design rules
  - UI animations and transitions

#### JavaScript Modules
- **app.js**: Central controller that initializes and coordinates all modules
- **app-integration-fixes.js**: Patches and fixes for third-party integrations
- **debug.js**: Utilities for debugging and development purposes
- **documentProcessor.js**: Handles document uploads and text extraction
  - PDF processing
  - Word and Excel document processing
  - Text optimization for LLM input
- **llmService.js**: Manages LLM API integration
  - API request formatting and error handling
  - Response parsing and rendering
  - Mock mode implementation
- **preview.js**: Handles document preview functionality
  - Compact document preview in main interface
  - Full document preview in modal window
  - Content formatting based on document type
  - Navigation options for previewing
- **mockData.js**: Contains sample responses for development and testing

### Testing Components

- **test_suite.py**: Automated Selenium test suite with the following test types:
  - **Positive Tests**: Verify expected functionality works correctly
  - **Negative Tests**: Test error handling and edge cases
  - **Performance Tests**: Measure and validate response times
- **Test Files**: Sample documents for testing different scenarios
  - PDF documents
  - Text files
  - Invalid file types
- **Test Reporting**: Automated generation of visual test reports with screenshots and performance charts

## Installation Guide

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for local development server)
- Python 3.7+ with pip (for running tests)
- Chrome WebDriver (for Selenium tests)

### Setup Instructions

#### Automated Setup (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doc-qa-app.git
cd doc-qa-app
```

2. Make the setup script executable and run it:
```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Create all necessary directories
- Install http-server globally
- Install Python dependencies for testing
- Create sample test files
- Guide you through next steps

#### Manual Setup (Alternative)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doc-qa-app.git
cd doc-qa-app
```

2. Install a local development server:
```bash
npm install -g http-server
```

3. Install test dependencies:
```bash
cd test/selenium
python get-pip.py  # If pip is not already installed
pip install -r requirements.txt
```

## User Guide

### Running the Application

#### Using the Run Script (Recommended)

1. Make the run script executable and execute it:
```bash
chmod +x run.sh
./run.sh
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

#### Manual Start (Alternative)

1. Start the local development server:
```bash
cd doc-qa-app
http-server -p 8000
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

### Using the Application

1. **Upload a Document**:
   - Click "Choose File" to upload a document
   - Wait for document processing to complete
   - You'll see a preview when ready

2. **Preview Your Document**:
   - View the compact preview automatically displayed after upload
   - Click "Show full preview of the document" to see the entire document in a modal
   - Use the modal controls to navigate and close the preview

3. **Ask Questions**:
   - Type a question about your document in the input field
   - Click "Ask" to submit your question
   - Review the response and recommended follow-up questions
   - Toggle "Mock Mode" for testing without API calls

### Running Tests

1. Ensure the application is running on http://localhost:8000

2. Run the Selenium test suite:
```bash
cd test/selenium
python test_suite.py
```

3. After test completion:
   - Check terminal output for test summary
   - Review generated test report at `test/selenium/test/results/test_report_[timestamp].pdf`
   - Examine screenshots of failed tests in `test/selenium/test/results/screenshots/`
   - View performance charts in `test/selenium/test/results/charts/`

## Development Guide

### Extending the Application

#### Adding New Document Types
1. Update file validation in `js/app.js`
2. Add processing logic in `js/documentProcessor.js`
3. Update preview formatting in `js/preview.js`
4. Update UI feedback for new file types

#### Enhancing Preview Functionality
1. Modify the format functions in `js/preview.js`
2. Update CSS styling for new preview elements
3. Add new navigation or viewing options as needed

#### Changing LLM Provider
1. Update API configuration in `js/llmService.js`
2. Adjust request/response handling for the new provider
3. Update mock data in `js/mockData.js` to match new response format

#### Adding New UI Features
1. Add HTML structure to `index.html`
2. Add corresponding styles to `css/styles.css`
3. Implement interaction logic in appropriate JavaScript modules

### Testing Guidelines

#### Adding New Tests
1. Create new test methods in `test/selenium/test_suite.py`
2. Register tests in the appropriate test category
3. Add test results recording
4. Update test reporting as needed

#### Troubleshooting Tests
- Review screenshots of failed tests
- Check console output for error messages
- Verify element IDs and selectors match the application
- Adjust timing parameters for slower environments

## Performance Considerations

- Document processing is performed client-side to minimize dependencies
- Large documents may require longer processing time
- The preview module intelligently formats content for optimal display
- Mock mode can be used to test UI without waiting for LLM responses
- Performance metrics are tracked and displayed in test reports

## Security and Limitations

- Documents are processed locally and not sent to external servers (except for LLM queries)
- Maximum file size is limited to 20MB
- Supported file types: PDF, DOCX, XLSX
- LLM responses depend on the quality of text extraction and the capabilities of the chosen LLM provider

## References and Resources

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF processing library
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) - Testing framework
- [Open-source LLMs](https://huggingface.co/models) - LLM provider options
- [Modal Web Component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) - For document preview modal

## License

This project is released under the MIT License.