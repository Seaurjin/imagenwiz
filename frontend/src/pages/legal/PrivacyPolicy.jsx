import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white">
      <Helmet>
        <title>{t('footer.privacy')} | iMagenWiz</title>
        <meta name="description" content="Privacy Policy for iMagenWiz" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('footer.privacy')}</h1>
        
        <div className="prose prose-teal max-w-none">
          <p className="text-lg mb-6">Last updated: April 19, 2025</p>
          
          <p>
            At iMagenWiz, we are committed to protecting your privacy and handling your personal data with transparency and integrity. This Privacy Policy explains how we collect, use, and protect your personal information when you use our AI-powered image processing and content management platform.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <h3 className="text-lg font-medium mt-4 mb-2">1.1 Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information: name, email address, username, and password</li>
            <li>Billing information: payment method details, billing address, and transaction history</li>
            <li>Profile information: profile picture, preferences, and settings</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-2">1.2 Image and Content Data</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Images uploaded for processing</li>
            <li>Metadata associated with uploaded images</li>
            <li>Content created or edited using our platform</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-2">1.3 Usage Data</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Log data: IP address, browser type, referring/exit pages, operating system, date/time stamps, and clickstream data</li>
            <li>Device information: device type, model, and operating system</li>
            <li>Analytics data: usage patterns, feature preferences, and performance metrics</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>To provide and maintain our services</li>
            <li>To process and complete transactions</li>
            <li>To manage your account and provide customer support</li>
            <li>To improve and personalize our services</li>
            <li>To send administrative information, updates, and marketing communications</li>
            <li>To detect, prevent, and address technical issues and security threats</li>
            <li>To comply with legal obligations</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">3. How We Share Your Information</h2>
          <p>
            We may share your information with the following categories of recipients:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Service providers: companies that provide services on our behalf, such as payment processing, data analytics, email delivery, and customer support</li>
            <li>Business partners: trusted companies with whom we collaborate to offer joint services or promotions</li>
            <li>Legal authorities: when required by law, court order, or government regulation</li>
            <li>Corporate transactions: in connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, and regular security assessments.
          </p>
          <p>
            While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining the appropriate retention period, we consider the nature and sensitivity of the data, the potential risk of harm from unauthorized disclosure, and legal requirements.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">6. Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access: the right to request copies of your personal information</li>
            <li>Rectification: the right to request that we correct inaccurate or incomplete information</li>
            <li>Erasure: the right to request that we delete your personal information</li>
            <li>Restriction: the right to request that we restrict the processing of your personal information</li>
            <li>Data portability: the right to request the transfer of your personal information to another service provider</li>
            <li>Objection: the right to object to the processing of your personal information</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">7. International Data Transfers</h2>
          <p>
            We may transfer your personal information to countries other than your country of residence. When we transfer personal information internationally, we take appropriate safeguards to ensure that your information is protected in accordance with this Privacy Policy and applicable data protection laws.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child without parental consent, we will take steps to delete that information as soon as possible.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">9. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to collect information about your browsing activities and to provide, improve, and secure our services. For more information about our use of cookies, please see our <Link to="/cookies" className="text-teal-600 hover:text-teal-800">Cookie Policy</Link>.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:<br />
            Email: privacy@imagenwiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;