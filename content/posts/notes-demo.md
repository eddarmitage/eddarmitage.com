---
title: "Demo: sidenotes and footnotes"
date: 2026-09-01
preface: "A throwaway post exercising both note patterns end to end, so the rendering can be checked in a real build rather than a mock. Delete this before merging."
---

This post exists to demonstrate the two note patterns added in #31. It is not real content and should be
removed before the branch merges.

## Sidenotes

Sidenotes are for short marginal asides.{{< ref >}} The marker is placed inline at the reference point, and the
note itself goes immediately after the paragraph, so that when the float drops on a narrow screen the callout
lands next to the text it belongs to rather than mid-sentence.

{{< sidenote >}}On a screen at least 1100px wide this note floats into the right-hand gutter, level with the
paragraph it annotates. Below that it becomes an inline callout box right here instead.{{< /sidenote >}}

Numbering is automatic, so a second note picks up the next number without anything being typed by hand.{{< ref >}}
Both the marker and the note are links: the marker jumps down to the note, and the note's number jumps back up
to the marker.

{{< sidenote >}}Which means the pattern still works on a phone, where the note is a scroll away rather than
sitting alongside the text. The jumped-to target gets a brief accent highlight.{{< /sidenote >}}

A note can be referenced a second time by passing its number explicitly.{{< ref 1 >}} That marker links to the
existing note and deliberately carries no id of its own, so the note's backref stays unambiguous.

{{< backtotoc >}}

## Footnotes

Footnotes are for the longer, more substantial note that would not fit in a 220px gutter — a digression, or a
citation.[^long] They collect at the end of the article under a "Notes" label.

Goldmark numbers them and generates the backref arrow itself, so a second footnote needs nothing special.[^second]

{{< backtotoc >}}

## Both together

The two patterns use separate anchor namespaces (`sn:` for sidenotes, `fn:` for footnotes), so an article can
use both without their links colliding.{{< ref >}} This paragraph does exactly that, and also has a footnote of
its own.[^both]

{{< sidenote >}}This sidenote and the footnote on the same paragraph are numbered independently — 03 here, 3
below — because each pattern counts its own notes.{{< /sidenote >}}

{{< backtotoc >}}

[^long]: This is a multi-paragraph footnote, which is the case the sidenote pattern handles badly: there is no
    sensible way to fit several paragraphs into a margin note without it dominating the page.

    The second paragraph is here to prove that the backref arrow attaches to the end of the last paragraph
    rather than the first, and that the spacing between paragraphs inside a note is tightened relative to body
    text.

[^second]: A short one, to check that consecutive footnotes number correctly and that the list markers line up
    on the same baseline as their first line of text.

[^both]: Numbered independently of the sidenotes on the same page.
