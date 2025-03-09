# Document Q&A Application - User Guide

This guide provides detailed instructions for setting up, running, and testing the Document Q&A application. The application allows you to upload documents and ask questions about their content using natural language.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Using the Application](#using-the-application)
   - [Document Upload](#document-upload)
   - [Document Preview](#document-preview)
   - [Asking Questions](#asking-questions)
   - [Mock Mode](#mock-mode)
   - [Document Navigation](#document-navigation)
5. [Running Tests](#running-tests)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+
- **Memory**: 4GB RAM (8GB recommended for larger documents)
- **Disk Space**: 100MB for application files

### For Development and Testing

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher
- **Python**: Version 3.7 or higher
- **pip**: Latest version

## Installation

Follow these steps to set up the Document Q&A application on your system.

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/doc-qa-app.git
cd doc-qa-app
```

### Step 2: Install Development Server

The application is a static website that requires a simple HTTP server to run locally:

```bash
# Install http-server globally
npm install -g http-server

# Verify installation
http-server --version
```

### Step 3: Install Test Dependencies

If you plan to run the automated tests, install the required Python packages:

```bash
# Navigate to the test directory
cd test/selenium

# Install dependencies
pip install -r requirements.txt
```

The requirements.txt file includes:
- selenium
- webdriver-manager
- matplotlib
- numpy
- fpdf

### Step 4: Verify Setup

Ensure the application files are in place:

```bash
# Return to project root
cd ../..

# Check for key files
ls index.html
ls css/styles.css
ls js/app.js
ls js/preview.js
```

## Running the Application

### Starting the Local Server

1. From the project root directory, start the HTTP server:

```bash
http-server -p 8000
```

2. You should see output similar to:

```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8000
  http://192.168.1.X:8000
Hit CTRL-C to stop the server
```

### Accessing the Application

1. Open your web browser
2. Navigate to: `http://localhost:8000` or `http://127.0.0.1:8000`
3. The Document Q&A application should load in your browser

### Stopping the Server

When you're done using the application:

1. Return to the terminal window where the server is running
2. Press `CTRL+C` to stop the server
3. Confirm termination if prompted

## Using the Application

### Document Upload

1. **Select a Document**
   - Click the "Choose File" button in the upload section
   - Browse to select a document from your computer
   - Supported formats: PDF, Word (.docx), Excel (.xlsx)
   - Maximum file size: 20MB

2. **Upload Process**
   - After selecting a file, it will automatically begin uploading
   - A progress indicator will show the upload status
   - Wait for the document to process (this may take a few seconds depending on file size)
   - Once processing is complete, you'll see a preview of your document

### Document Preview

1. **Preview Section**
   - After successful document upload, you'll see a compact preview of your document
   - The preview shows the first few lines or paragraphs of the document
   - The document name appears as the preview title

2. **Full Document Preview**
   - To see the entire document content, click the "Show full preview of the document" button
   - A modal window will open displaying the complete document content
   - You can scroll through the entire document in this view

3. **Closing Full Preview**
   - To close the full preview, you can:
     - Click the "×" button in the top right corner
     - Click anywhere outside the preview window
     - Press the ESC key on your keyboard

4. **Preview Formatting**
   - The preview intelligently formats different document types:
     - PDF documents may show page breaks
     - Word documents show heading structure
     - Text documents maintain paragraph formatting

### Asking Questions

1. **Enter Your Question**
   - In the question input box, type a question about your document
   - Be specific to get the most relevant answers
   - The character counter shows how many characters you've used

2. **Submit Your Question**
   - Click the "Ask" button to submit your question
   - A loading indicator will appear while the system processes your question
   - The response will appear in the response area below

3. **Using Recommendation Chips**
   - After receiving a response, suggestion chips will appear
   - These are follow-up questions the system recommends
   - Click any chip to automatically fill it in the question input
   - You can then submit the suggested question by clicking "Ask"

### Mock Mode

For testing or demonstration purposes, you can enable mock mode:

1. Toggle the "Mock Mode" switch to the ON position
2. When in mock mode, responses are generated from pre-defined templates
3. This allows you to test the UI without making actual API calls
4. Response times are typically faster in mock mode

### Document Navigation

If your document has multiple pages:

1. Use the page navigation controls to move between pages
2. The current page indicator shows your position in the document
3. The document preview updates as you change pages

## Running Tests

The application includes a comprehensive test suite to verify functionality.

### Prerequisites for Testing

Ensure you have:
- Completed the installation of test dependencies
- Chrome browser installed (for WebDriver)
- The application running on port 8000

### Executing the Test Suite

1. **Start the Application Server** (if not already running):

```bash
# From project root
http-server -p 8000
```

2. **Run the Complete Test Suite**:

```bash
# Navigate to the test directory
cd test/selenium

# Run the test suite
python test_suite.py
```

3. **Test Execution Process**:
   - The test will launch a browser window (or run headlessly)
   - It will automatically navigate through various test scenarios
   - Progress will be displayed in the terminal
   - The browser will close when tests are complete

### Test Results

After tests complete:

1. **Console Output**:
   - View the terminal for a summary of test results
   - Passed and failed tests will be indicated

2. **Generated Report**:
   - A PDF report is generated in the `test/results` directory
   - The filename includes a timestamp (e.g., `test_report_20250307_123045.pdf`)
   - Open this file to see detailed test results and statistics

3. **Screenshots**:
   - For failed tests, screenshots are saved in `test/results/screenshots`
   - These can help diagnose UI issues or unexpected behaviors

4. **Performance Charts**:
   - Charts showing performance metrics are in `test/results/charts`
   - These visualize response times against benchmarks

### Running Specific Tests

To run only specific types of tests:

```bash
# For positive tests only
python -m unittest test_suite.DocumentQATestSuite.test_page_loads_correctly test_suite.DocumentQATestSuite.test_file_upload test_suite.DocumentQATestSuite.test_ask_question test_suite.DocumentQATestSuite.test_recommendation_chips test_suite.DocumentQATestSuite.test_document_preview

# For negative tests only
python -m unittest test_suite.DocumentQATestSuite.test_invalid_file_type test_suite.DocumentQATestSuite.test_empty_question test_suite.DocumentQATestSuite.test_question_without_document

# For performance tests only
python -m unittest test_suite.DocumentQATestSuite.test_character_counter_performance test_suite.DocumentQATestSuite.test_preview_modal_performance
```

## Troubleshooting

### Application Issues

1. **Page Doesn't Load**
   - Verify the HTTP server is running
   - Check browser console for JavaScript errors
   - Try a different browser

2. **Upload Failures**
   - Check file format (must be PDF, DOCX, or XLSX)
   - Verify file size (< 20MB)
   - Try a different document

3. **No Response to Questions**
   - Check if mock mode is enabled
   - Verify network connectivity
   - Try shorter, simpler questions

4. **Preview Not Working**
   - Check browser console for JavaScript errors
   - Verify that the document was processed successfully
   - Try refreshing the page and uploading the document again

### Testing Issues

1. **Selenium WebDriver Problems**
   - Update Chrome to the latest version
   - Run `pip install --upgrade webdriver-manager`
   - Check for Python dependency conflicts

2. **Test Failures**
   - Review screenshots from failed tests
   - Check if application is running on the correct port
   - Adjust timing parameters in test_suite.py if needed

3. **Report Generation Errors**
   - Verify Python matplotlib and fpdf are installed
   - Check write permissions in the test/results directory

For persistent issues, please check the GitHub repository issues page or contact the development team.