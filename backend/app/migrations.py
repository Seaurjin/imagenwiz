"""
Database migration scripts for the application
"""
import logging
from sqlalchemy import text, exc

from app import db

def run_recharge_history_migration():
    """
    Add is_yearly and package_id columns to recharge_history table if they don't exist
    """
    print("Running recharge_history table migration to add is_yearly and package_id columns...")
    
    try:
        # Check if is_yearly column exists
        check_is_yearly = "SHOW COLUMNS FROM `recharge_history` LIKE 'is_yearly'"
        print(f"Checking if column exists: is_yearly")
        result = db.session.execute(text(check_is_yearly))
        is_yearly_exists = result.rowcount > 0
        
        # Check if package_id column exists
        check_package_id = "SHOW COLUMNS FROM `recharge_history` LIKE 'package_id'"
        print(f"Checking if column exists: package_id")
        result = db.session.execute(text(check_package_id))
        package_id_exists = result.rowcount > 0
        
        if not is_yearly_exists or not package_id_exists:
            # Add any missing columns
            if not is_yearly_exists:
                add_is_yearly = "ALTER TABLE `recharge_history` ADD COLUMN `is_yearly` BOOLEAN DEFAULT FALSE"
                db.session.execute(text(add_is_yearly))
                print(f"Added column: is_yearly")
            
            if not package_id_exists:
                add_package_id = "ALTER TABLE `recharge_history` ADD COLUMN `package_id` INT"
                db.session.execute(text(add_package_id))
                print(f"Added column: package_id")
            
            db.session.commit()
            print(f"Migration completed successfully")
        else:
            print(f"No migration needed, all columns already exist.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration failed: {e}")

def run_user_credits_migration():
    """
    Add credits column to users table if it doesn't exist
    """
    print("Running user credits column migration...")
    
    try:
        # Check if credits column exists
        check_credits = "SHOW COLUMNS FROM `users` LIKE 'credits'"
        result = db.session.execute(text(check_credits))
        
        if result.rowcount == 0:
            # Add credits column with default value of 0
            add_credits = "ALTER TABLE `users` ADD COLUMN `credits` INT NOT NULL DEFAULT 0"
            db.session.execute(text(add_credits))
            db.session.commit()
            print(f"Added column: credits to users table")
        else:
            print(f"'credits' column already exists in users table.")
    except Exception as e:
        db.session.rollback()
        print(f"Credits column migration failed: {e}")

def run_cms_translation_field_migration():
    """
    Add is_auto_translated field to cms_post_translations table if it doesn't exist
    """
    try:
        # Check if is_auto_translated column exists
        check_sql = "SHOW COLUMNS FROM `cms_post_translations` LIKE 'is_auto_translated'"
        result = db.session.execute(text(check_sql))
        
        if result.rowcount == 0:
            # Add is_auto_translated column with default value of false
            alter_sql = "ALTER TABLE `cms_post_translations` ADD COLUMN `is_auto_translated` BOOLEAN NOT NULL DEFAULT FALSE"
            db.session.execute(text(alter_sql))
            db.session.commit()
            logging.info("Added is_auto_translated column to cms_post_translations table")
        
        # Check if last_updated_at column exists
        check_sql = "SHOW COLUMNS FROM `cms_post_translations` LIKE 'last_updated_at'"
        result = db.session.execute(text(check_sql))
        
        if result.rowcount == 0:
            # Add last_updated_at column
            alter_sql = "ALTER TABLE `cms_post_translations` ADD COLUMN `last_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            db.session.execute(text(alter_sql))
            db.session.commit()
            logging.info("Added last_updated_at column to cms_post_translations table")
    except Exception as e:
        db.session.rollback()
        logging.error(f"CMS translation field migration failed: {e}")

def run_cms_tags_description_migration():
    """
    Add description field to cms_tags table if it doesn't exist
    """
    try:
        # Check if description column exists
        check_sql = "SHOW COLUMNS FROM `cms_tags` LIKE 'description'"
        result = db.session.execute(text(check_sql))
        
        if result.rowcount == 0:
            # Add description column
            alter_sql = "ALTER TABLE `cms_tags` ADD COLUMN `description` VARCHAR(255)"
            db.session.execute(text(alter_sql))
            db.session.commit()
            logging.info("Added description column to cms_tags table")
    except Exception as e:
        db.session.rollback()
        logging.error(f"CMS tags description field migration failed: {e}")

def run_cms_language_flags_migration():
    """
    Add flag field to cms_languages table if it doesn't exist
    """
    try:
        # Check if flag column exists
        check_sql = "SHOW COLUMNS FROM `cms_languages` LIKE 'flag'"
        result = db.session.execute(text(check_sql))
        
        if result.rowcount == 0:
            # Add flag column
            alter_sql = "ALTER TABLE `cms_languages` ADD COLUMN `flag` VARCHAR(10)"
            db.session.execute(text(alter_sql))
            db.session.commit()
            
            # Update flags for existing languages
            flag_updates = [
                ("en", "🇬🇧"), ("fr", "🇫🇷"), ("es", "🇪🇸"), ("de", "🇩🇪"), ("it", "🇮🇹"),
                ("pt", "🇵🇹"), ("ru", "🇷🇺"), ("ja", "🇯🇵"), ("ko", "🇰🇷"), ("zh-TW", "🇹🇼"),
                ("ar", "🇸🇦"), ("nl", "🇳🇱"), ("sv", "🇸🇪"), ("tr", "🇹🇷"), ("pl", "🇵🇱"),
                ("hu", "🇭🇺"), ("el", "🇬🇷"), ("no", "🇳🇴"), ("vi", "🇻🇳"), ("th", "🇹🇭"),
                ("id", "🇮🇩"), ("ms", "🇲🇾"), ("bg", "🇧🇬"), ("ca", "🇪🇸"), ("cs", "🇨🇿"),
                ("da", "🇩🇰"), ("fi", "🇫🇮"), ("he", "🇮🇱"), ("hi", "🇮🇳"), ("ro", "🇷🇴"),
                ("sk", "🇸🇰"), ("uk", "🇺🇦"), ("zh-CN", "🇨🇳")
            ]
            
            for code, flag in flag_updates:
                update_sql = text("UPDATE `cms_languages` SET flag = :flag WHERE code = :code")
                db.session.execute(update_sql, {"flag": flag, "code": code})
            
            db.session.commit()
            logging.info("Added flag column and updated values for cms_languages table")
        else:
            # Update any missing flags
            flag_updates = [
                ("en", "🇬🇧"), ("fr", "🇫🇷"), ("es", "🇪🇸"), ("de", "🇩🇪"), ("it", "🇮🇹"),
                ("pt", "🇵🇹"), ("ru", "🇷🇺"), ("ja", "🇯🇵"), ("ko", "🇰🇷"), ("zh-TW", "🇹🇼"),
                ("ar", "🇸🇦"), ("nl", "🇳🇱"), ("sv", "🇸🇪"), ("tr", "🇹🇷"), ("pl", "🇵🇱"),
                ("hu", "🇭🇺"), ("el", "🇬🇷"), ("no", "🇳🇴"), ("vi", "🇻🇳"), ("th", "🇹🇭"),
                ("id", "🇮🇩"), ("ms", "🇲🇾"), ("bg", "🇧🇬"), ("ca", "🇪🇸"), ("cs", "🇨🇿"),
                ("da", "🇩🇰"), ("fi", "🇫🇮"), ("he", "🇮🇱"), ("hi", "🇮🇳"), ("ro", "🇷🇴"),
                ("sk", "🇸🇰"), ("uk", "🇺🇦"), ("zh-CN", "🇨🇳")
            ]
            
            for code, flag in flag_updates:
                update_sql = text("UPDATE `cms_languages` SET flag = :flag WHERE code = :code AND (flag IS NULL OR flag = '')")
                db.session.execute(update_sql, {"flag": flag, "code": code})
            
            db.session.commit()
            logging.info("Updated missing flag values for cms_languages table")
    except Exception as e:
        db.session.rollback()
        logging.error(f"CMS language flags migration failed: {e}")