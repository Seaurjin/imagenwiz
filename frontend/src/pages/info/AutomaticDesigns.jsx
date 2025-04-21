import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const AutomaticDesigns = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Create Automatic Designs"
      description="Harness the power of AI to create stunning, professional designs in seconds"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Introducing Automatic Designs</h2>
        
        <p className="mb-4">
          iMagenWiz's Automatic Designs feature transforms how you create visual content by leveraging our advanced AI 
          to generate professional, ready-to-use designs in seconds. Whether you're a marketer, social media manager, 
          e-commerce seller, or content creator, our AI design assistant helps you produce stunning visuals without the 
          steep learning curve of traditional design software.
        </p>
        
        <p className="mb-8">
          Simply describe what you need, choose a style, and our AI will generate multiple design options tailored to 
          your specifications. From social media posts and digital ads to product photography enhancements and marketing 
          materials - creating beautiful designs has never been easier.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Fast & Effortless</h3>
            <p className="text-gray-700">
              Go from concept to finished design in seconds, not hours. Save time with AI-powered design generation.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Professional Quality</h3>
            <p className="text-gray-700">
              Create designs that look like they were made by a professional designer, perfectly sized for any platform.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Endless Creativity</h3>
            <p className="text-gray-700">
              Generate multiple design variations and styles to find the perfect look for your brand or project.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Automatic Design Features</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Text-to-Design Generation</h3>
              <p className="text-gray-600 mb-4">
                Simply describe what you want, and our AI will generate multiple design options based on your description.
                Specify elements, colors, mood, style and more for tailored results.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate social media posts optimized for any platform</li>
                <li>Create digital ads in standard sizes for campaigns</li>
                <li>Design branded promotional materials</li>
                <li>Generate product showcases and lifestyle images</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Brand & Style Consistency</h3>
              <p className="text-gray-600 mb-4">
                Save your brand colors, fonts, and style preferences to ensure all generated designs maintain your visual identity.
                Create design sets that work together cohesively across multiple platforms.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Upload your logo and brand assets for automatic integration</li>
                <li>Save custom templates for recurring design needs</li>
                <li>Maintain consistent visual branding across all designs</li>
                <li>Create design variations that share a unified theme</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Image Enhancement & Transformation</h3>
              <p className="text-gray-600 mb-4">
                Upload your existing product photos or images and have our AI transform them into professional marketing
                materials with backgrounds, text, and design elements that complement your products.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create professional product listings from simple photos</li>
                <li>Generate lifestyle contexts for product images</li>
                <li>Add seasonal themes or promotional elements to existing images</li>
                <li>Transform casual photos into professional marketing materials</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Format Design Sets</h3>
              <p className="text-gray-600 mb-4">
                Generate coordinated design sets for multi-channel campaigns with a single prompt. Get versions optimized for
                each platform while maintaining a consistent visual identity across all formats.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create matching designs for Instagram, Facebook, Twitter, and LinkedIn</li>
                <li>Generate web banners and email headers that share design elements</li>
                <li>Produce coordinated designs for entire marketing campaigns</li>
                <li>Adapt your designs across different dimensions and formats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        
        <div className="border-l-4 border-teal-500 pl-6 py-2 my-8">
          <p className="text-lg italic text-gray-700">
            "Our AI-driven design system combines visual intelligence with creative principles to generate designs that are
            not just visually appealing, but strategically effective for your specific use case."
          </p>
        </div>
        
        <ol className="space-y-6">
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg">Describe Your Vision</h3>
              <p className="text-gray-600">Tell our AI what you want to create - be as specific or general as you like.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg">Select Your Parameters</h3>
              <p className="text-gray-600">Choose format, style, color palette, and add any specific requirements.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg">Generate Multiple Options</h3>
              <p className="text-gray-600">Our AI creates several design variations based on your specifications.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold text-lg">Refine & Customize</h3>
              <p className="text-gray-600">Make adjustments to the generated designs or request new variations.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">5</div>
            <div>
              <h3 className="font-semibold text-lg">Download & Use</h3>
              <p className="text-gray-600">Download your finished designs in multiple formats ready for immediate use.</p>
            </div>
          </li>
        </ol>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Try Automatic Designs Today</h2>
        
        <p className="mb-6">
          Experience the power of AI-assisted design for yourself. Automatic Designs is available on all iMagenWiz Pro and Enterprise plans,
          with additional advanced features and priority generation on our Enterprise tier.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Pro Plan</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Full access to Automatic Designs</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Up to 100 designs per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Standard resolution designs</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              See Pro Plan
            </a>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-sm rounded-lg border border-teal-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Enterprise Plan</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited designs generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>High-resolution designs</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom brand profile storage</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              See Enterprise Plan
            </a>
          </div>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default AutomaticDesigns;