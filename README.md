# iMagenWiz

iMagenWiz is an advanced AI-powered image processing and multilingual content management platform that provides intelligent visual manipulation and comprehensive translation capabilities.

## System Architecture

The application consists of:
- **Express Frontend**: Node.js service handling the React user interface (port 3000)
- **Flask Backend**: Python service providing AI and data processing (port 5001)
- **Placeholder Server**: Minimal server for Replit workflow support (port 5000)

## Starting the Application

### Option 1: Using Replit Workflow (Recommended)

The simplest way to start the application is to use the Replit workflow:

1. In the Replit interface, click the "Run" button
2. This will start the application using the workflow configuration

### Option 2: Using the Startup Script

For better control over the startup process, use the provided startup script:

```bash
./start-imagenwiz.sh
```

This script automatically:
- Sets the right environment variables
- Starts the placeholder server on port 5000
- Launches the full application stack

### Option 3: Using the Coordinated Startup Script

For complete control with detailed logs:

```bash
node coordinated-startup.js
```

This script:
- Starts all components with proper sequencing
- Provides detailed color-coded logs
- Handles proper shutdown of all services

## Environment Configuration

The application uses these environment variables:

- `REPLIT_DOMAIN`: The domain of your Replit application
- `FLASK_URL`: URL to access the Flask backend
- `EXPRESS_PORT`: Port for the Express frontend (default: 3000)
- `FLASK_PORT`: Port for the Flask backend (default: 5001)
- `DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT`: Database connection settings

## Development Guidelines

When developing:

1. The Express frontend serves static files and proxies API requests to Flask
2. Flask backend handles AI processing, database operations, and complex business logic
3. The placeholder server on port 5000 keeps the Replit workflow active

## Troubleshooting

If you encounter issues:

1. **Workflow Timeout**: Make sure port 5000 is available for the placeholder server
2. **Flask Connection**: Check that the Flask backend is running and accessible
3. **Frontend Issues**: Verify that the Express server can locate the built frontend files

## License

Copyright © 2025 iMagenWiz