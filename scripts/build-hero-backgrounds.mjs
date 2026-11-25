import path from 'path';
import { Jimp } from 'jimp';

const ROOT = process.cwd();
const SRC_HERO = path.join(ROOT, 'assets-src', 'generated', 'hero-clinic.jpg');
const OUT_DIR = path.join(ROOT, 'public', 'images');

async function buildDesktopHero(src) {
  const W = 1920;
  const H = 1080;
  const canvas = new Jimp({ width: W, height: H, color: 0xf9eee9ff });

  // Cria fundo suave em degradê nude-rosado #F7E4DE -> #FAF1EC na metade esquerda
  for (let y = 0; y < H; y++) {
    const ty = y / H;
    for (let x = 0; x < W; x++) {
      const tx = x / W;
      const idx = (y * W + x) * 4;
      const r = Math.round(247 + (252 - 247) * (tx * 0.6 + ty * 0.4));
      const g = Math.round(228 + (242 - 228) * (tx * 0.6 + ty * 0.4));
      const b = Math.round(222 + (236 - 222) * (tx * 0.6 + ty * 0.4));
      canvas.bitmap.data[idx] = r;
      canvas.bitmap.data[idx + 1] = g;
      canvas.bitmap.data[idx + 2] = b;
      canvas.bitmap.data[idx + 3] = 255;
    }
  }

  // Enquadra a clínica à direita preservando cadeira estética, cortina de linho, arandela rose gold e travertino
  const rightW = 1220;
  const clinic = src.clone();
  clinic.cover({ w: rightW, h: H });

  const startX = W - rightW;
  const blendW = 460;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < rightW; x++) {
      const tx = startX + x;
      let alpha = 1;
      if (x < blendW) {
        const t = x / blendW;
        alpha = t * t * (3 - 2 * t);
      }

      const sIdx = (y * rightW + x) * 4;
      const dIdx = (y * W + tx) * 4;

      const sr = clinic.bitmap.data[sIdx];
      const sg = clinic.bitmap.data[sIdx + 1];
      const sb = clinic.bitmap.data[sIdx + 2];

      const dr = canvas.bitmap.data[dIdx];
      const dg = canvas.bitmap.data[dIdx + 1];
      const db = canvas.bitmap.data[dIdx + 2];

      // Véu blush sutil (4%) para consistência exata com a identidade #F7E4DE
      const wr = sr * 0.96 + 247 * 0.04;
      const wg = sg * 0.96 + 228 * 0.04;
      const wb = sb * 0.96 + 222 * 0.04;

      canvas.bitmap.data[dIdx] = Math.round(dr * (1 - alpha) + wr * alpha);
      canvas.bitmap.data[dIdx + 1] = Math.round(dg * (1 - alpha) + wg * alpha);
      canvas.bitmap.data[dIdx + 2] = Math.round(db * (1 - alpha) + wb * alpha);
    }
  }

  await canvas.write(path.join(OUT_DIR, 'hero-bg-desktop.jpg'), { quality: 86 });
  console.log('Generated public/images/hero-bg-desktop.jpg (1920x1080)');
}

async function buildMobileHero(src) {
  const W = 1080;
  const H = 1620;
  const canvas = src.clone();
  canvas.cover({ w: W, h: H });

  // Aplica um véu suave blush/ivory na parte superior e inferior para leitura perfeita no celular,
  // mantendo a clínica e a cadeira estética visíveis com sofisticação
  for (let y = 0; y < H; y++) {
    const ty = y / H;
    let veil = 0.22;
    if (ty > 0.42) {
      const t = Math.min(1, (ty - 0.42) / 0.48);
      veil = 0.22 + 0.62 * (t * t * (3 - 2 * t));
    } else if (ty < 0.22) {
      const t = (0.22 - ty) / 0.22;
      veil = 0.22 + 0.34 * t;
    }

    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = canvas.bitmap.data[idx];
      const g = canvas.bitmap.data[idx + 1];
      const b = canvas.bitmap.data[idx + 2];

      canvas.bitmap.data[idx] = Math.round(r * (1 - veil) + 250 * veil);
      canvas.bitmap.data[idx + 1] = Math.round(g * (1 - veil) + 236 * veil);
      canvas.bitmap.data[idx + 2] = Math.round(b * (1 - veil) + 230 * veil);
    }
  }

  await canvas.write(path.join(OUT_DIR, 'hero-bg-mobile.jpg'), { quality: 85 });
  console.log('Generated public/images/hero-bg-mobile.jpg (1080x1620)');
}

async function main() {
  const src = await Jimp.read(SRC_HERO);
  await buildDesktopHero(src);
  await buildMobileHero(src);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
