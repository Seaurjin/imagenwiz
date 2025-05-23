import axios from 'axios';

// Define the correct API URL path
// Important: Always use the full path for API requests to avoid routing issues
const API_URL = '/api/cms'; // Use this consistently for all CMS API routes

// Get authentication token from localStorage
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('[cms-service] getAuthToken() retrieved:', token ? token.substring(0, 15) + '...' : 'null | undefined');
  return token;
};

// Helper function to handle API errors
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API error:', error.response.data);
    throw new Error(error.response.data.error || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API error: No response received', error.request);
    throw new Error('No response from server. Please try again.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API error:', error.message);
    throw new Error('Error setting up request. Please try again.');
  }
};

// Languages
export const getLanguages = async () => {
  try {
    console.log('Fetching languages from API...');
    const token = getAuthToken(); // Get the stored token
    console.log('[cms-service] getLanguages - token for request:', token ? token.substring(0, 15) + '...' : 'null | undefined');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('[cms-service] getLanguages - request headers:', headers);

    const response = await axios.get(`${API_URL}/languages`, {
      params: {
        nocache: Date.now() // Add cache-busting parameter
      },
      headers: headers // Add the Authorization header if token exists
    });
    console.log('Languages API response:', response.data);
    
    // Ensure we have valid data - if not, try direct SQL approach
    if (!Array.isArray(response.data) || response.data.length < 3) {
      console.warn('Languages API returned insufficient data, trying direct fetch');
      // Try a different approach with explicit is_active parameter
      const directResponse = await axios.get(`${API_URL}/languages`, {
        params: {
          is_active: true,
          nocache: Date.now() + 1 // Different cache-busting value
        },
        headers: headers // Add the Authorization header if token exists
      });
      console.log('Direct languages API response:', directResponse.data);
      return directResponse.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    
    // If there's an error, try a fallback to our website's supported languages
    try {
      console.log('Using fallback to website supported languages');
      // Import the supported languages from the main app
      const { SUPPORTED_LANGUAGES } = await import('../i18n/i18n');
      
      // Convert to CMS format
      return SUPPORTED_LANGUAGES.map(lang => ({
        code: lang.code,
        name: lang.name,
        is_active: true,
        is_default: lang.code === 'en'
      }));
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError);
      return handleError(error);
    }
  }
};

// Get website languages (only the 22 languages used on the website, not all in database)
export const getWebsiteLanguages = async () => {
  try {
    // First try the dedicated website languages endpoint
    try {
      const response = await axios.get(`${API_URL}/website-languages`, {
        params: {
          nocache: Date.now() // Cache-busting parameter
        }
      });
      console.log('Website languages dedicated endpoint response:', response.data);
      
      if (Array.isArray(response.data) && response.data.length >= 3) {
        return response.data;
      }
    } catch (specificEndpointError) {
      console.warn('Dedicated website languages endpoint failed, falling back to filtered main endpoint:', specificEndpointError);
      // Continue to fallback approach if dedicated endpoint fails
    }
    
    // Fallback: Use the main languages endpoint with website_only filter
    const response = await axios.get(`${API_URL}/languages`, {
      params: {
        nocache: Date.now(), // Cache-busting parameter
        is_active: true,     // Only get active languages
        website_only: true   // Use backend parameter to filter languages
      }
    });
    console.log('Website languages fallback response:', response.data);
    
    // If the API call succeeds but we need additional filtering
    if (Array.isArray(response.data) && response.data.length >= 3) {
      // These are the codes used by the website (our 22 supported languages)
      const websiteLangCodes = [
        'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW', 
        'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
      ];
      
      // Filter API response to just website languages (double-check)
      const filteredLangs = response.data.filter(lang => 
        websiteLangCodes.includes(lang.code) && lang.is_active
      );
      
      console.log(`Filtered API response to ${filteredLangs.length} website languages`);
      
      if (filteredLangs.length >= 3) {
        return filteredLangs;
      }
    }
    
    // Fallback to hardcoded list if API response is invalid or too few languages
    console.warn('Website languages API returned insufficient data, using predefined list');
    return [
      {"code": "en", "name": "English", "is_active": true, "is_default": true, "flag": "🇬🇧"},
      {"code": "fr", "name": "French", "is_active": true, "is_default": false, "flag": "🇫🇷"},
      {"code": "es", "name": "Spanish", "is_active": true, "is_default": false, "flag": "🇪🇸"},
      {"code": "de", "name": "German", "is_active": true, "is_default": false, "flag": "🇩🇪"},
      {"code": "it", "name": "Italian", "is_active": true, "is_default": false, "flag": "🇮🇹"},
      {"code": "pt", "name": "Portuguese", "is_active": true, "is_default": false, "flag": "🇵🇹"},
      {"code": "ru", "name": "Russian", "is_active": true, "is_default": false, "flag": "🇷🇺"},
      {"code": "ja", "name": "Japanese", "is_active": true, "is_default": false, "flag": "🇯🇵"},
      {"code": "ko", "name": "Korean", "is_active": true, "is_default": false, "flag": "🇰🇷"},
      {"code": "zh-TW", "name": "Traditional Chinese", "is_active": true, "is_default": false, "flag": "🇹🇼"},
      {"code": "ar", "name": "Arabic", "is_active": true, "is_default": false, "flag": "🇸🇦"},
      {"code": "nl", "name": "Dutch", "is_active": true, "is_default": false, "flag": "🇳🇱"},
      {"code": "sv", "name": "Swedish", "is_active": true, "is_default": false, "flag": "🇸🇪"},
      {"code": "tr", "name": "Turkish", "is_active": true, "is_default": false, "flag": "🇹🇷"},
      {"code": "pl", "name": "Polish", "is_active": true, "is_default": false, "flag": "🇵🇱"},
      {"code": "hu", "name": "Hungarian", "is_active": true, "is_default": false, "flag": "🇭🇺"},
      {"code": "el", "name": "Greek", "is_active": true, "is_default": false, "flag": "🇬🇷"},
      {"code": "no", "name": "Norwegian", "is_active": true, "is_default": false, "flag": "🇳🇴"},
      {"code": "vi", "name": "Vietnamese", "is_active": true, "is_default": false, "flag": "🇻🇳"},
      {"code": "th", "name": "Thai", "is_active": true, "is_default": false, "flag": "🇹🇭"},
      {"code": "id", "name": "Indonesian", "is_active": true, "is_default": false, "flag": "🇮🇩"},
      {"code": "ms", "name": "Malaysian", "is_active": true, "is_default": false, "flag": "🇲🇾"}
    ];
  } catch (error) {
    console.error('Error fetching website languages:', error);
    // Return predefined list as fallback
    return [
      {"code": "en", "name": "English", "is_active": true, "is_default": true, "flag": "🇬🇧"},
      {"code": "fr", "name": "French", "is_active": true, "is_default": false, "flag": "🇫🇷"},
      {"code": "es", "name": "Spanish", "is_active": true, "is_default": false, "flag": "🇪🇸"},
      {"code": "de", "name": "German", "is_active": true, "is_default": false, "flag": "🇩🇪"},
      {"code": "it", "name": "Italian", "is_active": true, "is_default": false, "flag": "🇮🇹"},
      {"code": "pt", "name": "Portuguese", "is_active": true, "is_default": false, "flag": "🇵🇹"},
      {"code": "ru", "name": "Russian", "is_active": true, "is_default": false, "flag": "🇷🇺"},
      {"code": "ja", "name": "Japanese", "is_active": true, "is_default": false, "flag": "🇯🇵"},
      {"code": "ko", "name": "Korean", "is_active": true, "is_default": false, "flag": "🇰🇷"},
      {"code": "zh-TW", "name": "Traditional Chinese", "is_active": true, "is_default": false, "flag": "🇹🇼"},
      {"code": "ar", "name": "Arabic", "is_active": true, "is_default": false, "flag": "🇸🇦"},
      {"code": "nl", "name": "Dutch", "is_active": true, "is_default": false, "flag": "🇳🇱"},
      {"code": "sv", "name": "Swedish", "is_active": true, "is_default": false, "flag": "🇸🇪"},
      {"code": "tr", "name": "Turkish", "is_active": true, "is_default": false, "flag": "🇹🇷"},
      {"code": "pl", "name": "Polish", "is_active": true, "is_default": false, "flag": "🇵🇱"},
      {"code": "hu", "name": "Hungarian", "is_active": true, "is_default": false, "flag": "🇭🇺"},
      {"code": "el", "name": "Greek", "is_active": true, "is_default": false, "flag": "🇬🇷"},
      {"code": "no", "name": "Norwegian", "is_active": true, "is_default": false, "flag": "🇳🇴"},
      {"code": "vi", "name": "Vietnamese", "is_active": true, "is_default": false, "flag": "🇻🇳"},
      {"code": "th", "name": "Thai", "is_active": true, "is_default": false, "flag": "🇹🇭"},
      {"code": "id", "name": "Indonesian", "is_active": true, "is_default": false, "flag": "🇮🇩"},
      {"code": "ms", "name": "Malaysian", "is_active": true, "is_default": false, "flag": "🇲🇾"}
    ];
  }
};

export const addLanguage = async (languageData) => {
  try {
    const response = await axios.post(`${API_URL}/languages`, languageData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateLanguage = async (code, languageData) => {
  try {
    const response = await axios.put(`${API_URL}/languages/${code}`, languageData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteLanguage = async (code) => {
  try {
    const response = await axios.delete(`${API_URL}/languages/${code}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Tags
export const getTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addTag = async (tagData) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/tags`;
    
    console.log('Adding tag with data:', tagData);
    console.log('Correct API URL:', fullApiUrl);
    console.log('Previously used API URL:', `${API_URL}/tags`);
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Token available:', !!token, token ? `(${token.substring(0, 10)}...)` : '(none)');
    
    if (!token) {
      console.error('No auth token available for tag creation');
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Log full request details
    console.log('Making tag creation request with:', {
      url: fullApiUrl,
      method: 'POST',
      data: tagData,
      authHeader: `Bearer ${token.substring(0, 10)}...`
    });
    
    // Use the full URL path to avoid any route confusion
    const response = await axios.post(fullApiUrl, tagData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Tag creation response:', response.data);
    return response.data;
  } catch (error) {
    // Detailed error logging
    console.error('Error in addTag:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return handleError(error);
  }
};

export const updateTag = async (id, tagData) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/tags/${id}`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Token for update tag:', !!token);
    console.log('Correct API URL for update:', fullApiUrl);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.put(fullApiUrl, tagData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateTag:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return handleError(error);
  }
};

export const deleteTag = async (id) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/tags/${id}`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Token for delete tag:', !!token);
    console.log('Correct API URL for delete:', fullApiUrl);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.delete(fullApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in deleteTag:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return handleError(error);
  }
};

// Blog Posts
export const getPosts = async (filters = {}) => {
  try {
    const token = getAuthToken(); // Get the stored token
    console.log('[cms-service] getPosts - token for request:', token ? token.substring(0, 15) + '...' : 'null | undefined');
    if (!token) {
      console.error('CMS getPosts: No auth token found. User might be logged out.');
      throw new Error('Authentication required. Please log in.');
    }

    const params = {
      ...filters,
      view_mode: 'admin', // Ensure we get all posts for CMS admin view
      nocache: Date.now() // Cache-busting
    };
    
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('[cms-service] getPosts - request headers:', headers);
    
    console.log('Fetching CMS posts with params:', params);
    
    // Correct API endpoint is /api/cms/blog for our proxy
    const fullApiUrl = `/api/cms/blog`; 
    
    const response = await axios.get(fullApiUrl, { 
      params: params, 
      headers: headers // Add the Authorization header
    });
    console.log('CMS Posts API response:', response.data);
    
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        console.log('Response is an array with', response.data.length, 'items');
        console.log('Sample first post language data:', 
          response.data[0]?.translations?.length > 0 ? 
          `Has ${response.data[0].translations.length} translations` : 
          'No translations');
      } else if (response.data.posts) {
        console.log('Response has posts property with', response.data.posts.length, 'items');
      } else {
        console.log('Response structure:', Object.keys(response.data));
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return handleError(error);
  }
};

/**
 * Expand post translations into virtual posts for display in the CMS
 * This takes posts with translations and creates virtual post objects for each translation
 */
export const expandPostTranslations = (posts) => {
  if (!posts || !Array.isArray(posts)) {
    console.error('Cannot expand translations: posts is not an array', posts);
    return [];
  }

  console.log(`Expanding ${posts.length} posts with their translations`);
  const expandedPosts = [];
  
  // Debug the structure of the first post if available
  if (posts.length > 0) {
    const firstPost = posts[0];
    console.log('First post structure:', {
      id: firstPost.id,
      hasTranslation: !!firstPost.translation,
      hasTranslations: !!firstPost.translations,
      translationsCount: firstPost.translations ? firstPost.translations.length : 0,
      translationLanguages: firstPost.translations ? 
        firstPost.translations.map(t => t.language_code) : []
    });
  }
  
  // Process each post to create a separate row for each translation
  posts.forEach(post => {
    if (!post.translations || post.translations.length === 0) {
      // If no translations array or empty, just add the original post
      console.log(`Post ${post.id} has no translations array or it's empty, adding as-is`);
      expandedPosts.push(post);
      return;
    }
    
    // For each post with translations, add one row per translation
    console.log(`Post ${post.id} has ${post.translations.length} translations, creating virtual posts`);
    
    // Loop through each translation and create a virtual post
    post.translations.forEach(translation => {
      // Create a virtual post with this translation as the primary one
      const virtualPost = {
        ...post,
        // Set this specific translation as the primary translation for this virtual post
        translation: {
          ...translation
        },
        // Add markers to identify this as a virtual post
        isVirtualTranslation: true,
        virtualId: `${post.id}-${translation.language_code}`
      };
      
      console.log(`Adding virtual post for ID: ${post.id}, language: ${translation.language_code}, title: "${translation.title?.substring(0, 20)}..."`);
      expandedPosts.push(virtualPost);
    });
  });
  
  console.log(`Expanded ${posts.length} original posts into ${expandedPosts.length} virtual posts with individual translations`);
  return expandedPosts;
};

export const getPost = async (id, language = null) => {
  try {
    const params = language ? { language } : {};
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[cms-service] getPost: No token found for ID based fetch. This might be an issue if endpoint is protected.');
      // Depending on API design, might need to throw error if token is absolutely required
    }
    // Corrected endpoint to match blog proxy for ID-based fetching
    const fullApiUrl = `/api/cms/blog/id/${id}`;
    console.log(`[cms-service] getPost: Fetching post by ID from ${fullApiUrl} with lang ${language}`);
    
    const response = await axios.get(fullApiUrl, { params, headers });
    
    // Enhanced debug logging
    console.log('API response for getPost:', response.data);
    
    // Handle content field - ensure it's properly provided for editor
    if (response.data) {
      // Process translation data for consistent content field
      if (response.data.translation) {
        console.log('Direct translation available:', response.data.translation);
        
        // Ensure content is never null or undefined for the editor
        if (!response.data.translation.content) {
          console.warn('Content is empty in translation, setting to empty string');
          response.data.translation.content = '';
        }
      } else if (response.data.translations && response.data.translations.length > 0) {
        console.log('Multiple translations available:', response.data.translations.length);
        
        // Ensure each translation has a content field
        response.data.translations.forEach(translation => {
          if (!translation.content) {
            console.warn(`Content is empty in translation (${translation.language_code}), setting to empty string`);
            translation.content = '';
          }
        });
      } else if (response.data.post) {
        // Handle nested post structure with translations
        if (response.data.post.translation) {
          console.warn('Nested translation detected, ensuring content field');
          if (!response.data.post.translation.content) {
            response.data.post.translation.content = '';
          }
        } else if (response.data.post.translations) {
          response.data.post.translations.forEach(translation => {
            if (!translation.content) {
              translation.content = '';
            }
          });
        }
      }
    }
    
    console.log('Processed response for editor:', response.data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPostBySlug = async (slug, language = null) => {
  try {
    const params = language ? { language } : {};
    const token = getAuthToken(); // Ensure token is fetched
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[cms-service] getPostBySlug: No token found for slug based fetch. This might be an issue if endpoint is protected.');
    }
    // Corrected endpoint to match blog proxy
    const fullApiUrl = `/api/cms/blog/${slug}`;
    console.log(`[cms-service] getPostBySlug: Fetching post by slug from ${fullApiUrl} with lang ${language}`);

    const response = await axios.get(fullApiUrl, { params, headers }); // Added headers
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createPost = async (postData) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Create post - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.post(fullApiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    return handleError(error);
  }
};

export const updatePost = async (id, postData) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts/${id}`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Update post - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.put(fullApiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    return handleError(error);
  }
};

export const deletePost = async (id) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts/${id}`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Delete post - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.delete(fullApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    return handleError(error);
  }
};

export const deleteTranslation = async (postId, languageCode) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts/${postId}/translations/${languageCode}`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Delete translation - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.delete(fullApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting translation:', error);
    return handleError(error);
  }
};

export const autoTranslatePost = async (postId, options = {}) => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts/${postId}/auto-translate`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Auto-translate post - Token available:', !!token);
    console.log('Correct API URL for auto-translate:', fullApiUrl);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    // If target_languages is provided in options, use it
    let targetLanguages = options.target_languages;
    
    // If no specific languages requested, get website languages
    if (!targetLanguages || targetLanguages.length === 0) {
      console.log('No target languages specified, will use website languages');
      try {
        // First try the dedicated website-languages endpoint
        const websiteLanguages = await getWebsiteLanguages();
        console.log('Got website languages from API:', websiteLanguages);
        
        // Make sure we have a valid array of languages with expected properties
        if (Array.isArray(websiteLanguages) && websiteLanguages.length > 0) {
          targetLanguages = websiteLanguages
            .filter(lang => lang.code !== 'en' && lang.is_active)
            .map(lang => lang.code);
          console.log('Filtered website languages for translation:', targetLanguages);
          
          if (targetLanguages.length === 0) {
            throw new Error('No active website languages found for translation');
          }
        } else {
          throw new Error('Invalid website languages response');
        }
      } catch (langError) {
        console.error('Error fetching website languages:', langError);
        
        // Fallback to the website language codes (22 languages without English)
        const websiteLangCodes = [
          'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW', 
          'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
        ];
        console.log('Using fallback website language codes:', websiteLangCodes);
        targetLanguages = websiteLangCodes;
      }
    }
    
    // Log selected target languages 
    console.log(`Auto-translating post ${postId} to ${targetLanguages.length} languages:`, targetLanguages);
    
    // Prepare payload with target languages
    const payload = {
      target_languages: targetLanguages,
    };
    
    // Make the translation request
    const response = await axios.post(fullApiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Log response summary
    const successCount = response.data?.translations?.successful?.length || 0;
    const skippedCount = response.data?.translations?.skipped?.length || 0;
    const failedCount = response.data?.translations?.failed?.length || 0;
    
    console.log(`Translation completed: ${successCount} translated, ${skippedCount} skipped, ${failedCount} failed`);
    
    return response.data;
  } catch (error) {
    console.error('Error in auto-translate:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // If we have a specific error message from the server, include it
      if (error.response.data && (error.response.data.error || error.response.data.message)) {
        throw new Error(error.response.data.error || error.response.data.message);
      }
    }
    return handleError(error);
  }
};

// Auto-translate all posts from English to all other languages
export const autoTranslateAllPosts = async (options = {}) => {
  try {
    console.log('Starting auto-translation for all posts');
    
    // Use the explicit full API path to ensure consistency
    const fullApiUrl = `/api/cms/posts/auto-translate-all`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Auto-translate all posts - Token available:', !!token);
    console.log('Correct API URL for auto-translate-all:', fullApiUrl);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    // If languages aren't specified, get all website languages except English
    if (!options.languages || options.languages.length === 0) {
      const websiteLanguages = await getWebsiteLanguages();
      const targetLanguages = websiteLanguages
        .filter(lang => lang.code !== 'en' && lang.is_active)
        .map(lang => lang.code);
      
      console.log('Auto-translating all posts to website languages:', targetLanguages);
      options = {
        languages: targetLanguages,
        batch_size: options.batch_size,
        placeholder_mode: options.placeholder_mode
      };
    } else {
      // If options.languages is provided, ensure force_translate is not in the options sent to backend
      const { force_translate, ...restOptions } = options;
      options = restOptions;
    }
    
    const response = await axios.post(fullApiUrl, options, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in auto-translating all posts:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return handleError(error);
  }
};

// Translate English posts to all missing languages (all except EN, ES, FR)
export const translateMissingLanguages = async () => {
  try {
    console.log('Starting translations for missing languages (excluding EN, ES, FR)');
    
    // Use the explicit full API path to ensure consistency
    const fullApiUrl = `/api/cms/posts/auto-translate-all`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Translate missing languages - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Specify only the missing languages to translate
    // This excludes EN (source), ES and FR (already translated)
    const options = {
      languages: [
        'de', 'ar', 'el', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 
        'nl', 'no', 'pl', 'pt', 'ru', 'sv', 'th', 'tr', 'vi', 'zh-TW'
      ],
      batch_size: 2,  // Process 2 posts at a time to avoid timeouts
    };
    
    console.log(`Translating to missing languages: ${options.languages.join(', ')}`);
    
    const response = await axios.post(fullApiUrl, options, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in translating missing languages:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return handleError(error);
  }
};

// Force translate all English posts to Spanish and French only
export const forceTranslateEsFr = async () => {
  try {
    console.log('Starting force translation to Spanish and French');
    
    // Use the explicit full API path to ensure consistency
    const fullApiUrl = `/api/cms/posts/force-translate-es-fr`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Force translate ES/FR - Token available:', !!token);
    console.log('Correct API URL for force-translate-es-fr:', fullApiUrl);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const response = await axios.post(fullApiUrl, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in force-translating to Spanish/French:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return handleError(error);
  }
};

// Media
export const uploadMedia = async (postId, formData) => {
  try {
    const response = await axios.post(`/api/cms/posts/${postId}/media`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // Returns { media: {...}, message: "Media uploaded successfully" }
  } catch (error) {
    return handleError(error);
  }
};

export const getPostMedia = async (postId) => {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await axios.get(`/api/cms/posts/${postId}/media`, { headers });
    // The response format is { media: [...], message: "Media retrieved successfully" }
    // But we want to maintain backward compatibility with existing code
    return response.data && response.data.media ? 
      { media: response.data.media } : 
      { media: [] };
  } catch (error) {
    return handleError(error);
  }
};

export const updateMedia = async (mediaId, mediaData) => {
  try {
    const response = await axios.put(`/api/cms/media/${mediaId}`, mediaData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMedia = async (mediaId) => {
  try {
    const response = await axios.delete(`/api/cms/media/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Public Blog API
export const getBlogPosts = async (params = {}) => {
  try {
    const response = await axios.get(`/api/cms/blog`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getBlogPostBySlug = async (slug, language = null) => {
  try {
    const params = language ? { language } : {};
    const response = await axios.get(`/api/cms/blog/${slug}`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Generate blog content using AI based on a title
 * 
 * @param {string} title - The blog post title
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @param {string} length - Content length: 'short', 'medium', or 'long'
 * @returns {Promise<Object>} - Generated content or error message
 */
export const generateAIContent = async (title, language = 'en', length = 'medium') => {
  try {
    // Ensure we're using the correct URL with full /api prefix
    const fullApiUrl = `/api/cms/posts/generate-content`;
    
    // Get the token using our helper
    const token = getAuthToken();
    console.log('Generate AI content - Token available:', !!token);
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Prepare request data
    const requestData = {
      title,
      language,
      length
    };
    
    console.log('Generating AI content with:', requestData);
    
    // Make the API request
    const response = await axios.post(fullApiUrl, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('AI content generation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating AI content:', error);
    
    // Custom error handler for AI content generation
    if (error.response && error.response.data && error.response.data.error) {
      // If we have a specific error message from the API
      throw new Error(`AI generation failed: ${error.response.data.error}`);
    }
    
    return handleError(error);
  }
};