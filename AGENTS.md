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
specifically to reproduce the exact URLs the old Jekyll site served
(`/about`, `/archive`, `/YYYY/MM/slug`, no trailing slash) once Cloudflare
Pages strips the `.html` extension at the edge. Changing permalink structure
or `uglyURLs` will break existing indexed/bookmarked URLs — treat this as a
deliberate constraint, not an oversight.

RSS is intentionally served at `/feed.xml` (via an `outputFormats.RSS`
override in `hugo.toml`), matching the feed URL that was actually live under
Jekyll — not Hugo's default `/index.xml`.

## Favicons

The favicon/manifest `<head>` block (`layouts/_partials/extend_head.html` +
`params.assets.*` in `hugo.toml`) has a documented history of Safari-specific
breakage in the old Jekyll site (6+ bug-fix commits). Test any change to this
in Safari (desktop and iOS), not just Chromium browsers.

## Build & dev

- `hugo server -D` — local dev with drafts.
- `hugo --gc --minify` — production build (what Cloudflare Pages runs).
- Keep the `HUGO_VERSION` env var on the Cloudflare Pages project in sync with
  whatever Hugo version is used locally/in CI — check `hugo version`.

## Related directories (not part of this repo)

`../new-eddarmitage.com` and `../new-new-eddarmitage.com` are earlier scratch
attempts at rebuilding this site — not canonical, but occasionally worth
checking for stray content or layout ideas that haven't been ported here yet.
