import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const MagicBrush = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Magic Brush"
      description="Advanced AI-powered image editing with remarkable precision and flexibility"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Introducing the Magic Brush</h2>
        
        <p className="mb-4">
          The Magic Brush is iMagenWiz's flagship AI tool that puts professional-grade image editing capabilities at your fingertips. 
          Unlike traditional editing tools that require precise selections and technical expertise, the Magic Brush understands 
          what you're trying to accomplish and intelligently applies changes based on the context of your image.
        </p>
        
        <p className="mb-8">
          With just a few strokes, you can remove unwanted objects, enhance specific areas, change colors, or add realistic 
          textures - all with the simplicity of painting over the area you want to modify.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Intuitive Editing</h3>
            <p className="text-gray-700">
              Simply paint over the areas you want to change. The AI understands the context and makes intelligent adjustments.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Precise Control</h3>
            <p className="text-gray-700">
              Adjust brush size, opacity, and effect intensity for precise control over your edits with real-time preview.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Multiple Effects</h3>
            <p className="text-gray-700">
              Choose from dozens of effects including object removal, color adjustment, texture modification, and enhancement.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Magic Brush Features</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Object Removal</h3>
              <p className="text-gray-600 mb-4">
                Seamlessly remove unwanted objects, people, or distractions from your photos. 
                The Magic Brush intelligently fills the area with appropriate background content 
                that matches the surrounding textures, lighting, and patterns.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Remove photobombers from perfect vacation shots</li>
                <li>Erase power lines, trash, or other distractions</li>
                <li>Clean up product photos by removing background elements</li>
                <li>Create cleaner compositions by removing unnecessary objects</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Color & Lighting Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Selectively adjust colors and lighting in specific areas of your image. 
                Perfect for highlighting subjects, correcting exposure issues, or creating artistic effects.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Brighten underexposed areas while preserving natural look</li>
                <li>Tone down overexposed highlights</li>
                <li>Enhance colors in specific regions for attention</li>
                <li>Create dramatic lighting effects with precise control</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Texture Transformation</h3>
              <p className="text-gray-600 mb-4">
                Transform the texture of specific areas in your image with incredible realism. 
                Change surfaces, materials, and finishes while maintaining proper lighting and perspective.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Convert grass to snow, sand, or other natural surfaces</li>
                <li>Change fabric textures in product photographs</li>
                <li>Update wall finishes or flooring in interior shots</li>
                <li>Add realistic texture to flat or bland surfaces</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Touch-Up</h3>
              <p className="text-gray-600 mb-4">
                Perfect for portraits and product photography, Smart Touch-Up intelligently 
                enhances the quality of specific areas without affecting the rest of the image.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Smooth skin while preserving natural texture</li>
                <li>Enhance eyes, teeth, and facial features</li>
                <li>Remove blemishes and imperfections</li>
                <li>Sharpen product details for e-commerce photos</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Background Transformation</h3>
              <p className="text-gray-600 mb-4">
                Change or enhance backgrounds without affecting your subject. Perfect for 
                creating consistency across product photos or improving casual snapshots.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Blur backgrounds for professional-looking portraits</li>
                <li>Create consistent white or colored backgrounds for product photos</li>
                <li>Change the scene behind your subject</li>
                <li>Enhance boring or distracting backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        
        <div className="border-l-4 border-teal-500 pl-6 py-2 my-8">
          <p className="text-lg italic text-gray-700">
            "The Magic Brush uses advanced AI to understand both what you're trying to edit and the context of your image. 
            This allows for natural-looking edits that would take hours with traditional tools."
          </p>
        </div>
        
        <ol className="space-y-6">
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg">Select Your Magic Brush Effect</h3>
              <p className="text-gray-600">Choose from object removal, color adjustment, texture change, or enhancement tools.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg">Adjust Brush Settings</h3>
              <p className="text-gray-600">Set your brush size, effect strength, and other parameters for precise control.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg">Paint Over Target Area</h3>
              <p className="text-gray-600">Simply paint over the area you want to modify with your mouse or stylus.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold text-lg">Watch the Magic Happen</h3>
              <p className="text-gray-600">Our AI processes your strokes and intelligently applies the effect based on image context.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">5</div>
            <div>
              <h3 className="font-semibold text-lg">Fine-tune as Needed</h3>
              <p className="text-gray-600">Use the eraser tool or adjust your brush for perfect results, with unlimited undos.</p>
            </div>
          </li>
        </ol>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Try Magic Brush Today</h2>
        
        <p className="mb-6">
          Experience the power of AI-assisted editing for yourself. The Magic Brush is available on all iMagenWiz plans, 
          with more advanced features and higher resolution processing on our Pro and Enterprise tiers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Free Plan</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic Magic Brush functionality</span>
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
                <span>Standard resolution processing</span>
              </li>
            </ul>
            <a 
              href="/register" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              Try Free
            </a>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-sm rounded-lg border border-teal-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Pro Plan</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced Magic Brush with all effects</span>
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
                <span>High-resolution processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Save custom brush presets</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default MagicBrush;