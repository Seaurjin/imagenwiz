import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ImageComparisonSlider = ({ beforeImage, afterImage, aspectRatio = "75%" }) => {
  const { t } = useTranslation(['common']);
  const [position, setPosition] = useState(50);
  
  // Direct slider movement implementation
  const handleSliderInput = (e) => {
    setPosition(parseInt(e.target.value, 10));
  };

  // Component visibility hook for showing hints
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Hide the hint after a few seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="comparison-slider-container w-full h-full mx-auto relative rounded-xl overflow-hidden shadow-xl">
      <div 
        className="comparison-slider relative w-full h-0 overflow-hidden rounded-xl"
        style={{ paddingBottom: aspectRatio }}
      >
        {/* Original Image (Background) */}
        <img 
          src={beforeImage} 
          alt="Original image with background" 
          className="comparison-image original absolute top-0 left-0 w-full h-full object-cover"
        />
        
        {/* Image with background removed */}
        <div 
          className="comparison-overlay absolute top-0 bottom-0 left-0 overflow-hidden"
          style={{ 
            width: `${position}%`,
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
        
        {/* Vertical separator line */}
        <div 
          className="comparison-separator absolute top-0 bottom-0 w-1 bg-white z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          {/* Draggable handle */}
          <div className="handle-circle absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white z-30 animate-pulse">
            <div className="handle-arrows flex items-center text-sm select-none">
              <span className="mr-1">◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>
        
        {/* HTML input range slider - the real interactive element */}
        <input
          type="range"
          min="1"
          max="99"
          value={position}
          onChange={handleSliderInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label={t('comparison.dragPrompt', 'Drag slider to compare images')}
        />
        
        {/* Helper instruction overlay */}
        {isVisible && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none z-5">
            <div className="bg-white bg-opacity-90 rounded-lg px-4 py-2 text-sm font-bold text-gray-700 shadow-lg animate-bounce">
              {t('comparison.dragPrompt', 'Drag to compare')} →
            </div>
          </div>
        )}
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