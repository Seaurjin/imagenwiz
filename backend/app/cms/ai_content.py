"""
AI Content Generation for CMS
This module provides functions to generate blog content using DeepSeek API.
"""

import os
import requests
import json
import logging

# Setup dedicated logger for this module
ai_content_logger = logging.getLogger('ai_content_specific')
ai_content_logger.setLevel(logging.DEBUG)
# Create a file handler
log_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../.. ', 'ai_content_specific.log')
# Ensure the log directory (project root) exists if we are creating the log file there
# For simplicity, let's try to log it next to the script or in a known logs dir if possible.
# Adjusted path to be relative to this file, aiming for project root.
project_root_log_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ai_content_specific.log'))

try:
    # Create logs directory if it doesn't exist (assuming project root/logs/)
    # Simplified: for now, log directly in the project root for guaranteed write access if possible
    # Ensure logs dir exists in project root
    # log_dir_in_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'logs'))
    # os.makedirs(log_dir_in_project_root, exist_ok=True)
    # project_root_log_path = os.path.join(log_dir_in_project_root, 'ai_content_specific.log')

    # Simpler: log directly into the same directory as ai_content.py for now to ensure it works
    module_dir = os.path.dirname(os.path.abspath(__file__))
    temp_log_path = os.path.join(module_dir, 'ai_content_module.log')

    # Using a more reliable path: project_root/ai_content_module.log
    # Assuming this script is in backend/app/cms/ai_content.py
    # So ../../../ takes it to the project root.
    final_log_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ai_content_module.log'))

    handler = logging.FileHandler(final_log_path, mode='a') # Append mode
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    if not ai_content_logger.handlers:
        ai_content_logger.addHandler(handler)
    ai_content_logger.propagate = False # Prevent double logging if Flask logger also gets it
except Exception as e:
    print(f"EMERGENCY FALLBACK PRINT: Failed to setup dedicated logger for ai_content.py: {e}")
    # Fallback to print if logger setup fails
    class PrintLogger:
        def debug(self, msg): print(f"DEBUG: {msg}")
        def info(self, msg): print(f"INFO: {msg}")
        def warning(self, msg): print(f"WARNING: {msg}")
        def error(self, msg): print(f"ERROR: {msg}")
    ai_content_logger = PrintLogger()

ai_content_logger.info("Logger for ai_content.py initialized.")

# Configure DeepSeek API
deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
if not deepseek_api_key:
    ai_content_logger.warning("DEEPSEEK_API_KEY environment variable not set.")

DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
# Common model, can be changed if needed e.g., deepseek-coder for code-related content
DEEPSEEK_MODEL = "deepseek-chat"

def generate_blog_content(title, language="en", length="medium"):
    """
    Generate blog content based on a title using DeepSeek API
    
    Args:
        title (str): The blog post title
        language (str): Language code (e.g., 'en', 'fr')
        length (str): 'short', 'medium', or 'long'
    
    Returns:
        dict: The generated content or error message
    """
    ai_content_logger.info(f"Entered generate_blog_content for title: '{title}', lang: '{language}', len: '{length}'")

    if not deepseek_api_key:
        ai_content_logger.error("DeepSeek API key is missing when function is called.")
        return {"success": False, "error": "DeepSeek API key not configured"}
    
    ai_content_logger.info(f"Using DeepSeek API Key (masked): {deepseek_api_key[:5]}...{deepseek_api_key[-4:] if len(deepseek_api_key) > 9 else ''}")

    word_counts = {
        "short": "300-500",
        "medium": "800-1200",
        "long": "1500-2000"
    }
    word_count = word_counts.get(length, "800-1200")
    
    if language != "en":
        ai_content_logger.warning(f"DeepSeek content generation requested for lang '{language}', generating in English.")
        # Fallback or more sophisticated prompt engineering would be needed for other languages.
        # For simplicity, this example will proceed with an English-focused prompt.

    prompt_text = f"Write a professional blog post in English with the title '{title}'. It should be approximately {word_count} words long, well-structured with HTML headings (h2, h3), paragraphs, and lists where appropriate. Ensure the tone is engaging and informative."

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {deepseek_api_key}"
    }

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional content writer specializing in creating engaging, informative blog posts with proper HTML formatting. Include h2 and h3 headings, paragraphs, and occasionally lists or emphasis where appropriate."},
            {"role": "user", "content": prompt_text}
        ],
        "max_tokens": 1000, # Further reduced from 2000
        "temperature": 0.7
    }

    ai_content_logger.debug(f"Attempting to call DeepSeek API. URL: {DEEPSEEK_API_URL}")
    ai_content_logger.debug(f"DeepSeek Headers: {json.dumps(headers)}")
    ai_content_logger.debug(f"DeepSeek Payload: {json.dumps(payload)}")
    
    log_entry_final_status = "No attempt made or early exit."

    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=120)
        ai_content_logger.info(f"DeepSeek API Raw Response Status: {response.status_code}")
        ai_content_logger.debug(f"DeepSeek API Raw Response Headers: {json.dumps(dict(response.headers))}")
        ai_content_logger.debug(f"DeepSeek API Raw Response Body: {response.text}")
        log_entry_final_status = f"Response status: {response.status_code}"
        
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        
        response_data = response.json()
        
        if response_data.get("choices") and len(response_data["choices"]) > 0:
            generated_content = response_data["choices"][0].get("message", {}).get("content")
            if generated_content:
                log_entry_final_status += " - Successfully got content."
                ai_content_logger.info("Successfully generated content with DeepSeek.")
                # ---- Log before returning ----
                ai_content_logger.info(f"FINAL STATUS before returning success: {log_entry_final_status}")
                return {
                    "success": True,
                    "content": generated_content,
                    "language": language, # Reflects requested language, even if prompt was English
                    "title": title
                }
            else:
                log_entry_final_status += " - API response missing content."
                ai_content_logger.error(f"DeepSeek API response missing content: {response_data}")
                # ---- Log before returning ----
                ai_content_logger.info(f"FINAL STATUS before returning error (missing content): {log_entry_final_status}")
                return {"success": False, "error": "DeepSeek API response missing content."}
        else:
            log_entry_final_status += " - API response invalid structure."
            ai_content_logger.error(f"DeepSeek API response invalid structure: {response_data}")
            # ---- Log before returning ----
            ai_content_logger.info(f"FINAL STATUS before returning error (invalid structure): {log_entry_final_status}")
            return {"success": False, "error": "DeepSeek API response had an invalid structure."}
        
    except requests.exceptions.RequestException as e:
        error_message = str(e)
        if e.response is not None:
            try:
                error_detail = e.response.json()
                error_message = f"{str(e)} - Details: {error_detail}"
            except ValueError: # If response is not JSON
                error_message = f"{str(e)} - Response: {e.response.text}"
        log_entry_final_status = f"RequestException: {error_message}"
        ai_content_logger.error(f"DeepSeek API request failed: {error_message}")
        # ---- Log before returning ----
        ai_content_logger.info(f"FINAL STATUS before returning error (RequestException): {log_entry_final_status}")
        return {
            "success": False,
            "error": error_message
        }
    except Exception as e:
        log_entry_final_status = f"Generic Exception: {str(e)}"
        ai_content_logger.error(f"Error processing DeepSeek response: {e}", exc_info=True)
        # ---- Log before returning ----
        ai_content_logger.info(f"FINAL STATUS before returning error (Generic Exception): {log_entry_final_status}")
        return {
            "success": False,
            "error": f"An unexpected error occurred: {str(e)}"
        }
    finally:
        # This log should appear even if there's an unhandled exception or early return in try block
        # though raise_for_status() might bypass it if it jumps to the except block that also returns.
        ai_content_logger.info(f"Exiting generate_blog_content. Final status before any return: {log_entry_final_status}")