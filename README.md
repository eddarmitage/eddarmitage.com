# Site contents for eddarmitage.com

It's a [Hugo](https://gohugo.io) site with a custom theme (implemented directly in `layouts/` and
`assets/css/main.css`), built and served by Cloudflare Pages. It was originally built using GitHub Pages and Jekyll —
I've written more details about that original setup in a blog post that you can read
[here](https://eddarmitage.com/2023/06/hosting-a-static-site) — but the site has since been migrated to Hugo, with
Cloudflare Pages handling both build and hosting. See `AGENTS.md` for details of the current setup.

## Writing notes

Posts support two kinds of note. Pick by how long the note is, not by which looks nicer:

| | Use for | Where it appears |
| --- | --- | --- |
| **Sidenote** | A short aside — a sentence or two | In the right margin, beside the paragraph |
| **Footnote** | Anything longer, multi-paragraph, or a citation | Collected at the end of the post, under "Notes" |

### Sidenotes

Two shortcodes: `{{< ref >}}` marks the spot in the sentence, and `{{< sidenote >}}` holds the note itself.

```markdown
The build runs on every push rather than every merge.{{< ref >}}

{{< sidenote >}}Worth checking before you touch any infrastructure: is the
expensive job running too often, not just too slowly?{{< /sidenote >}}
```

Three rules:

1. **Don't write the number.** They're numbered automatically. Just write `{{< ref >}}` and `{{< sidenote >}}`.
2. **Use them in pairs, in order.** Each `{{< ref >}}` needs exactly one `{{< sidenote >}}` after it. Miss one out
   and the numbering slips out of step for the rest of the post.
3. **Put the sidenote straight after the paragraph** containing its `{{< ref >}}` — not mid-paragraph, and not
   several paragraphs later. On a narrow screen the note drops inline at exactly that point, so it needs to land
   next to the text it belongs to.

Keep sidenotes to plain text: **bold**, links and other markdown won't render inside them. If you find yourself
wanting formatting, or more than a couple of sentences, it should probably be a footnote.

To point at the same note twice, pass the number explicitly the second time — `{{< ref 1 >}}` links back to
sidenote 1.

### Footnotes

Standard markdown footnotes; no shortcodes involved.

```markdown
Cheap to run for a site this quiet.[^costs]

[^costs]: "Minimal" means the bill rounds to zero on a quiet month, not that
    it's free. A few pounds a year for a domain is fine.

    Indent by four spaces to add a second paragraph to the same note.
```

The label (`costs`) is just a handle for you — readers see a number. Put the definition wherever you like; it
always renders at the end of the post. Numbering is independent of the sidenotes, so a post can use both.

### What readers get

Both kinds are clickable in both directions: tapping the marker jumps to the note, and tapping the note's number
jumps back to where you were. That matters most on a phone, where the note is a scroll away rather than sitting
in the margin. Sidenotes move into the flow below 1100px wide, and both kinds print sensibly.

## License

The content of this site is licensed under the [Creative Commons Attribution 3.0 Unported license](https://creativecommons.org/licenses/by/3.0/), and the underlying source code used to format and display that content is licensed under the [MIT license](LICENSE.md).
