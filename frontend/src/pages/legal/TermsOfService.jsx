import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white">
      <Helmet>
        <title>{t('footer.terms')} | iMagenWiz</title>
        <meta name="description" content="Terms of Service for iMagenWiz" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('footer.terms')}</h1>
        
        <div className="prose prose-teal max-w-none">
          <p className="text-lg mb-6">Last updated: April 19, 2025</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to iMagenWiz ("we," "our," or "us"). By accessing or using our AI-powered image processing and content management platform, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Definitions</h2>
          <p>
            <strong>"Service"</strong> refers to the iMagenWiz platform, website, and all related applications and services.<br />
            <strong>"User"</strong> refers to any individual or entity that accesses or uses the Service.<br />
            <strong>"Content"</strong> refers to any images, text, or other materials uploaded, processed, or created using the Service.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">3. Account Registration</h2>
          <p>
            To use certain features of the Service, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">4. Subscription and Payment</h2>
          <p>
            We offer various subscription plans as described on our pricing page. By subscribing to a paid plan, you agree to pay all fees associated with your selected plan. All payments are processed through our secure payment processor, Stripe. Subscription fees are non-refundable except as required by law or as expressly stated in these Terms.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">5. Credits System</h2>
          <p>
            Our platform operates using a credits system. Each image processing operation consumes a certain number of credits based on your subscription plan. Unused credits expire at the end of your billing cycle unless otherwise specified in your plan details.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">6. User Content</h2>
          <p>
            You retain all rights to the Content you upload to the Service. By uploading Content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your Content solely for the purpose of providing and improving the Service.
          </p>
          <p>
            You are solely responsible for ensuring that your Content does not violate any third-party rights, including intellectual property rights, privacy rights, or other personal or proprietary rights.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">7. Prohibited Uses</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Upload, transmit, or distribute any Content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
            <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">8. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by iMagenWiz and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, iMagenWiz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, resulting from your use of the Service or any Content processed through the Service.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">10. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any significant changes by posting a notice on our website or by sending an email. Your continued use of the Service after any changes to the Terms constitutes your acceptance of the modified Terms.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">11. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which iMagenWiz is registered, without regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:<br />
            Email: legal@imagenwiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;