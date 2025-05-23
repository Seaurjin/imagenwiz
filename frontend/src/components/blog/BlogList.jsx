import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag as TagIcon, ChevronRight, Clock, User, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '../../lib/cms-service';
import { useTranslation } from 'react-i18next';
import BlogImage from './BlogImage';

const BlogList = ({ language, tag = '', search = '', limit = 6, onPostCountChange }) => {
  // Use the current i18n language if not explicitly provided
  const { i18n } = useTranslation();
  const currentLanguage = language || i18n.language || 'en';
  const navigate = useNavigate();
  const { t } = useTranslation(['blog', 'common']);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [currentLanguage, tag, search, currentPage, limit]);
  
  // Notify parent component of the post count
  useEffect(() => {
    if (typeof onPostCountChange === 'function') {
      onPostCountChange(totalCount);
    }
  }, [totalCount, onPostCountChange]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        language: currentLanguage,
        page: currentPage,
        limit,
      };
      
      if (tag) {
        params.tag = tag;
      }
      
      if (search) {
        params.search = search;
      }
      
      console.log('Fetching blog posts with params:', params);
      const response = await getBlogPosts(params);
      console.log('Blog API response:', response);
      
      const allPosts = response.posts || [];
      console.log('Retrieved posts count:', allPosts.length);
      
      // Only include posts that have the translation we want
      const postsWithTranslation = allPosts.filter(post => {
        // Check if the post has the translation data in the requested language
        return post.translation && post.translation.title && post.translation.content;
      });
      
      console.log('Posts with translation:', postsWithTranslation.length);
      
      // Set a featured post only on the first page when no filters are applied
      if (currentPage === 1 && !tag && !search && postsWithTranslation.length > 0) {
        setFeaturedPost(postsWithTranslation[0]);
        setPosts(postsWithTranslation.slice(1));
        console.log('Set featured post:', postsWithTranslation[0].translation?.title);
      } else {
        setFeaturedPost(null);
        setPosts(postsWithTranslation);
      }
      
      setTotalPages(response.total_pages || 1);
      setTotalCount(response.total || postsWithTranslation.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Could not load blog posts. Please try again later. Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (content) => {
    if (!content) return t('postInfo.readingTime', '{{time}} min read', { time: 3 });
    
    // Average reading speed: 200 words per minute
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    return t('postInfo.readingTime', '{{time}} min read', { time: readTimeMinutes });
  };

  const truncateText = (text, maxLength = 160) => {
    if (!text) return '';
    
    // Remove any HTML tags for the excerpt
    const strippedText = text.replace(/<[^>]*>?/gm, '');
    
    if (strippedText.length <= maxLength) return strippedText;
    
    // Find the last space before the maxLength to avoid cutting words
    const lastSpace = strippedText.lastIndexOf(' ', maxLength);
    return strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
  };

  const renderLoadingState = () => {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-gray-500">{t('status.loading', 'Loading articles...')}</p>
      </div>
    );
  };

  const renderErrorState = () => {
    return (
      <div className="w-full py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            {t('status.tryAgain', 'Try Again')}
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="w-full py-12 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block max-w-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('notFound.title', 'No Articles Found')}</h3>
          <p className="text-gray-500 mb-6">
            {tag 
              ? t('notFound.tagEmpty', 'No posts found for the selected category. Try a different filter.')
              : search
                ? t('notFound.searchEmpty', 'No results found for "{{search}}". Try a different search term.', { search })
                : t('notFound.description', 'No blog posts available at the moment. Please check back later.')}
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
          >
            {t('relatedPosts.browseAll', 'Browse all articles')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const renderFeaturedPost = () => {
    if (!featuredPost) return null;
    
    // Get the correct translation content
    const translation = featuredPost.translation || {};
    const title = translation.title || '';
    const content = translation.content || '';
    const excerpt = translation.excerpt || '';
    
    return (
      <div className="mb-16 relative">
        {/* Featured Badge - Absolute positioned for a modern look */}
        <div className="absolute -top-5 left-4 z-10">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.4L6 19.4L8 12.6L2 8.6H9.2L12 2L14.8 8.6H22L16 12.6L18 19.4L12 15.4Z" fill="currentColor"/>
            </svg>
            {t('featuredPost.label', 'Featured Article')}
          </div>
        </div>
      
        <div 
          className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row border border-gray-100"
          onClick={() => handlePostClick(featuredPost.slug)}
        >
          {/* Left: Image */}
          <div className="relative md:w-1/2 h-72 md:h-auto overflow-hidden">
            {featuredPost.featured_image ? (
              <div className="w-full h-full overflow-hidden">
                <BlogImage 
                  src={featuredPost.featured_image} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient overlay to improve text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-70 md:hidden"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                <span className="text-2xl font-bold">{t('common.companyName', 'iMagenWiz')}</span>
              </div>
            )}
            
            {/* Reading time badge */}
            <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center shadow-sm">
              <Clock className="h-4 w-4 mr-2" />
              {formatReadTime(content)}
            </div>
          </div>
          
          {/* Right: Content */}
          <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredPost.tags && featuredPost.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 shadow-sm hover:bg-teal-100 transition-colors"
                >
                  <TagIcon className="h-3 w-3 mr-1.5" />
                  {tag.name}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 group-hover:text-teal-600 transition-colors leading-tight">
              {title}
            </h2>
            
            {/* Date */}
            <div className="flex items-center mb-6 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5 text-teal-500" />
              <span>{formatDate(featuredPost.created_at)}</span>
            </div>
            
            {/* Excerpt */}
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              {truncateText(excerpt || content, 220)}
            </p>
            
            {/* Author & Read More */}
            <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3 shadow-sm border-2 border-white">
                  <span className="text-teal-700 font-semibold text-base">
                    {featuredPost.author?.name ? featuredPost.author.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-800 font-medium block">{featuredPost.author?.name || t('author.defaultName', 'iMagenWiz Team')}</span>
                  <span className="text-gray-500 text-xs">{t('postInfo.role', 'Content Writer')}</span>
                </div>
              </div>
              
              <div className="flex items-center text-teal-600 font-medium group-hover:text-teal-700">
                {t('relatedPosts.readFull', 'Read Full Article')}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1.5" />
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 text-teal-50 opacity-50 hidden lg:block">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <circle cx="25" cy="25" r="25" />
                <circle cx="75" cy="75" r="25" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPostCard = (post) => {
    // Get the translation content
    const translation = post.translation || {};
    const title = translation.title || '';
    const content = translation.content || '';
    const excerpt = translation.excerpt || '';
    
    return (
      <article 
        key={post.id} 
        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-gray-100"
        onClick={() => handlePostClick(post.slug)}
      >
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          {post.featured_image ? (
            <div className="w-full h-full overflow-hidden">
              <BlogImage 
                src={post.featured_image}
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <span className="text-xl font-bold">{t('common.companyName', 'iMagenWiz')}</span>
            </div>
          )}
          
          {/* Reading time badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center shadow-sm">
            <Clock className="h-3 w-3 mr-1.5" />
            {formatReadTime(content)}
          </div>
          
          {/* Tags overlay at bottom of image */}
          {post.tags && post.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-teal-700 shadow-sm backdrop-blur-sm border border-teal-100/30"
                >
                  <TagIcon className="h-3 w-3 mr-1.5 text-teal-500" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Title - larger and more prominent */}
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Date with improved styling */}
          <div className="flex items-center mb-3 text-sm text-gray-500 bg-gray-50 inline-flex self-start px-2.5 py-1 rounded-md">
            <Calendar className="h-4 w-4 mr-2 text-teal-500" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          {/* Excerpt with better spacing and readability */}
          <p className="text-gray-600 mb-5 text-sm line-clamp-3 flex-grow leading-relaxed">
            {truncateText(excerpt || content, 140)}
          </p>
          
          {/* Author and read more with hover effects */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center mr-2 shadow-sm">
                <span className="text-teal-700 font-medium text-xs">
                  {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {post.author?.name || t('author.defaultName', 'iMagenWiz Team')}
              </span>
            </div>
            
            <div className="flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
              {t('relatedPosts.readFull', 'Read Article')}
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </article>
    );
  };

  if (loading && posts.length === 0 && !featuredPost) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  if (posts.length === 0 && !featuredPost) {
    return renderEmptyState();
  }

  return (
    <div className="w-full">
      {/* Featured Post (only on first page with no filters) */}
      {featuredPost && renderFeaturedPost()}
      
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.map(renderPostCard)}
      </div>

      {/* Loading More Indicator */}
      {loading && posts.length > 0 && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center bg-white px-5 py-4 rounded-xl shadow-md border border-gray-100" aria-label="Pagination">
            {/* Previous page button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`mr-3 inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200 shadow-sm'
              }`}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('pagination.previous', 'Previous')}
            </button>
            
            {/* Page numbers - desktop only */}
            <div className="hidden md:inline-flex items-center">
              {/* Logic to show limited page numbers with ellipsis for large page counts */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                // Show ellipsis for breaks in sequence
                const showEllipsisBefore = page === currentPage - 1 && currentPage > 3;
                const showEllipsisAfter = page === currentPage + 1 && currentPage < totalPages - 2;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className="mx-1 px-1 text-gray-500">...</span>
                    )}
                    
                    {showPage && (
                      <button
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`mx-1 inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-teal-500 text-white shadow-sm border border-teal-500'
                            : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                    
                    {showEllipsisAfter && (
                      <span className="mx-1 px-1 text-gray-500">...</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Mobile view - simple current/total indicator */}
            <div className="md:hidden flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-gray-700 text-sm font-medium">
                {t('pagination.page', 'Page {{current}} of {{total}}', { current: currentPage, total: totalPages })}
              </span>
            </div>
            
            {/* Next page button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`ml-3 inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200 shadow-sm'
              }`}
            >
              {t('pagination.next', 'Next')}
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogList;