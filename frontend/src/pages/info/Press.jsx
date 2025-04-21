import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Press = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Press & Partnerships"
      description="Media resources and partnership opportunities with iMagenWiz"
      showGetStarted={false}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Press Information</h2>
        
        <p className="mb-4">
          iMagenWiz is at the forefront of AI-powered image processing technology, providing intelligent tools that make
          professional image editing accessible to everyone. Our innovative platform combines cutting-edge AI models with
          an intuitive user experience, allowing individuals and businesses to achieve professional results in seconds
          rather than hours.
        </p>
        
        <p className="mb-8">
          If you're a journalist or content creator looking to cover iMagenWiz, we've provided resources below to help
          you tell our story accurately and effectively.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Company Overview</h3>
            <p className="text-gray-600 mb-4">
              iMagenWiz is a tech company focused on creating AI-powered image processing tools that make professional
              quality accessible to everyone. Our flagship products include background removal, image enhancement, and
              our innovative Magic Brush editor.
            </p>
            <a href="/about" className="text-teal-600 hover:text-teal-700 font-medium">
              Learn more about our mission →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Media Contact</h3>
            <p className="text-gray-600 mb-4">
              For press inquiries, interview requests, or additional information, please reach out to our communications team:
            </p>
            <p className="text-gray-800 font-medium">press@imagenwiz.com</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Assets</h2>
        
        <p className="mb-8">
          Below you'll find approved brand assets for media use. When using these materials, please maintain their original
          proportions and do not modify the logos or brand colors.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col items-center">
            <div className="bg-white w-full h-40 rounded flex items-center justify-center mb-4 p-4">
              <img className="max-h-full max-w-full object-contain" src="/attached_assets/iMagenWiz Logo small_1745119547734.jpg" alt="iMagenWiz Logo" />
            </div>
            <p className="text-sm text-gray-500 text-center mb-3">Primary Logo (Full Color)</p>
            <a 
              href="/attached_assets/iMagenWiz Logo small_1745119547734.jpg" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              download
            >
              Download PNG
            </a>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col items-center">
            <div className="bg-gray-800 w-full h-40 rounded flex items-center justify-center mb-4 p-4">
              <img className="max-h-full max-w-full object-contain" src="/attached_assets/iMagenWiz Logo reverse_1745075588661.jpg" alt="iMagenWiz Logo Reverse" />
            </div>
            <p className="text-sm text-gray-500 text-center mb-3">Reversed Logo (For Dark Backgrounds)</p>
            <a 
              href="/attached_assets/iMagenWiz Logo reverse_1745075588661.jpg" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              download
            >
              Download PNG
            </a>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col items-center">
            <div className="bg-white w-full h-40 rounded flex items-center justify-center mb-4 p-4 grid grid-cols-2 gap-2">
              <div className="bg-teal-600 rounded"></div>
              <div className="bg-blue-600 rounded"></div>
              <div className="bg-gray-800 rounded"></div>
              <div className="bg-gray-200 rounded"></div>
            </div>
            <p className="text-sm text-gray-500 text-center mb-3">Brand Color Palette</p>
            <a 
              href="#" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View Color Specs
            </a>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Partnership Opportunities</h2>
        
        <p className="mb-8">
          We believe in the power of strategic partnerships to create innovative solutions and expand the reach of our technology. 
          iMagenWiz offers several partnership models designed to create mutual value.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technology Integration</h3>
            <p className="text-gray-600 mb-4">
              Integrate iMagenWiz's powerful AI image processing capabilities into your platform, app, or service. Our API provides
              seamless access to our background removal, enhancement, and editing tools.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">API Access</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">SDK</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">White Label</span>
            </div>
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Explore API documentation →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategic Business Partnerships</h3>
            <p className="text-gray-600 mb-4">
              We're interested in partnerships with complementary businesses in photography, e-commerce, marketing, and creative
              services. Together, we can create integrated solutions that deliver more value to our users.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Co-Marketing</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Integration</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Joint Ventures</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Partnerships</h3>
            <p className="text-gray-600 mb-4">
              We offer special programs for educational institutions, online learning platforms, and photography/design schools.
              Help your students develop skills with professional-grade tools.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Academic Licenses</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Curriculum Integration</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Workshops</span>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Partnerships</h2>
        
        <p className="mb-8">
          If you're interested in exploring a partnership with iMagenWiz, we'd love to hear from you. Please provide some basic
          information about your organization and your partnership idea, and our team will get back to you promptly.
        </p>
        
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
          <p className="mb-6">
            Ready to discuss partnership opportunities? Reach out to our partnerships team to start the conversation.
          </p>
          <a 
            href="/contact" 
            className="inline-block py-3 px-6 bg-white text-teal-600 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-white"
          >
            Contact Us
          </a>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default Press;