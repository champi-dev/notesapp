#!/bin/bash

# NoteFlow Setup Script
# This script installs dependencies and starts the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║         NoteFlow Setup Script         ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js 20.19+ or 22.12+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo -e "${GREEN}✓${NC} Node.js detected: $(node -v)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm detected: $(npm -v)"

# Check for MongoDB
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB detected"
else
    echo -e "${YELLOW}⚠${NC} MongoDB not found locally. Make sure you have MongoDB running or use MongoDB Atlas."
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo -e "${BLUE}Installing server dependencies...${NC}"
cd server
npm install
echo -e "${GREEN}✓${NC} Server dependencies installed"

echo ""
echo -e "${BLUE}Installing client dependencies...${NC}"
cd ../client
npm install
echo -e "${GREEN}✓${NC} Client dependencies installed"

# Create .env file if it doesn't exist
cd ../server
if [ ! -f .env ]; then
    echo ""
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << 'EOF'
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/noteflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
EOF
    echo -e "${GREEN}✓${NC} .env file created"
    echo -e "${YELLOW}⚠${NC} Remember to update JWT secrets for production!"
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

cd "$SCRIPT_DIR"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       Setup complete!                 ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "To start the application, run:"
echo -e "  ${YELLOW}./run.sh${NC}"
echo ""
echo -e "Or manually:"
echo -e "  Terminal 1: ${YELLOW}cd server && npm run dev${NC}"
echo -e "  Terminal 2: ${YELLOW}cd client && npm run dev${NC}"
echo ""
echo -e "Then open ${BLUE}http://localhost:5173${NC} in your browser"
