---
layout: post
title: "Hosting a static site"
---

I've wanted to host a simple little website for many years now, but never had the inclination to invest too much (be
it in terms of time, money or thought) into it - the obvious solution was to serve some kind of pre-baked static site,
removing the need for any real kind of infrastructure maintenance, leaving me to worry about "content" (whatever that
means).

I've gone through various systems in the past - trials and experimentation with most workflows including fully-hosted
Wordpress; locally run static-site generators with the output synced to a traditional webhost; and even writing my own
static site generator that was little more than glue around common libraries for parsing markdown.

I might not have seen anything through to completion with those, but I did at least start to form an understanding of
what I was looking for, and I came up with the following list of requirements:

- A static site, served consistently for all requests.
- Requiring minimal maintenance and updating of the infrastructure.
- Possible to host for minimal fixed costs given how little traffic this site will receive.
- Able to use my own domain name to completely mask how the sites actually run.