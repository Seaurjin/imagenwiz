"""
Script to migrate all blog posts from PostgreSQL to MySQL

This script calls the single post migration script for each post
to ensure more reliable migration.
"""

import os
import sys
import subprocess
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# List of blog post slugs to migrate
POST_SLUGS = [
    "product-photography-tips",
    "background-removal-applications",
    "ai-image-editing-workflow",
    "image-processing-for-social-media"
]

def migrate_all_posts():
    """Migrate all blog posts one by one"""
    success_count = 0
    failure_count = 0
    
    for slug in POST_SLUGS:
        logger.info(f"Migrating post: {slug}")
        try:
            # Run the single post migration script for this slug
            result = subprocess.run(
                ["python", "migrate_single_blog_post.py", slug],
                check=False,
                capture_output=True,
                text=True,
                timeout=300  # 5-minute timeout per post
            )
            
            if result.returncode == 0:
                logger.info(f"✅ Successfully migrated post: {slug}")
                logger.debug(f"Output: {result.stdout}")
                success_count += 1
            else:
                logger.error(f"❌ Failed to migrate post: {slug}")
                logger.error(f"Error output: {result.stderr}")
                failure_count += 1
                
        except subprocess.TimeoutExpired:
            logger.error(f"⏱️ Timeout while migrating post: {slug}")
            failure_count += 1
        except Exception as e:
            logger.error(f"⚠️ Error migrating post {slug}: {e}")
            failure_count += 1
    
    # Print summary
    logger.info(f"Migration summary:")
    logger.info(f"✅ Successfully migrated: {success_count} posts")
    logger.info(f"❌ Failed to migrate: {failure_count} posts")
    
    # Return true if all posts were migrated successfully
    return success_count == len(POST_SLUGS)

if __name__ == "__main__":
    logger.info("Starting migration of all blog posts")
    result = migrate_all_posts()
    
    if result:
        logger.info("✅ All posts were migrated successfully")
        sys.exit(0)
    else:
        logger.error("⚠️ Some posts failed to migrate")
        sys.exit(1)