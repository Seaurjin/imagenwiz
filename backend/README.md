# iMagenWiz Backend

This is the Flask backend for the iMagenWiz application.

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Set up the database:
```
# Run the database setup script from the root directory
../setup-mysql.sh

# Or manually set up MySQL
# See the MYSQL_SETUP.md file in the root directory for detailed instructions
```

3. Configure environment variables (if not using setup script):
```
# Create a .env file in the root directory with the following variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password  # Leave empty if no password
DB_NAME=mat_db
DB_PORT=3306
JWT_SECRET_KEY=your_jwt_secret
```

4. Test database connection:
```
python test_db_connection.py
```

5. Run the application:
```
python run.py
```

The server will start on port 5000.

## Database Connection

The application is configured to:
1. Try to connect to the database specified in environment variables
2. If that fails, attempt to connect to a local MySQL instance
3. If local connection fails, attempt to connect to the remote instance
4. Continue running with warnings if all connections fail

For more details about database setup and troubleshooting, see the `MYSQL_SETUP.md` file in the root directory.

## API Endpoints

- `/` - Test endpoint
- `/api/auth/register` - Register a new user
- `/api/auth/login` - Login a user
- `/api/auth/user` - Get current user details
- `/api/auth/update` - Update user details
- `/api/matting/process` - Process an image to remove background
- `/api/matting/history` - Get user's matting history
- `/api/matting/:id` - Get specific matting details
- `/api/payment/packages` - Get all credit packages
- `/api/payment/create-checkout` - Create a Stripe checkout session
- `/api/payment/webhook` - Handle Stripe webhook events
- `/api/payment/verify/:session_id` - Verify a payment
- `/api/payment/history` - Get user's payment history

## Admin API Endpoints

The backend also includes CMS and settings endpoints for admin users:

- `/api/cms/posts` - Manage blog posts
- `/api/cms/tags` - Manage tags
- `/api/cms/languages` - Manage languages
- `/api/cms/media` - Manage media files
- `/api/settings` - Manage application settings

These endpoints require admin authentication through JWT and check_admin_access().

## Logs

Logs are stored in the `logs` directory:
- `app.log` - Application logs

## Troubleshooting

If you encounter database connection issues:
1. Check the logs in `logs/app.log`
2. Verify MySQL is running
3. Make sure the database credentials are correct
4. Run `python test_db_connection.py` to debug connection issues