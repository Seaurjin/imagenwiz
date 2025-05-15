"""
Translation service for automatically translating content between languages
"""
import os
import json
import time
import random
import logging
import requests
from urllib3.util import Retry
from requests.adapters import HTTPAdapter
from flask import current_app, g, has_request_context
from app.models.cms import Language

logger = logging.getLogger('flask.app')

class TranslationService:
    """Service for translating content between languages using DeepSeek API"""
    
    def __init__(self):
        """Initialize the translation service with DeepSeek API"""
        self.api_key = os.environ.get('DEEPSEEK_API_KEY') or os.environ.get('OPENAI_API_KEY')
        self.api_base_url = "https://api.deepseek.com/v1"
        self.model = "deepseek-chat"
        self.session = None
        self.setup_session()
        
        logger.info(f"Translation service initialized with DeepSeek API")
        
        if self.api_key:
            logger.info("DeepSeek API settings initialized successfully")
        else:
            logger.warning("DEEPSEEK_API_KEY not found in environment variables")
    
    def setup_session(self):
        """Setup a requests session with connection pooling and retries"""
        if self.session:
            self.session.close()
            
        self.session = requests.Session()
        adapter = HTTPAdapter(
            pool_connections=10,
            pool_maxsize=10,
            max_retries=Retry(
                total=2,  # Reduced retries
                backoff_factor=1,
                status_forcelist=[408, 429, 500, 502, 503, 504],
                allowed_methods=["POST"],
                respect_retry_after_header=True
            )
        )
        self.session.mount('https://', adapter)
    
    def is_available(self):
        """Check if the translation service is available"""
        return self.api_key is not None
    
    def get_language_name(self, language_code):
        """Get the language name from code, prioritizing hardcoded map, then DB if context available."""
        # Fallback values for common languages if not in database
        language_map = {
            'en': 'English',
            'fr': 'French',
            'es': 'Spanish',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh-TW': 'Traditional Chinese',
            'ar': 'Arabic',
            'nl': 'Dutch',
            'sv': 'Swedish',
            'tr': 'Turkish',
            'pl': 'Polish',
            'hu': 'Hungarian',
            'el': 'Greek',
            'no': 'Norwegian',
            'vi': 'Vietnamese',
            'th': 'Thai',
            'id': 'Indonesian',
            'ms': 'Malaysian'
        }
        
        if language_code in language_map:
            logger.debug(f"Language code '{language_code}' resolved to '{language_map[language_code]}' from hardcoded map.")
            return language_map[language_code]

        # If not in map, and if we have app context, try the database
        if has_request_context(): # Check if we are in an application context that allows DB queries
            try:
                language = Language.query.get(language_code)
                if language:
                    logger.info(f"Language code '{language_code}' resolved to '{language.name}' from database.")
                    return language.name
                else:
                    logger.info(f"Language code '{language_code}' not found in database (after checking map). Using placeholder.")
            except Exception as e:
                logger.error(f"Error querying database for language code '{language_code}': {str(e)}", exc_info=True)
                logger.info(f"Using placeholder for language code '{language_code}' after DB error.")
        else:
            logger.warning(f"Language code '{language_code}' not in hardcoded map and no request context to query database. Using placeholder.")
            
        # Ultimate fallback if not in map and DB query not possible or failed
        return f"Language ({language_code})"
    
    def translate_content(self, content, from_lang_code, to_lang_code):
        """
        Translate content from one language to another
        
        Args:
            content (str): The text content to translate
            from_lang_code (str): Source language code
            to_lang_code (str): Target language code
            
        Returns:
            str: Translated content or None if translation fails
        """
        if not self.is_available():
            logger.error(f"API key not available for {to_lang_code}")
            return None
        if not content or not content.strip():
            logger.info(f"Empty content provided for {to_lang_code}")
            return "" 
        if from_lang_code == to_lang_code: return content
        
        from_lang_name = self.get_language_name(from_lang_code)
        to_lang_name = self.get_language_name(to_lang_code)
        
        return self.translate_content_with_names(content, from_lang_code, to_lang_code, from_lang_name, to_lang_name)
        
    def translate_content_with_names(self, content, from_lang_code, to_lang_code, from_lang_name, to_lang_name):
        """
        Translate content from one language to another using pre-fetched language names
        
        Args:
            content (str): The text content to translate
            from_lang_code (str): Source language code
            to_lang_code (str): Target language code
            from_lang_name (str): Source language name
            to_lang_name (str): Target language name
            
        Returns:
            str: Translated content or None if translation fails
        """
        if not self.is_available():
            logger.error(f"API key not available for {to_lang_code}")
            return None
        if not content or not content.strip():
            logger.info(f"Empty content provided for {to_lang_code}")
            return "" 
        if from_lang_code == to_lang_code: return content
        
        logger.info(f"Attempting to translate ~{len(content)} chars from {from_lang_name} to {to_lang_name}...")
        logger.debug(f"Translation prompt for {to_lang_name} will use from_lang_name: '{from_lang_name}', to_lang_name: '{to_lang_name}'")
        
        prompt = f"""Translate the ENTIRE HTML content provided within the <content_to_translate> XML element from {from_lang_name} into {to_lang_name}.
It is CRUCIAL that you process and translate all text content within the provided HTML, from the beginning to the very end.
Preserve ALL original HTML tags (like <p>, <h1>, <h2>, <ul>, <li>, <strong>, <a>, etc.), structure, and attributes EXACTLY as they are.
Translate only the text content found within these HTML tags.
If there are any untranslatable terms (like product names, code snippets, or specific proper nouns), keep them as they are in the original language.

<content_to_translate>
{content}
</content_to_translate>

Respond ONLY with the fully translated HTML content that would go inside the <content_to_translate> element. Ensure your response includes ALL original HTML structure. Do not add any explanatory text before or after the translated HTML block."""
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        data = {
            "model": self.model, "messages": [
                {"role": "system", "content": "You are an expert translator."}, {"role": "user", "content": prompt}
            ],
            "temperature": 0.2, "max_tokens": 4090 # Increased slightly just in case
        }

        # Create a new session for each call to ensure thread safety
        local_session = requests.Session()
        adapter = HTTPAdapter(
            pool_connections=1, # Fine for single, short-lived session
            pool_maxsize=1,   # Fine for single, short-lived session
            max_retries=Retry(
                total=2,  # Reduced retries from original global session for quicker feedback per call
                backoff_factor=1,
                status_forcelist=[408, 429, 500, 502, 503, 504],
                allowed_methods=["POST"],
                respect_retry_after_header=True
            )
        )
        local_session.mount('https://', adapter)

        try:
            # Removed: if hasattr(g, 'cancel_translation') and g.cancel_translation: return None
            # Cancellation is primarily handled by X-Cancel-Translation header check before task submission in routes.py
            # and task timeout via future.result(timeout=...).
            
            logger.debug(f"Calling DeepSeek API for {to_lang_name}. URL: {self.api_base_url}/chat/completions. Timeout: (20, 75)")
            response = local_session.post(f"{self.api_base_url}/chat/completions", headers=headers, json=data, timeout=(20, 75)) # Connect, Read timeouts
            
            logger.info(f"DeepSeek API response for {to_lang_name}. Status: {response.status_code}. Raw Response Text (first 500 chars): {response.text[:500]}")

            if response.status_code != 200:
                logger.error(f"DeepSeek API Error ({to_lang_name}): {response.status_code} - {response.text[:200]}") # Log more of error if not 200
                return None
            
            try:
                response_data = response.json()
            except ValueError as json_e: # Handle cases where response is not valid JSON
                logger.error(f"Failed to parse DeepSeek API response as JSON for {to_lang_name}. Error: {str(json_e)}. Response text: {response.text[:500]}")
                return None

            if not response_data.get("choices") or not response_data["choices"][0].get("message", {}).get("content"):
                logger.error(f"Invalid DeepSeek API response structure for {to_lang_name}. Full Response JSON: {json.dumps(response_data)}")
                return None
            
            translated_content = response_data["choices"][0]["message"]["content"].strip().replace('```', '')
            logger.info(f"Original len: {len(content)}, Translated len ({to_lang_name}): {len(translated_content)}. Sample: '{translated_content[:70]}...'")

            if not translated_content.strip():
                logger.warning(f"Translated content for {to_lang_name} is EMPTY. Original had {len(content)} chars.")
                # Consider this a failure for robustness, as empty translation is usually not desired.
                return None 
            if translated_content == content and len(content) > 50: # Heuristic for non-trivial content
                logger.warning(f"Translated content for {to_lang_name} is identical to original for non-trivial input.")
                # Potentially return None here if this is a strong indicator of failure for this API
                # For now, let it pass but log it clearly.

            return translated_content
        except requests.exceptions.Timeout as e:
            logger.error(f"DeepSeek API call timed out for {to_lang_name}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Exception during translate_content for {to_lang_name}: {str(e)}", exc_info=True)
            return None
        finally:
            local_session.close() # Ensure the local session is always closed
    
    def translate_post_fields(self, post_data, from_lang_code, to_lang_code):
        logger.info(f"-- Starting field translation for {to_lang_code} (via main translate_post_fields method) --")
        
        from_lang_name_resolved = from_lang_code # Default to code
        to_lang_name_resolved = to_lang_code   # Default to code
        try:
            from_lang_name_resolved = self.get_language_name(from_lang_code)
            to_lang_name_resolved = self.get_language_name(to_lang_code)
            logger.info(f"Resolved language names in translate_post_fields: {from_lang_name_resolved} -> {to_lang_name_resolved}")
        except Exception as e:
            logger.error(f"Failed to resolve language names in translate_post_fields for {from_lang_code} -> {to_lang_code}. Error: {str(e)}", exc_info=True)
            logger.warning(f"Using language codes as names for translation due to resolution failure: {from_lang_name_resolved} -> {to_lang_name_resolved}")

        # Only check 'g' if we are in a request context
        if has_request_context():
            if (hasattr(g, 'cancel_translation') and g.cancel_translation) or \
               (hasattr(g, 'translation_timeout') and g.translation_timeout):
                logger.warning(f"Translation for {to_lang_code} aborted/timed out based on 'g' flags before calling _with_lang_names variant.")
                return None
        else:
            logger.debug(f"Not in a request context. Skipping 'g' object checks in translate_post_fields for {to_lang_code}.")

        return self.translate_post_fields_with_lang_names(post_data, from_lang_code, to_lang_code, from_lang_name_resolved, to_lang_name_resolved)

    def translate_post_fields_with_lang_names(self, post_data, from_lang_code, to_lang_code, from_lang_name, to_lang_name):
        """Alternative version of translate_post_fields that accepts language names directly to avoid DB lookups"""
        logger.info(f"-- Starting field translation using explicit lang names: {from_lang_name} to {to_lang_name} --")
        translated_fields = {}
        
        # Removed: Early cancellation check using 'g' object as it's not reliable in worker threads without context
        # if hasattr(g, 'cancel_translation') and g.cancel_translation:
        #     logger.warning(f"Translation for {to_lang_code} aborted before starting fields.")
        #     return None

        # Title (Critical)
        title_orig = post_data.get('title', '')
        logger.info(f"Translating TITLE for {to_lang_code}...")
        translated_title = self.translate_content_with_names(title_orig, from_lang_code, to_lang_code, from_lang_name, to_lang_name)
        if translated_title is None:
            logger.error(f"CRITICAL: Title translation FAILED for {to_lang_code}.")
            return None # If title fails, the whole translation for this language fails
        translated_fields['title'] = translated_title
        logger.info(f"Title for {to_lang_code} translated successfully.")

        # Removed: Cancellation check after title using 'g' object
        # if hasattr(g, 'cancel_translation') and g.cancel_translation:
        #    logger.warning(f"Translation for {to_lang_code} aborted after title.")
        #    return None 

        # Content (Critical)
        content_orig = post_data.get('content', '')
        logger.info(f"Translating CONTENT for {to_lang_code}...")
        translated_content = self.translate_content_with_names(content_orig, from_lang_code, to_lang_code, from_lang_name, to_lang_name)
        if translated_content is None:
            logger.error(f"CRITICAL: Main content translation FAILED for {to_lang_code}.")
            return None # If main content fails, the whole translation for this language fails
        translated_fields['content'] = translated_content
        logger.info(f"Content for {to_lang_code} translated successfully.")

        # Removed: Cancellation check after content using 'g' object
        # if hasattr(g, 'cancel_translation') and g.cancel_translation:
        #    logger.warning(f"Translation for {to_lang_code} aborted after content.")
        #    return None

        # Meta Title (Less critical, try to translate, use placeholder or derived if fails)
        meta_title_orig = post_data.get('meta_title', '')
        if meta_title_orig:
            logger.info(f"Translating META_TITLE for {to_lang_code}...")
            translated_meta_title = self.translate_content_with_names(meta_title_orig, from_lang_code, to_lang_code, from_lang_name, to_lang_name)
            if translated_meta_title is not None:
                translated_fields['meta_title'] = translated_meta_title
            else:
                logger.warning(f"Meta title translation failed for {to_lang_code}. Using placeholder based on translated title.")
                translated_fields['meta_title'] = f"[{to_lang_name}] {translated_title}" # Use direct lang name
        elif translated_title: # If original meta_title is empty, use the (already translated) main title as base for placeholder
             translated_fields['meta_title'] = f"[{to_lang_name}] {translated_title}" # Use direct lang name
        else: # Should not happen if title translation is critical
            translated_fields['meta_title'] = ""

        # Meta Description (Less critical)
        meta_description_orig = post_data.get('meta_description', '')
        if meta_description_orig:
            logger.info(f"Translating META_DESC for {to_lang_code}...")
            translated_meta_description = self.translate_content_with_names(meta_description_orig, from_lang_code, to_lang_code, from_lang_name, to_lang_name)
            if translated_meta_description is not None:
                translated_fields['meta_description'] = translated_meta_description
            else:
                logger.warning(f"Meta description translation failed for {to_lang_code}. Using placeholder.")
                translated_fields['meta_description'] = f"[{to_lang_name}] {meta_description_orig}" # Use direct lang name
        else: # If original meta_description is empty, try to generate a simple one from translated content
            logger.info(f"Original meta_description for {to_lang_code} is empty. Attempting to generate from content.")
            if translated_content:
                # Basic plain text conversion and excerpt
                temp_div = f"<div>{translated_content}</div>" # Wrap in div for basic parsing if needed
                # A more robust HTML to text might be good here if issues persist
                plain_text_content = temp_div.replace('</p>', ' </p>').replace('<br>', ' ').replace('<br/>', ' ')
                import re
                plain_text_content = re.sub('<[^<]+?>', '', plain_text_content) # Strip tags
                excerpt = (plain_text_content.strip()[:155] + '...') if len(plain_text_content.strip()) > 155 else plain_text_content.strip()
                translated_fields['meta_description'] = excerpt
                logger.info(f"Generated meta_description for {to_lang_code}: '{excerpt[:50]}...'")
            else:
                translated_fields['meta_description'] = ''

        translated_fields['meta_keywords'] = post_data.get('meta_keywords', '')
        logger.info(f"-- Field translation for {to_lang_code} completed successfully with explicit lang names. --")
        return translated_fields

    def _create_placeholder_translation(self, content, from_lang_code, to_lang_code):
        to_lang_name = self.get_language_name(to_lang_code)
        return f"[{to_lang_name}] {content}"

    def _create_placeholder_post_fields(self, post_data, from_lang_code, to_lang_code):
        to_lang_name = self.get_language_name(to_lang_code)
        return {
            'title': f"[{to_lang_name}] {post_data.get('title', '')}",
            'content': f"[{to_lang_name}] {post_data.get('content', '')}",
            'meta_title': f"[{to_lang_name}] {post_data.get('meta_title', '')}",
            'meta_description': f"[{to_lang_name}] {post_data.get('meta_description', '')}",
            'meta_keywords': post_data.get('meta_keywords', '')
        }


# Create a singleton instance for import
translation_service = TranslationService()