import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const VideoBackgroundRemoval = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Video Background Removal"
      description="Our advanced AI video background removal technology is coming soon"
      showGetStarted={false}
    >
      <section className="mb-12">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl border border-teal-100 mb-10">
          <div className="flex items-center mb-4">
            <div className="mr-4 bg-teal-100 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-teal-800">Coming Soon</h2>
          </div>
          <p className="text-gray-700 mb-2">
            We're currently developing our AI-powered video background removal technology. This groundbreaking feature will 
            bring the same precision and ease of our image background removal tools to video content.
          </p>
          <p className="text-gray-700">
            Join our mailing list to be the first to know when this feature becomes available.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
        
        <p className="mb-8">
          iMagenWiz's upcoming Video Background Removal feature will revolutionize how content creators, marketers, and businesses 
          work with video. Our advanced AI technology will make it possible to remove and replace backgrounds in video content with 
          the same ease and precision as our image tools - maintaining consistent quality across every frame.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Frame-Perfect Removal</h3>
            <p className="text-gray-600">
              Our AI will analyze each frame to ensure consistent, high-quality background removal throughout your entire video.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Backgrounds</h3>
            <p className="text-gray-600">
              Replace video backgrounds with solid colors, gradients, images, or even other videos for unlimited creative possibilities.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Workflow</h3>
            <p className="text-gray-600">
              Simple, intuitive controls and real-time previews make video editing accessible to everyone, regardless of technical expertise.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Future Features</h2>
        
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Multiple Export Options</h3>
              <p className="text-gray-600">
                Export your videos in various formats with alpha channel support for transparent backgrounds, optimized for different platforms.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Batch Processing</h3>
              <p className="text-gray-600">
                Process multiple videos simultaneously with consistent settings, perfect for content creators with high-volume needs.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Advanced Customization</h3>
              <p className="text-gray-600">
                Fine-tune edge detection, shadows, and lighting for professional-quality results that match your creative vision.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Object Tracking & Masking</h3>
              <p className="text-gray-600">
                Select specific objects to remove or keep in your video, with intelligent tracking that follows movement across frames.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Cases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Marketing & Advertising</h3>
            <p className="text-gray-600 mb-4">
              Create professional video content with interchangeable backgrounds to target different audiences or platforms 
              without reshooting. Place products in various contexts or environments effortlessly.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Content Creation</h3>
            <p className="text-gray-600 mb-4">
              YouTubers, TikTok creators, and social media influencers can easily change video backgrounds to create 
              engaging content without expensive studio setups or green screens.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">E-Commerce & Product Videos</h3>
            <p className="text-gray-600 mb-4">
              Showcase products in various settings or against clean, consistent backgrounds for professional product videos 
              and demonstrations without complex filming setups.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Virtual Meetings & Presentations</h3>
            <p className="text-gray-600 mb-4">
              Create professional, distraction-free backgrounds for virtual meetings, webinars, and online presentations 
              without requiring special hardware or complicated setup.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6">
            Sign up for our newsletter to be notified when our Video Background Removal feature launches. 
            Early subscribers will receive exclusive access to beta testing and special introductory pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="/register" 
              className="inline-block py-3 px-6 bg-white text-teal-600 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-white"
            >
              Create an Account
            </a>
            <a 
              href="/pricing" 
              className="inline-block py-3 px-6 border border-white text-white font-medium rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-white"
            >
              View Plans
            </a>
          </div>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default VideoBackgroundRemoval;