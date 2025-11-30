-- Initial schema setup for main-api
-- This is a placeholder migration file

-- Create a simple health check table for demonstration
CREATE TABLE IF NOT EXISTS application_info (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    last_startup_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO application_info (service_name, version)
VALUES ('main-api', '1.0.0');

