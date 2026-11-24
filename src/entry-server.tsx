import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { buildStructuredDataJson } from './utils/structuredData';

export function render() {
  const html = renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  const head = `<script type="application/ld+json">${buildStructuredDataJson()}</script>`;

  return { html, head };
}
