"""
AI Content Generation for CMS
This module provides functions to generate blog content using OpenAI's GPT.
"""

import os
import openai
from flask import current_app

# Configure OpenAI
openai_api_key = os.environ.get('OPENAI_API_KEY')
if not openai_api_key:
    print("WARNING: OPENAI_API_KEY environment variable not set. AI content generation will not work.")

def openai_client():
    """Return an OpenAI client instance"""
    # Return None if API key is not set
    if not openai_api_key:
        return None
        
    try:
        return openai.OpenAI(api_key=openai_api_key)
    except Exception as e:
        current_app.logger.error(f"Failed to initialize OpenAI client: {e}")
        return None

def generate_blog_content(title, language="en", length="medium"):
    """
    Generate blog content based on a title
    
    Args:
        title (str): The blog post title
        language (str): Language code (e.g., 'en', 'fr')
        length (str): 'short', 'medium', or 'long'
    
    Returns:
        dict: The generated content or error message
    """
    client = openai_client()
    if not client:
        return {"error": "OpenAI API key not configured"}
    
    # Set content length based on parameter
    word_counts = {
        "short": "300-500",
        "medium": "800-1200",
        "long": "1500-2000"
    }
    word_count = word_counts.get(length, "800-1200")
    
    # Language-specific instructions
    lang_instructions = {
        "en": f"Write a professional blog post in English with the title '{title}'. It should be {word_count} words long, well-structured with headings, and engaging for readers.",
        "fr": f"Écrivez un article de blog professionnel en français avec le titre '{title}'. Il devrait comporter {word_count} mots, être bien structuré avec des titres, et engageant pour les lecteurs.",
        "es": f"Escribe una publicación de blog profesional en español con el título '{title}'. Debe tener {word_count} palabras, estar bien estructurado con encabezados y ser atractivo para los lectores.",
        "de": f"Schreiben Sie einen professionellen Blogeintrag auf Deutsch mit dem Titel '{title}'. Er sollte {word_count} Wörter lang sein, gut strukturiert mit Überschriften und ansprechend für die Leser.",
        # Add more languages as needed
    }
    
    # Use English as fallback for other languages
    prompt = lang_instructions.get(language, lang_instructions["en"])
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages=[
                {"role": "system", "content": "You are a professional content writer specializing in creating engaging, informative blog posts with proper HTML formatting. Include h2 and h3 headings, paragraphs, and occasionally lists or emphasis where appropriate."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        return {
            "success": True,
            "content": generated_content,
            "language": language,
            "title": title
        }
        
    except Exception as e:
        current_app.logger.error(f"OpenAI API error: {e}")
        return {
            "success": False,
            "error": str(e)
        }