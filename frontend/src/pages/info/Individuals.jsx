import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Individuals = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Individuals"
      description="Powerful AI tools to enhance your personal photos and creative projects"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Personal Photos</h2>
        
        <p className="mb-4">
          iMagenWiz gives individuals like you the power to transform ordinary photos into extraordinary images without requiring technical expertise or expensive software. Whether you're preparing images for social media, creating personal projects, or just improving your photo collection, our intuitive AI tools make professional-quality editing accessible to everyone.
        </p>
        
        <p className="mb-6">
          From removing unwanted objects to enhancing colors and replacing backgrounds, iMagenWiz helps you achieve the perfect look for all your photos with just a few clicks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">User-Friendly Interface</h3>
            <p className="text-gray-700">
              Our intuitive design means you can start editing immediately without a learning curve. Simple controls and AI-assisted tools make complex edits remarkably easy.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">No Software to Install</h3>
            <p className="text-gray-700">
              Access iMagenWiz from any device with a web browser. No downloads, installations, or updates required - just sign in and start editing.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect for Personal Use</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Social Media Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Create stunning images that stand out in social feeds. Remove distractions, enhance colors, and create professional-looking compositions that get more engagement.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Optimize images for different social platforms</li>
                <li>Remove photobombers and unwanted objects</li>
                <li>Enhance colors and lighting for eye-catching posts</li>
                <li>Create consistent visual themes for your profile</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Personal Photo Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Breathe new life into your personal photo collection. Fix lighting issues, enhance colors, and remove distractions from your precious memories.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Restore and enhance old or damaged photos</li>
                <li>Improve poorly lit or exposed images</li>
                <li>Remove date stamps or unwanted elements</li>
                <li>Organize and maintain a stunning photo collection</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Creative Projects</h3>
              <p className="text-gray-600 mb-4">
                Turn your ideas into reality with powerful creative tools. Create custom cards, invitations, digital art, and more with professional-quality results.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Design personalized greeting cards and invitations</li>
                <li>Create custom wall art for your home</li>
                <li>Develop unique digital collages and compositions</li>
                <li>Prepare images for printing on various materials</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Online Marketplace Photos</h3>
              <p className="text-gray-600 mb-4">
                Maximize the value of items you're selling online with professional-looking product photos that attract more buyers and higher offers.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create clean, distraction-free product images</li>
                <li>Apply consistent white backgrounds for marketplace listings</li>
                <li>Enhance item details and correct color accuracy</li>
                <li>Batch process multiple items to save time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tools for Individuals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Background Removal</h3>
            <p className="text-gray-600 text-sm">
              Remove backgrounds with a single click, perfect for creating profile photos, product images, or creative compositions.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Magic Brush</h3>
            <p className="text-gray-600 text-sm">
              Remove unwanted objects, people, or distractions from your photos with intelligent AI that fills in the background naturally.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Smart Enhancement</h3>
            <p className="text-gray-600 text-sm">
              Automatically improve colors, lighting, and details in your photos while maintaining a natural look and feel.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Portrait Perfection</h3>
            <p className="text-gray-600 text-sm">
              Enhance portraits with subtle, natural-looking improvements to skin, eyes, and facial features without the "over-processed" look.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Creative Templates</h3>
            <p className="text-gray-600 text-sm">
              Access professionally designed templates for social media posts, cards, invitations, and more to jumpstart your creative projects.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quick Export</h3>
            <p className="text-gray-600 text-sm">
              Export your edited images in multiple formats and sizes, perfect for different uses from social media to printing.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose iMagenWiz</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "I've tried many photo editing apps, but iMagenWiz is by far the easiest to use while still giving professional results. I was able to fix old family photos that I thought were beyond repair!"
              </div>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-gray-500">Hobbyist Photographer</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "The background removal tool is amazing! I've been able to create professional-looking product photos for my online store without hiring a photographer or buying expensive equipment."
              </div>
              <div className="font-semibold">James K.</div>
              <div className="text-sm text-gray-500">Online Seller</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plans for Individuals</h2>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-lg mb-2">Free Plan</h3>
          <p className="text-gray-600 mb-4">
            Get started with basic editing features at no cost. Perfect for occasional use and simple edits.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Basic image editing tools</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Limited monthly edits</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Standard resolution output</span>
            </li>
          </ul>
          <a 
            href="/register" 
            className="inline-block w-full sm:w-auto py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            Try Free
          </a>
        </div>
        
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-sm rounded-lg border border-teal-200 p-6">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 mb-2">Most Popular</div>
          <h3 className="font-semibold text-lg mb-2">Pro Plan</h3>
          <p className="text-gray-600 mb-4">
            Unlock the full power of iMagenWiz with advanced features and more editing capacity.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>All advanced editing tools</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Unlimited edits</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>High-resolution output</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Save custom presets</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Priority processing</span>
            </li>
          </ul>
          <a 
            href="/pricing" 
            className="inline-block w-full sm:w-auto py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            See Pricing
          </a>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default Individuals;