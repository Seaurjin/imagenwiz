import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Help = () => {
  const { t } = useTranslation('common');
  const [activeCategory, setActiveCategory] = useState('general');
  
  // FAQ categories
  const categories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'features', name: 'Features & Tools' },
    { id: 'technical', name: 'Technical Issues' },
    { id: 'privacy', name: 'Privacy & Security' }
  ];
  
  // FAQ content
  const faqItems = {
    general: [
      {
        question: "What is iMagenWiz?",
        answer: "iMagenWiz is an AI-powered image processing and content management platform that helps you transform, enhance, and manage your visual content. Our suite of tools includes background removal, image enhancement, object removal, and more, all powered by advanced artificial intelligence."
      },
      {
        question: "Do I need to install any software to use iMagenWiz?",
        answer: "No, iMagenWiz is a web-based platform that runs entirely in your browser. There's no software to download or install. Simply create an account, log in, and start editing your images right away from any device with an internet connection."
      },
      {
        question: "What image formats does iMagenWiz support?",
        answer: "iMagenWiz supports all common image formats including JPG, PNG, WebP, and TIFF. You can upload images in any of these formats and download your edited results in the format that best suits your needs."
      },
      {
        question: "Is there a limit to how many images I can edit?",
        answer: "The number of images you can edit depends on your subscription plan. Free accounts have a limited number of edits per month, while our paid plans offer higher or unlimited processing allowances based on your subscription level."
      },
      {
        question: "How do I get started with iMagenWiz?",
        answer: "Getting started is easy! Simply sign up for an account, choose a subscription plan (or start with our free option), and you'll be ready to upload and edit your first image within minutes."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click the 'Register' button in the top right corner of our website. You can sign up using your email address or continue with Google for faster registration. Follow the prompts to complete your account setup."
      },
      {
        question: "What subscription plans do you offer?",
        answer: "We offer several subscription tiers to accommodate different needs, from individual users to enterprise-level teams. Visit our Pricing page to see a detailed breakdown of our plans, features, and pricing options."
      },
      {
        question: "How do I upgrade or downgrade my subscription?",
        answer: "You can modify your subscription at any time by going to your Account Settings and selecting the 'Subscription' tab. From there, you can choose to upgrade, downgrade, or cancel your subscription."
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time through your Account Settings. Your access will continue until the end of your current billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer refunds within 14 days of purchase if you're not satisfied with our service and haven't exceeded the usage limits of your plan. Please contact our support team for assistance with refund requests."
      }
    ],
    features: [
      {
        question: "How does the Magic Brush tool work?",
        answer: "The Magic Brush is our AI-powered editing tool that allows you to make precise modifications to your images with minimal effort. Simply select the Magic Brush, choose your desired effect, and paint over the area you want to modify. Our AI will intelligently apply the effect based on the context of your image."
      },
      {
        question: "How accurate is the background removal tool?",
        answer: "Our background removal tool uses advanced AI to detect and isolate subjects with high precision. It works exceptionally well for most images, including those with complex edges like hair and transparent elements. For extremely complex images, you may need to use our refinement tools for perfect results."
      },
      {
        question: "Can I batch process multiple images at once?",
        answer: "Yes, our batch processing feature allows you to apply the same edits to multiple images simultaneously. This is especially useful for product photography, event photos, or any situation where you need consistent editing across many images."
      },
      {
        question: "Can I use my edited images commercially?",
        answer: "Yes, you retain full rights to all your edited images. You can use them for personal or commercial purposes without attribution to iMagenWiz."
      },
      {
        question: "Do you have mobile apps available?",
        answer: "We currently offer a web application that's mobile-responsive and works well on smartphones and tablets. Dedicated mobile apps for iOS and Android are in development and will be available soon."
      }
    ],
    technical: [
      {
        question: "My image isn't uploading. What should I do?",
        answer: "If you're having trouble uploading an image, first check that your file is under our 50MB size limit and in a supported format (JPG, PNG, WebP, TIFF). Try using a different browser or clearing your browser cache. If problems persist, contact our support team."
      },
      {
        question: "Why is my edited image processing taking so long?",
        answer: "Processing time depends on several factors including the size and complexity of your image, the specific tools you're using, and current server load. Most edits complete within seconds, but complex operations on very large images may take longer."
      },
      {
        question: "Can I use iMagenWiz offline?",
        answer: "iMagenWiz requires an internet connection to function since it's a cloud-based service. However, once you've downloaded your edited images, you can access them offline."
      },
      {
        question: "Which browsers are supported?",
        answer: "iMagenWiz works best on modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance."
      },
      {
        question: "My edited image quality looks reduced. Why?",
        answer: "By default, we maintain high quality in all processed images. If you notice quality reduction, check your download settings to ensure you're using the highest quality option. Very large images may be automatically compressed in the free plan; upgrade to a paid plan for full-resolution processing."
      }
    ],
    privacy: [
      {
        question: "Is my data secure with iMagenWiz?",
        answer: "Yes, we take data security very seriously. All image uploads and downloads are secured with encryption, and we implement industry-standard security practices to protect your data and account information."
      },
      {
        question: "What happens to my images after I upload them?",
        answer: "Your uploaded images are stored securely on our servers while you're working on them. After processing, the original images are retained only for a specific period based on your subscription plan, after which they are automatically deleted from our systems."
      },
      {
        question: "Does iMagenWiz collect user data?",
        answer: "We collect basic usage data to improve our service and provide support. We do not sell your personal data or images to third parties. For complete information, please review our Privacy Policy."
      },
      {
        question: "Who owns the copyright to edited images?",
        answer: "You retain all rights to your original and edited images. iMagenWiz does not claim ownership of any content you upload or create using our platform."
      },
      {
        question: "Are my images used to train your AI?",
        answer: "No, we do not use your uploaded images to train our AI without explicit consent. Your content remains private and is not used for any purpose other than providing the service you requested."
      }
    ]
  };
  
  return (
    <FooterPageTemplate
      title="Help & FAQs"
      description="Find answers to your questions about iMagenWiz features, account management, and technical support"
    >
      <p className="text-lg mb-8">
        Browse through our frequently asked questions to find quick answers to common questions. If you can't find what you're looking for, please <a href="/contact" className="text-teal-600 hover:underline">contact our support team</a> for assistance.
      </p>
      
      {/* Category navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* FAQ accordion */}
      <div className="space-y-4">
        {faqItems[activeCategory].map((item, index) => (
          <details key={index} className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
            <summary className="flex justify-between items-center cursor-pointer p-5 bg-white">
              <h3 className="font-medium text-gray-900">{item.question}</h3>
              <span className="ml-6 flex-shrink-0 text-teal-600 group-open:rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0">
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
      
      {/* Contact support section */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
        <p className="text-gray-600 mb-6">
          Our support team is ready to assist you with any questions not covered in our FAQ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default Help;