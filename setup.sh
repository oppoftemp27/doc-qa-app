#!/bin/bash
# Setup script for Document Q&A Application

# Output colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Document Q&A Application...${NC}"

# Create necessary directories
echo -e "${GREEN}Creating directory structure...${NC}"
mkdir -p css js assets/icons assets/img test/selenium test/results test/test_files models

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install Node.js and npm first.${NC}"
    echo -e "${YELLOW}Visit https://nodejs.org/ to download and install.${NC}"
    exit 1
fi

# Install http-server
echo -e "${GREEN}Installing http-server...${NC}"
npm install -g http-server

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 not found. You'll need Python 3.7+ to run tests.${NC}"
    echo -e "${YELLOW}Visit https://www.python.org/ to download and install.${NC}"
else
    echo -e "${GREEN}Installing Python dependencies for testing...${NC}"
    cd test/selenium
    pip3 install -r requirements.txt
    cd ../..
fi

# Create a sample test file for testing
echo -e "${GREEN}Creating sample test files...${NC}"
echo "This is a sample PDF document for testing." > test/test_files/sample.pdf
echo "This is an invalid file type." > test/test_files/invalid.txt

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the application, run:${NC}"
echo -e "${GREEN}./run.sh${NC}"
echo -e "${YELLOW}Or manually:${NC}"
echo -e "${GREEN}http-server -p 8000${NC}"
echo -e "${YELLOW}Then navigate to:${NC}"
echo -e "${GREEN}http://localhost:8000${NC}"
