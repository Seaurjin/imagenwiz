"""
MySQL migration script to add the flag column to the cms_languages table
"""
import logging
from sqlalchemy import text, exc
from app import db

def run_migration():
    """
    Add flag column to cms_languages table if it doesn't exist
    """
    try:
        # Check if flag column exists in cms_languages table
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
            print("Added flag column and updated values for cms_languages table")
            return True
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
            print("Updated missing flag values for cms_languages table")
            return True
    except Exception as e:
        db.session.rollback()
        print(f"CMS language flags migration failed: {e}")
        return False