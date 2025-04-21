import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const CarDealerships = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Car Dealerships"
      description="Powerful AI tools to enhance vehicle imagery and drive more sales"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Vehicle Photography</h2>
        
        <p className="mb-4">
          In today's automotive marketplace, high-quality vehicle imagery is essential for attracting buyers and driving sales. 
          iMagenWiz provides specialized tools for car dealerships to create professional, consistent, and compelling vehicle 
          photos that help vehicles sell faster—without expensive equipment or specialized photography skills.
        </p>
        
        <p className="mb-6">
          Whether you manage a small independent dealership or a multi-location auto group, our AI-powered solutions help you 
          create, enhance, and manage vehicle imagery at scale, resulting in higher engagement, more leads, and faster sales.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Sell Vehicles Faster</h3>
            <p className="text-gray-700">
              Dealerships using professional-quality images sell vehicles up to 36% faster than those using basic smartphone photos.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Generate More Leads</h3>
            <p className="text-gray-700">
              High-quality, consistent vehicle imagery increases lead generation by up to 42% on listing sites and dealer websites.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Automotive-Specific Solutions</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Dealership Background Replacement</h3>
              <p className="text-gray-600 mb-4">
                Create clean, consistent vehicle listings by automatically replacing messy lot backgrounds with professional virtual environments. Make every vehicle stand out with perfect lighting, regardless of weather or time of day.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Remove distracting lot backgrounds in one click</li>
                <li>Replace with virtual showrooms or outdoor settings</li>
                <li>Maintain consistent branding across all listings</li>
                <li>Create seasonal or promotional background themes</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Vehicle Image Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Automatically enhance vehicle photos with professional-grade adjustments to lighting, color, clarity, and reflections. Make every vehicle's paint and details pop, even in challenging lighting conditions.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Enhance paint finish and reflections</li>
                <li>Correct color to show true vehicle appearance</li>
                <li>Improve interior shots with better lighting</li>
                <li>Remove unwanted reflections and glare</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Automated Feature Highlighting</h3>
              <p className="text-gray-600 mb-4">
                Our AI automatically detects and enhances key vehicle features like wheels, grilles, and interior elements. Create visual focus on selling points that matter to buyers without manual editing.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Auto-detect and highlight premium wheels</li>
                <li>Enhance technology features and screens</li>
                <li>Optimize lighting on interior luxury features</li>
                <li>Create focus on brand-specific design elements</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Platform Optimization</h3>
              <p className="text-gray-600 mb-4">
                Automatically create optimized image sets for different platforms including your website, AutoTrader, Cars.com, Facebook Marketplace, and other listing sites—all with consistent quality and appearance.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate platform-specific image sizes and formats</li>
                <li>Create optimized mobile and desktop versions</li>
                <li>Apply appropriate compression for fast loading</li>
                <li>Maintain consistent appearance across all platforms</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Batch Processing</h3>
              <p className="text-gray-600 mb-4">
                Process entire vehicle inventories in minutes instead of hours. Batch upload images from multiple vehicles and apply consistent enhancements to all, saving tremendous time and ensuring brand consistency.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Process hundreds of vehicle images simultaneously</li>
                <li>Apply dealership-specific templates and styles</li>
                <li>Group by vehicle type for consistent treatment</li>
                <li>Auto-categorize interior, exterior, and detail shots</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Dealership Branding Integration</h3>
              <p className="text-gray-600 mb-4">
                Automatically apply your dealership branding to vehicle images with watermarks, logos, and custom overlays. Create a consistent, professional look that reinforces your brand identity.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Add dealership logo watermarks</li>
                <li>Create custom price and feature callouts</li>
                <li>Apply consistent branded borders or frames</li>
                <li>Add QR codes for quick mobile access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Standalone Platform</h3>
            <p className="text-gray-600 text-sm">
              Access all tools through our web-based platform with no software to install. Perfect for any dealership size.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">DMS Integration</h3>
            <p className="text-gray-600 text-sm">
              Connect directly with popular Dealer Management Systems for seamless inventory image management.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Mobile App</h3>
            <p className="text-gray-600 text-sm">
              Capture and enhance vehicle photos on the go with our dedicated mobile application for iOS and Android.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Compatible With Your Systems</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#1877f2] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#e50914] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.492 20.93c4.939 0 8.93-4.001 8.93-8.93 0-4.929-3.991-8.93-8.93-8.93-4.939 0-8.93 4.001-8.93 8.93 0 4.929 3.991 8.93 8.93 8.93zM12.492 0c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12 5.373-12 12-12z"/>
              <path d="M14.423 8.735l-1.305 4.59H10.92l1.434-4.59h2.069zm1.237-2.895h-6.677l-3.146 9.882h2.983l.61-1.924h3.118l-.595 1.924h3.018l2.587-9.882h-1.898z"/>
            </svg>
            <span className="text-sm font-medium">AutoTrader</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#eb001b] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path d="M9.678 11.467H7.922c-.149 0-.29.07-.38.19a.507.507 0 00-.099.424c.88.396.323.694.644.694h1.591v.845H7.922a1.534 1.534 0 01-1.369-.845 1.515 1.515 0 01.297-1.693 1.534 1.534 0 011.072-.461h1.756v.845zm1.9 0v1.79c0 .157.127.284.284.284h1.473v.845h-1.473c-.623 0-1.129-.506-1.129-1.129v-1.79h.845zm4.61 0h-2.824v2.153h-.845v-2.998h3.67v.845z"/>
            </svg>
            <span className="text-sm font-medium">Cars.com</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#0f65ef] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.71 0H7.29C3.27 0 0 3.27 0 7.29v9.41C0 20.73 3.27 24 7.29 24h9.41C20.73 24 24 20.73 24 16.71V7.29C24 3.27 20.73 0 16.71 0zm.9 15.92c-.31.98-1.14 1.65-2.16 1.65-1.94 0-3.5-1.57-3.5-3.5 0-1.2.64-2.26 1.58-2.86-.6.25-1.25.38-1.92.38-2.76 0-5-2.24-5-5 0-.55.09-1.07.25-1.57-.3.17-.65.27-1.02.27-.86 0-1.57-.71-1.57-1.57 0-.86.71-1.57 1.57-1.57.86 0 1.57.71 1.57 1.57 0 .37-.13.7-.35.97.55-.22 1.15-.35 1.77-.35 2.76 0 5 2.24 5 5 0 .7-.14 1.36-.4 1.96.76-.47 1.64-.75 2.6-.75 2.76 0 5 2.24 5 5 0 .46-.06.9-.18 1.33.12-.05.26-.08.39-.08.64 0 1.17.51 1.17 1.15 0 .64-.52 1.17-1.17 1.17-.43 0-.8-.24-1-.58z"/>
            </svg>
            <span className="text-sm font-medium">CarGurus</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#0077c8] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.553 2h6.894L24 10.554v2.892L15.447 22H8.553L0 13.446v-2.892L8.553 2zm.844 3L3 10.446v3.108L9.397 19h5.206L21 13.554v-3.108L14.603 5H9.397z"/>
              <path d="M7.5 16.5L7.5 16.5 11.999 9.5 16.5 16.5z"/>
            </svg>
            <span className="text-sm font-medium">CDK Global</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#00a0df] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.667c-5.891 0-10.667-4.776-10.667-10.667S6.109 1.333 12 1.333 22.667 6.109 22.667 12 17.891 22.667 12 22.667z"/>
              <path d="M11.458 7.292v5.333c0 .368.298.667.667.667H17.5c.368 0 .667-.298.667-.667 0-3.452-2.798-6.25-6.25-6.25-.368 0-.667.298-.667.667H7.458c-.368 0-.667.298-.667.667 0 3.452 2.798 6.25 6.25 6.25.368 0 .667-.298.667-.667v-5.333c0-.368-.298-.667-.667-.667-3.452 0-6.25 2.798-6.25 6.25 0 .368.298.667.667.667h3.792c.368 0 .667-.298.667-.667 0-3.452-2.798-6.25-6.25-6.25-.368 0-.667.298-.667.667v5.333"/>
            </svg>
            <span className="text-sm font-medium">Reynolds & Reynolds</span>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Dealerships Benefit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "Before iMagenWiz, we were spending hours editing vehicle photos or paying a third-party service thousands each month. Now our team can process an entire day's inventory in minutes, with better quality than we ever had before. Our vehicles look spectacular online and our time-to-sale has decreased by over 20%."
              </div>
              <div className="font-semibold">Michael Roberts</div>
              <div className="text-sm text-gray-500">General Manager, Capital City Motors</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "As a multi-location auto group, maintaining consistent imagery across all our stores was nearly impossible. iMagenWiz's batch processing and integration with our DMS has standardized our visual presence and helped us build a stronger brand. We've seen a 35% increase in website leads since implementation."
              </div>
              <div className="font-semibold">Jennifer Martinez</div>
              <div className="text-sm text-gray-500">Marketing Director, Premier Auto Group</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dealership Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Single Rooftop</h3>
            <div className="text-3xl font-bold mb-4">$399<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Perfect for independent dealerships with a single location.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Up to 150 vehicles per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All core features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>3 user accounts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Email support</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md text-center font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Get Started
            </a>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-md rounded-lg border border-teal-200 p-6 transform md:scale-105 z-10">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 mb-2">Most Popular</div>
            <h3 className="font-semibold text-lg mb-2">Multi-Location</h3>
            <div className="text-3xl font-bold mb-4">$999<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Ideal for dealer groups with multiple locations.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Up to 500 vehicles per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All advanced features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>10 user accounts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>DMS integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              Get Started
            </a>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <p className="text-gray-600 mb-4">
              For large dealer groups and automotive enterprises.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited vehicles</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All premium features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited user accounts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <a 
              href="/contact" 
              className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md text-center font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default CarDealerships;