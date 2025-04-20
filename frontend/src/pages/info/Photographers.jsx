import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Photographers = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Photographers"
      description="Powerful AI tools to enhance your workflow and deliver stunning professional images"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Photography Workflow</h2>
        
        <p className="mb-4">
          iMagenWiz helps professional photographers and photography studios streamline their editing workflow, save hours of tedious manual work, and deliver consistent, high-quality results to clients faster than ever before.
        </p>
        
        <p className="mb-6">
          Our AI-powered tools are designed to handle the repetitive aspects of photo editing, allowing you to focus on your creative vision and grow your business.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Professional Workflow Integration</h3>
            <p className="text-gray-700">
              iMagenWiz seamlessly integrates with your existing workflow, whether you're processing individual portraits or batch editing thousands of event photos.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Consistent Results</h3>
            <p className="text-gray-700">
              Deliver the same high-quality edits across entire photoshoots with our AI-powered batch processing and style transfer tools.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Tools for Photographers</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Advanced Portrait Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Our AI portrait tools go beyond basic retouching to provide natural-looking skin smoothing, blemish removal, and facial feature enhancement that preserves your subject's unique characteristics.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Intelligent skin retouching with texture preservation</li>
                <li>Natural enhancement of eyes, lips, and facial features</li>
                <li>Automatic detection and removal of temporary blemishes</li>
                <li>Subtle lighting improvements for flattering results</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Professional Background Management</h3>
              <p className="text-gray-600 mb-4">
                Transform, replace, or remove backgrounds with precision, maintaining fine details around complex edges like hair and transparent objects.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>One-click background removal with edge refinement tools</li>
                <li>Background replacement with lighting adjustment</li>
                <li>Studio backdrop simulation and enhancement</li>
                <li>Consistent background processing for product photography</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Batch Processing & Automation</h3>
              <p className="text-gray-600 mb-4">
                Process entire sessions in minutes instead of hours with intelligent batch editing that adapts to different shooting conditions.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Apply consistent edits across thousands of images</li>
                <li>Intelligent automation that adapts to lighting changes</li>
                <li>Custom presets and editing profiles</li>
                <li>Bulk export with client-ready watermarking</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Advanced Object Removal</h3>
              <p className="text-gray-600 mb-4">
                Quickly remove unwanted elements from your photos with our content-aware fill technology that preserves image context and quality.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Intelligent removal of photobombers, trash, and distractions</li>
                <li>Context-aware fill that matches lighting and texture</li>
                <li>Precision object selection tools</li>
                <li>Ability to remove complex objects from busy backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Photography Business Solutions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Time Savings</h3>
            <p className="text-gray-600 text-sm">
              Reduce post-processing time by up to 80%, allowing you to take on more clients and projects.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Cost Efficiency</h3>
            <p className="text-gray-600 text-sm">
              Reduce or eliminate outsourced editing costs while maintaining complete control over your style.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Client Satisfaction</h3>
            <p className="text-gray-600 text-sm">
              Faster turnaround times and consistently high-quality deliverables lead to happier clients and more referrals.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Real Photographers, Real Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "As a wedding photographer handling 30+ events per year, post-processing was consuming my life. iMagenWiz has cut my editing time in half while actually improving the consistency of my deliverables. My clients are happier, and I finally have my weekends back."
              </div>
              <div className="font-semibold">David Chen</div>
              <div className="text-sm text-gray-500">Wedding Photographer, Boston</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "The batch processing capabilities are game-changing for my product photography business. What used to take me days now happens while I'm shooting the next session. The AI background tools are so good that I've been able to simplify my in-studio setup."
              </div>
              <div className="font-semibold">Sophia Williams</div>
              <div className="text-sm text-gray-500">Commercial Photographer, Chicago</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Photographer-Specific Plans</h2>
        
        <p className="mb-6">
          We offer specialized subscription plans for photographers with features and pricing designed specifically for professional needs:
        </p>
        
        <ul className="list-disc ml-5 space-y-2 mb-6">
          <li><strong>Studio Plan</strong> - Perfect for individual photographers with unlimited processing and batch editing capabilities</li>
          <li><strong>Team Plan</strong> - Ideal for photography studios with multiple photographers and shared resources</li>
          <li><strong>Enterprise Plan</strong> - Custom solutions for high-volume photography businesses with dedicated support</li>
        </ul>
        
        <a 
          href="/pricing" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
        >
          View Photography Plans
        </a>
      </section>
      
      <div className="border-t border-gray-200 pt-8 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Can I integrate iMagenWiz with Lightroom or Capture One?</h3>
            <p>
              While we don't currently offer direct plugin integration, our platform is designed to work alongside your existing workflow. Many photographers use iMagenWiz for specific edits and batch processing before or after their standard editing process.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">How does iMagenWiz handle RAW files?</h3>
            <p>
              For optimal processing, we recommend converting RAW files to high-quality JPG or TIFF formats before uploading. Our Pro and Studio plans preserve full resolution and metadata throughout the editing process.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Is there a limit to how many photos I can process?</h3>
            <p>
              Our photographer-specific plans include higher or unlimited processing allowances designed for professional volumes. The Studio and Team plans are specifically created for photographers who need to process large batches of images regularly.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Can I create and save my own editing presets?</h3>
            <p>
              Yes, all professional plans include the ability to create, save, and share custom editing presets and processing workflows to maintain consistency across projects and team members.
            </p>
          </div>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default Photographers;