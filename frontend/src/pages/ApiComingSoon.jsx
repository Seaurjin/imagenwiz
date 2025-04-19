import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineCode, HiOutlineClipboardCheck, HiOutlineDocumentText } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ApiComingSoon = () => {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            {t('api.title', 'API')}
            <span className="block text-teal-600">{t('api.comingSoon', 'Coming Soon')}</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('api.description', 'Our powerful API for iMagenWiz is currently under development. Sign up to be notified when it launches.')}
          </p>
          
          <div className="mt-12">
            <form className="sm:flex sm:max-w-lg mx-auto">
              <label htmlFor="email-address" className="sr-only">
                {t('api.emailLabel', 'Email address')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:max-w-xs rounded-md"
                placeholder={t('api.emailPlaceholder', 'Enter your email')}
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {t('api.notifyMe', 'Notify me')}
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              {t('api.privacyNotice', 'We care about your data. Read our')}
              {' '}
              <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-500">
                {t('api.privacyPolicy', 'Privacy Policy')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                    <HiOutlineCode className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">{t('api.featureOne', 'Simple Integration')}</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('api.featureOneDesc', 'Integrate with our API quickly using clear documentation and examples.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                    <HiOutlineClipboardCheck className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">{t('api.featureTwo', 'Powerful Features')}</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('api.featureTwoDesc', 'Access all of our image processing capabilities programmatically.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                    <HiOutlineDocumentText className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">{t('api.featureThree', 'Comprehensive Docs')}</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('api.featureThreeDesc', 'Clear documentation with code examples in multiple languages.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiComingSoon;