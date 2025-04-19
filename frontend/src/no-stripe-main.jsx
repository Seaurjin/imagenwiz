import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// This is an alternative entry point that doesn't initialize Stripe
console.log('Using alternative entry point without Stripe initialization');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);