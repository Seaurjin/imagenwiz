import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

/**
 * Admin tool to trigger blog translations
 */
const TranslationTool = () => {
  const { user, isAdmin } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [batchSize, setBatchSize] = useState(10);
  const [usePlaceholder, setUsePlaceholder] = useState(true);
  const [forceTranslate, setForceTranslate] = useState(false);

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleTranslateAll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/cms/posts/auto-translate-all', {
        batch_size: parseInt(batchSize),
        placeholder_mode: usePlaceholder,
        force_translate: forceTranslate
      });

      setResult(response.data);
      console.log('Translation response:', response.data);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.response?.data?.error || err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return <div className="p-8 text-center">Admin access required</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Translation Tool</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Auto-Translate All Blog Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Batch Size
              <input 
                type="number" 
                min="1"
                max="100"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">Number of posts to process at once. Use 0 for all posts.</p>
            </label>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={usePlaceholder}
                onChange={(e) => setUsePlaceholder(e.target.checked)}
                className="mr-2"
              />
              <span>Use Placeholder Mode</span>
              <p className="text-xs text-gray-500 ml-6">Creates placeholder translations instead of using DeepSeek AI</p>
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={forceTranslate}
                onChange={(e) => setForceTranslate(e.target.checked)}
                className="mr-2"
              />
              <span>Force Translate All</span>
              <p className="text-xs text-gray-500 ml-6">Overwrite existing translations (even manually edited ones)</p>
            </label>
          </div>
        </div>
        
        <button
          onClick={handleTranslateAll}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Translate All Posts'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h3 className="font-bold text-lg mb-2">Translation Complete</h3>
          <div className="mb-2">
            <p><strong>Total Posts:</strong> {result.results?.total_posts || 0}</p>
            <p><strong>Posts Translated:</strong> {result.results?.successfully_translated_posts || 0}</p>
            <p><strong>Languages Translated:</strong> {result.results?.translated_languages || 0}</p>
            <p><strong>Skipped Languages:</strong> {result.results?.skipped_languages || 0}</p>
            <p><strong>Failed Translations:</strong> {result.results?.failed_posts || 0}</p>
            <p><strong>Remaining Posts:</strong> {result.results?.remaining_posts || 0}</p>
          </div>
          
          {result.results?.details && result.results.details.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Details by Post:</h4>
              <div className="mt-2 max-h-60 overflow-y-auto">
                {result.results.details.map((post, index) => (
                  <div key={index} className="border-b border-green-200 py-2">
                    <p><strong>Post ID {post.post_id}:</strong> {post.post_slug}</p>
                    {post.successful_languages.length > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Successful:</span> {post.successful_languages.join(', ')}
                      </p>
                    )}
                    {post.failed_languages.length > 0 && (
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Failed:</span> {post.failed_languages.join(', ')}
                      </p>
                    )}
                    {post.skipped_languages.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Skipped:</span> {post.skipped_languages.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationTool;