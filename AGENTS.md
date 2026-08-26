# Agent guidance for eddarmitage.com

Hugo static site for eddarmitage.com, hosted on Cloudflare Pages. Migrated from
Jekyll+GitHub Pages in 2026 (see PR #4 and git history for the full migration
rationale).

## Design

`design/DESIGN.md` and `design/eddarmitage-design-concept.html` are the source
of truth for the site's intended visual design (bespoke typography, sidenotes,
TOC, content-type tags, print stylesheet, Writing/Projects/Photos/Food/About
nav) — implement against these, not from scratch.

The custom theme is implemented directly in `layouts/` and `assets/css/main.css`
(no theme submodule — PaperMod has been removed). Key pieces:

- `layouts/baseof.html` + `layouts/_partials/{head,header,footer,social-icons,feed-item}.html`
  — shared chrome.
- `layouts/posts/single.html` — article template (preface, auto-generated TOC
  from `.TableOfContents`, footnotes via goldmark). Sidenotes and "back to
  contents" links are authored per-article via the `{{< sidenote >}}`,
  `{{< ref >}}` and `{{< backtotoc >}}` shortcodes in `layouts/_shortcodes/`
  — use angle-bracket `{{< >}}` delimiters for these, not `{{% %}}`, since
  goldmark's `unsafe = false` strips raw HTML emitted by percent-delimited
  shortcode output.
- `layouts/posts/single.html` also handles Link-type posts (front matter
  `externalURL` set) with a stripped-down template instead of the full
  article layout.
- Photos/Food/Projects each have `list.html` (card grid + a permanent
  "More soon" empty-state card) and `single.html` (gallery grid / recipe
  card respectively).
- Home feed (`layouts/index.html`, `layouts/index.rss.xml`) aggregates
  `posts` + `photos` + `food` sections by date; `projects` is excluded
  (standalone page per the design spec).
- `[outputs]` in `hugo.toml` restricts non-home page kinds to `["HTML"]` —
  Hugo's default of also emitting RSS for every section would otherwise
  scatter stray `/posts/feed.xml`-style files and defeat `uglyURLs` on
  those sections.

## Content conventions

- `content/posts/` — articles/blog posts.
- `content/projects/` — project write-ups (per the design spec, these will
  become cards on a standalone Projects page, not a chronological feed).
- Mark unfinished content `draft: true` in front matter rather than deleting
  it — drafts are excluded from `hugo build` but included with `hugo server -D`
  / `hugo -D`.
- Front matter is YAML (`---`), matching the rest of this repo's content —
  not TOML (`+++`), even if content is copy-pasted from elsewhere.

## URL structure — do not change without checking backward-compat

`hugo.toml` sets `uglyURLs = true` plus a custom `posts` permalink
(`/YYYY/slug`, no trailing slash) once Cloudflare Pages strips the `.html`
extension at the edge. This originally reproduced the old Jekyll site's
`/YYYY/MM/slug` scheme exactly; that month segment was deliberately dropped
in #36, with 301s in `static/_redirects` covering every post that was
already published under the old scheme so existing indexed/bookmarked links
keep working. Changing permalink structure or `uglyURLs` again will break
current indexed/bookmarked URLs — treat this as a deliberate constraint, not
an oversight, and add a corresponding `static/_redirects` entry for any
already-published URL a future change would move.

RSS is intentionally served at `/feed.xml` (via an `outputFormats.RSS`
override in `hugo.toml`), matching the feed URL that was actually live under
Jekyll — not Hugo's default `/index.xml`.

## Favicons

The favicon/manifest `<head>` block (`layouts/_partials/extend_head.html` +
`params.assets.*` in `hugo.toml`) has a documented history of Safari-specific
breakage in the old Jekyll site (6+ bug-fix commits). Test any change to this
in Safari (desktop and iOS), not just Chromium browsers.

## QR codes

Every published page gets a `qr` alongside it (e.g. `/about/qr`, `/food/qr`,
the home page's at `/qr`) — an extension-less file, matching this site's own
uglyURLs scheme, returning a PNG QR code that encodes that page's own
canonical URL. Generated entirely at build time using Hugo's built-in
`images.QR`/`images.Overlay` (Hugo ≥0.123) — no external script, package
manager, or Cloudflare Pages Function needed, so the site stays pure Hugo.

- `layouts/_partials/qr.html` does the work and is called once per page from
  `layouts/baseof.html`; its return value is discarded (`{{- $_ := ... }}`)
  — the only effect is the side effect of publishing the generated image.
  Skipped for the 404 page, which has no canonical URL of its own.
- `.Permalink`/`.RelPermalink` carry the literal `.html` uglyURLs produces
  (Hugo itself doesn't hide it — Cloudflare Pages strips it at the edge, see
  "URL structure" above), so the partial strips `.html`/`index.html` back
  off both the encoded URL and the output path before appending `qr` —
  landing each page's code alongside its own output (`public/about/qr`,
  `public/food/qr`) without overwriting anything already there, and
  encoding the clean URL actually served rather than the `.html` one. This
  also means the encoded URL automatically reflects the `-b`/baseURL
  override `scripts/build.sh` applies for preview deployments. Drafts are
  excluded the same way the rest of the build excludes them — the partial
  only ever runs for pages Hugo is actually rendering.
- Because the output file has no extension, Cloudflare Pages can't infer its
  Content-Type — `static/_headers` sets `Content-Type: image/png` for `/qr`
  and, via a greedy `/*/qr` splat (Cloudflare's `_headers` wildcard matches
  across path segments/slashes), every nested `<path>/qr`.
- Uses error-correction level `high` (~30% redundancy) with
  `assets/images/qr-logo.png` — a copy of
  `static/assets/android-chrome-192x192.png`, duplicated because
  `resources.Get`/`images.Overlay` can only reach files under `assets/`, not
  `static/` — composited at the centre at ~20% of the code's width, which
  stays comfortably inside the level-H budget. If the favicon is ever
  regenerated, update this copy too (see #21). Verified scannable with a
  real decoder (`jsQR`), not just visually.

## Build & dev

- `hugo server -D` — local dev with drafts.
- `./scripts/build.sh` — what Cloudflare Pages runs (both production and
  preview deployments share this one build command). On the `main` branch it
  runs the normal `hugo --gc --minify`; on any other branch it additionally
  passes `-b "$CF_PAGES_URL"` to override `baseURL` with the preview
  deployment's own `*.pages.dev` URL. Without this, Hugo bakes the production
  `baseURL` from `hugo.toml` into every `.Permalink`-derived link (RSS,
  canonical tags, favicons, "continue reading" links, etc.), so preview
  builds would otherwise link back to production instead of themselves.
  `CF_PAGES_BRANCH` and `CF_PAGES_URL` are injected automatically by
  Cloudflare Pages — nothing to configure per-environment.
- Keep the `HUGO_VERSION` env var on the Cloudflare Pages project in sync with
  whatever Hugo version is used locally/in CI — check `hugo version`.

## Related directories (not part of this repo)

`../new-eddarmitage.com` and `../new-new-eddarmitage.com` are earlier scratch
attempts at rebuilding this site — not canonical, but occasionally worth
checking for stray content or layout ideas that haven't been ported here yet.
