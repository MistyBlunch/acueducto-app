#!/bin/sh
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}🚀 Starting Acueducto API...${NC}"

# Function to wait for database
wait_for_db() {
    echo "${YELLOW}⏳ Waiting for database connection...${NC}"
    
    # Maximum attempts to connect to database
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if yarn prisma db push --accept-data-loss > /dev/null 2>&1; then
            echo "${GREEN}✅ Database connection established${NC}"
            break
        fi
        
        echo "${YELLOW}   Attempt $attempt/$max_attempts - Database not ready, waiting...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo "${RED}❌ Failed to connect to database after $max_attempts attempts${NC}"
        exit 1
    fi
}

# Function to run database migrations
run_migrations() {
    echo "${BLUE}🔄 Running database migrations...${NC}"
    
    if yarn prisma migrate deploy; then
        echo "${GREEN}✅ Database migrations completed successfully${NC}"
    else
        echo "${RED}❌ Database migrations failed${NC}"
        exit 1
    fi
}

# Function to generate Prisma client (in case it's needed)
generate_client() {
    echo "${BLUE}⚙️  Generating Prisma client...${NC}"
    
    if yarn prisma generate; then
        echo "${GREEN}✅ Prisma client generated successfully${NC}"
    else
        echo "${RED}❌ Failed to generate Prisma client${NC}"
        exit 1
    fi
}

# Main startup sequence
main() {
    echo "${BLUE}🏗️  Starting database setup...${NC}"
    
    # Wait for database to be ready
    wait_for_db
    
    # Generate Prisma client
    generate_client
    
    # Run migrations
    run_migrations
    
    echo "${GREEN}🎉 Database setup completed successfully!${NC}"
    echo "${BLUE}🚀 Starting NestJS application...${NC}"
    
    # Start the main application
    exec node dist/main.js
}

# Handle termination signals gracefully
trap 'echo "${YELLOW}⚠️  Received termination signal, shutting down...${NC}"; exit 0' TERM INT

# Run main function
main