import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const MagicBrush = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Magic Brush"
      description="Transform your images with precision using our AI-powered Magic Brush tool"
      showGetStarted={true}
    >
      <h2 className="text-xl font-bold mt-8 mb-4">Advanced AI-Powered Image Editing</h2>
      
      <p>
        The Magic Brush is iMagenWiz's flagship feature that enables you to make precise, intelligent edits to your images with just a few strokes. Powered by state-of-the-art AI technology, our Magic Brush understands the context of your image and makes smart editing decisions automatically.
      </p>
      
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Object Removal</h3>
          <p>Easily remove unwanted objects, people, or distractions from your photos with precision.</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Background Replacement</h3>
          <p>Switch backgrounds or place your subjects in entirely new scenes with natural-looking results.</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Color Correction</h3>
          <p>Adjust and enhance colors in specific areas of your image without affecting the rest.</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Detail Enhancement</h3>
          <p>Bring out hidden details and add clarity to important elements in your photos.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">How It Works</h2>
      
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li>
          <strong>Upload your image</strong> - Start by uploading any image you want to edit.
        </li>
        <li>
          <strong>Select the Magic Brush tool</strong> - Choose from our suite of intelligent brush tools tailored for different editing needs.
        </li>
        <li>
          <strong>Draw over the area</strong> - Simply mark the area you want to modify with a few brush strokes.
        </li>
        <li>
          <strong>Let AI do the work</strong> - Our AI instantly analyzes your input and makes contextually aware edits.
        </li>
        <li>
          <strong>Fine-tune as needed</strong> - Make adjustments with our intuitive controls until you achieve the perfect result.
        </li>
      </ol>

      <h2 className="text-xl font-bold mt-8 mb-4">Key Benefits</h2>
      
      <ul className="list-disc pl-6 mb-6 space-y-3">
        <li>
          <strong>Save time</strong> - Complete complex edits in seconds that would take hours in traditional editing software.
        </li>
        <li>
          <strong>Professional results</strong> - Achieve high-quality, natural-looking edits without professional skills.
        </li>
        <li>
          <strong>User-friendly</strong> - Intuitive interface makes advanced editing accessible to everyone.
        </li>
        <li>
          <strong>Endless creative possibilities</strong> - Unleash your creativity with tools that adapt to your unique vision.
        </li>
        <li>
          <strong>Cloud-based</strong> - Edit from anywhere, on any device, without installing heavy software.
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">Use Cases</h2>
      
      <div className="my-6 space-y-4">
        <div className="border-l-4 border-teal-500 pl-4 py-2">
          <h3 className="font-semibold">Product Photography</h3>
          <p>Remove distractions, enhance products, and create consistent backgrounds for your e-commerce listings.</p>
        </div>
        
        <div className="border-l-4 border-teal-500 pl-4 py-2">
          <h3 className="font-semibold">Portrait Retouching</h3>
          <p>Enhance portraits with natural skin smoothing, blemish removal, and lighting adjustments.</p>
        </div>
        
        <div className="border-l-4 border-teal-500 pl-4 py-2">
          <h3 className="font-semibold">Real Estate</h3>
          <p>Remove temporary objects, enhance spaces, and improve lighting in property photographs.</p>
        </div>
        
        <div className="border-l-4 border-teal-500 pl-4 py-2">
          <h3 className="font-semibold">Digital Marketing</h3>
          <p>Create compelling visuals for marketing campaigns with perfectly edited images that captivate your audience.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Customer Testimonials</h2>
      
      <div className="my-6 bg-gray-50 p-6 rounded-lg italic">
        "The Magic Brush tool has completely transformed my workflow. What used to take me hours in Photoshop now takes just minutes. The AI understands exactly what I'm trying to achieve with minimal guidance."
        <p className="mt-2 font-semibold not-italic">— Sarah T., Professional Photographer</p>
      </div>
      
      <div className="my-6 bg-gray-50 p-6 rounded-lg italic">
        "As someone with no design background, I was amazed at how easily I could edit product photos for my online store. The Magic Brush is truly magical!"
        <p className="mt-2 font-semibold not-italic">— Michael K., E-commerce Business Owner</p>
      </div>

      <div className="my-8 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Do I need design experience to use the Magic Brush?</h3>
            <p>No, the Magic Brush is designed to be intuitive and accessible for users of all skill levels. Our AI technology does the heavy lifting for you.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">What file formats are supported?</h3>
            <p>The Magic Brush supports common image formats including JPG, PNG, TIFF, and WebP files.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Are there limits to how many images I can edit?</h3>
            <p>The number of images you can edit depends on your subscription plan. We offer flexible options for both occasional users and professionals who need to process many images.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Can I use the edited images commercially?</h3>
            <p>Yes, you retain full rights to your edited images and can use them for personal or commercial purposes.</p>
          </div>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default MagicBrush;