// Builds web copies of the approved photos into public/assets/photos.
// Originals are only read. For each photo we write:
//   <out>.webp / <out>_thumb.webp            unedited (orientation corrected only)
//   <out>_edit.webp / <out>_edit_thumb.webp  only when a derivative is recorded
// sharp drops EXIF/GPS metadata by default, so nothing private rides along.
// Run: npm run assets
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

const FULL = 2000; // long edge for the viewer
const THUMB = 560; // long edge for grids and cards
const tmp = mkdtempSync(join(tmpdir(), 'reva-assets-'));

const dims = {};
const missing = [];

async function write(buf, name) {
  await sharp(buf).resize({ width: FULL, height: FULL, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(outDir, `${name}.webp`));
  await sharp(buf).resize({ width: THUMB, height: THUMB, fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(join(outDir, `${name}_thumb.webp`));
  const m = await sharp(buf).metadata();
  return { w: m.width, h: m.height };
}

for (const [id, p] of Object.entries(cfg.photos)) {
  let file = join(srcRoot, p.video ?? p.src);
  if (!existsSync(file)) {
    missing.push(`${id}: ${p.video ?? p.src}`);
    continue;
  }
  if (p.heic) {
    // sharp's bundled libvips can't decode HEVC; macOS sips can.
    const jpg = join(tmp, `${p.out}.jpg`);
    execFileSync('sips', ['-s', 'format', 'jpeg', file, '--out', jpg], { stdio: 'ignore' });
    file = jpg;
  }
  if (p.video) {
    // a still frame from one of Ruru's flower-making videos
    const jpg = join(tmp, `${p.out}.jpg`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(p.at), '-i', file, '-frames:v', '1', '-q:v', '2', jpg]);
    file = jpg;
  }
  // .rotate() with no angle applies EXIF orientation; an explicit angle fixes sideways files
  const base = await sharp(file).rotate(p.rotate ?? undefined).toBuffer();
  const record = { file: p.out, ...(await write(base, p.out)) };
  if (p.derivative) {
    const edit = await sharp(base).extract(p.derivative.crop).toBuffer();
    record.edit = { ...(await write(edit, `${p.out}_edit`)), removes: p.derivative.removes, approved: !!p.derivative.approved };
  }
  dims[id] = record;
  console.log(`✓ ${id} → ${p.out} (${record.w}×${record.h})${record.edit ? ` + edit (${record.edit.approved ? 'shown' : 'awaiting approval'})` : ''}`);
}

// Ruru's real handwriting: "Happy 21st, Riruu." → charcoal ink on transparent.
{
  const h = { src: 'production/handwriting/work/ink_full.png', out: 'happy-21st-riruu', crop: { left: 360, top: 1100, width: 1070, height: 168 } };
  const file = join(srcRoot, h.src);
  if (!existsSync(file)) missing.push(`handwriting: ${h.src}`);
  else {
    const { data, info } = await sharp(file).extract(h.crop).greyscale().raw().toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i++) {
      rgba.set([0x34, 0x33, 0x42, Math.max(0, Math.min(255, (255 - data[i]) * 1.6))], i * 4);
    }
    const illoDir = join(root, 'public/assets/illustrations');
    mkdirSync(illoDir, { recursive: true });
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(join(illoDir, `${h.out}.png`));
  }
}

writeFileSync(join(root, 'src/data/generated/assetDimensions.json'), JSON.stringify(dims, null, 2) + '\n');
if (missing.length) {
  console.warn('\n⚠ Missing source files (left as placeholders, nothing substituted):');
  missing.forEach((m) => console.warn('  - ' + m));
}
