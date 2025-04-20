import React from 'react';
import { Helmet } from 'react-helmet';

const InfoPageTemplate = ({ 
  title, 
  description, 
  children, 
  heroImage,
  heroImageAlt,
  showContactCta = false
}) => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>{title} | iMagenWiz</title>
        <meta name="description" content={description} />
      </Helmet>
      
      {heroImage && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-800 opacity-90"></div>
          <div className="relative h-72 md:h-96 w-full overflow-hidden">
            <img 
              src={heroImage} 
              alt={heroImageAlt || title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!heroImage && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
              {title}
            </h1>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-teal max-w-none">
          {children}
        </div>
        
        {showContactCta && (
          <div className="mt-16 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the right solution for your needs.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPageTemplate;