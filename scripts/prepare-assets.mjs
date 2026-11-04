// Builds web-sized copies of the approved photos into public/assets/.
// Source files are only ever read. Run: npm run assets
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const cfg = JSON.parse(readFileSync(join(here, 'asset-sources.json'), 'utf8'));
const srcRoot = resolve(here, cfg.sourceRoot);
const outDir = join(root, 'public/assets/photos');
mkdirSync(outDir, { recursive: true });

const FULL = 2000; // long edge for the lightbox
const THUMB = 560; // long edge for grids and cards

const dims = {};
const missing = [];
const tmp = mkdtempSync(join(tmpdir(), 'reva-assets-'));

for (const [id, p] of Object.entries(cfg.photos)) {
  let file = join(srcRoot, p.src);
  if (!existsSync(file)) {
    missing.push(`${id}: ${p.src}`);
    continue;
  }
  if (p.heic) {
    // sharp's bundled libvips can't decode HEVC; macOS sips can.
    const jpg = join(tmp, `${p.out}.jpg`);
    execFileSync('sips', ['-s', 'format', 'jpeg', file, '--out', jpg], { stdio: 'ignore' });
    file = jpg;
  }
  let img = sharp(file).rotate(p.rotate ?? undefined);
  if (p.crop) {
    // rotate() must be applied before extract, so materialise it first
    const buf = await img.toBuffer();
    img = sharp(buf).extract(p.crop);
  }
  const base = await img.toBuffer();
  const meta = await sharp(base).metadata();
  await sharp(base)
    .resize({ width: FULL, height: FULL, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(outDir, `${p.out}.webp`));
  await sharp(base)
    .resize({ width: THUMB, height: THUMB, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(join(outDir, `${p.out}_thumb.webp`));
  dims[id] = { file: p.out, w: meta.width, h: meta.height };
  console.log(`✓ ${id} → ${p.out} (${meta.width}×${meta.height})`);
}

// Handwriting: dark ink on white → charcoal ink on transparent.
{
  const h = cfg.handwriting;
  const file = join(srcRoot, h.src);
  if (!existsSync(file)) missing.push(`handwriting: ${h.src}`);
  else {
    const { data, info } = await sharp(file)
      .extract(h.crop)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i++) {
      const a = Math.max(0, Math.min(255, (255 - data[i]) * 1.6));
      rgba[i * 4] = 0x34;
      rgba[i * 4 + 1] = 0x33;
      rgba[i * 4 + 2] = 0x42;
      rgba[i * 4 + 3] = a;
    }
    const illoDir = join(root, 'public/assets/illustrations');
    mkdirSync(illoDir, { recursive: true });
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(join(illoDir, `${h.out}.png`));
    console.log(`✓ handwriting → ${h.out}.png`);
  }
}

writeFileSync(join(root, 'src/data/assetDimensions.json'), JSON.stringify(dims, null, 2) + '\n');
if (missing.length) {
  console.warn('\n⚠ Missing source files (left as placeholders, nothing substituted):');
  missing.forEach((m) => console.warn('  - ' + m));
}
