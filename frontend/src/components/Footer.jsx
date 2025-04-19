import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  // Links grid section above the main footer
  const FooterLinksGrid = () => {
    return (
      <div className="bg-gray-50 py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Learn More Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                {t('footer.learnMore', 'Learn more')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/magic-brush" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.magicBrush', 'Magic Brush')}
                  </Link>
                </li>
                <li>
                  <Link to="/individuals" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.individuals', 'Individuals')}
                  </Link>
                </li>
                <li>
                  <Link to="/photographers" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.photographers', 'Photographers')}
                  </Link>
                </li>
                <li>
                  <Link to="/marketing" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.marketing', 'Marketing')}
                  </Link>
                </li>
                <li>
                  <Link to="/developers" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.developers', 'Developers')}
                  </Link>
                </li>
                <li>
                  <Link to="/ecommerce" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.ecommerce', 'Ecommerce')}
                  </Link>
                </li>
                <li>
                  <Link to="/media" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.media', 'Media')}
                  </Link>
                </li>
                <li>
                  <Link to="/car-dealerships" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.carDealerships', 'Car Dealerships')}
                  </Link>
                </li>
                <li>
                  <Link to="/enterprise" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.enterprise', 'Enterprise')}
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.successStories', 'Success stories')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                {t('footer.support', 'Support')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.helpAndFaqs', 'Help & FAQs')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.contactUs', 'Contact us')}
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.refunds', 'Refunds')}
                  </Link>
                </li>
                <li>
                  <Link to="/platform-status" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.platformStatus', 'Platform Status')}
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.api', 'API')}
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-800">
                      {t('footer.comingSoon', 'Coming Soon')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                {t('footer.company', 'Company')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/blog" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.blog', 'Blog')}
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.affiliateProgram', 'Affiliate Program')}
                  </Link>
                </li>
                <li>
                  <Link to="/automatic-designs" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.createAutomaticDesigns', 'Create automatic designs')}
                  </Link>
                </li>
                <li>
                  <Link to="/video-background-removal" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.videoBackgroundRemoval', 'Video Background Removal')}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.careers', 'Careers')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.aboutUs', 'About us')}
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-500 hover:text-teal-600 text-sm">
                    {t('footer.pressAndPartnerships', 'Press & Partnerships')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Spacer for the fourth column */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <FooterLinksGrid />
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-lg font-bold mb-4">{t('common.companyName')}</h3>
              <p className="text-gray-300">
                {t('home.hero.subtitle')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks', 'Quick Links')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-teal-400">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-teal-400">
                    {t('nav.pricing')}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-teal-400">
                    {t('nav.register')}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-teal-400">
                    {t('nav.login')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-teal-400">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/general-terms" className="text-gray-300 hover:text-teal-400">
                    {t('footer.generalTerms')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-teal-400">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-300 hover:text-teal-400">
                    {t('footer.cookies')}
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-300 hover:text-teal-400">
                    {t('footer.refund', 'Refund Policy')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-teal-400">
                    {t('nav.contact', 'Contact Us')}
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@imagenwiz.com" className="text-gray-300 hover:text-teal-400">
                    support@imagenwiz.com
                  </a>
                </li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400">
              {t('footer.copyright', `© ${year} iMagenWiz. All rights reserved.`)}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;