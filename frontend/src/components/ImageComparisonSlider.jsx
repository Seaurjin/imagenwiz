import { useState, useRef, useEffect, useCallback } from 'react';
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

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!isDragging || !sliderRef.current) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(clientX - sliderRect.left, sliderRect.width));
    const newPercentage = (newPosition / sliderRect.width) * 100;
    
    setPosition(newPercentage);
  }, [isDragging]);

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  // Update slider position when clicking anywhere on the slider
  const handleSliderClick = (e) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(e.clientX - sliderRect.left, sliderRect.width));
    const newPercentage = (newPosition / sliderRect.width) * 100;
    setPosition(newPercentage);
  };

  useEffect(() => {
    const currentSliderRef = sliderRef.current;
    
    // Add click handler to slider for direct positioning
    if (currentSliderRef) {
      currentSliderRef.addEventListener('click', handleSliderClick);
    }
    
    // Only add document-level handlers when dragging
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (currentSliderRef) {
        currentSliderRef.removeEventListener('click', handleSliderClick);
      }
      
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, handleMouseUp, handleTouchEnd, handleMouseMove, handleTouchMove]);

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
        
        {/* Image with background removed */}
        <div 
          className="comparison-overlay absolute top-0 bottom-0 left-0 overflow-hidden"
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
            src={afterImage} 
            alt="Image with background removed" 
            className="comparison-image edited absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Draggable handle */}
        <div 
          className="comparison-handle absolute top-1/2 transform -translate-y-1/2 z-20 cursor-ew-resize"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={`handle-circle w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white transition-all duration-150 ${isDragging ? 'scale-110' : 'animate-pulse'}`}>
            <div className="handle-arrows flex items-center text-sm select-none">
              <span className="mr-1">◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>
        
        {/* Helper instruction overlay on first load */}
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center pointer-events-none z-5 animate-fadeOut">
          <div className="bg-white bg-opacity-80 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
            {t('comparison.dragPrompt', 'Drag to compare')}
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="comparison-labels flex justify-between mt-2 font-medium">
        <div className="label-before px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
          {t('comparison.before', 'Before')}
        </div>
        <div className="label-after px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
          {t('comparison.after', 'After')}
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;