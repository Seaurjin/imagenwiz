# iMagenWiz

An advanced AI-powered image processing and multilingual content management platform.

## Key Features

- AI-driven image processing and manipulation
- Comprehensive multilingual translation capabilities
- Stripe payment integration
- Google OAuth authentication
- Blog/CMS with 22+ languages support

## Technical Stack

- **Frontend**: Vite + React.js with modern build process
- **Backend**: Flask (Python) for API endpoints
- **Database**: MySQL for data management
- **AI Integration**: DeepSeek AI translation service

## Running the Application

### Default Mode

Use the workflow "Start application" to run the Express server with fallbacks for missing Flask API endpoints.

### Full-Stack Mode

Use the workflow "Start Fullstack Application" to run both Express and Flask together. This will:
1. Start the Flask backend first
2. Wait for Flask to initialize
3. Start the Express frontend
4. Provide proper health checks and coordination between components

### Development Mode

Use the workflow "Development Mode (Skip Migrations)" to run a faster version that skips database migrations. This is recommended for development only as it may not have the complete database schema.

## Environment Variables

The application supports these environment variables:

- `SKIP_MIGRATIONS`: Set to `true` to skip all database migrations for faster startup in development
- `SKIP_RECHARGE_HISTORY_MIGRATION`: Set to `true` to skip just the recharge history migration
- `SKIP_USER_CREDITS_MIGRATION`: Set to `true` to skip just the user credits migration
- `SKIP_MYSQL_AUTO_TRANSLATION_MIGRATION`: Set to `true` to skip just the auto translation migration

## Authentication

The application supports standard username/password authentication as well as Google OAuth login.

## API Structure

- `/api/auth/*` - Authentication endpoints
- `/api/matting/*` - Image processing endpoints
- `/api/payment/*` - Payment and subscription endpoints
- `/api/cms/*` - Content management endpoints

## Common Issues

### Slow Startup

The application may take longer to start initially because of database migrations, especially when connecting to an external MySQL database. This is normal and expected behavior. Use the development mode workflow to skip migrations for faster startup during development.

### Missing API Functionality

If certain advanced features don't work, it may be because the Flask backend is still initializing or hasn't started properly. Check the logs for "Flask backend is now running" messages to confirm when the backend is fully available.