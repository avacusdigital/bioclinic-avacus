import fs from 'fs';
import path from 'path';

const DIST = path.join(process.cwd(), 'dist');

function assert(cond, msg) {
  if (!cond) {
    console.error('❌ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('✅ PASS:', msg);
  }
}

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

// 1. Verificar arquivos fundamentais
for (const f of [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'site.webmanifest',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'og-image.jpg',
]) {
  const full = path.join(DIST, f);
  assert(fs.existsSync(full) && fs.statSync(full).size > 0, `Arquivo gerado: dist/${f}`);
}

// 2. Verificar SSR / Pré-renderização (HTML não vazio para crawlers)
assert(!html.includes('<!--app-html-->'), 'Placeholder <!--app-html--> substituído pelo HTML pré-renderizado');
assert(!html.includes('<!--app-head-->'), 'Placeholder <!--app-head--> substituído pelo JSON-LD');
assert(html.includes('Conheça a BioClinic Estética Avançada'), 'Conteúdo textual institucional presente no HTML estático');
assert(html.includes('CRBM/MA 11622'), 'Registro profissional CRBM/MA 11622 presente no HTML estático');
assert(html.includes('Harmonização Facial'), 'Procedimentos presentes no HTML estático');
assert(html.includes('Harmonização Corporal'), 'Procedimentos corporais presentes no HTML estático');

// 3. Verificar Metadados SEO e Open Graph
assert(html.includes('<html lang="pt-BR"'), 'Atributo lang="pt-BR" presente');
assert(html.includes('rel="canonical"'), 'Tag canonical configurada');
assert(html.includes('property="og:image"'), 'Meta og:image configurada');
assert(html.includes('property="og:title"'), 'Meta og:title configurada');
assert(html.includes('name="twitter:card"'), 'Meta twitter:card configurada');
assert(!/noindex/i.test(html), 'Ausência de diretiva noindex indevida');

// 4. Verificar exatamente um <h1>
const h1Matches = html.match(/<h1[\s>]/g) || [];
assert(h1Matches.length === 1, `Exatamente um H1 principal encontrado (total: ${h1Matches.length})`);

// 5. Verificar ordem exata das 9 seções e ausência de seções extras proibidas
const sectionIds = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((m) => m[1]);
const expectedOrder = [
  'inicio',
  'servicos',
  'sobre',
  'antes-e-depois',
  'avaliacoes',
  'agendamento',
  'contato',
  'faq',
];
assert(
  JSON.stringify(sectionIds) === JSON.stringify(expectedOrder),
  `Ordem exata das 8 seções + footer: ${sectionIds.join(' → ')}`,
);
assert(html.includes('<footer'), 'Seção 9 (Footer) presente');

// 6. Verificar JSON-LD válido e sem AggregateRating fictício
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(Boolean(ldMatch), 'Bloco JSON-LD presente no head');
if (ldMatch) {
  const json = JSON.parse(ldMatch[1]);
  const types = json['@graph'].map((g) => g['@type']);
  assert(types.includes('Organization'), 'JSON-LD inclui Organization');
  assert(types.includes('HealthAndBeautyBusiness'), 'JSON-LD inclui HealthAndBeautyBusiness');
  assert(types.includes('FAQPage'), 'JSON-LD inclui FAQPage');
  assert(types.includes('BreadcrumbList'), 'JSON-LD inclui BreadcrumbList');
  assert(!ldMatch[1].includes('AggregateRating'), 'JSON-LD sem AggregateRating fictício');
  const faqNode = json['@graph'].find((g) => g['@type'] === 'FAQPage');
  assert(faqNode.mainEntity.length === 5, `FAQPage possui exatamente 5 perguntas (${faqNode.mainEntity.length})`);
}

// 7. Verificar robots.txt
const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf-8');
assert(robots.includes('Googlebot') && robots.includes('Bingbot') && robots.includes('GPTBot') && robots.includes('OAI-SearchBot'), 'robots.txt permite Googlebot, Bingbot, GPTBot e OAI-SearchBot');
assert(!/Disallow:\s*\/assets/i.test(robots), 'robots.txt não bloqueia CSS/JS');

// 8. Verificar que todas as imagens referenciadas em /images/ existem no dist
const imgRefs = [...new Set([...html.matchAll(/\/images\/[a-zA-Z0-9._-]+/g)].map((m) => m[0]))];
for (const ref of imgRefs) {
  const full = path.join(DIST, ref.replace(/^\//, ''));
  assert(fs.existsSync(full), `Imagem referenciada existe: ${ref}`);
}

console.log('\nVerificação técnica concluída!');
