# eddarmitage.com — design spec

Status: visual direction and structure agreed. Not yet built. This document plus
`eddarmitage-design-concept.html` (a single-file HTML/CSS reference) are the source
of truth for the design — implement against these, not from scratch.

The reference file includes a dark dashed bar at the very top (jump links + an
"accent: orange (locked)" label). That bar is prototyping scaffolding only —
it is not part of the site and should not be carried into the build.

## Accent

Orange, decided. No runtime theme switcher — bake these in as static values,
don't ship a color picker.

```css
--accent: #B5651F;
--accent-soft: #FBEEE2;
--accent-strong: #8B4B14;
```

## Color tokens

```css
--bg: #ffffff;
--bg-subtle: #f5f6f8;
--bg-inset: #eef0f3;
--text: #14171c;
--text-muted: #5b6472;
--border: #e3e6ea;
```

## Typography

System fonts only — deliberate, not a placeholder. No webfont requests, no FOUT,
nothing to self-host. Three roles:

- **Serif (display + body)** — `Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif`. Used for the site wordmark, all headings, and article prose.
- **Sans (UI)** — `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`. Nav, feed chrome, buttons.
- **Mono (utility)** — `ui-monospace, 'SF Mono', 'Cascadia Code', 'Consolas', monospace`. Dates, content-type tags, TOC numbers, footnote markers, code blocks.

## Layout

- Prose measure: 640px max-width.
- Wider 900px canvas for header, footer, and grids (galleries, project cards),
  and to leave gutter room for sidenotes.
- Breakpoints:
  - `≥1100px` — desktop. Sidenotes float in the right margin next to the paragraph they annotate.
  - `700–1099px` — sidenotes drop the float and become inline callout boxes right after the paragraph (same markup, no duplicated content).
  - `≤700px` — header stacks (wordmark, then nav); nav wraps via flexbox as needed.
  - `≤600px` — two-column layouts (e.g. recipe ingredients/method) collapse to one column.
  - `≤480px` — article H1 steps down from 38px to 28px so long titles don't run to 4–5 lines.
- No hamburger menu. Five nav items + four icons wrap naturally; revisit only if the nav grows substantially.

## Navigation

Top nav: **Writing · Projects · Photos · Food · About**
Icon cluster, right-aligned and visually separated from the text nav: GitHub, Instagram, LinkedIn, RSS.

## Content types

Feed items are tagged by type — the tag is both a visual rhythm device and real information (reader knows what they're clicking before they click):

- **Article** — long-form, full content in RSS. Longer pieces use the Preface → TOC → body structure below.
- **Link** — short commentary + outbound link, title prefixed with `→`.
- **Photos** — gallery post.
- **Food** — recipe/food post.
- **Projects** — not a feed type; a standalone page, card grid of things built (name, one-line description, links out). E.g. the Rummikub score tracker.

## Article template

- **Preface** — italic serif lead paragraph, sits above the TOC.
- **TOC** — bordered box, mono decimal-leading-zero numbering, links to each `<h2 id="">`.
- **"↑ Back to contents"** link after every `<h2>` section (in our own words, borrowed from jamesshore.com's "[Contents]" convention).
- **Notes** — two patterns, chosen by the *kind* of note rather than as fallbacks for one another. Both are in the reference file.
  - **Sidenotes** (`.sidenote`, via `{{< ref >}}` + `{{< sidenote >}}`) — short marginal asides. Floated into the right margin via CSS only (negative margin + float, single source of content, degrades to an inline callout at `<1100px`). The shortcodes auto-number per page and emit reciprocal anchors, so marker and note link to each other on every screen size and the note is reachable without JS. Numbering is decimal-leading-zero, matching the TOC.
  - **Footnotes** (`.footnotes`, goldmark `[^1]`) — long, multi-paragraph or citation-style notes, collected at the end of the article under a mono "Notes" label. Goldmark owns the numbering, so these stay plain decimal and match the sidenotes in font and colour instead. Styled to share the sidenote visual language; `clear:both` keeps them off a trailing floated sidenote.
  - Why both: floated margin placement is free only because sidenote content is authored inline, and goldmark's linked backrefs are free only because its notes live at the bottom. Getting both properties from one pattern would need JS, which neither the print stylesheet nor a no-JS reader would benefit from.
- **Code blocks** — dark background, accent-colored left border.
- **Print** — dedicated `@media print` block: hides nav/footer/print-button, un-floats sidenotes, drops footnote backrefs and `:target` highlights (both are navigation, meaningless on paper), forces black-on-white. The article's print button just calls `window.print()`.

## Empty-state pattern

Sections without content yet (Photos and Food at launch) should stay in the nav
and render a quiet placeholder rather than disappear — keeps the IA and URLs
stable from day one. Pattern: same card shape as real content, dashed border
instead of solid, muted italic copy, small mono "eyebrow" label. See
`.empty-state`, demonstrated as the "More soon" card in the Projects grid.

## Requirements checklist

Covered by this spec + the reference file:

- [x] Preface / TOC / article structure
- [x] Footnotes and sidenotes (both patterns designed, with a rule for which to use)
- [x] Content-type tagging (article / link / photos / food)
- [x] Print stylesheet
- [x] Photo gallery grid + caption treatment
- [x] Social icons + nav structure
- [x] Responsive behavior (breakpoints above)
- [x] Empty-state treatment for sparse sections

Not covered here — implementation-level, needs its own work:

- [ ] RSS feed generation (full article content)
- [ ] Favicon file
- [ ] Code syntax highlighting engine
- [ ] Responsive image pipeline (`srcset`, lazy loading)
- [ ] Reader-mode support (semantic `<article>`/`<time>`, meta tags — the reference file's HTML skeleton is a starting point, not final)
- [ ] HSTS preload
- [ ] Cloudflare Pages preview instances
