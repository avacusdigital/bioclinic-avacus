# BioClinic Estética Avançada

Site institucional completo, responsivo e pré-renderizado (SSG/SSR) desenvolvido para a **BioClinic Estética Avançada** (São Luís - MA · Responsável: Fabiana Tavares · CRBM/MA 11622).

## Tecnologias

- **React 18 + TypeScript + Vite 6**
- **Tailwind CSS** com paleta oficial da marca (`#F7E4DE`, rose gold `#C79282`, vinho `#4A1010`)
- **Pré-renderização estática (SSR build-time)** via `scripts/prerender.mjs` com injeção automática de **JSON-LD** (`Organization`, `HealthAndBeautyBusiness`, `Service`, `FAQPage`, `BreadcrumbList`)
- **SEO Técnico Completo**: `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, favicons circulares e imagem Open Graph `1200×630`

## Configuração Centralizada

Todos os dados oficiais da clínica (contato, WhatsApp, endereço, horários, intervalos editáveis, datas bloqueadas, serviços, galeria Antes e Depois, FAQ, redes sociais e URLs de SEO) estão centralizados em:

- `src/config/clinic.ts`

## Comandos

```bash
npm install         # instala dependências
npm run dev         # inicia servidor de desenvolvimento
npm run build       # gera dist/ com pré-renderização SSR e JSON-LD
npm run preview     # pré-visualiza o build de produção
```

## Deploy na Vercel

O projeto já inclui `vercel.json` pronto para deploy direto:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Antes de apontar o domínio definitivo em produção, atualize `siteUrl` em `src/config/clinic.ts`, `index.html`, `public/robots.txt` e `public/sitemap.xml`.
