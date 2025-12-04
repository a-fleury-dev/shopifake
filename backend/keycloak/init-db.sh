#!/bin/bash
set -e

echo "🏗️  Initializing databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE ${MAIN_DB};
    CREATE DATABASE ${TEST_DB};
EOSQL

echo "✅ Databases created successfully."