import React from 'react';
import { Helmet } from 'react-helmet';

const FooterPageTemplate = ({ 
  title, 
  description, 
  children, 
  topImage = null,
  showGetStarted = false
}) => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>{title} | iMagenWiz</title>
        <meta name="description" content={description} />
      </Helmet>
      
      {topImage && (
        <div className="w-full bg-gradient-to-r from-teal-500 to-blue-500 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-extrabold text-white mb-4">{title}</h1>
                <p className="text-xl text-white opacity-90">{description}</p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img src={topImage} alt={title} className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ${!topImage ? 'pt-16' : ''}`}>
        {!topImage && (
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{title}</h1>
        )}
        
        <div className="prose prose-teal max-w-none">
          {children}
        </div>
        
        {showGetStarted && (
          <div className="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of individuals and businesses who are already transforming their images with iMagenWiz.
            </p>
            <a 
              href="/pricing" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterPageTemplate;