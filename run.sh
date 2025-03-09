#!/bin/bash
# Run script for Document Q&A Application

# Output colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if http-server is installed
if ! command -v http-server &> /dev/null; then
    echo -e "${RED}http-server not found. Please run setup.sh first.${NC}"
    exit 1
fi

# Start the server
echo -e "${GREEN}Starting Document Q&A Application...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
http-server -p 8000
