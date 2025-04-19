import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white">
      <Helmet>
        <title>{t('footer.cookies')} | iMagenWiz</title>
        <meta name="description" content="Cookie Policy for iMagenWiz" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('footer.cookies')}</h1>
        
        <div className="prose prose-teal max-w-none">
          <p className="text-lg mb-6">Last updated: April 19, 2025</p>
          
          <p>
            This Cookie Policy explains how iMagenWiz ("we," "our," or "us") uses cookies and similar technologies on our website and platform. This policy should be read alongside our <Link to="/privacy" className="text-teal-600 hover:text-teal-800">Privacy Policy</Link>, which explains how we use personal information.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently, provide a better user experience, and give information to the website owners.
          </p>
          <p>
            Other similar technologies, including local storage, session storage, pixels, and tags, also store and retrieve data on your device. For simplicity, we refer to all these technologies as "cookies" in this policy.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Types of Cookies We Use</h2>
          <p>
            We use the following types of cookies:
          </p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable basic functions such as page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
          </p>
          <table className="min-w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Cookie Name</th>
                <th className="border border-gray-300 px-4 py-2">Purpose</th>
                <th className="border border-gray-300 px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">session</td>
                <td className="border border-gray-300 px-4 py-2">Maintains your session</td>
                <td className="border border-gray-300 px-4 py-2">Session</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">auth_token</td>
                <td className="border border-gray-300 px-4 py-2">Authenticates your user account</td>
                <td className="border border-gray-300 px-4 py-2">30 days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">csrf_token</td>
                <td className="border border-gray-300 px-4 py-2">Prevents cross-site request forgery</td>
                <td className="border border-gray-300 px-4 py-2">Session</td>
              </tr>
            </tbody>
          </table>
          
          <h3 className="text-lg font-medium mt-4 mb-2">2.2 Preference Cookies</h3>
          <p>
            These cookies enable the website to remember information that changes the way the website behaves or looks, such as your preferred language or region.
          </p>
          <table className="min-w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Cookie Name</th>
                <th className="border border-gray-300 px-4 py-2">Purpose</th>
                <th className="border border-gray-300 px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">language</td>
                <td className="border border-gray-300 px-4 py-2">Stores your language preference</td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">theme</td>
                <td className="border border-gray-300 px-4 py-2">Stores your theme preference (light/dark)</td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
              </tr>
            </tbody>
          </table>
          
          <h3 className="text-lg font-medium mt-4 mb-2">2.3 Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
          </p>
          <table className="min-w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Cookie Name</th>
                <th className="border border-gray-300 px-4 py-2">Purpose</th>
                <th className="border border-gray-300 px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_ga</td>
                <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguishes users</td>
                <td className="border border-gray-300 px-4 py-2">2 years</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_gid</td>
                <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguishes users</td>
                <td className="border border-gray-300 px-4 py-2">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_gat</td>
                <td className="border border-gray-300 px-4 py-2">Google Analytics - Throttles request rate</td>
                <td className="border border-gray-300 px-4 py-2">1 minute</td>
              </tr>
            </tbody>
          </table>
          
          <h3 className="text-lg font-medium mt-4 mb-2">2.4 Marketing Cookies</h3>
          <p>
            These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share information with other organizations or advertisers.
          </p>
          <table className="min-w-full border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Cookie Name</th>
                <th className="border border-gray-300 px-4 py-2">Purpose</th>
                <th className="border border-gray-300 px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_fbp</td>
                <td className="border border-gray-300 px-4 py-2">Facebook Pixel - Tracks visits across websites</td>
                <td className="border border-gray-300 px-4 py-2">3 months</td>
              </tr>
            </tbody>
          </table>
          
          <h2 className="text-xl font-bold mt-8 mb-4">3. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third parties on our website. These third parties may include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Google Analytics for website analytics</li>
            <li>Stripe for payment processing</li>
            <li>Facebook for marketing and social media integration</li>
            <li>Google for authentication (Google OAuth)</li>
          </ul>
          <p>
            Please note that these third parties may have their own privacy and cookie policies, which we encourage you to review.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">4. Managing Cookies</h2>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
          </p>
          <p>
            To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" className="text-teal-600 hover:text-teal-800" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">5. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the new Cookie Policy on this page and updating the "Last updated" date. We encourage you to review this Cookie Policy periodically.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Cookie Policy or our data practices, please contact us at:<br />
            Email: privacy@imagenwiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;