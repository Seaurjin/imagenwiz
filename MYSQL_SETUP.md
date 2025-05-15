# MySQL Connection Guide for iMagenWiz

This guide explains how to resolve MySQL connection issues for the iMagenWiz application.

## Understanding the Database Connection

The iMagenWiz application uses MySQL for data storage. By default, it tries to connect to:

1. A local MySQL instance first (if available)
2. Falls back to a remote MySQL instance (8.130.113.102) if the local one isn't working

## Option 1: Setting Up Local MySQL (Recommended)

For development, we recommend setting up a local MySQL instance:

### Automatic Setup

Run the provided setup script:

```
./setup-mysql.sh
```

This script will:
1. Check if MySQL is installed and running
2. Create a `mat_db` database
3. Configure environment variables in the `.env` file

### Manual Setup

If the automatic setup doesn't work, follow these steps:

1. Install MySQL if you don't have it already:
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`
   - Windows: Download from https://dev.mysql.com/downloads/installer/

2. Start the MySQL service:
   - macOS: `brew services start mysql` or `mysql.server start`
   - Linux: `sudo systemctl start mysql`
   - Windows: Start via Services or MySQL Workbench

3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS mat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Update your environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password  # Leave empty if no password
   DB_NAME=mat_db
   DB_PORT=3306
   ```

## Option 2: Using the Remote Database

If you prefer to use the remote database, set these environment variables:

```
DB_HOST=8.130.113.102
DB_USER=root
DB_PASSWORD=Ir%86241992
DB_NAME=mat_db
DB_PORT=3306
```

Note: The remote database might not always be accessible or might have connection limits.

## Testing Your Connection

You can test your database connection using the provided test script:

```
python backend/test_db_connection.py
```

This script will:
1. Try to connect to your configured database
2. Show if the connection succeeded or failed
3. Suggest fixes if there are issues

## Troubleshooting

### "Access denied" Error
- Check that your username and password are correct
- Make sure the user has permissions to access the database

### "Can't connect to MySQL server" Error
- Ensure MySQL is running
- Check if the host and port are correct
- Check if firewalls are blocking the connection

### "Unknown database" Error
- Make sure the database (`mat_db`) exists
- Create it if it doesn't exist

### Import Errors
- Make sure all required Python packages are installed:
  ```
  pip install -r backend/requirements.txt
  pip install python-dotenv pymysql
  ```

## Connection Flow

The application's connection logic has been updated to:

1. Try to connect to the database specified in environment variables
2. If that fails, attempt to connect to the local MySQL instance
3. If local connection fails, attempt to connect to the remote instance
4. Continue running with warnings if all connections fail

This ensures the application can start even if database connections are temporarily unavailable.

## Advanced: Migrating Data

If you need to migrate data from the remote database to your local one:

1. Export the data from the remote database:
   ```
   mysqldump -h 8.130.113.102 -u root -p'Ir%86241992' mat_db > mat_db_backup.sql
   ```

2. Import it to your local database:
   ```
   mysql -u root -p mat_db < mat_db_backup.sql
   ```

Note: Replace `root` with your MySQL username and provide your password when prompted.

## Questions or Issues

If you encounter any other database issues, please check the logs in:
- `backend/logs/app.log`
- `server.log`

For more support, contact the development team or file an issue in the project repository. 