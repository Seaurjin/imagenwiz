"""
Simple script to create the site_settings table in the database
"""
import os
import sys
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_site_settings_table():
    """Create the site_settings table if it doesn't exist"""
    try:
        # Get MySQL credentials from environment variables
        mysql_user = os.environ.get('DB_USER', 'root')
        mysql_password = os.environ.get('DB_PASSWORD', '')
        mysql_host = os.environ.get('DB_HOST', 'localhost')
        mysql_db = os.environ.get('DB_NAME', 'mat_db')
        mysql_port = os.environ.get('DB_PORT', '3306')
        
        print(f"Connecting to MySQL: {mysql_user}@{mysql_host}:{mysql_port}/{mysql_db}")
        
        # Connect to MySQL
        conn = mysql.connector.connect(
            host=mysql_host,
            user=mysql_user,
            password=mysql_password,
            database=mysql_db,
            port=int(mysql_port)
        )
        
        if conn.is_connected():
            cursor = conn.cursor()
            
            # Check if site_settings table exists
            cursor.execute("SHOW TABLES LIKE 'site_settings'")
            result = cursor.fetchone()
            
            if not result:
                print("Creating site_settings table...")
                # Create site_settings table
                cursor.execute("""
                CREATE TABLE site_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    setting_key VARCHAR(100) NOT NULL UNIQUE,
                    setting_value TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
                """)
                conn.commit()
                print("site_settings table created successfully")
            else:
                print("site_settings table already exists")
                
            # Insert default settings if they don't exist
            default_settings = [
                ('logo_navbar', '/images/imagenwiz-logo-navbar-gradient.svg'),
                ('logo_footer', '/images/imagenwiz-logo-footer.svg'),
                ('logo_favicon', '/favicon.svg')
            ]
            
            for key, value in default_settings:
                cursor.execute(
                    "SELECT COUNT(*) FROM site_settings WHERE setting_key = %s",
                    (key,)
                )
                count = cursor.fetchone()[0]
                
                if count == 0:
                    cursor.execute(
                        "INSERT INTO site_settings (setting_key, setting_value) VALUES (%s, %s)",
                        (key, value)
                    )
                    print(f"Inserted default setting: {key}")
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Migration completed successfully")
            
    except Error as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_site_settings_table()