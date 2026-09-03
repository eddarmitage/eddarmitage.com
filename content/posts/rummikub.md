---
title: "I wrote a Rummikub scoreboard app"
date: 2026-09-01
---

My family love playing [Rummikub](https://en.wikipedia.org/wiki/Rummikub), particularly when travelling, but the scoring is ever so slightly burdensome.{{< sidenote >}}Each player's score is based on the sum of the value of all of the other players' remaining tiles, so requires just enough mechanical computation (working out the values of your remaining tiles) and coordination (nobody can calculate a score until everybody has added up their remaining tiles) to become tiresome after a few rounds of a game with several players.{{< /sidenote >}}
This seemed like the sort of thing that could be solved fairly simply with code, and creating a trivial single-page webapp would give me an excuse to experiment with React & TypeScript.

As with a lot of my toy side-projects, keeping cost as close to zero as possible for the vast majority of the time whilst the system is not being used far outweighed any benefits of making it cheap to run whilst it is under load, and this tends to direct me towards fully-managed, serverless cloud offerings.
I guess the default option for this sort of thing would be AWS Lambda, but the simple nature and limited scope of this project (a trivial frontend, and then a backend that mostly just does persistence and auth), combined with Cloudflare's generous free tier, led me to choose to deploy to a Cloudflare Worker with D1 as the persistent store.

## UI
Blah blah react typescript boring but modern CSS

## Cloudflare Environment
Workers, D1, Auth thingy

## Deployment
Rather than using Terraform (Or OpenTofu, or some other derivative...), I've taken a pretty simple approach: On merge, run any migrations to the D1 database schema, and then just redeploy the worker using `wrangler deploy`.