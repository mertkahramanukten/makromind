#!/bin/bash

# Fourth Platform Deployment Script
# This script deploys the entire Fourth platform using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse command line arguments
ENVIRONMENT="production"
BUILD_IMAGES=true
PULL_IMAGES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --no-build)
            BUILD_IMAGES=false
            shift
            ;;
        --pull)
            PULL_IMAGES=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --env ENVIRONMENT    Set environment (production, development) [default: production]"
            echo "  --no-build          Skip building images"
            echo "  --pull              Pull latest images before building"
            echo "  --help              Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            exit 1
            ;;
    esac
done

print_status "Starting Fourth Platform deployment..."
print_status "Environment: $ENVIRONMENT"

# Set compose file based on environment
if [ "$ENVIRONMENT" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Docker compose file $COMPOSE_FILE not found!"
    exit 1
fi

# Pull images if requested
if [ "$PULL_IMAGES" = true ]; then
    print_status "Pulling latest images..."
    docker-compose -f $COMPOSE_FILE pull
fi

# Build images if requested
if [ "$BUILD_IMAGES" = true ]; then
    print_status "Building images..."
    docker-compose -f $COMPOSE_FILE build --no-cache
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Start services
print_status "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker-compose -f $COMPOSE_FILE exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    print_status "✓ MongoDB is healthy"
else
    print_warning "⚠ MongoDB health check failed"
fi

# Check Backend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✓ Backend API is healthy"
else
    print_warning "⚠ Backend API health check failed"
fi

# Check Frontend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "✓ Frontend Web is healthy"
else
    print_warning "⚠ Frontend Web health check failed"
fi

print_status "Deployment completed!"
print_status "Services available at:"
print_status "  - Backend API: http://localhost:3000"
print_status "  - Frontend Web: http://localhost:3001"
print_status "  - MongoDB: localhost:27017"

print_status "To view logs: docker-compose -f $COMPOSE_FILE logs -f"
print_status "To stop services: docker-compose -f $COMPOSE_FILE down"
