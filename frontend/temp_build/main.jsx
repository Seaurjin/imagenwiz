import React from 'react';
import ReactDOM from 'react-dom/client';

function ImageComparisonSlider() {
  const [position, setPosition] = React.useState(50);
  const sliderRef = React.useRef(null);
  const beforeImageRef = React.useRef(null);
  const afterImageRef = React.useRef(null);
  
  const handleMouseMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setPosition(percent);
  };
  
  React.useEffect(() => {
    if (afterImageRef.current) {
      afterImageRef.current.style.clipPath = `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`;
    }
  }, [position]);
  
  return (
    <div 
      className="comparison-slider"
      ref={sliderRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        maxWidth: '800px',
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onMouseMove={handleMouseMove}
    >
      <img 
        ref={beforeImageRef}
        src="/images/comparison/original-dog-final-v2.svg" 
        alt="Original" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <img 
        ref={afterImageRef}
        src="/images/comparison/dog-no-background.svg" 
        alt="Processed" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'white',
          left: `${position}%`,
          transform: 'translateX(-50%)',
          cursor: 'ew-resize',
          zIndex: 10
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#14b8a6',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg 
            style={{ color: 'white' }}
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#14b8a6', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          iMagenWiz
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1rem' }}>AI-Powered Background Removal</h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 2rem' }}>
          Remove backgrounds from images in seconds with our state-of-the-art AI technology.
        </p>
      </header>
      
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '0.5rem' }}>See the Difference</h2>
          <p style={{ color: '#4b5563' }}>Drag the slider to compare before and after</p>
        </div>
        <ImageComparisonSlider />
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '1rem auto 0' }}>
          <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', fontSize: '0.875rem', color: '#334155' }}>Original</span>
          <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', fontSize: '0.875rem', color: '#334155' }}>Background Removed</span>
        </div>
      </section>
      
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '1.5rem' }}>Ready to try it yourself?</h2>
        <a 
          href="/demo" 
          style={{
            display: 'inline-block',
            backgroundColor: '#14b8a6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Try Our Full Demo
        </a>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);