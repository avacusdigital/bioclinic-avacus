import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { Jimp } from 'jimp';

const ROOT = process.cwd();
const LOGO_PATH = path.join(ROOT, 'assets-src', 'logo-oficial.jpg');
const CLINIC_IMG_PATH = path.join(ROOT, 'assets-src', 'generated', 'hero-clinic.jpg');
const TMP_HTML = path.join(ROOT, 'scripts', '.tmp-og-art.html');
const TMP_PNG = path.join(ROOT, 'scripts', '.tmp-og-art.png');
const OUT_OG_JPG = path.join(ROOT, 'public', 'og-image.jpg');

function findBrowser() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Chrome/Edge executable not found for OG art rendering.');
}

async function prepareCroppedLogoDataUri() {
  const img = await Jimp.read(LOGO_PATH);
  const w = img.width;
  const h = img.height;
  // Preserva 100% da arte e proporção da logo oficial removendo apenas margens excessivas
  img.crop({
    x: Math.round(w * 0.13),
    y: Math.round(h * 0.24),
    w: Math.round(w * 0.74),
    h: Math.round(h * 0.48),
  });
  const buf = await img.getBuffer('image/png');
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function fileToDataUri(filePath, mime) {
  const b64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${b64}`;
}

async function main() {
  const browser = findBrowser();
  const logoUri = await prepareCroppedLogoDataUri();
  const clinicUri = fileToDataUri(CLINIC_IMG_PATH, 'image/jpeg');

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #F7E4DE;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      color: #4A1010;
      -webkit-font-smoothing: antialiased;
    }
    .canvas {
      position: relative;
      width: 1200px;
      height: 630px;
      background:
        radial-gradient(circle at 14% 16%, rgba(255, 253, 251, 0.78), transparent 46%),
        radial-gradient(circle at 80% 85%, rgba(199, 146, 130, 0.22), transparent 48%),
        linear-gradient(122deg, #F7E4DE 0%, #FAF0EC 56%, #F3DBD3 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 46px 56px;
    }
    .frame-outer {
      position: absolute;
      inset: 18px;
      border: 1.5px solid rgba(199, 146, 130, 0.72);
      border-radius: 26px;
      pointer-events: none;
    }
    .frame-inner {
      position: absolute;
      inset: 25px;
      border: 1px solid rgba(199, 146, 130, 0.28);
      border-radius: 20px;
      pointer-events: none;
    }
    .left {
      position: relative;
      z-index: 2;
      width: 655px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
    }
    .top-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 16px;
      border-radius: 999px;
      background: rgba(255, 253, 251, 0.92);
      border: 1px solid rgba(199, 146, 130, 0.55);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #4A1010;
    }
    .pill-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #9E6657;
    }
    .brand-lockup {
      margin-top: 22px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-card {
      width: 148px;
      height: 112px;
      border-radius: 22px;
      background: #F7E4DE;
      border: 1.5px solid rgba(199, 146, 130, 0.75);
      box-shadow: 0 14px 32px -14px rgba(74, 16, 16, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      flex-shrink: 0;
    }
    .logo-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .brand-titles h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.05;
      color: #4A1010;
      letter-spacing: -0.015em;
    }
    .brand-titles .sub {
      margin-top: 6px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #9E6657;
    }
    .divider {
      margin: 24px 0 20px;
      width: 110px;
      height: 2.5px;
      border-radius: 999px;
      background: linear-gradient(90deg, #4A1010 0%, #C79282 100%);
    }
    .headline {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 33px;
      font-weight: 600;
      font-style: italic;
      line-height: 1.22;
      color: #4A1010;
      max-width: 600px;
    }
    .specialty-row {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #6B2A2A;
    }
    .footer-card {
      margin-top: 28px;
      display: inline-flex;
      align-items: center;
      gap: 20px;
      padding: 13px 22px;
      border-radius: 18px;
      background: rgba(255, 253, 251, 0.88);
      border: 1px solid rgba(199, 146, 130, 0.45);
      box-shadow: 0 10px 26px -12px rgba(74, 16, 16, 0.14);
      width: fit-content;
    }
    .footer-item .lbl {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9E6657;
    }
    .footer-item .val {
      margin-top: 2px;
      font-size: 15px;
      font-weight: 700;
      color: #4A1010;
    }
    .v-sep {
      width: 1px;
      height: 30px;
      background: rgba(199, 146, 130, 0.5);
    }

    .right {
      position: relative;
      z-index: 2;
      width: 405px;
      height: 510px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .arch-outline {
      position: absolute;
      inset: -10px -10px 10px 10px;
      border: 1.5px solid rgba(199, 146, 130, 0.72);
      border-radius: 210px 210px 28px 28px;
    }
    .arch-photo {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 205px 205px 24px 24px;
      overflow: hidden;
      border: 4px solid #FFFDFB;
      box-shadow: 0 26px 56px -18px rgba(74, 16, 16, 0.28);
    }
    .arch-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .arch-photo::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(247, 228, 222, 0.06) 0%, rgba(74, 16, 16, 0.12) 100%);
    }
    .bottom-wine-bar {
      position: absolute;
      left: 56px;
      right: 56px;
      bottom: 18px;
      height: 4px;
      border-radius: 999px;
      background: linear-gradient(90deg, #4A1010 0%, #C79282 55%, transparent 100%);
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="frame-outer"></div>
    <div class="frame-inner"></div>

    <div class="left">
      <div class="top-row">
        <span class="pill"><span class="pill-dot"></span>São Luís - MA</span>
      </div>

      <div class="brand-lockup">
        <div class="logo-card">
          <img src="${logoUri}" alt="Logo BioClinic" />
        </div>
        <div class="brand-titles">
          <h1>BioClinic</h1>
          <div class="sub">Estética Avançada</div>
        </div>
      </div>

      <div class="divider"></div>

      <p class="headline">Beleza e harmonia, cuidado em cada detalhe.</p>
      <p class="specialty-row">Harmonização Facial e Corporal · Procedimentos Faciais e Corporais</p>

      <div class="footer-card">
        <div class="footer-item">
          <div class="lbl">Responsável</div>
          <div class="val">Fabiana Tavares · CRBM/MA 11622</div>
        </div>
        <div class="v-sep"></div>
        <div class="footer-item">
          <div class="lbl">Agendamento</div>
          <div class="val">(98) 98811-1576</div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="arch-outline"></div>
      <div class="arch-photo">
        <img src="${clinicUri}" alt="Ambiente estético BioClinic" />
      </div>
    </div>

    <div class="bottom-wine-bar"></div>
  </div>
</body>
</html>`;

  fs.writeFileSync(TMP_HTML, html, 'utf-8');

  const fileUrl = `file:///${TMP_HTML.replace(/\\/g, '/')}`;
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=5000',
      `--screenshot=${TMP_PNG}`,
      fileUrl,
    ],
    { stdio: 'inherit' },
  );

  const rendered = await Jimp.read(TMP_PNG);
  if (rendered.width !== 1200 || rendered.height !== 630) {
    rendered.cover({ w: 1200, h: 630 });
  }
  await rendered.write(OUT_OG_JPG, { quality: 90 });

  fs.rmSync(TMP_HTML, { force: true });
  fs.rmSync(TMP_PNG, { force: true });

  const stats = fs.statSync(OUT_OG_JPG);
  console.log(`Generated exclusive Open Graph art: public/og-image.jpg (${rendered.width}x${rendered.height}, ${Math.round(stats.size / 1024)} KB)`);
}

main().catch((err) => {
  console.error('Failed rendering OG art:', err);
  process.exit(1);
});
