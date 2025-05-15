#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    echo "On macOS: brew install postgresql"
    echo "On Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

# Database details
DB_NAME="imagenwiz"
DB_USER="imagenwiz_user"
DB_PASSWORD="imagenwiz_pass"

echo "Setting up PostgreSQL database for iMagenWiz..."

# Create the database user
psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" postgres || {
    echo "Error creating user. The user might already exist."
    echo "Continuing..."
}

# Create the database
psql -c "CREATE DATABASE $DB_NAME WITH OWNER $DB_USER;" postgres || {
    echo "Error creating database. The database might already exist."
    echo "Continuing..."
}

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" postgres

echo "Database setup complete!"
echo "Your DATABASE_URL is: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo "Please update your .env file with this URL."

# Update .env file if it exists
if [ -f .env ]; then
    # Check if DATABASE_URL already exists in the file
    if grep -q "DATABASE_URL=" .env; then
        # Replace the existing DATABASE_URL
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME|" .env
        echo "Updated DATABASE_URL in .env file."
    else
        # Add DATABASE_URL to the file
        echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME" >> .env
        echo "Added DATABASE_URL to .env file."
    fi
else
    echo "Warning: .env file not found. Please create one with the DATABASE_URL manually."
fi

echo "Setup complete. Running npm run db:push to initialize schema..."
npm run db:push 