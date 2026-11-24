import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;

// Usa hydrateRoot quando o HTML foi pré-renderizado no build; em dev usa createRoot
const hasPrerenderedContent =
  container.hasChildNodes() && container.innerHTML.trim() !== '<!--app-html-->';

if (hasPrerenderedContent) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
