import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite HMR websocket errors
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('failed to connect to websocket') || args[0].includes('WebSocket'))) {
    return;
  }
  originalError.apply(console, args);
};

window.addEventListener('unhandledrejection', (event) => {
  const isWebSocketError = 
    (event.reason && event.reason.message && event.reason.message.includes('WebSocket')) ||
    (event.reason && typeof event.reason === 'string' && event.reason.includes('WebSocket')) ||
    (event.reason && event.reason.toString().includes('WebSocket'));

  if (isWebSocketError) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
