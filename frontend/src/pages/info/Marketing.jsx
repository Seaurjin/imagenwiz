import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Marketing = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Marketing Teams"
      description="Powerful AI tools to elevate your visual content and drive engagement"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Marketing Visuals</h2>
        
        <p className="mb-4">
          In today's digital landscape, high-quality visual content is essential for cutting through the noise and capturing audience attention. 
          iMagenWiz provides marketing teams with powerful AI-driven tools to create, enhance, and manage visual assets at scale—without requiring 
          specialized design skills or expensive software.
        </p>
        
        <p className="mb-6">
          Whether you're managing social media campaigns, creating email marketing assets, or developing website content, 
          iMagenWiz helps you produce professional-quality visuals in a fraction of the time traditional methods would require.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Scale Content Production</h3>
            <p className="text-gray-700">
              Create and adapt visual content for multiple platforms and campaigns simultaneously, maintaining brand consistency while saving time and resources.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Democratize Design</h3>
            <p className="text-gray-700">
              Empower every team member to create professional-quality visuals without specialized design skills, freeing up creative resources for higher-value work.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing-Specific Solutions</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Social Media Content Creation</h3>
              <p className="text-gray-600 mb-4">
                Quickly create and optimize eye-catching visuals for multiple social platforms, maintaining brand consistency while adapting to each platform's unique requirements.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Resize images for different platforms with a single click</li>
                <li>Remove and replace backgrounds to maintain visual consistency</li>
                <li>Enhance product photos for maximum engagement</li>
                <li>Apply branded templates and filters across multiple assets</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Campaign Asset Management</h3>
              <p className="text-gray-600 mb-4">
                Create, organize, and adapt marketing campaign assets with unprecedented speed and consistency, ensuring your message stays on-brand across all channels.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Batch process images for multi-channel campaigns</li>
                <li>Create variations of key visuals for A/B testing</li>
                <li>Maintain consistent lighting and colors across product shots</li>
                <li>Transform existing assets to fit new campaign styles</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Content Localization</h3>
              <p className="text-gray-600 mb-4">
                Quickly adapt marketing materials for different regions and languages, maintaining brand consistency while respecting cultural nuances.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Replace text elements in images while preserving design integrity</li>
                <li>Adapt visual elements to suit different cultural preferences</li>
                <li>Resize and reformat designs for region-specific platforms</li>
                <li>Create culturally relevant backgrounds and contexts</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Email Marketing Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Create compelling visual content that drives higher engagement and conversion rates in your email marketing campaigns.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create eye-catching header images and CTA buttons</li>
                <li>Optimize product shots specifically for email display</li>
                <li>Create custom thumbnails that drive click-through</li>
                <li>Develop visual content series for nurture campaigns</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Ad Creative Generation</h3>
              <p className="text-gray-600 mb-4">
                Produce and optimize ad creatives for paid media campaigns across multiple platforms, improving performance while reducing production time.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate multiple ad variants from a single template</li>
                <li>Create platform-specific formats for Google, Meta, LinkedIn, and more</li>
                <li>Optimize images for different ad placements</li>
                <li>Produce animated ad variants from static images</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tools for Marketers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Background Removal & Replacement</h3>
            <p className="text-gray-600 text-sm">
              Instantly remove and replace backgrounds to create consistent brand imagery across different contexts and campaigns.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Multi-Format Creator</h3>
            <p className="text-gray-600 text-sm">
              Transform a single creative into multiple formats for different channels and platforms with automatic resizing and optimization.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Brand Style Application</h3>
            <p className="text-gray-600 text-sm">
              Apply your brand's visual style to any image, ensuring consistent color schemes, filters, and aesthetic across all marketing materials.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Magic Brush</h3>
            <p className="text-gray-600 text-sm">
              Quickly eliminate distractions, enhance specific elements, or make precise adjustments to marketing visuals with AI-powered contextual editing.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Batch Processing</h3>
            <p className="text-gray-600 text-sm">
              Apply the same edits to hundreds of images simultaneously, perfect for product catalogs, campaign rollouts, and seasonal updates.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-600 text-sm">
              Track which visual assets perform best across different channels, helping optimize your creative strategy with data-driven insights.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Marketing Teams Benefit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "iMagenWiz has transformed our content production process. What used to take our design team days now takes our marketing team hours. We've increased our visual content output by 300% while maintaining consistent brand quality across all channels."
              </div>
              <div className="font-semibold">Sarah Rodriguez</div>
              <div className="text-sm text-gray-500">Marketing Director, TechFlow Inc.</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "Being able to quickly create and optimize visuals for different platforms has been game-changing for our social media strategy. Our engagement rates have improved by 45% since we started using iMagenWiz for our content creation."
              </div>
              <div className="font-semibold">Michael Chen</div>
              <div className="text-sm text-gray-500">Social Media Manager, Brand Elevate</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Team Plans</h2>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-lg mb-2">Team Plan</h3>
          <p className="text-gray-600 mb-4">
            Designed specifically for marketing teams needing to create and manage visual content at scale.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Unlimited processing for your entire team</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Advanced batch processing capabilities</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Brand asset management and templates</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Multi-channel format optimization</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Advanced analytics and usage reporting</span>
            </li>
          </ul>
          <a 
            href="/pricing" 
            className="inline-block w-full sm:w-auto py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            See Pricing
          </a>
        </div>
        
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-sm rounded-lg border border-teal-200 p-6">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 mb-2">Enterprise Solution</div>
          <h3 className="font-semibold text-lg mb-2">Enterprise Plan</h3>
          <p className="text-gray-600 mb-4">
            Custom solutions for large marketing departments and agencies with advanced needs.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dedicated account management</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Custom API integration</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Advanced workflow automation</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Enhanced security and compliance features</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Priority processing and 24/7 support</span>
            </li>
          </ul>
          <a 
            href="/contact" 
            className="inline-block w-full sm:w-auto py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default Marketing;