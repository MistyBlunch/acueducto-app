#!/bin/bash
# ==============================================================================
# Deployment Script for Acueducto API
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
BUILD_CACHE=${BUILD_CACHE:-true}

echo "${BLUE}🚀 Starting Acueducto API deployment...${NC}"
echo "${BLUE}📋 Environment: ${ENVIRONMENT}${NC}"

# Function to check if required files exist
check_requirements() {
    echo "${BLUE}🔍 Checking requirements...${NC}"
    
    if [ ! -f ".env" ]; then
        echo "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo "${YELLOW}📝 Please edit .env file with your configuration before proceeding${NC}"
            exit 1
        else
            echo "${RED}❌ .env.example not found${NC}"
            exit 1
        fi
    fi
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        echo "${RED}❌ $COMPOSE_FILE not found${NC}"
        exit 1
    fi
    
    echo "${GREEN}✅ Requirements check passed${NC}"
}

# Function to validate environment variables
validate_env() {
    echo "${BLUE}🔧 Validating environment variables...${NC}"
    
    # Source .env file
    set -a
    source .env
    set +a
    
    # Check required variables
    required_vars=(
        "POSTGRES_PASSWORD"
        "JWT_SECRET"
        "WEB_ORIGIN"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "${RED}❌ Required environment variable $var is not set${NC}"
            exit 1
        fi
    done
    
    # Validate JWT_SECRET length
    if [ ${#JWT_SECRET} -lt 32 ]; then
        echo "${RED}❌ JWT_SECRET must be at least 32 characters long${NC}"
        exit 1
    fi
    
    echo "${GREEN}✅ Environment validation passed${NC}"
}

# Function to build and deploy
deploy() {
    echo "${BLUE}🏗️  Building and deploying services...${NC}"
    
    # Stop existing services
    echo "${YELLOW}🛑 Stopping existing services...${NC}"
    docker-compose -f $COMPOSE_FILE down
    
    # Remove old images if not using cache
    if [ "$BUILD_CACHE" = "false" ]; then
        echo "${YELLOW}🗑️  Removing old images...${NC}"
        docker-compose -f $COMPOSE_FILE down --rmi all --volumes --remove-orphans
    fi
    
    # Build and start services
    echo "${BLUE}🔨 Building services...${NC}"
    if [ "$BUILD_CACHE" = "true" ]; then
        docker-compose -f $COMPOSE_FILE build --parallel
    else
        docker-compose -f $COMPOSE_FILE build --no-cache --parallel
    fi
    
    echo "${BLUE}🚀 Starting services...${NC}"
    docker-compose -f $COMPOSE_FILE up -d
    
    echo "${GREEN}✅ Services started successfully${NC}"
}

# Function to check service health
check_health() {
    echo "${BLUE}🏥 Checking service health...${NC}"
    
    # Wait for services to be healthy
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f $COMPOSE_FILE ps | grep -q "healthy"; then
            echo "${GREEN}✅ Services are healthy${NC}"
            break
        fi
        
        echo "${YELLOW}⏳ Waiting for services to be healthy... ($attempt/$max_attempts)${NC}"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo "${RED}❌ Services failed to become healthy${NC}"
        docker-compose -f $COMPOSE_FILE logs --tail=50
        exit 1
    fi
}

# Function to show deployment info
show_info() {
    echo "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "${BLUE}📋 Service Information:${NC}"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    echo "${BLUE}🔗 Service URLs:${NC}"
    echo "  API: http://localhost:${API_PORT:-3001}"
    echo "  API Health: http://localhost:${API_PORT:-3001}/health"
    if [ "$ENVIRONMENT" = "development" ]; then
        echo "  API Docs: http://localhost:${API_PORT:-3001}/api/docs"
        echo "  PgAdmin: http://localhost:${PGADMIN_PORT:-5050}"
    fi
    echo ""
    echo "${BLUE}📊 View logs:${NC}"
    echo "  docker-compose -f $COMPOSE_FILE logs -f"
    echo ""
    echo "${BLUE}🛑 Stop services:${NC}"
    echo "  docker-compose -f $COMPOSE_FILE down"
}

# Main deployment flow
main() {
    # Set compose file based on environment
    if [ "$ENVIRONMENT" = "development" ] || [ "$ENVIRONMENT" = "dev" ]; then
        COMPOSE_FILE="docker-compose.dev.yml"
    fi
    
    check_requirements
    validate_env
    deploy
    check_health
    show_info
}

# Handle script arguments
case "${1:-}" in
    "production"|"prod")
        ENVIRONMENT="production"
        COMPOSE_FILE="docker-compose.yml"
        ;;
    "development"|"dev")
        ENVIRONMENT="development"
        COMPOSE_FILE="docker-compose.dev.yml"
        ;;
    "help"|"--help"|"-h")
        echo "Usage: $0 [environment] [options]"
        echo ""
        echo "Environments:"
        echo "  production, prod    Deploy for production"
        echo "  development, dev    Deploy for development"
        echo ""
        echo "Environment variables:"
        echo "  BUILD_CACHE=false   Disable Docker build cache"
        echo ""
        echo "Examples:"
        echo "  $0 production"
        echo "  $0 dev"
        echo "  BUILD_CACHE=false $0 production"
        exit 0
        ;;
    *)
        if [ -n "${1:-}" ]; then
            echo "${RED}❌ Unknown environment: $1${NC}"
            echo "Use '$0 help' for usage information"
            exit 1
        fi
        ;;
esac

# Run main function
main