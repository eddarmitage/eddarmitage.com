#!/usr/bin/env node
// Generates a `qr.png` for every page Hugo built, alongside that page's own
// output, encoding the page's own canonical URL (so e.g. `/about` gets
// `/about/qr.png`, `/food/` gets `/food/qr.png`, and the home page gets
// `/qr.png`). Run after `hugo build`/`hugo --gc --minify` — it reads
// `sitemap.xml` from the Hugo output directory to enumerate published pages,
// which already respects baseURL overrides (see scripts/build.sh) and
// naturally excludes drafts, same as the rest of the build.
//
// See "QR codes" in AGENTS.md for the URL scheme and design rationale.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { Jimp } from "jimp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");

const publicDir = path.resolve(process.argv[2] || path.join(repoRoot, "public"));
const faviconPath = path.join(repoRoot, "static/assets/android-chrome-192x192.png");

const QR_SIZE = 512;
const LOGO_SCALE = 0.2; // fraction of QR width; kept well under ~30% of the
// error-correction budget at level H so the code stays scannable.
const LOGO_PADDING_SCALE = 0.12; // white margin around the logo, as a
// fraction of the logo size, so it reads clearly against the QR modules.

// Derives the output directory (relative to publicDir) and the clean,
// extension-less URL for a page from its sitemap <loc>, matching how
// Cloudflare Pages serves uglyURLs output (stripping `.html` at the edge).
function pageFromLoc(loc) {
  const url = new URL(loc);
  const { pathname } = url;

  let dir;
  let cleanPath;
  if (pathname.endsWith("/index.html")) {
    dir = pathname.slice(0, -"index.html".length);
    cleanPath = dir;
  } else if (pathname.endsWith(".html")) {
    cleanPath = pathname.slice(0, -".html".length);
    dir = `${cleanPath}/`;
  } else {
    return null;
  }

  return { outDir: dir, url: `${url.origin}${cleanPath}` };
}

async function readSitemapLocs(sitemapPath) {
  const xml = await fs.readFile(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function buildLogoOverlay(faviconPath) {
  const favicon = await Jimp.read(faviconPath);
  const logoSize = Math.round(QR_SIZE * LOGO_SCALE);
  favicon.resize({ w: logoSize, h: logoSize });

  const pad = Math.round(logoSize * LOGO_PADDING_SCALE);
  const overlay = new Jimp({
    width: logoSize + pad * 2,
    height: logoSize + pad * 2,
    color: 0xffffffff,
  });
  overlay.composite(favicon, pad, pad);
  return overlay;
}

async function generateQr(url, logoOverlay) {
  const qrBuffer = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 2,
    width: QR_SIZE,
  });
  const qrImage = await Jimp.read(qrBuffer);

  const x = Math.round((qrImage.width - logoOverlay.width) / 2);
  const y = Math.round((qrImage.height - logoOverlay.height) / 2);
  qrImage.composite(logoOverlay, x, y);

  return qrImage.getBuffer("image/png");
}

async function main() {
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  const locs = await readSitemapLocs(sitemapPath);
  const logoOverlay = await buildLogoOverlay(faviconPath);

  let count = 0;
  for (const loc of locs) {
    const page = pageFromLoc(loc);
    if (!page) {
      console.warn(`generate-qr: skipping non-HTML sitemap entry: ${loc}`);
      continue;
    }

    const outDir = path.join(publicDir, page.outDir);
    await fs.mkdir(outDir, { recursive: true });
    const buffer = await generateQr(page.url, logoOverlay);
    await fs.writeFile(path.join(outDir, "qr.png"), buffer);
    count += 1;
  }

  console.log(`generate-qr: wrote ${count} QR code(s) to ${publicDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
