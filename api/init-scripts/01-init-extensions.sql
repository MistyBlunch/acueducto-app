-- ==============================================================================
-- PostgreSQL Initialization Script
-- This script runs when the PostgreSQL container is first initialized
-- ==============================================================================

-- Create extensions needed for the application
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (these will be created by Prisma, but just in case)
-- Note: Prisma migrations will handle the actual table creation

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Extensions created successfully';
END
$$;