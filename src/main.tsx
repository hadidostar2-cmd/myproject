import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

// Global error handler to catch and log more details about "Script error."
window.onerror = function(message, source, lineno, colno, error) {
  if (message === 'Script error.') {
    console.warn('A cross-origin script error occurred. This is often benign but can be caused by blocked scripts or CORS issues.');
  } else {
    console.error('Global Error:', message, 'at', source, lineno, ':', colno, error);
  }
  return false; // Let the error propagate
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics debug={true} />
  </StrictMode>,
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}
