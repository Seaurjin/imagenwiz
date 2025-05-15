import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { 
  Image, 
  Zap, 
  Shield, 
  Download, 
  Upload, 
  Sparkles, 
  Settings, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Clock, 
  Grid,
  MessageSquareText
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useTranslation(['home', 'common'])
  
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-sky-50 to-cyan-50 text-gray-800 overflow-hidden py-20 md:py-32">
        {/* Light Yellow Decorative Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
          <div className="w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
          <div className="w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl animate-pulse-slower"></div>
        </div>
         <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-30">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-10 text-center md:text-left">
              {/* New AI Technology Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-6 shadow-sm">
                <Zap size={16} className="mr-2" />
                New AI Technology
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                Remove Backgrounds with AI <span className="text-teal-500">Backgrounds</span> in Seconds
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                Fast, easy, and accurate background removal powered by advanced AI technology
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/register"} 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3.5 rounded-lg font-semibold text-center shadow-md transition-all hover:shadow-lg transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white text-teal-500 border border-teal-500 hover:bg-teal-50 px-8 py-3.5 rounded-lg font-semibold transition-all text-center shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </div>
              
              {/* Trusted By Badge */}
              <div className="mt-10 flex items-center text-gray-500 justify-center md:justify-start">
                <CheckCircle size={20} className="mr-2 text-teal-500" />
                <span className="text-sm">Trusted by over 10,000 users worldwide</span>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative bg-white p-2 sm:p-3 rounded-xl shadow-2xl border border-gray-200/50">
                 <ImageComparisonSlider />
                  <div className="absolute -bottom-3 right-4 sm:-bottom-4 sm:right-6 bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg border border-gray-200 flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-1.5 sm:mr-2 animate-ping-slow"></div>
                    Real-time AI processing
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Features Section based on screenshot */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">Powerful Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Features <span className="text-teal-500">iMagenWiz?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Why choose iMagenWiz?
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 md:mb-24">
            {/* Feature 1: Lightning Fast */}
            <div className="bg-teal-50/50 p-6 md:p-8 rounded-xl shadow-lg border border-teal-200/70 hover:shadow-teal-100 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg mb-5">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Process images in seconds, not minutes. Our AI is optimized for speed without sacrificing quality.
              </p>
              <Link to="/features/fast-processing" className="text-teal-600 hover:text-teal-700 font-medium text-sm group">
                Learn more <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </Link>
            </div>
            
            {/* Feature 2: Precise Results */}
            <div className="bg-teal-50/50 p-6 md:p-8 rounded-xl shadow-lg border border-teal-200/70 hover:shadow-teal-100 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg mb-5">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Precise Results</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Our AI accurately detects edges, hair, and complex details that other tools miss, even in challenging images.
              </p>
              <Link to="/features/precise-results" className="text-teal-600 hover:text-teal-700 font-medium text-sm group">
                Learn more <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </Link>
            </div>
            
            {/* Feature 3: Easy to Use */}
            <div className="bg-teal-50/50 p-6 md:p-8 rounded-xl shadow-lg border border-teal-200/70 hover:shadow-teal-100 transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg mb-5">
                {/* Consider using SlidersHorizontal or Settings2 from lucide-react if more appropriate */}
                <Image size={28} /> 
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy to Use</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Simply upload your image and download the result. No technical expertise required. Perfect for any skill level.
              </p>
              <Link to="/features/easy-to-use" className="text-teal-600 hover:text-teal-700 font-medium text-sm group">
                Learn more <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </Link>
            </div>
          </div>

          {/* Stats Bar Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto text-center">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-teal-200/50">
              <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">99.8%</p>
              <p className="text-xs md:text-sm text-gray-500">Accuracy Rate</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-teal-200/50">
              <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">3s</p>
              <p className="text-xs md:text-sm text-gray-500">Average Processing Time</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-teal-200/50">
              <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">100K+</p>
              <p className="text-xs md:text-sm text-gray-500">Daily Processed Images</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-teal-200/50">
              <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">22</p>
              <p className="text-xs md:text-sm text-gray-500">Supported Languages</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Updated to match screenshot */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How It <span className="text-teal-500">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to remove image backgrounds in seconds
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Lines - adjust positioning as needed */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 hidden md:block" style={{transform: 'translateY(-4rem)'}}></div>
            <div className="absolute top-1/2 left-1/4 w-0.5 h-16 bg-gray-200 hidden md:block" style={{transform: 'translateY(-4rem)'}}></div>
            <div className="absolute top-1/2 right-1/4 w-0.5 h-16 bg-gray-200 hidden md:block" style={{transform: 'translateY(-4rem)'}}></div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              {/* Step 1 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200/80 text-center z-10">
                <div className="relative inline-flex items-center justify-center w-12 h-12 bg-teal-500 text-white rounded-full text-xl font-bold mx-auto mb-6 ring-4 ring-teal-100">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Upload Image</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Upload any image from your device to our secure platform. We support JPG, PNG, and WebP formats.
                </p>
                <div className="flex items-center justify-center w-full h-20 bg-teal-50/60 rounded-lg">
                  <Upload className="h-10 w-10 text-teal-500 opacity-70" />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200/80 text-center z-10">
                <div className="relative inline-flex items-center justify-center w-12 h-12 bg-teal-500 text-white rounded-full text-xl font-bold mx-auto mb-6 ring-4 ring-teal-100">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Processing</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Our advanced AI automatically detects and removes the background in seconds with high precision.
                </p>
                <div className="flex items-center justify-center w-full h-20 bg-teal-50/60 rounded-lg">
                  <Sparkles className="h-10 w-10 text-teal-500 opacity-70" /> {/* Using Sparkles, could be Beaker or Wand2 */}
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200/80 text-center z-10">
                <div className="relative inline-flex items-center justify-center w-12 h-12 bg-teal-500 text-white rounded-full text-xl font-bold mx-auto mb-6 ring-4 ring-teal-100">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Download Result</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Download your transparent PNG or choose a custom background. Unlimited possibilities.
                </p>
                <div className="flex items-center justify-center w-full h-20 bg-teal-50/60 rounded-lg">
                  <Download className="h-10 w-10 text-teal-500 opacity-70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section - Updated to match screenshot */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-teal-50/70 p-8 md:p-10 rounded-xl shadow-xl border border-teal-200/60">
            <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-500 text-white rounded-full">
                    <MessageSquareText size={24} /> {/* Using MessageSquareText from lucide-react */}
                </div>
            </div>
            <p className="text-center text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6">
              "iMagenWiz has revolutionized our product photography workflow. What used to take hours now takes seconds, and the results are flawless!"
            </p>
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-full text-sm font-semibold mr-3">
                SJ
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sarah Johnson</p>
                <p className="text-sm text-gray-500">E-commerce Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('useCases.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('useCases.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-teal-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('useCases.ecommerce.title')}</h3>
              <p className="text-gray-600 text-sm">{t('useCases.ecommerce.description')}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-teal-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('useCases.marketing.title')}</h3>
              <p className="text-gray-600 text-sm">{t('useCases.marketing.description')}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-teal-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                <Image className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('useCases.designers.title')}</h3>
              <p className="text-gray-600 text-sm">{t('useCases.designers.description')}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-teal-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('useCases.developers.title')}</h3>
              <p className="text-gray-600 text-sm">{t('useCases.developers.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* New CTA Section - Updated to match screenshot */}
      <section className="bg-teal-600 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-teal-500 to-teal-700 p-8 md:p-12 rounded-xl shadow-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your images?
            </h2>
            <p className="text-lg text-teal-100 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who trust iMagenWiz for their image processing needs. Get started today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link 
                to={isAuthenticated ? "/dashboard" : "/register"} 
                className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link 
                to="/pricing" 
                className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-teal-100 text-sm">
              <div className="flex items-center justify-center">
                <Shield size={16} className="mr-1.5" /> Secure Processing
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle size={16} className="mr-1.5" /> 99.8% Accuracy
              </div>
              <div className="flex items-center justify-center">
                <Upload size={16} className="mr-1.5" /> Cloud Processing {/* Assuming Upload icon for Cloud */}
              </div>
              <div className="flex items-center justify-center">
                <Clock size={16} className="mr-1.5" /> 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Image Comparison Slider Component
function ImageComparisonSlider() {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const { t } = useTranslation(['common']);

  // Remove pulsing effect to keep handle always visible
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    // Only show initial instruction overlay when first loaded
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setIsPulsing(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    setIsPulsing(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMove = (clientX) => {
    if (!isDragging || !sliderRef.current) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(clientX - sliderRect.left, sliderRect.width));
    const newPercentage = (newPosition / sliderRect.width) * 100;
    
    setPosition(newPercentage);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-0 overflow-hidden rounded-lg shadow-inner"
      style={{ paddingBottom: "75%" }}
    >
      {/* Container with the same exact dimensions for both images */}
      <div className="absolute inset-0">
        {/* Mint green checkerboard background - visible everywhere */}
        <div className="absolute inset-0 z-10" style={{ 
          backgroundImage: `
            linear-gradient(45deg, #f0fdfb 25%, #99f6e4 25%), 
            linear-gradient(-45deg, #f0fdfb 25%, #99f6e4 25%), 
            linear-gradient(45deg, #99f6e4 75%, #f0fdfb 75%), 
            linear-gradient(-45deg, #99f6e4 75%, #f0fdfb 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}/>
        
        {/* Background-removed image - positioned as the base layer (always visible) */}
        <img 
          src="/images/comparison/border-collie-transparent.png" 
          alt="Image with background removed" 
          className="absolute inset-0 w-full h-full object-cover z-20"
        />
        
        {/* Original image with clipping mask controlled by slider position */}
        <div 
          className="absolute inset-0 z-30"
          style={{ 
            clipPath: `inset(0 0 0 ${position}%)`,
            WebkitClipPath: `inset(0 0 0 ${position}%)`
          }}
        >
          <img 
            src="/images/comparison/border-collie-original.jpg" 
            alt="Original image with background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Vertical separator line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2 z-40 shadow-md"
        style={{ left: `${position}%` }}
      />
      
      {/* Hint overlay - visible initially */}
      {isPulsing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none transition-opacity duration-500 ease-in-out">
          <div className="bg-white/90 px-4 py-2 rounded-full text-teal-700 font-medium animate-pulse">
            {t('comparison.dragToCompare', 'Drag to compare')} ↔️
          </div>
        </div>
      )}
      
      {/* Draggable handle - circle with arrows (always visible) */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 z-50 cursor-ew-resize transition-transform duration-150 ease-in-out hover:scale-110"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="handle-circle w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <div className="handle-arrows flex items-center text-xs select-none">
            <span className="mr-1">◀</span>
            <span>▶</span>
          </div>
        </div>
      </div>
      
      {/* Before/After labels at the bottom of the image */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-40">
        <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 font-medium shadow-sm">
          {t('comparison.transparent', 'Background Removed')}
        </div>
        <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 font-medium shadow-sm">
          {t('comparison.original', 'Original')}
        </div>
      </div>
    </div>
  );
}