import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Enterprise = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Enterprise"
      description="Advanced AI image solutions for scalable business operations"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise-Grade Image Intelligence</h2>
        
        <p className="mb-4">
          In today's digital-first business environment, visual content at enterprise scale presents unique challenges
          in creation, management, and optimization. iMagenWiz provides robust, secure, and highly scalable AI-powered 
          image processing solutions designed specifically for the complex needs of large organizations.
        </p>
        
        <p className="mb-6">
          Our enterprise solutions help Fortune 500 companies, multinational corporations, and large organizations 
          transform their visual content operations with advanced automation, integration capabilities, and 
          enterprise-grade security—driving efficiency and maintaining brand consistency across global operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Scale Operations Globally</h3>
            <p className="text-gray-700">
              Process millions of images with consistent quality across all markets, maintaining brand standards while adapting to regional needs.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Streamline Complex Workflows</h3>
            <p className="text-gray-700">
              Eliminate bottlenecks in visual content creation with automated processing that integrates seamlessly with your existing systems.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise-Specific Solutions</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Global Content Management</h3>
              <p className="text-gray-600 mb-4">
                Manage visual assets across multiple brands, regions, and platforms with comprehensive governance controls 
                and centralized management. Ensure consistent brand standards while enabling local market adaptation.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Centralized visual asset repository with advanced search</li>
                <li>Multi-brand, multi-market governance controls</li>
                <li>Regional variant automation with localization support</li>
                <li>Global content distribution with version control</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Enterprise Security & Compliance</h3>
              <p className="text-gray-600 mb-4">
                Meet the strictest corporate security requirements with our enterprise-grade infrastructure, 
                compliance certifications, and comprehensive data protection measures.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>SOC 2 Type II and ISO 27001 certified infrastructure</li>
                <li>GDPR, CCPA, and HIPAA compliant operations</li>
                <li>AES-256 encryption at rest and in transit</li>
                <li>Role-based access control with SSO integration</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Advanced Enterprise Integration</h3>
              <p className="text-gray-600 mb-4">
                Seamlessly integrate iMagenWiz's capabilities into your existing enterprise systems, 
                content platforms, and workflows with our extensive API and connector library.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Enterprise DAM and CMS integration</li>
                <li>Cross-platform content synchronization</li>
                <li>ERP and PIM system connectors</li>
                <li>Custom workflow automation via webhooks</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">High-Volume Processing</h3>
              <p className="text-gray-600 mb-4">
                Process millions of images with high throughput, consistent quality, and distributed processing 
                capabilities designed for enterprise-scale operations.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Dedicated processing capacity with SLA guarantees</li>
                <li>Parallel batch processing for multi-million image catalogs</li>
                <li>Automated quality assurance and consistency checks</li>
                <li>Load-balanced processing across global data centers</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Custom AI Model Development</h3>
              <p className="text-gray-600 mb-4">
                Work with our AI research team to develop custom image processing models tailored to your unique 
                industry requirements and visual content challenges.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Industry-specific AI model training</li>
                <li>Proprietary dataset utilization with privacy guarantees</li>
                <li>Custom algorithm development for specialized processing</li>
                <li>Continuous model improvement and refinement</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Enterprise Analytics & Insights</h3>
              <p className="text-gray-600 mb-4">
                Gain comprehensive visibility into your visual content operations with advanced analytics, 
                performance metrics, and actionable intelligence.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Real-time processing and usage dashboards</li>
                <li>Visual content performance analysis</li>
                <li>Cross-channel asset effectiveness tracking</li>
                <li>AI-driven content optimization recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Story Section */}
      <section className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl overflow-hidden border border-indigo-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Story</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-2/3 pr-0 md:pr-8 mb-6 md:mb-0">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">NeoAnime Studios</h3>
                <p className="text-gray-600 mb-4">
                  A leading Japanese "二次元" animation studio transformed their IP merchandise development 
                  using iMagenWiz, reducing design time from weeks to days and dramatically expanding 
                  their product catalog with a fraction of the resources.
                </p>
                <blockquote className="italic border-l-4 border-indigo-500 pl-4 my-4 text-gray-600">
                  "The speed and quality of designs we can produce with iMagenWiz has completely transformed 
                  our merchandising strategy. We can now respond to fan demand almost immediately, creating 
                  products for characters as soon as they become popular."
                </blockquote>
                <div className="mt-4">
                  <Link to="/success-stories" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                    Read the full story
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-lg text-white">
                  <div className="text-lg font-bold mb-3">Results at a glance</div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-white mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>47% increase in merchandise revenue</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-white mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>200+ new product SKUs in 6 months</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-white mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Development time cut by 80%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/success-stories" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Explore More Success Stories
            </Link>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Deployment Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Cloud-Based SaaS</h3>
            <p className="text-gray-600 text-sm">
              Our fully managed cloud solution with dedicated enterprise resources, global availability, and automatic scaling.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Private Cloud</h3>
            <p className="text-gray-600 text-sm">
              Dedicated instance within your private cloud environment, meeting specific security and compliance requirements.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">On-Premises Deployment</h3>
            <p className="text-gray-600 text-sm">
              Full on-premises solution with hardware specifications and deployment support for high-security environments.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Support & Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">Enterprise Support</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>24/7 priority technical support</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Dedicated technical account management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Guaranteed response time SLAs</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority feature development consideration</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">Professional Services</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Enterprise implementation services</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom integration development</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Workflow optimization consulting</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Dedicated training and enablement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Industry Solutions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold">Retail & E-commerce</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Scale product imagery across millions of SKUs, enable consistent visuals across marketplaces, and optimize imagery for conversion.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Media & Publishing</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Streamline image processing for news and content organizations, enable multi-platform optimization, and automate content adaptation.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold">Real Estate</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Enhance property imagery at scale, create virtual staging, and maintain consistent visual standards across global property portfolios.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold">Retail & Fashion</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Streamline product photography, generate consistent on-model imagery, and create seasonal campaign visuals efficiently.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Financial Services</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Process sensitive documents with compliance-focused image processing, secure content management, and audit-ready operations.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold">Manufacturing</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Standardize product documentation imagery, maintain part catalogs, and enable visual quality control across global operations.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trusted by Global Enterprises</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "iMagenWiz has transformed how our global marketing teams create and manage visual content. We've reduced time-to-market for campaign assets by 60% while maintaining consistent brand standards across 24 countries."
              </div>
              <div className="font-semibold">Jennifer Morgan</div>
              <div className="text-sm text-gray-500">VP of Global Marketing Operations, Fortune 100 Technology Company</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "The integration capabilities and enterprise-grade security of iMagenWiz allowed us to centralize our visual asset management across our entire product catalog. Processing over 3 million product images annually is now seamless and consistent."
              </div>
              <div className="font-semibold">David Chen</div>
              <div className="text-sm text-gray-500">CTO, Global Retail Corporation</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to discuss your enterprise needs?</h2>
        <p className="text-gray-600 mb-6">
          Our enterprise team will work with you to develop a customized solution that meets your organization's specific requirements.
        </p>
        <a 
          href="/contact" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
        >
          Contact Enterprise Sales
        </a>
      </section>
    </FooterPageTemplate>
  );
};

export default Enterprise;