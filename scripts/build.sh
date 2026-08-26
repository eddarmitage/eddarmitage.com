#!/usr/bin/env bash
# Cloudflare Pages build command. Preview deployments must not bake in the
# production baseURL (see hugo.toml) or every absolute link Hugo generates
# (.Permalink, RSS, canonical tags, favicons) resolves to eddarmitage.com
# instead of the preview's own *.pages.dev URL. CF_PAGES_BRANCH and
# CF_PAGES_URL are injected automatically by Cloudflare Pages.
set -euo pipefail

npm ci

if [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
  hugo --gc --minify
else
  hugo --gc --minify -b "${CF_PAGES_URL}"
fi

# Generate a per-page /qr code image (see "QR codes" in AGENTS.md) now that
# Hugo has written public/sitemap.xml listing every published page.
node scripts/generate-qr.mjs
