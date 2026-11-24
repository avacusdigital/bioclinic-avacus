import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = process.cwd();
const DIST_HTML = path.join(ROOT, 'dist', 'index.html');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

async function prerender() {
  const template = fs.readFileSync(DIST_HTML, 'utf-8');
  const { render } = await import(pathToFileURL(SSR_ENTRY).href);
  const { html, head } = render();

  const finalHtml = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);

  fs.writeFileSync(DIST_HTML, finalHtml, 'utf-8');
  fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });

  console.log('Prerendered dist/index.html successfully with full SSR HTML + JSON-LD!');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
