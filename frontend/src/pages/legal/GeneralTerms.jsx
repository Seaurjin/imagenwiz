import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const GeneralTerms = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white">
      <Helmet>
        <title>{t('footer.generalTerms')} | iMagenWiz</title>
        <meta name="description" content="General Terms and Conditions for iMagenWiz" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('footer.generalTerms')}</h1>
        
        <div className="prose prose-teal max-w-none">
          <p className="text-lg mb-6">Last updated: April 19, 2025</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. General Provisions</h2>
          <p>
            These General Terms and Conditions ("Terms") govern the business relationship between iMagenWiz ("Service Provider," "we," "our," or "us") and the users of our services ("Customer," "User," "you," or "your"). By accessing or using our services, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Service Description</h2>
          <p>
            iMagenWiz provides an AI-powered image processing and content management platform that allows users to manipulate, edit, and manage visual content. The specific features and functionality of our services are described on our website and may be updated from time to time.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">3. Contract Formation</h2>
          <p>
            A contract between you and iMagenWiz is formed when you register for an account or subscribe to one of our paid plans. By entering into this contract, you confirm that you are at least 18 years old or have the necessary legal capacity to enter into contracts under the laws of your jurisdiction.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">4. Prices and Payment Terms</h2>
          <p>
            4.1 Our current prices are listed on our website. All prices are exclusive of applicable taxes unless otherwise stated.<br />
            4.2 Payment for our services is due according to the billing cycle of your selected subscription plan.<br />
            4.3 We accept payment through the payment methods specified on our website, primarily through our secure payment processor, Stripe.<br />
            4.4 If your payment method is declined or fails, we reserve the right to suspend your access to our services until payment is successfully processed.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">5. Subscription Terms</h2>
          <p>
            5.1 Our subscription plans automatically renew at the end of each billing cycle unless canceled by you before the renewal date.<br />
            5.2 You may cancel your subscription at any time through your account settings or by contacting our customer support. Cancellation will take effect at the end of your current billing cycle.<br />
            5.3 No refunds or credits will be provided for partial subscription periods or unused credits unless required by applicable law.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">6. Service Availability and Maintenance</h2>
          <p>
            6.1 We strive to ensure that our services are available 24/7, but we do not guarantee uninterrupted access.<br />
            6.2 We may conduct scheduled maintenance during which our services may be temporarily unavailable. We will attempt to provide reasonable notice of scheduled maintenance.<br />
            6.3 We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">7. Customer Obligations</h2>
          <p>
            7.1 You are responsible for ensuring that your use of our services complies with all applicable laws and regulations.<br />
            7.2 You must not use our services to store, process, or transmit any content that is illegal, harmful, threatening, abusive, or otherwise objectionable.<br />
            7.3 You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">8. Data Protection and Privacy</h2>
          <p>
            8.1 We process personal data in accordance with our Privacy Policy, which is incorporated into these Terms by reference.<br />
            8.2 You represent and warrant that you have the right to provide any data or content that you upload to our services and that your use of our services does not violate any third-party rights.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">9. Intellectual Property Rights</h2>
          <p>
            9.1 You retain all rights to the content you upload to our services.<br />
            9.2 By uploading content to our services, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content solely for the purpose of providing and improving our services.<br />
            9.3 All intellectual property rights in our services, including but not limited to software, design, and trademarks, remain the property of iMagenWiz or our licensors.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">10. Warranty and Liability</h2>
          <p>
            10.1 Our services are provided "as is" without any warranties, express or implied.<br />
            10.2 To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.<br />
            10.3 Our total liability for any claims arising from or related to these Terms shall not exceed the amount paid by you for our services during the 12 months preceding the claim.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">11. Termination</h2>
          <p>
            11.1 We may terminate or suspend your access to our services immediately if you breach these Terms or if we are required to do so by law.<br />
            11.2 You may terminate your agreement with us by canceling your subscription and closing your account.<br />
            11.3 Upon termination, you will lose access to our services and any content stored on our platform.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">12. Governing Law and Dispute Resolution</h2>
          <p>
            12.1 These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which iMagenWiz is registered.<br />
            12.2 Any disputes arising from or related to these Terms shall be resolved through good-faith negotiation. If negotiation fails, the dispute shall be submitted to the competent courts of the jurisdiction in which iMagenWiz is registered.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">13. Amendments to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any significant changes by posting a notice on our website or by sending an email. Your continued use of our services after any changes to the Terms constitutes your acceptance of the modified Terms.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">14. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:<br />
            Email: legal@imagenwiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralTerms;