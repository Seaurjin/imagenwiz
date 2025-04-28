import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ImageComparisonSlider from '../components/ImageComparisonSlider';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation(['common']);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-teal-50 to-cyan-50 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-gradient-to-br from-teal-200 to-teal-100 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-200 to-blue-50 blur-3xl transform -rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text content - Takes 6 columns on large screens */}
            <div className="lg:col-span-6 lg:pr-8">
              <div className="mb-5 flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('home.hero.tag', 'New AI Technology')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                {t('home.hero.title', 'Remove Image')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t('home.hero.titleHighlight', 'Backgrounds')}</span> {t('home.hero.titleEnd', 'in Seconds')}
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
                {t('home.hero.subtitle', 'Our AI-powered technology makes background removal fast, easy, and precise. Perfect for e-commerce, marketing, or personal projects.')}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
                  >
                    {t('nav.dashboard', 'Go to Dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
                    >
                      {t('home.hero.getStarted', 'Get Started Free')}
                    </Link>
                    <Link
                      to="/login"
                      className="bg-white hover:bg-gray-50 text-teal-600 font-bold py-3 px-8 rounded-lg shadow-lg border border-teal-200 transition duration-300 hover:border-teal-400"
                    >
                      {t('nav.login', 'Login')}
                    </Link>
                  </>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="pt-5 border-t border-gray-200 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('home.hero.trust', 'Trusted by over 10,000 users worldwide')}
              </div>
            </div>
            
            {/* Image content - Takes 6 columns on large screens */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full h-full overflow-hidden mx-auto rounded-xl">
                {/* Image Comparison Slider */}
                <ImageComparisonSlider 
                  beforeImage="/images/comparison/border-collie-original.jpg"
                  afterImage="/images/comparison/border-collie-transparent.png"
                  aspectRatio="75%"
                />
                
                {/* Floating sparkle elements for visual interest */}
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-teal-400 animate-pulse"></div>
                <div className="absolute bottom-10 left-6 w-3 h-3 rounded-full bg-teal-500 animate-ping"></div>
                <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-teal-300 animate-pulse"></div>
              </div>
              {/* Caption for the image with visual emphasis */}
              <div className="absolute -bottom-4 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-xs text-teal-700 font-medium border border-teal-100">
                {t('home.hero.imageCaption', 'Try sliding to see the difference!')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-8 border-teal-200"></div>
          <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full border-16 border-teal-100"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
              {t('home.features.badge', 'POWERFUL FEATURES')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('home.features.title', 'Why Choose')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">iMagenWiz</span>?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle', 'Our advanced AI technologies provide industry-leading results for all your image editing needs')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-white to-teal-50 p-8 rounded-2xl shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.features.fast.title', 'Lightning Fast')}</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {t('home.features.fast.description', 'Process images in seconds, not minutes. Our AI is optimized for speed without sacrificing quality.')}
              </p>
              <div className="flex items-center text-teal-600 text-sm font-medium">
                <span>{t('common.learnMore', 'Learn more')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-white to-teal-50 p-8 rounded-2xl shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.features.precise.title', 'Precise Results')}</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {t('home.features.precise.description', 'Our AI accurately detects edges, hair, and complex details that other tools miss, even in challenging images.')}
              </p>
              <div className="flex items-center text-teal-600 text-sm font-medium">
                <span>{t('common.learnMore', 'Learn more')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-white to-teal-50 p-8 rounded-2xl shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.features.easy.title', 'Easy to Use')}</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {t('home.features.easy.description', 'Simply upload your image and download the result. No technical expertise required. Perfect for any skill level.')}
              </p>
              <div className="flex items-center text-teal-600 text-sm font-medium">
                <span>{t('common.learnMore', 'Learn more')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Stats section with improved visual appeal */}
          <div className="mt-20 pt-16 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {/* Stat 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 text-center transition-all duration-300 hover:shadow-md">
                <div className="text-4xl font-bold text-teal-600 mb-2">99.8%</div>
                <p className="text-gray-600 font-medium">{t('home.stats.accuracy', 'Accuracy Rate')}</p>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 text-center transition-all duration-300 hover:shadow-md">
                <div className="text-4xl font-bold text-teal-600 mb-2">3s</div>
                <p className="text-gray-600 font-medium">{t('home.stats.time', 'Average Processing Time')}</p>
              </div>
              
              {/* Stat 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 text-center transition-all duration-300 hover:shadow-md">
                <div className="text-4xl font-bold text-teal-600 mb-2">100K+</div>
                <p className="text-gray-600 font-medium">{t('home.stats.images', 'Daily Processed Images')}</p>
              </div>
              
              {/* Stat 4 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 text-center transition-all duration-300 hover:shadow-md">
                <div className="text-4xl font-bold text-teal-600 mb-2">22</div>
                <p className="text-gray-600 font-medium">{t('home.stats.languages', 'Supported Languages')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-teal-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
              {t('home.howItWorks.tag', 'SIMPLE PROCESS')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('home.howItWorks.title', 'How It')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">{t('home.howItWorks.titleHighlight', 'Works')}</span></h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle', 'Three simple steps to remove image backgrounds in seconds')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line between steps */}
            <div className="absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 hidden md:block opacity-60"></div>
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-100 relative z-10 h-full flex flex-col">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-14 mb-6 text-white font-bold text-xl shadow-lg border-4 border-white">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('home.steps.upload.title', 'Upload Image')}</h3>
              <p className="text-gray-600 text-center mb-6 flex-grow">
                {t('home.steps.upload.description', 'Upload any image from your device to our secure platform. We support JPG, PNG, and WebP formats.')}
              </p>
              <div className="bg-teal-50 p-5 rounded-lg">
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-100 relative z-10 md:mt-8 h-full flex flex-col">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-14 mb-6 text-white font-bold text-xl shadow-lg border-4 border-white">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('home.steps.process.title', 'AI Processing')}</h3>
              <p className="text-gray-600 text-center mb-6 flex-grow">
                {t('home.steps.process.description', 'Our advanced AI automatically detects and removes the background in seconds with high precision.')}
              </p>
              <div className="bg-teal-50 p-5 rounded-lg">
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-100 relative z-10 h-full flex flex-col">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-14 mb-6 text-white font-bold text-xl shadow-lg border-4 border-white">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('home.steps.download.title', 'Download Result')}</h3>
              <p className="text-gray-600 text-center mb-6 flex-grow">
                {t('home.steps.download.description', 'Download your transparent PNG or choose a custom background. Unlimited possibilities.')}
              </p>
              <div className="bg-teal-50 p-5 rounded-lg">
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Testimonial */}
          <div className="mt-24 mb-4 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-100 relative">
              <div className="absolute -top-5 left-10 bg-teal-500 p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-600 italic mb-6 text-lg leading-relaxed">
                  {t('home.testimonial.quote', '"iMagenWiz has revolutionized our product photography workflow. What used to take hours now takes seconds, and the results are flawless!"')}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    SJ
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('home.testimonial.author', 'Sarah Johnson')}</p>
                    <p className="text-sm text-gray-500">{t('home.testimonial.title', 'E-commerce Manager')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full border-8 border-white"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border-8 border-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white/20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                {t('home.cta.title', 'Ready to transform your images?')}
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                {t('home.cta.subtitle', 'Join thousands of professionals who trust iMagenWiz for their image processing needs. Get started today and see the difference.')}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="bg-white hover:bg-gray-50 text-teal-600 font-bold py-4 px-10 rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1"
                  >
                    {t('nav.dashboard', 'Go to Dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-white hover:bg-gray-50 text-teal-600 font-bold py-4 px-10 rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1"
                    >
                      {t('home.cta.getStarted', 'Get Started Free')}
                    </Link>
                    <Link
                      to="/pricing"
                      className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-4 px-10 rounded-xl shadow-xl transition duration-300 hover:border-white/80"
                    >
                      {t('home.cta.viewPricing', 'View Pricing')}
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Trust badges */}
            <div className="mt-10 pt-10 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-8 items-center">
                <div className="text-white/80 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{t('home.trust.secure', 'Secure Processing')}</span>
                </div>
                <div className="text-white/80 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t('home.trust.accuracy', '99.8% Accuracy')}</span>
                </div>
                <div className="text-white/80 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span>{t('home.trust.cloud', 'Cloud Processing')}</span>
                </div>
                <div className="text-white/80 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('home.trust.support', '24/7 Support')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;