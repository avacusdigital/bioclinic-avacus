import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';
import pngToIco from 'png-to-ico';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'assets-src');
const GEN_DIR = path.join(SRC_DIR, 'generated');
const STOCK_DIR = path.join(SRC_DIR, 'stock');
const OUT_PUBLIC = path.join(ROOT, 'public');
const OUT_IMAGES = path.join(OUT_PUBLIC, 'images');

fs.mkdirSync(OUT_IMAGES, { recursive: true });

function hexToRgbaInt(hex, alpha = 255) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return ((r << 24) >>> 0) + (g << 16) + (b << 8) + alpha;
}

/**
 * Cria um PNG circular com fundo blush #F7E4DE, borda rose gold discreta
 * e a logo oficial real da BioClinic centralizada sem distorção.
 */
async function createCircularLogoPng(logoImg, size, withRing = true) {
  const canvas = new Jimp({ width: size, height: size, color: 0x00000000 });
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;

  const blushR = 0xf7,
    blushG = 0xe4,
    blushB = 0xde;
  const ringR = 0xc7,
    ringG = 0x92,
    ringB = 0x82;
  const ringThickness = withRing ? Math.max(1.5, size * 0.032) : 0;

  // Preenche o círculo com anti-aliasing suave nas bordas
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        const edgeAlpha = dist > radius - 1.2 ? Math.max(0, Math.min(1, (radius - dist) / 1.2)) : 1;
        let r = blushR,
          g = blushG,
          b = blushB;

        if (withRing && dist >= radius - ringThickness) {
          r = ringR;
          g = ringG;
          b = ringB;
        }

        const idx = (y * size + x) * 4;
        canvas.bitmap.data[idx] = r;
        canvas.bitmap.data[idx + 1] = g;
        canvas.bitmap.data[idx + 2] = b;
        canvas.bitmap.data[idx + 3] = Math.round(edgeAlpha * 255);
      }
    }
  }

  // Recorta a área útil da logo original preservando 100% da arte e proporção
  const croppedLogo = logoImg.clone();
  const lw = croppedLogo.width;
  const lh = croppedLogo.height;
  // A arte da logo oficial ocupa a faixa central (aprox. x: 11%..89%, y: 21%..74%)
  const cropX = Math.round(lw * 0.11);
  const cropY = Math.round(lh * 0.21);
  const cropW = Math.round(lw * 0.78);
  const cropH = Math.round(lh * 0.54);
  croppedLogo.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

  const innerTargetW = Math.round(size * 0.8);
  const scale = innerTargetW / croppedLogo.width;
  const innerTargetH = Math.max(1, Math.round(croppedLogo.height * scale));
  croppedLogo.resize({ w: innerTargetW, h: innerTargetH });

  const offsetX = Math.round((size - innerTargetW) / 2);
  const offsetY = Math.round((size - innerTargetH) / 2);

  // Compõe respeitando a máscara circular
  for (let y = 0; y < innerTargetH; y++) {
    for (let x = 0; x < innerTargetW; x++) {
      const tx = offsetX + x;
      const ty = offsetY + y;
      if (tx < 0 || ty < 0 || tx >= size || ty >= size) continue;
      const dx = tx + 0.5 - cx;
      const dy = ty + 0.5 - cy;
      if (Math.sqrt(dx * dx + dy * dy) > radius - ringThickness - 0.5) continue;

      const sIdx = (y * innerTargetW + x) * 4;
      const dIdx = (ty * size + tx) * 4;
      canvas.bitmap.data[dIdx] = croppedLogo.bitmap.data[sIdx];
      canvas.bitmap.data[dIdx + 1] = croppedLogo.bitmap.data[sIdx + 1];
      canvas.bitmap.data[dIdx + 2] = croppedLogo.bitmap.data[sIdx + 2];
    }
  }

  return canvas;
}

/**
 * Gera a imagem Open Graph 1200x630 combinando:
 * - Fundo blush oficial #F7E4DE à esquerda
 * - Fotografia editorial da clínica à direita com fusão suave em degradê
 * - Logotipo oficial real da BioClinic centralizado na área esquerda
 * - Moldura fina em rose gold e faixa inferior discreta em vinho #4A1010
 */
async function createOpenGraphImage(logoImg, heroClinicImg) {
  const W = 1200;
  const H = 630;
  const bg = new Jimp({ width: W, height: H, color: hexToRgbaInt('#F7E4DE', 255) });

  // Prepara a foto da clínica para cobrir a metade direita (x: 540..1200)
  const rightW = 680;
  const clinicRight = heroClinicImg.clone();
  clinicRight.cover({ w: rightW, h: H });

  const startX = W - rightW;
  const blendWidth = 220;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < rightW; x++) {
      const tx = startX + x;
      let alpha = 1;
      if (x < blendWidth) {
        const t = x / blendWidth;
        // Curva smoothstep para fusão impecável com o fundo #F7E4DE
        alpha = t * t * (3 - 2 * t);
      }

      const sIdx = (y * rightW + x) * 4;
      const dIdx = (y * W + tx) * 4;

      const sr = clinicRight.bitmap.data[sIdx];
      const sg = clinicRight.bitmap.data[sIdx + 1];
      const sb = clinicRight.bitmap.data[sIdx + 2];

      // Leve véu blush quente para harmonia de marca
      const dr = bg.bitmap.data[dIdx];
      const dg = bg.bitmap.data[dIdx + 1];
      const db = bg.bitmap.data[dIdx + 2];

      const effectiveAlpha = alpha * 0.92;
      bg.bitmap.data[dIdx] = Math.round(dr * (1 - effectiveAlpha) + sr * effectiveAlpha);
      bg.bitmap.data[dIdx + 1] = Math.round(dg * (1 - effectiveAlpha) + sg * effectiveAlpha);
      bg.bitmap.data[dIdx + 2] = Math.round(db * (1 - effectiveAlpha) + sb * effectiveAlpha);
    }
  }

  // Insere a logo oficial real na metade esquerda (sem distorção, preservando 100% da arte)
  const logoCrop = logoImg.clone();
  const lw = logoCrop.width;
  const lh = logoCrop.height;
  logoCrop.crop({
    x: Math.round(lw * 0.1),
    y: Math.round(lh * 0.2),
    w: Math.round(lw * 0.8),
    h: Math.round(lh * 0.56),
  });
  logoCrop.resize({ w: 500 });

  const logoX = 56;
  const logoY = Math.round((H - logoCrop.height) / 2) - 10;

  // Mistura suave apenas onde a logo não é o próprio fundo #F7E4DE
  bg.composite(logoCrop, logoX, logoY);

  // Desenha moldura editorial fina em rose gold (#C79282)
  const borderMargin = 24;
  const rgR = 0xc7,
    rgG = 0x92,
    rgB = 0x82;
  for (let t = 0; t < 2; t++) {
    for (let x = borderMargin; x < W - borderMargin; x++) {
      for (const y of [borderMargin + t, H - borderMargin - 1 - t]) {
        const idx = (y * W + x) * 4;
        bg.bitmap.data[idx] = rgR;
        bg.bitmap.data[idx + 1] = rgG;
        bg.bitmap.data[idx + 2] = rgB;
      }
    }
    for (let y = borderMargin; y < H - borderMargin; y++) {
      for (const x of [borderMargin + t, W - borderMargin - 1 - t]) {
        const idx = (y * W + x) * 4;
        bg.bitmap.data[idx] = rgR;
        bg.bitmap.data[idx + 1] = rgG;
        bg.bitmap.data[idx + 2] = rgB;
      }
    }
  }

  // Detalhe linear vinho elegante abaixo da logo (x: 92..280)
  const wineR = 0x4a,
    wineG = 0x10,
    wineB = 0x10;
  const barY = logoY + logoCrop.height + 26;
  for (let y = barY; y < barY + 3; y++) {
    for (let x = 92; x < 240; x++) {
      const idx = (y * W + x) * 4;
      bg.bitmap.data[idx] = wineR;
      bg.bitmap.data[idx + 1] = wineG;
      bg.bitmap.data[idx + 2] = wineB;
    }
  }

  await bg.write(path.join(OUT_PUBLIC, 'og-image.jpg'), { quality: 88 });
  console.log('Generated public/og-image.jpg (1200x630)');
}

/**
 * Aplica tratamento sutil de color grading quente (identidade blush/champagne)
 * para dar unidade editorial a todas as fotografias dos cards.
 */
function applySoftEditorialTone(img, warmStrength = 0.06) {
  const data = img.bitmap.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.round(data[i] * (1 - warmStrength) + 247 * warmStrength));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * (1 - warmStrength) + 228 * warmStrength));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * (1 - warmStrength) + 222 * warmStrength));
  }
  return img;
}

/**
 * Cria par Antes/Depois ilustrativo perfeitamente alinhado pixel-a-pixel.
 * Diferença sutil, natural e elegante (textura/luminosidade/viço) sem exageros artificiais.
 */
async function createBeforeAfterPair(sourcePath, outPrefix) {
  const base = await Jimp.read(sourcePath);
  base.cover({ w: 1080, h: 760 });

  // "Antes": tonalidade levemente mais fria/opaca e contraste natural de pele sem tratamento
  const beforeImg = base.clone();
  beforeImg.brightness(0.95);
  beforeImg.contrast(0.06);
  const bd = beforeImg.bitmap.data;
  for (let i = 0; i < bd.length; i += 4) {
    // Leve dessaturação sutil para aparência natural pré-procedimento
    const avg = bd[i] * 0.3 + bd[i + 1] * 0.59 + bd[i + 2] * 0.11;
    bd[i] = Math.max(0, Math.min(255, Math.round(bd[i] * 0.86 + avg * 0.14 - 3)));
    bd[i + 1] = Math.max(0, Math.min(255, Math.round(bd[i + 1] * 0.86 + avg * 0.14 - 2)));
    bd[i + 2] = Math.max(0, Math.min(255, Math.round(bd[i + 2] * 0.88 + avg * 0.12)));
  }

  // "Depois": luminosidade suave, viço radiante e uniformidade tonal discreta
  const afterImg = base.clone();
  const softBlur = base.clone();
  softBlur.blur(2);
  // Mistura 28% do blur leve sobre a imagem original para simular viço/suavidade natural (skin glow)
  const ad = afterImg.bitmap.data;
  const sd = softBlur.bitmap.data;
  for (let i = 0; i < ad.length; i += 4) {
    const r = ad[i] * 0.72 + sd[i] * 0.28;
    const g = ad[i + 1] * 0.72 + sd[i + 1] * 0.28;
    const b = ad[i + 2] * 0.72 + sd[i + 2] * 0.28;
    ad[i] = Math.min(255, Math.round(r * 1.05 + 6));
    ad[i + 1] = Math.min(255, Math.round(g * 1.04 + 4));
    ad[i + 2] = Math.min(255, Math.round(b * 1.03 + 3));
  }

  await beforeImg.write(path.join(OUT_IMAGES, `${outPrefix}-before.jpg`), { quality: 84 });
  await afterImg.write(path.join(OUT_IMAGES, `${outPrefix}-after.jpg`), { quality: 86 });
  console.log(`Generated pair ${outPrefix}-before.jpg & ${outPrefix}-after.jpg`);
}

async function main() {
  console.log('Processing BioClinic assets...');

  // 1. Logo oficial
  const logoOrig = await Jimp.read(path.join(SRC_DIR, 'logo-oficial.jpg'));
  const logoOptimized = logoOrig.clone().resize({ w: 512 });
  await logoOptimized.write(path.join(OUT_IMAGES, 'logo-bioclinic.jpg'), { quality: 92 });

  // Logo circular PNG para uso nítido no Header e Rodapé
  const logoCircle256 = await createCircularLogoPng(logoOrig, 256, false);
  await logoCircle256.write(path.join(OUT_IMAGES, 'logo-bioclinic-circle.png'));

  // 2. Favicons oficiais circulares a partir da logo oficial
  const fav16 = await createCircularLogoPng(logoOrig, 16, false);
  const fav32 = await createCircularLogoPng(logoOrig, 32, true);
  const fav48 = await createCircularLogoPng(logoOrig, 48, true);
  const apple180 = await createCircularLogoPng(logoOrig, 180, true);
  const icon192 = await createCircularLogoPng(logoOrig, 192, true);
  const icon512 = await createCircularLogoPng(logoOrig, 512, true);

  const p16 = path.join(OUT_PUBLIC, 'favicon-16x16.png');
  const p32 = path.join(OUT_PUBLIC, 'favicon-32x32.png');
  const p48 = path.join(SRC_DIR, 'tmp-48.png');

  await fav16.write(p16);
  await fav32.write(p32);
  await fav48.write(p48);
  await apple180.write(path.join(OUT_PUBLIC, 'apple-touch-icon.png'));
  await icon192.write(path.join(OUT_PUBLIC, 'icon-192.png'));
  await icon512.write(path.join(OUT_PUBLIC, 'icon-512.png'));

  const icoBuf = await pngToIco([p16, p32, p48]);
  fs.writeFileSync(path.join(OUT_PUBLIC, 'favicon.ico'), icoBuf);
  if (fs.existsSync(p48)) fs.unlinkSync(p48);
  console.log('Generated favicons (favicon.ico + PNGs + apple-touch-icon)');

  // 3. Fotografia oficial da Dra. Fabiana Tavares (preservar integridade e proporção)
  const fabiana = await Jimp.read(path.join(SRC_DIR, 'fabiana-tavares.jpg'));
  await fabiana.write(path.join(OUT_IMAGES, 'fabiana-tavares.jpg'), { quality: 92 });

  // 4. Hero principal (imagem editorial gerada da clínica) + Hero detalhe
  const heroClinic = await Jimp.read(path.join(GEN_DIR, 'hero-clinic.jpg'));
  const heroMain = heroClinic.clone().resize({ w: 1080 });
  await heroMain.write(path.join(OUT_IMAGES, 'hero-clinic.jpg'), { quality: 86 });

  const heroDetail = await Jimp.read(path.join(GEN_DIR, 'corporal-harmonizacao.jpg'));
  heroDetail.cover({ w: 600, h: 600 });
  applySoftEditorialTone(heroDetail, 0.04);
  await heroDetail.write(path.join(OUT_IMAGES, 'hero-detail.jpg'), { quality: 86 });

  // 5. Open Graph 1200x630
  await createOpenGraphImage(logoOrig, heroClinic);

  // 6. Serviços Faciais e Corporais (todos 800x600 editorial 4:3, 100% curados sem marcas comerciais)
  const serviceMap = [
    ['facial-harmonizacao.jpg', path.join(GEN_DIR, 'ba-1-before.jpg'), 0.03],
    ['facial-limpeza.jpg', path.join(STOCK_DIR, 'facial-limpeza.jpg'), 0.07],
    ['facial-peeling.jpg', path.join(STOCK_DIR, 'facial-peeling.jpg'), 0.07],
    ['facial-microagulhamento.jpg', path.join(STOCK_DIR, 'corporal-carboxiterapia.jpg'), 0.06],
    ['facial-rejuvenescimento.jpg', path.join(STOCK_DIR, 'extra-portrait-1.jpg'), 0.04],
    ['facial-skinbooster.jpg', path.join(STOCK_DIR, 'facial-limpeza-peeling.jpg'), 0.06],
    ['facial-botox.jpg', path.join(STOCK_DIR, 'facial-microagulhamento.jpg'), 0.06],
    ['facial-limpeza-peeling.jpg', path.join(STOCK_DIR, 'facial-limpeza.jpg'), 0.08],
    ['facial-limpeza-skinbooster.jpg', path.join(STOCK_DIR, 'extra-portrait-2.jpg'), 0.06],
    ['corporal-harmonizacao.jpg', path.join(GEN_DIR, 'corporal-harmonizacao.jpg'), 0.02],
    ['corporal-criolipolise.jpg', path.join(STOCK_DIR, 'corporal-criolipolise.jpg'), 0.08],
    ['corporal-carboxiterapia.jpg', path.join(STOCK_DIR, 'extra-massage2.jpg'), 0.08],
    ['corporal-corrente-russa.jpg', path.join(STOCK_DIR, 'extra-spa-face.jpg'), 0.08],
    ['corporal-detox.jpg', path.join(STOCK_DIR, 'corporal-corrente-russa.jpg'), 0.06],
  ];

  for (const [outName, srcPath, tone] of serviceMap) {
    const img = await Jimp.read(srcPath);
    img.cover({ w: 800, h: 600 });
    applySoftEditorialTone(img, tone);
    await img.write(path.join(OUT_IMAGES, outName), { quality: 82 });
  }
  console.log(`Processed ${serviceMap.length} service images`);

  // 7. Galeria Antes e Depois (4 pares alinhados pixel a pixel)
  await createBeforeAfterPair(path.join(GEN_DIR, 'ba-1-before.jpg'), 'ba-1');
  await createBeforeAfterPair(path.join(STOCK_DIR, 'extra-portrait-1.jpg'), 'ba-2');
  await createBeforeAfterPair(path.join(STOCK_DIR, 'extra-portrait-2.jpg'), 'ba-3');
  await createBeforeAfterPair(path.join(STOCK_DIR, 'corporal-carboxiterapia.jpg'), 'ba-4');

  console.log('All BioClinic assets processed successfully!');
}

main().catch((err) => {
  console.error('Asset processing failed:', err);
  process.exit(1);
});
