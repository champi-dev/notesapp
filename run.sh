#!/bin/bash

# NoteFlow Run Script
# This script starts both the server and client

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exist
if [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Dependencies not installed. Running setup first...${NC}"
    ./setup.sh
fi

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║         Starting NoteFlow...          ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start server in background
echo -e "${BLUE}Starting server...${NC}"
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 2

# Start client in background
echo -e "${BLUE}Starting client...${NC}"
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         NoteFlow is running!          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "  Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "  Backend:  ${BLUE}http://localhost:5001${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
