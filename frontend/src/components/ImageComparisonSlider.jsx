import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ImageComparisonSlider = ({ beforeImage, afterImage, aspectRatio = "75%" }) => {
  const { t } = useTranslation(['common']);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(50);
  const sliderRef = useRef(null);

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
    <div className="comparison-slider-container w-full h-full mx-auto relative rounded-xl overflow-hidden shadow-xl">
      <div 
        ref={sliderRef}
        className="comparison-slider relative w-full h-0 overflow-hidden rounded-xl"
        style={{ paddingBottom: aspectRatio }}
      >
        {/* Original Image (Background) */}
        <img 
          src={beforeImage} 
          alt="Original image with background" 
          className="comparison-image original absolute top-0 left-0 w-full h-full object-cover"
        />
        
        {/* Vertical separator line */}
        <div 
          className="comparison-separator absolute top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2 z-10"
          style={{ left: `${position}%` }}
        />
        
        {/* Image with background removed - with teal checkered pattern as in screenshot */}
        <div 
          className="comparison-overlay absolute top-0 bottom-0 left-0 overflow-hidden"
          style={{ right: `${100 - position}%` }}
        >
          {/* Checkered background pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundColor: '#0FF0C3',
            backgroundImage: 'linear-gradient(45deg, #10b8a6 25%, transparent 25%), linear-gradient(-45deg, #10b8a6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #10b8a6 75%), linear-gradient(-45deg, transparent 75%, #10b8a6 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.3
          }}/>
          
          <img 
            src={afterImage} 
            alt="Image with background removed" 
            className="comparison-image edited absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Draggable handle - circle with arrows */}
        <div 
          className="comparison-handle absolute top-1/2 transform -translate-y-1/2 z-20 cursor-ew-resize"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="handle-circle w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
            <div className="handle-arrows flex items-center text-xs select-none">
              <span className="mr-0.5">◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>
        
        {/* Before/After labels at the bottom of the image */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
          <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-700 font-medium">
            {t('comparison.before', 'Before')}
          </div>
          <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-700 font-medium">
            {t('comparison.after', 'After')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;