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
          
          <h2 className="text-xl font-bold mt-8 mb-4">Before we get into the details …</h2>
          
          <p>
            If you are wondering what happens to your files when you upload them, the answer is simple: We upload them securely, process them as you would expect, provide you with the results for download, then delete them shortly after. That's all.
          </p>
          
          <p>
            We don't publish your files, we don't share them with anyone unexpected and we don't use them to improve our products, unless you explicitly send them to our team as feedback.
          </p>
          
          <p>
            We keep usage statistics (without your files) and if you contact us e.g. by email, we use the personal data you provide for our reply. If you buy from us, we also keep data for purposes like bookkeeping and financial reports.
          </p>
          
          <p>
            If you want to learn more, find our privacy policy below.
          </p>
          
          <p>
            We are QubitRise Limited ("Operator", "We", "Us"). This privacy policy applies to Operator's website, product websites and apps (www.imagenwiz.com), and other connected websites operated by Operator that link to this policy (such as app.imagenwiz.com) (each, a "Service", or together, the "Services").
          </p>
          
          <p>
            This privacy policy explains who we are, how we collect, use and disclose your personal data and how you can exercise your privacy rights. We are always at your disposal for any questions, suggestions or complaints about data protection. If you have any questions, suggestions or complaints about our use of your data or this privacy policy, please contact us using the details provided at the bottom of this page.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. We process your personal data as follows</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.1 Information you provide us directly</h3>
          <p>
            Certain parts of our Services may ask you to provide personal data voluntarily: for example, we may ask you to provide your name, email address, marketing preferences, subscription type, and brand in order to register an account with us, to subscribe to marketing communications from us, and/or to submit enquiries to or complete a survey for us. The data that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you.
          </p>
          
          <p>
            We also collect any messages you send to us. We use this information to operate, maintain, and provide the features and functionality of our services to you, to correspond with you, and to address any issues you raise about our Services.
          </p>
          
          <p>
            If you don't provide your personal data to us, you may not be able to access or use certain features of our Services or your experience of using our Services may not be as enjoyable.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.2 Information we receive from third parties</h3>
          <p>
            We may receive information about you from third parties. For example, if you access our Services through a third-party connection or log-in (e.g. through Facebook or Google), that third party may pass certain information about your use of its service to us. This information could include, for example, your name and email address, and any other information that you have permitted the third party to share with us. You should always review, and if necessary, adjust your privacy settings on third-party websites and services before linking or connecting them to our Services.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.3 Information we collect through your use of our Services</h3>
          <p>
            Our web server collects data that your Internet browser communicates to us, including the IP address of the requesting computer, location data, device or app data, together with the date, time, the request, which file is requested (name and URL), the amount of data transferred to you, a message as to whether the request was successful, identification data of the browser and operating system used, and the website from which the access was made (should the access take place via a link).
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.4 Cookies information</h3>
          <p>
            When you use our Services, we send cookies — small text files containing a string of alphanumeric characters — to your device that uniquely identifies your browser and lets us help you log in faster and enhance your navigation through our services. A cookie may also convey information to us about how you use our Services (e.g. the pages you view, the links you click and other actions you take on the Services), and allow us or our business partners to track your usage.
          </p>
          
          <p>
            You can control or reset your cookies and similar technologies through your web browser, which will allow you to customize your cookie preferences and to refuse all cookies or to indicate when a cookie is being sent. However, some features of the Services may not function properly if the ability to accept cookies is disabled. For more information on how we use cookies and other technologies, and how you can control them, please read our <Link to="/cookies" className="text-teal-600 hover:text-teal-800">Cookies Policy</Link>.
          </p>
          
          <p>
            We use cookies served by Google Analytics to collect limited data directly from you to enable us to better understand your use of our Services, including making use of the demographics and interests reports services of Google Analytics. Further information on how Google collects and uses this data can be found at www.google.com/policies/privacy/partners/. You can opt-out of all Google supported analytics within the services by visiting https://tools.google.com/dlpage/gaoptout.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Legal basis for processing personal data</h2>
          
          <p>
            We need a legal basis to collect, use and disclose your personal data. Our legal basis for collecting, using and disclosing your data will depend on the data concerned and the context in which it is processed. However, we will normally process your data only where we need the data to perform a contract with you, it is in our legitimate interests to do so, or we have your consent to do so. In some cases, we may also have a legal obligation to process your data.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2.1 Data processing in the context of contacting us</h3>
          <p>
            If you contact us (e.g. by e-mail or telephone), your data is processed to carry out pre-contractual measures, fulfill our contract with you or because it is in our legitimate interests to do so.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2.2 General data processing in the context of our business relationship</h3>
          <p>
            If your data is processed to deal with business transactions and to process the sale of our Services, your data is processed to carry out pre-contractual measures, fulfill our contract with you or because it is in our legitimate interests to do so.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2.3 Data processing for direct marketing purposes</h3>
          <p>
            If we contact you to inform you about news from our company, offers and events and to promote our own range of Services, your data is processed either on the basis of your consent or because it is in our legitimate interests to do.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2.4 Data processing to manage security, perform data analytics and improve our Services</h3>
          <p>
            We process your data to ensure system security, manage the website technically, optimize service quality and analyze use of and improve our Services where it is in our legitimate interests to do. We do not rely on this lawful basis where our legitimate interests are overridden by your interest in protecting your data
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">2.5 Data processing to comply with our legal obligations</h3>
          <p>
            We may process your data because it is necessary to comply with our legal obligations, such as for tax, accounting and audit purposes.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">3. Sharing your personal data</h2>
          
          <p>
            We may disclose your personal data to the following categories of recipients:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li>to our group companies, services providers and partners who provide data processing services to us (for example, to support the delivery of, provide functionality on, or help to enhance the security of our websites or provide analytics services to us) or who otherwise process data for purposes that are described in this privacy policy or notified to you when we collect your data.</li>
            <li>to any competent law enforcement body, regulatory, government agency, court or other third party where we believe disclosure is necessary as a matter of applicable law or regulation, to exercise, establish or defend our legal rights, or to protect your vital interests or those of any other person.</li>
            <li>to an actual or potential buyer (and its agents and advisers) in connection with any actual or proposed purchase, merger or acquisition of any part of our business, provided that we inform the buyer it must use your personal information only for the purposes disclosed in this privacy policy</li>
            <li>to any other person with your consent to the disclosure.</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4">4. How we transfer, store and protect your data</h2>
          
          <p>
            Your data will be stored and processed in Europe and any other country in which Operator, its affiliates or service providers maintain facilities.
          </p>
          
          <p>
            This means that your data may be transferred to and processed in countries other than the country in which you are located. These countries may have data protection laws that are different to the laws of your country (and, in some cases, may not be as protective).
          </p>
          
          <p>
            However, we've taken appropriate safeguards to require that your data will remain protected in accordance with this privacy policy and applicable data protection laws. These measures include transferring your data to a country that the European Commission or UK authorities (as applicable) have determined provides an adequate level of protection for personal data, or by implementing standard contractual clauses with our affiliates and service providers.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">5. Rights in respect of your personal data</h2>
          
          <p>
            You have the right to access the data we process about you, obtain rectification of inaccurate data, request deletion of your data, restrict our processing of your data, request portability of your data, and/or object to unreasonable processing. If we process your data on the basis of your consent, you have the option to withdraw your consent at any time. Doing so will not affect the lawfulness of the processing we carried out based on your consent up to the time of withdrawal.
          </p>
          
          <p>
            You can exercise any of these rights by contacting us using the contact details provided at the bottom of this page under the "How to contact us" heading. We respond to all requests we receive in accordance with applicable data protection laws.
          </p>
          
          <p>
            You also have the right to opt-out of marketing communications we send you at any time. You can exercise this right by clicking on the "unsubscribe" or "opt-out" link in the marketing e-mails we send you or by contacting us using the contact details provided at the bottom of this page under the "How to contact us" heading.
          </p>
          
          <p>
            We do not engage in automated decision-making. If we process your personal data for a purpose other than the one for which we collected your data, we will inform you of this fact and of that other purpose.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">6. How long we keep your personal data</h2>
          
          <p>
            We retain personal data we collect from you where we have an ongoing legitimate business need to do so (for example, to provide you with a service you have requested or to comply with applicable legal, tax or accounting requirements).
          </p>
          
          <p>
            When we have no ongoing legitimate business need to process your personal data, we will either delete or anonymise it or, if this is not possible (for example, because your personal data has been stored in backup archives), then we will securely store your personal data and isolate it from any further processing until deletion is possible. We may retain certain account information to comply with our legal obligations (such as for accounting and audit purposes).
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">7. Changes to this policy</h2>
          
          <p>
            We may update this policy from time to time to reflect our current practice and ensure compliance with applicable laws. When we post changes to this policy, we will revise the "Last Updated" date at the top of this policy. If we make any material changes to the way we collect, use, store and/or share your personal data, we will take appropriate measures to notify you. We recommend that you check this page from time to time to inform yourself of any changes.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">8. How to contact us</h2>
          
          <p>
            The data controller responsible for your personal data is QubitRise Limited, through its brands imagenwiz.
          </p>
          
          <p>
            If you have any questions, suggestions or concerns about our use of your personal data or this privacy policy, please contact us at:
          </p>
          
          <p>
            Email:<br />
            imagenwiz.com: support@imagenwiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;