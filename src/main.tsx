import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite HMR websocket errors in the AI Studio environment
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('failed to connect to websocket')) {
    return;
  }
  originalError.apply(console, args);
};

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('WebSocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
