import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import MobileLanguageSelector from './MobileLanguageSelector';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
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
                <img 
                  src="/images/imagenwiz-logo-navbar.svg?v=2" 
                  alt="iMagenWiz Logo" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
              {/* Always show CMS for admin users - desktop menu */}
              {isAuthenticated && user && user.is_admin === true && (
                <Link
                  to="/cms"
                  className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('nav.editor', 'CMS')}
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {t('common.credits')}: {user?.credits || 0}
                </span>
                <Link
                  to="/profile"
                  className="bg-white p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <span>{user?.username}</span>
                  {user?.is_admin ? <span className="ml-1 text-green-600">(Admin)</span> : null}
                </Link>

                <button
                  onClick={logout}
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                >
                  {t('nav.logout')}
                </button>
                <LanguageSelector variant="outline" />
              </div>
            ) : (
              <div className="space-x-4">
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
                <LanguageSelector variant="outline" />
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
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
            >
              {t('nav.home')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/history"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.history', 'History')}
                </Link>
              </>
            )}
            <Link
              to="/pricing"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              to="/blog"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
            >
              {t('nav.blog')}
            </Link>
            {/* Always show CMS for admin users */}
            {isAuthenticated && user && user.is_admin === true && (
              <Link
                to="/cms"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
              >
                {t('nav.editor', 'CMS')}
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="pl-3 pr-4 py-2 text-gray-700">
                  {t('common.credits')}: {user?.credits || 0}
                </div>
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.account')}
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.logout')}
                </button>
                <div className="pl-3 pr-4 py-2">
                  <MobileLanguageSelector />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  {t('nav.register')}
                </Link>
                <div className="pl-3 pr-4 py-2">
                  <MobileLanguageSelector />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;