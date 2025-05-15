import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import MobileLanguageSelector from './MobileLanguageSelector';
import ErrorBoundary from './ErrorBoundary';

// Logo component that matches the screenshot
const Logo = () => (
  <div className="flex items-center">
    <img 
      src="/images/imagenwiz-logo-navbar.svg" 
      alt="iMagenWiz" 
      className="h-8" 
    />
  </div>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { logos, isLoading: logosLoading } = useSiteSettings();
  const { t, i18n } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Listen for language changes from anywhere in the app
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail?.language || i18n.language);
    };
    
    // Listen for the custom languageChanged event
    document.addEventListener('languageChanged', handleLanguageChange);
    
    // Also listen for i18next's own language change event
    const onLanguageChanged = () => {
      setCurrentLang(i18n.language);
    };
    i18n.on('languageChanged', onLanguageChanged);
    
    return () => {
      document.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 nav-links">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('nav.home')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/history"
                    className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {t('nav.history', 'History')}
                  </Link>
                </>
              )}
              <Link
                to="/pricing"
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                to="/blog"
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('nav.blog')}
              </Link>
              {/* Admin menu items - desktop */}
              {isAuthenticated && user && user.is_admin === true && (
                <>
                  <Link
                    to="/cms"
                    className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {t('nav.editor', 'CMS')}
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {t('nav.settings', 'Settings')}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {t('common.credits')}: {user?.credits || 0}
                </span>
                <div className="relative group">
                  <button className="bg-white p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none flex items-center">
                    <span>{user?.username}</span>
                    {user?.is_admin ? <span className="ml-1 text-green-600">(Admin)</span> : null}
                    <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.account')}
                    </Link>
                    
                    {user?.is_admin && (
                      <>
                        <Link
                          to="/admin/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('nav.settings', 'Admin Settings')}
                        </Link>
                        <Link
                          to="/admin/translations"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="text-teal-600">✓</span> Blog Translations
                        </Link>
                        <Link
                          to="/cms"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('nav.editor', 'CMS Dashboard')}
                        </Link>
                      </>
                    )}
                    
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
                
                <ErrorBoundary>
                  <LanguageSelector variant="outline" />
                </ErrorBoundary>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-teal-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                >
                  {t('nav.register')}
                </Link>
                <ErrorBoundary>
                  <LanguageSelector variant="outline" />
                </ErrorBoundary>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/history"
                className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.history')}
              </Link>
            </>
          )}
          <Link
            to="/pricing"
            className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.pricing')}
          </Link>
          <Link
            to="/blog"
            className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.blog')}
          </Link>
          {/* Admin menu items - mobile */}
          {isAuthenticated && user && user.is_admin === true && (
            <>
              <Link
                to="/cms"
                className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.editor', 'CMS')}
              </Link>
              <Link
                to="/admin/settings"
                className="border-transparent text-gray-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.settings', 'Settings')}
              </Link>
            </>
          )}
        </div>
        {isAuthenticated ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.username}</div>
                <div className="text-sm font-medium text-gray-500">
                  {t('common.credits')}: {user?.credits || 0}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.account')}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {t('nav.logout')}
              </button>
              <div className="px-4 py-2">
                <ErrorBoundary>
                  <MobileLanguageSelector onSelect={() => setIsMenuOpen(false)} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 px-4">
              <Link
                to="/login"
                className="text-center w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="text-center w-full bg-teal-500 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.register')}
              </Link>
              <div className="py-2">
                <ErrorBoundary>
                  <MobileLanguageSelector onSelect={() => setIsMenuOpen(false)} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;