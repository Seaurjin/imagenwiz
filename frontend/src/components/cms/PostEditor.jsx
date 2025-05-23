import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save,
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Globe, 
  Tag as TagIcon,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Languages,
  Sparkles
} from 'lucide-react';
import { 
  getPost, 
  createPost, 
  updatePost, 
  getTags, 
  getLanguages, 
  uploadMedia,
  getPostMedia,
  deleteTranslation,
  generateAIContent,
  getWebsiteLanguages,
  getAuthToken // Corrected import name
} from '../../lib/cms-service';
import TranslationModal from './TranslationModal';

// Simplified HTML Editor component that is more reliable for displaying and editing content
const SimpleHtmlEditor = ({ value, onChange, languageCode }) => {
  // Use expanded RTL check for all RTL languages
  const isRTL = ['ar', 'he', 'ur', 'fa'].includes(languageCode);
  
  // Process value to ensure it displays correctly
  let processedValue = value;
  
  // If value is null or undefined, use empty string
  if (processedValue === null || processedValue === undefined) {
    processedValue = '';
  }
  
  // If value appears to be HTML encoded (like &lt;p&gt;), decode it
  if (typeof processedValue === 'string' && (processedValue.includes('&lt;') || processedValue.includes('&gt;'))) {
    try {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = processedValue;
      processedValue = tempElement.textContent;
    } catch (e) {
      console.warn('Failed to decode HTML entities, using original content', e);
    }
  }
  
  // For debugging purposes to see what we're getting
  console.log('SimpleHtmlEditor received value:', {
    type: typeof value,
    original: value ? value.substring(0, 200) : null, // First 200 chars
    processed: processedValue ? processedValue.substring(0, 200) : null, // First 200 chars
    empty: !processedValue || processedValue.trim() === ''
  });
  
  // We do NOT need to process the HTML content for editing
  // In an HTML editor, we want to show the raw HTML tags as text
  // This ensures HTML tags are properly displayed as plain text in the editor
  
  // Show a warning if content appears to be empty
  const contentIsEmpty = !processedValue || processedValue.trim() === '';
  
  // Only show formatting toolbar if we actually have content
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Simple toolbar with basic formatting buttons */}
      <div className="bg-gray-100 p-2 border-b border-gray-300" style={{direction: 'ltr'}} dir="ltr">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => {
                const textarea = document.getElementById('content-textarea');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selection = textarea.value.substring(start, end);
                const replacement = `<strong>${selection}</strong>`;
                const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                onChange(newValue);
                
                // Set cursor position after the change
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = start + replacement.length;
                  textarea.selectionEnd = start + replacement.length;
                }, 0);
              }}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => {
                const textarea = document.getElementById('content-textarea');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selection = textarea.value.substring(start, end);
                const replacement = `<em>${selection}</em>`;
                const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                onChange(newValue);
                
                // Set cursor position after the change
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = start + replacement.length;
                  textarea.selectionEnd = start + replacement.length;
                }, 0);
              }}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => {
                const textarea = document.getElementById('content-textarea');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selection = textarea.value.substring(start, end);
                const replacement = `<h2>${selection || 'Heading'}</h2>`;
                const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                onChange(newValue);
                
                // Set cursor position after the change
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = start + replacement.length;
                  textarea.selectionEnd = start + replacement.length;
                }, 0);
              }}
            >
              H2
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => {
                const textarea = document.getElementById('content-textarea');
                const start = textarea.selectionStart;
                const content = `<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>`;
                const newValue = textarea.value.substring(0, start) + content + textarea.value.substring(start);
                onChange(newValue);
                
                // Set cursor position after the change
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = start + content.length;
                  textarea.selectionEnd = start + content.length;
                }, 0);
              }}
            >
              List
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            HTML formatting allowed
          </div>
        </div>
      </div>
      
      {/* Warning for empty content */}
      {contentIsEmpty && (
        <div className="bg-yellow-50 p-4 border-b border-yellow-200">
          <p className="text-yellow-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Empty content detected. Please add some content or use Auto Translate.
          </p>
          <p className="text-sm text-yellow-600 ml-7 mt-1">
            You may need to select another language to view existing translations.
          </p>
        </div>
      )}
      
      {/* Simple textarea for editing HTML directly */}
      <textarea
        id="content-textarea"
        value={processedValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 min-h-[400px] font-mono text-sm"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
        }}
      />
      
      {/* Preview section */}
      {!contentIsEmpty && (
        <div className="border-t border-gray-300">
          <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            Preview
          </div>
          <div 
            className="p-4 prose max-w-none"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
              direction: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}
            dangerouslySetInnerHTML={{ __html: processedValue }}
          />
        </div>
      )}
    </div>
  );
};

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // isLoading is for general page loading, isSaving for the save button
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);
  const [media, setMedia] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  // isTranslating is specifically for the translation process
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAIContent, setIsGeneratingAIContent] = useState(false);
  const [abortController, setAbortController] = useState(null);
  
  // Helper function to check if a language is RTL
  const isRTL = (langCode) => ['ar', 'he', 'ur', 'fa'].includes(langCode);
  
  // Function to handle AI content generation
  const handleGenerateAIContent = async () => {
    if (!formData.title || formData.title.trim() === '') {
      setError("Please provide a title before generating AI content");
      return;
    }
    
    setIsGeneratingAIContent(true);
    setError(null);
    
    try {
      console.log(`Generating AI content for title: "${formData.title}" in language: ${formData.language_code}`);
      // Call the API to generate content
      const response = await generateAIContent(
        formData.title, 
        formData.language_code, 
        'medium' // Default to medium length content
      );
      
      console.log('AI content generation response:', response);
      
      if (response.success && response.content) {
        // Update form data with the generated content
        setFormData({
          ...formData,
          content: response.content
        });
        
        // Show success message
        setSuccess("AI content successfully generated!");
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error generating AI content:', err);
      setError(`AI content generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingAIContent(false);
    }
  };
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    status: 'draft',
    language_code: 'en',
    tag_ids: []
  });
  
  const [translations, setTranslations] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch languages, website languages, and tags
        const [languagesData, websiteLanguagesData, tagsData] = await Promise.all([
          getLanguages(),
          getWebsiteLanguages(), // Use the website languages
          getTags()
        ]);
        
        console.log('Loaded languages data:', languagesData);
        console.log('Loaded website languages data:', websiteLanguagesData);
        
        // Get the website language codes to filter CMS languages
        const websiteLanguageCodes = websiteLanguagesData
          .filter(lang => lang.is_active)
          .map(lang => lang.code);
        
        console.log('Website language codes:', websiteLanguageCodes);
        
        // Filter to only active languages that are also in the website languages list
        const filteredLanguages = Array.isArray(languagesData) 
          ? languagesData.filter(lang => lang.is_active && websiteLanguageCodes.includes(lang.code))
          : (languagesData.languages || []).filter(lang => lang.is_active && websiteLanguageCodes.includes(lang.code));
        
        console.log('Filtered to active website languages:', filteredLanguages.length);
        setLanguages(filteredLanguages);
        setTags(tagsData.tags || []);
        
        // If we're editing an existing post, fetch it
        if (id) {
          try {
            // Fetch the post with language=en to get a specific translation (prevents empty content)
            const postData = await getPost(id, 'en');
            const mediaData = await getPostMedia(id);
            
            console.log('DEBUG - Fetched post data:', JSON.stringify(postData, null, 2));
            
            // API can return data in multiple formats - handle both direct and nested responses
            const postObject = postData.post || postData;
            
            // Initialize form data with post details
            let translationData = {};
            
            // Check for translation data in various formats
            if (postData.translation) {
              console.log('Using single translation data:', postData.translation);
              translationData = postData.translation;
            } else if (postData.translations && postData.translations.length > 0) {
              console.log('Using first of multiple translations:', postData.translations[0]);
              translationData = postData.translations[0];
            } else if (postObject.translation) {
              console.log('Using translation from post object:', postObject.translation);
              translationData = postObject.translation;
            } else if (postObject.translations && postObject.translations.length > 0) {
              console.log('Using first translation from post object:', postObject.translations[0]);
              translationData = postObject.translations[0];
            }
            
            // If no translation data was found, show an error
            if (!translationData || Object.keys(translationData).length === 0) {
              console.error('No translation data found in API response:', postData);
              setError('Could not find any translation data in the response');
              return;
            }
            
            console.log('CRITICAL DEBUG - Translation data found:', JSON.stringify(translationData, null, 2));
            console.log('CRITICAL DEBUG - Content length:', translationData.content ? translationData.content.length : 0);
            console.log('CRITICAL DEBUG - Content value:', translationData.content);
            
            // If content seems to be missing but we have translation data, log a more detailed warning
            if ((!translationData.content || translationData.content.trim() === '') && Object.keys(translationData).length > 0) {
              console.warn('WARNING: Translation data found but content field is empty!', translationData);
              
              // Try to check if we have other translations with content
              if (postData.translations && postData.translations.length > 0) {
                const enTranslation = postData.translations.find(t => t.language_code === 'en');
                if (enTranslation && enTranslation.content) {
                  console.log('Found English translation with content, using it instead.');
                  translationData = enTranslation;
                }
              }
            }
            
            // Set form data with the post object and translation data
            // Process the content field to detect empty strings and fix any encoding/escaping issues
            let processedContent = '';
            if (translationData.content) {
              // Ensure we have proper content handling
              processedContent = translationData.content;
              console.log('Raw content from API:', processedContent);
              
              // If the content appears to be JSON escaped, unescape it
              if (typeof processedContent === 'string' && processedContent.includes('\\n')) {
                try {
                  // Try to normalize the content by parsing and restringifying if it looks like escaped JSON
                  const normalizedContent = JSON.parse(`"${processedContent.replace(/"/g, '\\"')}"`);
                  if (normalizedContent && typeof normalizedContent === 'string') {
                    processedContent = normalizedContent;
                    console.log('Unescaped content:', processedContent);
                  }
                } catch (e) {
                  console.warn('Content normalization failed, using original content', e);
                }
              }
              
              // If content is a string but looks like it's HTML-encoded, decode it
              if (typeof processedContent === 'string' && processedContent.includes('&lt;')) {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = processedContent;
                processedContent = tempElement.textContent;
                console.log('HTML-decoded content:', processedContent);
              }
            } else {
              // If content is completely missing, show an explicit message
              console.warn('Setting default content as content field is completely missing');
              processedContent = '<p>Content field was empty. Please add content or try selecting a different language.</p>';
            }
            
            console.log('CONTENT FIELD:', {
              raw: translationData.content,
              processed: processedContent,
              length: processedContent.length,
              isEmpty: processedContent.trim() === ''
            });
            
            setFormData({
              title: translationData.title || '',
              slug: postObject.slug || '',
              content: processedContent,
              excerpt: translationData.excerpt || '',
              meta_title: translationData.meta_title || '',
              meta_description: translationData.meta_description || '',
              featured_image: postObject.featured_image || '',
              status: postObject.status || 'draft',
              language_code: translationData.language_code || 'en',
              tag_ids: (postObject.tags || []).map(tag => tag.id)
            });
            
            // Set translations
            if (postData.translations) {
              console.log('Setting translations from direct response:', postData.translations);
              setTranslations(postData.translations);
            } else if (postObject.translations) {
              console.log('Setting translations from post object:', postObject.translations);
              setTranslations(postObject.translations);
            } else {
              console.log('No translations found, setting empty array');
              setTranslations([]);
            }
            
            // Set media
            if (mediaData && mediaData.media) {
              setMedia(mediaData.media);
            }
          } catch (postError) {
            console.error('Error fetching post data:', postError);
            setError('Failed to load post data. Please try again.');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      // Only auto-generate slug if it's empty or matches previous auto-generated slug
      slug: formData.slug === generateSlug(formData.title) 
        ? generateSlug(newTitle)
        : formData.slug
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for language_code changes
    if (name === 'language_code') {
      // When changing language in edit mode, fetch that language's content
      if (id) {
        console.log(`Language changed to ${value}, fetching translation`);
        
        // Always fetch fresh translation data from the API to ensure we have the latest content
        getPost(id, value)
          .then(postData => {
            console.log('Fetched translation data for language change:', postData);
            
            // Get translation data
            const postObject = postData.post || postData;
            const translationData = postData.translation || (postObject && postObject.translation);
            
            // Also update our local translations array if available
            if (postData.translations) {
              setTranslations(postData.translations);
            } else if (postObject && postObject.translations) {
              setTranslations(postObject.translations);
            }
            
            // CRITICAL FALLBACK DETECTION - Detect when backend returns English content instead of requested language
            // Check three key conditions:
            // 1. Is this explicitly flagged as a fallback translation (is_fallback=true)?
            // 2. Is the language code different from what we requested (e.g., got 'en' when requested 'de')?
            // 3. Does this translation have the is_requested_language=false flag set?
            // ANY of these conditions means we're getting English content as a fallback!
            const isFallback = translationData && (
              translationData.is_fallback === true || 
              translationData.language_code !== value ||
              translationData.is_requested_language === false
            );
            
            // Add extra logging to debug translation fallback detection 
            console.log(`TRANSLATION FALLBACK CHECK FOR ${value}:`, {
              requestedLanguage: value,
              receivedLanguage: translationData?.language_code || 'none',
              isFallback: isFallback,
              fallbackDetectionDetails: translationData ? {
                is_fallback_flag: translationData.is_fallback === true,
                language_mismatch: translationData.language_code !== value,
                not_requested_language: translationData.is_requested_language === false,
              } : 'No translation data'
            });
            
            console.log('Translation check:', {
              requestedLanguage: value,
              receivedLanguage: translationData?.language_code,
              isFallback: isFallback,
              hasFallbackFlag: translationData?.is_fallback,
              isRequestedLanguage: translationData?.is_requested_language
            });
            
            if (isFallback || !translationData) {
              // This is either:
              // - A fallback translation returning English
              // - The translation doesn't exist yet
              // In both cases, show empty fields for a new translation
              console.log('Creating new translation UI for language:', value);
              
              setFormData({
                ...formData,
                language_code: value,
                title: '',
                content: '',
                meta_title: '',
                meta_description: ''
              });
              
              // Show a message that we're creating a new translation
              setError(null); 
              setSuccess(`Creating new translation for ${value}`);
              
              // Clear success message after 3 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            } else {
              // We have a real translation in the requested language, process it
              console.log('Using translation data:', translationData);
              
              // Process content to handle any HTML encoding issues
              let processedContent = translationData.content || '';
              if (typeof processedContent === 'string' && processedContent.includes('&lt;')) {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = processedContent;
                processedContent = tempElement.textContent || tempElement.innerHTML;
              }
              
              // Set form data with the translation
              setFormData({
                ...formData,
                language_code: value,
                title: translationData.title || '',
                content: processedContent,
                meta_title: translationData.meta_title || '',
                meta_description: translationData.meta_description || ''
              });
              
              // Success message
              setError(null);
              setSuccess(`Loaded ${value} translation successfully`);
              
              // Clear success message after 3 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            }
          })
          .catch(err => {
            console.error('Error fetching translation:', err);
            // On error, still update the language but show a notification
            setFormData({
              ...formData,
              language_code: value
            });
            setError(`Failed to load ${value} translation. Please try again.`);
          });
      } else {
        // For new posts, just change the language code
        setFormData({
          ...formData,
          language_code: value
        });
      }
      
      // Apply a slight delay to allow React to update the DOM before resetting direction
      setTimeout(() => {
        // Force re-evaluation of text direction for all inputs
        const inputs = document.querySelectorAll('input[dir], textarea[dir]');
        inputs.forEach(input => {
          // Skip slug field which should always be LTR
          if (input.id === 'slug') return;
          
          // Use our helper function to check RTL
          const rtl = isRTL(value);
          input.dir = rtl ? 'rtl' : 'ltr';
          input.style.direction = rtl ? 'rtl' : 'ltr';
          input.style.textAlign = rtl ? 'right' : 'left';
        });
      }, 50);
    } else {
      // For all other inputs, simply update the value
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedTags = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedTags.push(parseInt(options[i].value));
      }
    }
    
    setFormData({
      ...formData,
      tag_ids: selectedTags
    });
  };
  
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('Selected file:', file.name, 'type:', file.type, 'size:', file.size);
    setIsLoading(true);
    
    // Create FormData object for API upload
    const mediaFormData = new FormData();
    mediaFormData.append('file', file);
    
    try {
      // For new posts, create a temporary local media object
      if (!id) {
        console.log('Creating temporary media for new post');
        const tempUrl = URL.createObjectURL(file);
        const tempMedia = {
          id: `temp-${Date.now()}`, // Temporary ID for React keys
          file_path: tempUrl,
          url: tempUrl,
          alt_text: file.name,
          is_temp: true // Flag to identify temporary uploads
        };
        
        console.log('Added temporary media:', tempMedia);
        setMedia([...media, tempMedia]);
        
        // Always set as featured image for direct uploads in new posts
        console.log('Setting as featured image:', tempUrl);
        setFeaturedImage(tempUrl);
        
        // Highlight media library section
        setTimeout(() => {
          const mediaLibrary = document.getElementById('media-library');
          if (mediaLibrary) {
            mediaLibrary.classList.add('ring-2', 'ring-teal-500');
            setTimeout(() => {
              mediaLibrary.classList.remove('ring-2', 'ring-teal-500');
            }, 2000);
          }
        }, 500);
        
        setSuccess('Media added and set as featured image');
      } else {
        // For existing posts, upload media to the server
        console.log('Uploading media for post ID:', id);
        const response = await uploadMedia(id, mediaFormData);
        
        console.log('Upload response:', response);
        
        if (response && response.media) {
          // Add the new media to the existing media array
          const newMedia = response.media;
          console.log('New media added:', newMedia);
          setMedia([...media, newMedia]);
          
          // Always set as featured image for direct uploads
          if (newMedia.file_path) {
            console.log('Setting as featured image:', newMedia.file_path);
            setFeaturedImage(newMedia.file_path);
          }
          
          // Highlight media library section
          setTimeout(() => {
            const mediaLibrary = document.getElementById('media-library');
            if (mediaLibrary) {
              mediaLibrary.classList.add('ring-2', 'ring-teal-500');
              setTimeout(() => {
                mediaLibrary.classList.remove('ring-2', 'ring-teal-500');
              }, 2000);
            }
          }, 500);
          
          setSuccess('Media uploaded and set as featured image');
        } else {
          console.error('Invalid response format:', response);
          setError('Invalid server response. Media data missing.');
        }
      }
      
      // Scroll to show the media library with newly added image
      setTimeout(() => {
        const mediaLibrary = document.getElementById('media-library');
        if (mediaLibrary) {
          mediaLibrary.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      
      // Clear file input to allow reselecting the same file
      e.target.value = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error uploading media:', err);
      setError(`Failed to upload media: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Format data to match backend expectations
      const postData = {
        slug: formData.slug,
        featured_image: formData.featured_image,
        status: formData.status,
        tags: formData.tag_ids, // Backend expects 'tags' not 'tag_ids'
        // Add translations as expected by the backend
        translations: [{
          language_code: formData.language_code,
          title: formData.title,
          content: formData.content,
          meta_title: formData.meta_title || formData.title,
          meta_description: formData.meta_description || formData.excerpt,
        }]
      };
      
      console.log('Submitting post data:', JSON.stringify(postData));
      
      if (id) {
        // Update existing post
        await updatePost(id, postData);
        setSuccess('Post updated successfully!');
      } else {
        // Create new post
        const response = await createPost(postData);
        setSuccess('Post created successfully!');
        
        // Redirect to edit page if we just created a new post
        const newPostId = response.id || (response.post && response.post.id);
        if (newPostId) {
          navigate(`/cms/posts/${newPostId}/edit`);
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTranslation = async (languageCode) => {
    try {
      await deleteTranslation(id, languageCode);
      
      // Update translations list
      setTranslations(translations.filter(t => t.language_code !== languageCode));
      setSuccess(`Translation in ${languageCode} deleted successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting translation:', err);
      setError('Failed to delete translation. Please try again.');
    }
  };
  
  // Handle translation cancellation
  const handleCancelTranslation = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsTranslating(false);
      setError('Translation cancelled by user.');
      setSuccess(null); // Clear any success message
      setTimeout(() => setError(null), 5000);
    }
  };

  // The only translation handler
  const handleAutoTranslate = async (targetLanguages = []) => {
    if (!id) {
      setError('You must save the post before it can be auto-translated. Please save first.');
      setSuccess(null);
      return;
    }
    
    // Ensure targetLanguages is always an array
    const languagesToProcess = Array.isArray(targetLanguages) ? targetLanguages : [];

    if (languagesToProcess.length === 0) {
      setError('No languages were selected for translation.');
      setSuccess(null);
      setIsTranslating(false); // Ensure loading state is reset
      return;
    }

    setIsTranslating(true);
    setError(null);
    setSuccess(null);

    let cumulativeSuccessCount = 0;
    let cumulativeFailedCount = 0;
    let cumulativeSkippedCount = 0;
    const controller = new AbortController();
    setAbortController(controller);

    try {
      setSuccess(`Starting translation for ${languagesToProcess.length} language(s)...`);
      
      const BATCH_SIZE = 5;
      const batches = [];
      for (let i = 0; i < languagesToProcess.length; i += BATCH_SIZE) {
        batches.push(languagesToProcess.slice(i, i + BATCH_SIZE));
      }

      console.log(`Processing translations in ${batches.length} batch(es) for ${languagesToProcess.length} language(s).`);

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        if (controller.signal.aborted) {
          throw new Error('Translation cancelled by user.');
        }
        
        // Clear previous batch error before showing new batch success
        setError(null);
        setSuccess(`Processing batch ${i + 1} of ${batches.length} (Languages: ${batch.join(', ')})...`);
        
        try {
          const token = getAuthToken(); // Corrected function call
          if (!token) throw new Error('Authentication token not found. Please log in again.');
          
          const response = await fetch(`/api/cms/posts/${id}/auto-translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ target_languages: batch }),
            signal: controller.signal
          });

          if (controller.signal.aborted) throw new Error('Translation cancelled by user.');

          const resultText = await response.text(); // Get raw response text for better debugging
          let result;
          try {
            result = JSON.parse(resultText);
          } catch (e) {
            console.error('Failed to parse JSON response:', resultText);
            throw new Error(`Server returned non-JSON response (status ${response.status}). Check console for details.`);
          }

          if (!response.ok) {
            console.error(`Batch ${i+1} API error:`, response.status, result);
            throw new Error(result.error || result.message || `Batch ${i+1} failed with status: ${response.status}`);
          }

          console.log(`Batch ${i + 1} response:`, result);

          if (result.translations) {
            cumulativeSuccessCount += (result.translations.successful || []).length;
            cumulativeFailedCount += (result.translations.failed || []).length;
            cumulativeSkippedCount += (result.translations.skipped || []).length;
          } else {
            // If translations key is missing, assume failure for the batch for safety
            console.warn('Translations key missing in batch response:', result);
            cumulativeFailedCount += batch.length; 
          }
          // Update success message after each batch, clear any lingering error
          setError(null);
          setSuccess(`Batch ${i + 1} processed. Overall: ${cumulativeSuccessCount} successful, ${cumulativeFailedCount} failed, ${cumulativeSkippedCount} skipped.`);
        
        } catch (batchError) {
          if (batchError.name === 'AbortError') throw batchError; // Re-throw to outer catch
          
          console.error(`Error processing batch ${i + 1}:`, batchError);
          cumulativeFailedCount += batch.length; // Assume all in batch failed if the batch itself errors
          // Set error message, clear success message
          setSuccess(null);
          setError(`Error in batch ${i + 1}: ${batchError.message}. Trying next batch if any.`);
          // No automatic retry for batch, allow loop to continue if there are more batches
        }
        
        if (i < batches.length - 1 && !controller.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between batches
        }
      }

      // After all batches attempted, refresh post data regardless of outcome to get latest state
      try {
        const postData = await getPost(id); 
        if (postData && postData.translations) {
          setTranslations(postData.translations);
        }
      } catch (fetchPostError) {
        console.error('Failed to refresh post data after translation attempt:', fetchPostError);
        // Don't let this obscure the translation result, but log it.
      }

      // Final status message logic
      if (cumulativeFailedCount > 0 && cumulativeSuccessCount === 0) {
        setSuccess(null);
        setError(`Translation failed for all ${cumulativeFailedCount} attempted language(s). ${cumulativeSkippedCount > 0 ? `${cumulativeSkippedCount} language(s) were skipped.` : ''}`);
      } else if (cumulativeFailedCount > 0) {
        setError(null); // Clear previous batch error
        setSuccess(`Translation partially completed: ${cumulativeSuccessCount} successful, ${cumulativeFailedCount} failed. ${cumulativeSkippedCount > 0 ? `${cumulativeSkippedCount} skipped.` : ''}`);
      } else if (cumulativeSuccessCount > 0) {
        setError(null); // Clear previous batch error
        setSuccess(`Translation successful! ${cumulativeSuccessCount} language(s) translated. ${cumulativeSkippedCount > 0 ? `${cumulativeSkippedCount} skipped.` : ''}`);
      } else if (cumulativeSkippedCount > 0 && cumulativeSuccessCount === 0 && cumulativeFailedCount === 0) {
        setError(null); // Clear previous batch error
        setSuccess(`No new translations created. ${cumulativeSkippedCount} language(s) were already up-to-date or skipped.`);
      } else if (languagesToProcess.length > 0 && cumulativeSuccessCount === 0 && cumulativeFailedCount === 0 && cumulativeSkippedCount === 0) {
        // This case means languages were processed, but API reported no success, fail, or skip for any
        setSuccess(null);
        setError(`Translation attempt finished for ${languagesToProcess.length} language(s), but no specific results (success/fail/skip) were reported by the server. Please check the content.`);
      } else if (languagesToProcess.length === 0) {
        // This case should have been caught at the beginning, but as a safeguard:
        setError(null); 
        setSuccess('No languages were selected for translation.');
      } else {
        // This should ideally not be reached if languagesToProcess.length > 0 at the start
        // But as a fallback if all counts are zero for some reason:
        setError(null);
        setSuccess('Translation process finished. No specific results returned.');
      }
      
      // Auto-clear success messages after a delay, but not error messages
      if (success && !error) { // Only if there is a success message and no current error
         setTimeout(() => setSuccess(null), 10000);
      }

    } catch (err) {
      setSuccess(null); // Clear any partial success message
      if (err.name === 'AbortError' || err.message.includes('Translation cancelled')) {
        setError('Translation cancelled by user.');
      } else {
        setError(`Translation process failed: ${err.message || 'Unknown error'}`);
      }
      console.error('Overall error in auto-translating post:', err);
    } finally {
      setAbortController(null);
      setIsTranslating(false);
      setIsTranslateModalOpen(false); // UX Improvement: Close modal on completion
    }
  };
  
  const setFeaturedImage = (url) => {
    console.log('Setting featured image via function to:', url);
    const updatedFormData = {
      ...formData,
      featured_image: url
    };
    setFormData(updatedFormData);
    console.log('Updated form data with featured image:', updatedFormData);
    
    // Show success message for feedback
    setSuccess(url ? 'Featured image set successfully!' : 'Featured image removed');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-teal-500 border-r-teal-500 border-b-transparent border-l-transparent"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/cms/posts')}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Posts
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>
        <div className="flex space-x-2">
          {/* Only show translate button if post exists and has English content */}
          {id && formData.language_code === 'en' && (
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded border ${
                isTranslating 
                  ? 'border-gray-400 text-gray-500 bg-gray-200 cursor-not-allowed' 
                  : 'border-teal-500 text-teal-600 hover:bg-teal-50'
              }`}
              onClick={() => setIsTranslateModalOpen(true)}
              disabled={isTranslating || isSaving || !formData.language_code || formData.language_code !== 'en'}
              title={formData.language_code !== 'en' ? "Translations are based on English content. Please switch to English to translate." : "Translate content"}
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full"></div>
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </>
              )}
            </button>
          )}
          
          <button
            type="button"
            className={`flex items-center px-4 py-2 rounded ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content section */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                dir={isRTL(formData.language_code) ? 'rtl' : 'ltr'}
                style={{
                  direction: isRTL(formData.language_code) ? 'rtl' : 'ltr',
                  textAlign: isRTL(formData.language_code) ? 'right' : 'left'
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  type="button"
                  className={`px-3 py-1 text-sm flex items-center gap-1 ${
                    isGeneratingAIContent
                      ? 'bg-indigo-100 text-indigo-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } rounded-md shadow-sm`}
                  onClick={handleGenerateAIContent}
                  disabled={isGeneratingAIContent || !formData.title}
                  title={!formData.title ? 'Please provide a title first' : 'Generate content with AI'}
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingAIContent ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <SimpleHtmlEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                languageCode={formData.language_code}
              />
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                dir={isRTL(formData.language_code) ? 'rtl' : 'ltr'}
                style={{
                  direction: isRTL(formData.language_code) ? 'rtl' : 'ltr',
                  textAlign: isRTL(formData.language_code) ? 'right' : 'left'
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          {/* Sidebar section */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Publishing Options</h3>
              
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language_code" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language_code"
                    name="language_code"
                    value={formData.language_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    {/* Show English first */}
                    <option value="en">🇬🇧 English</option>
                    <optgroup label="Other Languages">
                      {languages
                        .filter(lang => lang.code !== 'en')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((lang) => {
                          // Choose flag based on language code
                          let flag = '🌐';
                          // Common language flags
                          if (lang.code === 'es') flag = '🇪🇸';
                          if (lang.code === 'fr') flag = '🇫🇷';
                          if (lang.code === 'de') flag = '🇩🇪';
                          if (lang.code === 'it') flag = '🇮🇹';
                          if (lang.code === 'pt') flag = '🇵🇹';
                          if (lang.code === 'ru') flag = '🇷🇺';
                          if (lang.code === 'zh') flag = '🇨🇳';
                          if (lang.code === 'ja') flag = '🇯🇵';
                          if (lang.code === 'ar') flag = '🇸🇦';
                          if (lang.code === 'hi') flag = '🇮🇳';
                          if (lang.code === 'ko') flag = '🇰🇷';
                          
                          return (
                            <option key={lang.code} value={lang.code}>
                              {flag} {lang.name}
                            </option>
                          );
                        })
                      }
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Changing language will load content for that language if available
                </p>
                
                {/* Auto-translate button for new drafts */}
                {!id && formData.language_code === 'en' && (
                  <div className="mt-3 p-2 border border-teal-100 bg-teal-50 rounded">
                    <p className="text-xs text-teal-800 mb-2">
                      <strong>Creating content in English?</strong> Make sure to save your post first, 
                      then you can auto-translate it to all 21 other languages with one click.
                    </p>
                    <button
                      type="button"
                      className="w-full flex justify-center items-center text-xs bg-teal-100 text-teal-700 px-2 py-2 rounded hover:bg-teal-200 border border-teal-200"
                      onClick={handleSubmit}
                      disabled={isLoading || isSaving}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save first, then auto-translate
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Translations */}
            {id && translations.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-700">Translations</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Use the Translate button in the header to translate content to specific languages.
                  This will process translations based on the English content.
                </p>
                <ul className="space-y-2">
                  {translations.map((translation) => (
                    <li key={translation.language_code} className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        {translation.language_name}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-teal-600 hover:text-teal-800"
                          onClick={() => navigate(`/cms/posts/${id}/translate/${translation.language_code}`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setConfirmDelete(translation.language_code)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                Tags
              </h3>
              
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tag_ids.length > 0 ? (
                    tags
                      .filter(tag => formData.tag_ids.includes(tag.id))
                      .map(tag => (
                        <div key={tag.id} className="flex items-center bg-teal-100 px-3 py-1 rounded-full">
                          <span className="text-teal-800 text-sm">{tag.name}</span>
                          <button
                            type="button"
                            className="ml-2 text-teal-600 hover:text-teal-800"
                            onClick={() => {
                              const updatedTags = formData.tag_ids.filter(id => id !== tag.id);
                              setFormData({
                                ...formData,
                                tag_ids: updatedTags
                              });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="text-gray-500 text-sm">No tags selected</div>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center">
                    <select
                      id="tag_selector"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-500 cursor-pointer appearance-none"
                      onChange={(e) => {
                        if (e.target.value) {
                          const tagId = parseInt(e.target.value);
                          if (!formData.tag_ids.includes(tagId)) {
                            // First update the form data
                            const updatedTags = [...formData.tag_ids, tagId];
                            setFormData({
                              ...formData,
                              tag_ids: updatedTags
                            });
                            
                            // Then synchronize the hidden select element for compatibility
                            const hiddenSelect = document.getElementById('tag_ids');
                            if (hiddenSelect) {
                              // Clear all selections first
                              Array.from(hiddenSelect.options).forEach(option => {
                                option.selected = false;
                              });
                              
                              // Then set the new selections
                              updatedTags.forEach(id => {
                                const option = Array.from(hiddenSelect.options).find(opt => parseInt(opt.value) === id);
                                if (option) option.selected = true;
                              });
                            }
                            
                            console.log('Added tag:', tagId, 'Updated tags:', updatedTags);
                          }
                          e.target.value = ''; // Reset the select after selection
                        }
                      }}
                      value=""
                    >
                      <option value="" disabled>Choose a tag to add</option>
                      {tags
                        .filter(tag => !formData.tag_ids.includes(tag.id))
                        .map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                    </select>
                    <button 
                      type="button"
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      onClick={() => {
                        // Focus and show dropdown
                        const tagSelector = document.getElementById('tag_selector');
                        if (tagSelector) {
                          tagSelector.focus();
                          tagSelector.click();
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Tag
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Click to select from available tags
                  </div>
                </div>
              </div>
              
              {/* Keep the original select for compatibility with handleTagChange */}
              <select
                multiple
                id="tag_ids"
                name="tag_ids"
                value={formData.tag_ids}
                onChange={handleTagChange}
                className="hidden"
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">SEO</h3>
              
              <div className="mb-4">
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  dir={isRTL(formData.language_code) ? 'rtl' : 'ltr'}
                  style={{
                    direction: isRTL(formData.language_code) ? 'rtl' : 'ltr',
                    textAlign: isRTL(formData.language_code) ? 'right' : 'left'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  dir={isRTL(formData.language_code) ? 'rtl' : 'ltr'}
                  style={{
                    direction: isRTL(formData.language_code) ? 'rtl' : 'ltr',
                    textAlign: isRTL(formData.language_code) ? 'right' : 'left'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                Featured Image
              </h3>
              
              {formData.featured_image ? (
                <div className="mb-3">
                  <div className="relative">
                    <img 
                      src={formData.featured_image.startsWith('/uploads/cms/') ? `/api${formData.featured_image}` : formData.featured_image} 
                      alt="Featured" 
                      className="w-full h-40 object-cover rounded border border-gray-300" 
                      onLoad={() => console.log('Featured image loaded successfully:', formData.featured_image)}
                      onError={(e) => {
                        console.error('Featured image failed to load, trying alternate paths:', formData.featured_image);
                        
                        // Try different combinations based on the path format
                        if (formData.featured_image.startsWith('/api/')) {
                          // Try without the /api prefix
                          const withoutApi = formData.featured_image.replace('/api', '');
                          e.target.src = withoutApi;
                          console.log('Trying without /api prefix:', withoutApi);
                        } else if (formData.featured_image.startsWith('/uploads/cms/')) {
                          // Try with /api prefix
                          e.target.src = `/api${formData.featured_image}`;
                          console.log('Trying with /api prefix:', `/api${formData.featured_image}`);
                        } else if (!formData.featured_image.startsWith('/')) {
                          // Try adding a leading slash
                          e.target.src = `/${formData.featured_image}`;
                          console.log('Trying with leading slash:', `/${formData.featured_image}`);
                        } else {
                          // Try direct API route to CMS uploads
                          const filename = formData.featured_image.split('/').pop();
                          if (filename) {
                            e.target.src = `/api/uploads/cms/${filename}`;
                            console.log('Trying direct CMS upload path:', `/api/uploads/cms/${filename}`);
                          }
                        }
                        
                        // Add a final error handler for fallback
                        e.target.onerror = () => {
                          console.error('All image load attempts failed, using placeholder');
                          e.target.src = '/images/placeholder-image.svg';
                          e.target.alt = 'Image not found';
                          e.target.onerror = null; // Prevent infinite loop
                        };
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                      <span className="px-2 py-1 text-xs text-white font-semibold">Featured</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      onClick={() => setFeaturedImage('')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Remove Image
                    </button>
                    <button
                      type="button"
                      className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
                      onClick={() => {
                        // Scroll to media library
                        const mediaLibrary = document.getElementById('media-library');
                        if (mediaLibrary) {
                          mediaLibrary.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                      Change Image
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 break-all">
                    Image path: {formData.featured_image}
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center mb-3 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                  onClick={() => {
                    // Scroll to media library
                    const mediaLibrary = document.getElementById('media-library');
                    if (mediaLibrary) {
                      mediaLibrary.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-2">No featured image selected</p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Select Image
                    </button>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <label htmlFor="media-upload" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload New Media
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    id="media-upload"
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop file here, or click to select file
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Media Library - Always visible */}
            <div id="media-library" className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Media Library
                </h3>
                <button
                  type="button"
                  className="text-xs text-teal-600 hover:text-teal-800 flex items-center"
                  onClick={() => {
                    // Refresh media list
                    if (id) {
                      setIsLoading(true);
                      getPostMedia(id)
                        .then(mediaData => {
                          if (mediaData && mediaData.media) {
                            setMedia(mediaData.media);
                          }
                        })
                        .catch(err => {
                          console.error('Error refreshing media:', err);
                          setError('Failed to refresh media library');
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Refresh
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">Click on an image to set it as the featured image</p>
              
              {media.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {media.map((item) => (
                    <div 
                      key={item.id || item.file_path} 
                      className={`relative cursor-pointer border ${
                        formData.featured_image === item.file_path ? 'border-teal-500 ring-2 ring-teal-300' : 'border-gray-300'
                      } rounded overflow-hidden group transition-all duration-200 hover:shadow-md`}
                      onClick={() => setFeaturedImage(item.file_path)}
                    >
                      <div className="relative pb-[100%]">
                        <img 
                          src={item.url ? item.url : (item.file_path.startsWith('/uploads/cms/') ? `/api${item.file_path}` : item.file_path)}
                          alt={item.alt_text || 'Media'} 
                          className="absolute inset-0 w-full h-full object-cover" 
                          onLoad={() => console.log('Image loaded successfully:', item.file_path)}
                          onError={(e) => {
                            console.error('Image failed to load, trying alternate paths:', item.file_path);
                            
                            // Try different combinations based on the path format
                            if (item.file_path.startsWith('/api/')) {
                              // Try without the /api prefix
                              const withoutApi = item.file_path.replace('/api', '');
                              e.target.src = withoutApi;
                              console.log('Trying without /api prefix:', withoutApi);
                            } else if (item.file_path.startsWith('/uploads/cms/')) {
                              // Try with /api prefix
                              e.target.src = `/api${item.file_path}`;
                              console.log('Trying with /api prefix:', `/api${item.file_path}`);
                            } else if (!item.file_path.startsWith('/')) {
                              // Try adding a leading slash
                              e.target.src = `/${item.file_path}`;
                              console.log('Trying with leading slash:', `/${item.file_path}`);
                            } else {
                              // Try direct API route to CMS uploads
                              const filename = item.file_path.split('/').pop();
                              if (filename) {
                                e.target.src = `/api/uploads/cms/${filename}`;
                                console.log('Trying direct CMS upload path:', `/api/uploads/cms/${filename}`);
                              }
                            }
                            
                            // Add a second error handler for the final fallback
                            e.target.onerror = () => {
                              console.error('All image load attempts failed, using placeholder');
                              e.target.src = '/images/placeholder-image.svg';
                              e.target.alt = 'Image not found';
                              e.target.onerror = null; // Prevent infinite loop
                            };
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      {formData.featured_image === item.file_path && (
                        <div className="absolute top-1 right-1 bg-teal-500 text-white text-xs p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500">No media uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload an image using the field above</p>
                </div>
              )}
              
              {media.length > 0 && (
                <div className="mt-3 text-xs text-gray-500 text-right">
                  {media.length} image{media.length !== 1 ? 's' : ''} in library
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this translation? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeleteTranslation(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Translation Modal */}
      <TranslationModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        languages={languages.filter(lang => lang.is_active)} // Pass only active languages
        onTranslate={handleAutoTranslate} // Directly pass the handler
        onCancel={handleCancelTranslation}
        isLoading={isTranslating} // Use the specific isTranslating state
      />
    </div>
  );
};

export default PostEditor;