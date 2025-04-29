import React, { useState, useRef, useEffect } from 'react';

function ImageComparisonSlider() {
  const [position, setPosition] = useState(50);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleTouchStart = () => {
    setIsDragging(true);
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
      className="relative w-full h-0 overflow-hidden rounded-xl"
      style={{ paddingBottom: "75%" }}
    >
      {/* Original Image (Background) */}
      <img 
        src="/images/comparison/original-dog-final-v2.svg" 
        alt="Original image with background" 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Vertical separator line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2 z-10"
        style={{ left: `${position}%` }}
      />
      
      {/* Image with background removed */}
      <div 
        className="absolute top-0 bottom-0 left-0 overflow-hidden"
        style={{ 
          right: `${100 - position}%`, 
          backgroundImage: `linear-gradient(45deg, #10b981 25%, #5eead4 25%), 
                           linear-gradient(-45deg, #10b981 25%, #5eead4 25%), 
                           linear-gradient(45deg, #5eead4 75%, #10b981 75%), 
                           linear-gradient(-45deg, #5eead4 75%, #10b981 75%)`,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
        }}
      >
        <img 
          src="/images/comparison/dog-no-background.svg" 
          alt="Image with background removed" 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Draggable handle */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 z-20 cursor-ew-resize"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <div className="flex items-center text-xs select-none">
            <span className="mr-0.5">◀</span>
            <span>▶</span>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
        <div className="px-2 py-1 bg-white/80 rounded-full text-xs text-gray-700">
          Before
        </div>
        <div className="px-2 py-1 bg-white/80 rounded-full text-xs text-gray-700">
          After
        </div>
      </div>
    </div>
  );
}

function LanguageButton() {
  return (
    <button className="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1">
      <span className="sr-only">Select language</span>
      <span>English</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-teal-500 font-semibold text-xl">iMagenWiz</a>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="/" className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium">Home</a>
                <a href="/pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="/blog" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Blog</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-500 hover:text-gray-700 font-medium">Login</a>
              <a href="/register" className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md font-medium">Register</a>
              <div className="relative">
                <LanguageButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-teal-50 to-teal-100">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  New AI Technology
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Remove <span className="text-teal-500">Backgrounds</span> with AI <span className="text-teal-500">Backgrounds</span> in Seconds
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Fast, easy, and accurate background removal powered by advanced AI technology
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <a href="/get-started" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md">
                  Get Started Free
                </a>
                <a href="/login" className="bg-white text-teal-500 border border-teal-300 font-bold py-3 px-6 rounded-lg shadow-md">
                  Login
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trusted by over 10,000 users worldwide</span>
              </div>
            </div>
            
            <div className="relative mx-auto max-w-md lg:max-w-full">
              <ImageComparisonSlider />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs text-teal-700 font-medium shadow border border-teal-100">
                Try sliding to see the difference!
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;