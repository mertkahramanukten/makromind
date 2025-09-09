#!/bin/bash

# Fourth Platform Setup Script
# This script sets up the development environment for the Fourth platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_header "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_status "✓ Node.js $(node -v) is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_status "✓ npm $(npm -v) is installed"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker is required for database and deployment."
        print_warning "Please install Docker to continue with full setup."
    else
        print_status "✓ Docker $(docker --version) is installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. Docker Compose is required for deployment."
        print_warning "Please install Docker Compose to continue with full setup."
    else
        print_status "✓ Docker Compose $(docker-compose --version) is installed"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing dependencies..."
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend Web dependencies
    print_status "Installing frontend web dependencies..."
    cd frontend-web
    npm install
    cd ..
    
    # Mobile dependencies
    print_status "Installing mobile dependencies..."
    cd mobile
    npm install
    cd ..
    
    # Shared types dependencies
    print_status "Installing shared types dependencies..."
    cd shared-types
    npm install
    cd ..
    
    print_status "✓ All dependencies installed"
}

# Setup environment files
setup_environment() {
    print_header "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/env.example" ]; then
            cp backend/env.example backend/.env
            print_status "✓ Created backend/.env from env.example"
        else
            print_warning "No env.example found for backend"
        fi
    else
        print_status "✓ Backend .env already exists"
    fi
    
    # Frontend Web environment
    if [ ! -f "frontend-web/.env" ]; then
        if [ -f "frontend-web/.env.example" ]; then
            cp frontend-web/.env.example frontend-web/.env
            print_status "✓ Created frontend-web/.env from .env.example"
        else
            print_warning "No .env.example found for frontend-web"
        fi
    else
        print_status "✓ Frontend Web .env already exists"
    fi
    
    print_warning "Please update the environment files with your actual configuration values."
}

# Build shared types
build_shared_types() {
    print_header "Building shared types..."
    
    cd shared-types
    npm run build
    cd ..
    
    print_status "✓ Shared types built successfully"
}

# Setup database
setup_database() {
    print_header "Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Starting MongoDB with Docker..."
        docker-compose -f docker-compose.dev.yml up -d mongodb
        
        # Wait for MongoDB to be ready
        print_status "Waiting for MongoDB to be ready..."
        sleep 10
        
        print_status "✓ Database setup completed"
    else
        print_warning "Docker not available. Please set up MongoDB manually."
        print_warning "MongoDB should be running on localhost:27017"
    fi
}

# Main setup function
main() {
    print_header "Setting up Fourth Platform Development Environment"
    
    check_requirements
    install_dependencies
    setup_environment
    build_shared_types
    setup_database
    
    print_header "Setup completed successfully!"
    print_status "Next steps:"
    print_status "1. Update environment files with your configuration"
    print_status "2. Start the development servers:"
    print_status "   - Backend: cd backend && npm run dev"
    print_status "   - Frontend Web: cd frontend-web && npm start"
    print_status "   - Mobile: cd mobile && npm start"
    print_status "3. Or use Docker: ./scripts/deploy.sh --env development"
}

# Run main function
main "$@"
