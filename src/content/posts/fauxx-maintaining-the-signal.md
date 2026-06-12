---
title: Maintaining the Signal
description: "Three months and three releases after launching Fauxx, the most interesting work wasn't a new feature. It was the decisions I had to reverse. What maintaining an open-source privacy app actually teaches you."
date: 2026-06-11
category: Digital
tags:
  - engineering
  - privacy
authors:
  - digitalgrease
comments: true
app: fauxx
---

Three months ago I shipped Fauxx and [wrote a post about it](/posts/fauxx-cant-stop-the-signal). Near the end, I made a prediction I didn't think of as a prediction: "The scrapers depend on platform UI that will change."

Three releases later, the bill came due. The scrapers are gone. So is the Google Play build. And the most interesting work since launch wasn't a single new feature. It was the steady accumulation of things I got wrong on day one and had to walk back.

That's the part nobody tells you about open source. Launching is the easy story: here's the idea, here's the architecture, here's the repo. Maintaining is the real one, and it's mostly made of reversals. The decisions you undo. The constraints you didn't know existed until you shipped into them.

Here's what three months of maintaining Fauxx actually taught me.

---

## Reality edits your design

Layer 2 was the clever part of the original design. If you authenticated with Google or Facebook, Fauxx would scrape your ad-preference dashboards, read the categories those platforms had actually assigned to you, and then aggressively steer the synthetic noise away from them. Know thy enemy, then flood everything they haven't tagged.

It was also, in hindsight, a bad idea on two fronts.

The first I'd already called out in the launch post: scrapers break. They depend on a DOM that some product team at Google can rearrange on a Tuesday, with no warning and no reason to care that my open-source privacy app is parsing their settings page. Maintaining a scraper is signing up to lose a slow war forever.

The second was the one I hadn't really sat with. A privacy tool that asks you to log into Google and Facebook through it, so it can automate clicking around inside your account: that's a lot of trust to ask, for a payoff that breaks every few months anyway. The right amount of account access for a tool like this is none.

So Layer 2 didn't get maintained. It got deleted. The new Layer 2 reads a file: a Google Takeout or Facebook data export you download yourself and hand to the app. Same signal (what the platforms think they know) without the logins and without the fragility. Fauxx never touches the platforms. It parses a file on-device and steers away from whatever's inside it.

You can see the whole pivot in one commit: a rename from `lastScrapeDate` to `lastImportedDate`. The best maintenance I did all quarter was subtraction.

---

## Platforms decide what your app is allowed to be

Fauxx is no longer on the Google Play Store. Not because it got pulled, because I stopped publishing it.

Play won't allow the full app. The location-spoofing module uses Android's mock-location provider; the ad-pollution module does exactly what the name says. Both are against Play policy. So the Play build was always a lobotomized version, missing two of the seven modules. And Play is drifting toward a mandatory age-verification API, the kind of thing a no-account, no-telemetry privacy tool has precisely no business wiring up.

At some point you have to admit the storefront and the app want incompatible things. A tool built to resist behavioral profiling can't really live inside the ecosystem that does the most profiling, on that ecosystem's terms.

So Fauxx ships through F-Droid, GitHub Releases, and Obtainium now. The full version, all seven modules, no asterisks.

I didn't delete the Play flavor, though. It still sits in the source tree, and CI still debug-compiles and unit-tests it on every run; it just no longer carries any quality gates and can't block a release. That's the compromise: keep the code from silently rotting in case the calculus ever changes, without letting a build I don't ship hold up one I do. Every quality gate moved over to the F-Droid `full` build, which is the one that actually reaches users.

---

## Other people show up, so you build guardrails for them

The first pull request I didn't write myself added Russian.

A whole language, from a contributor I'd never met. It's the moment an open-source project stops being a thing you made and becomes a thing other people are making with you, which is the entire point, and also the moment you find out your codebase wasn't ready for it.

Fauxx generates synthetic search queries. In English, I'd hand-reviewed the query banks and the blocklist of things the app must never search for. A new language means a new query bank, a new persona set, and (this is the part that matters) a new blocklist. And I don't read Russian.

That's not a translation problem. It's a safety problem. Fauxx fires off search queries that are supposed to look like a real person's. If a synthetic query in an unreviewed language accidentally matches a genuine first-person distress phrase (a crisis-line search, a domestic-violence query), the app would be manufacturing exactly the kind of signal it exists to dilute, in a language I can't audit by eye.

So shipping a language is gated. There's a `SHIPPED_LOCALES` allowlist, and a locale doesn't join it until a native speaker has reviewed its harmful-queries file: the one that has to contain that region's actual crisis hotlines, DV resources, and poison-control numbers, not a translated guess at them. The infrastructure can land in the repo; the locale stays dark in production until the review is done, with a test that fails if anyone tries to flip the switch early.

Maintaining a project means making it safe for contributions you didn't write and, sometimes, can't fully read.

---

## Honesty is a maintenance discipline

Launch-day enthusiasm makes you overclaim. Maintenance is mostly the slow walk back.

The dashboard used to lead with a "Noise Ratio." It looked authoritative. It measured nothing real, just throughput, `actions today / 500`, capped at 100%. Five hundred synthetic actions and the gauge reads "saturated," whether or not a single one of them actually steered your profile anywhere useful. It was a vanity number, and vanity numbers are worse than no number, because people trust them.

It got replaced with something honest: a profile-drift card backed by KL divergence, an actual measure of how far the synthetic distribution has pushed your apparent profile away from your real one. Sometimes the honest metric is less flattering. That's the point of it.

Same instinct elsewhere. The synthetic personas used to come from a handful of hand-written archetype templates, which is fine until you notice your "random Americans" are a dozen stereotypes on rotation. They're now joint-sampled from real Census ACS PUMS microdata, so a synthetic persona is a statistically plausible person instead of my guess at one. And the README's threat model got rewritten to say plainly what Fauxx does and doesn't reach: it dilutes weak signals at the edge of the identity graph, and it does not touch deterministic identity joins, server-side conversion events, or anything anchored to your real email and phone number. Edge dilution, not profile replacement.

None of that is a feature. All of it is the project getting more honest than its launch post was.

---

## The unglamorous majority

The rest of the work since launch doesn't make a good headline, which is exactly why it's most of maintenance.

Auto-resume is now crash-safe and has a reconcile watchdog, because a background service that's supposed to come back after quiet hours has to actually come back, every time, including after the OS killed it overnight. The resume notification can start the engine headlessly instead of forcing the app open. Wi-Fi and mobile data got separate intensity tiers, so "go hard on Wi-Fi, stay off my mobile data" is a thing you can actually set. The blocklist interceptor was made fail-closed: if the check can't run, the request doesn't go.

The launch post got the architecture right. The releases since have been the edge cases the architecture didn't know about yet. That ratio, a little design and a lot of edge cases, is what maintenance is.

---

## Three months in

The launch post ended with "Issues, PRs, and skeptical takes all welcome." That was a hopeful little sign-off at the time. There was nobody there yet.

Now there are issues I didn't open, PRs I didn't write, and a contributor who speaks a language I don't. The app got smaller in places (one fewer way to log in), narrower in its claims, and a lot more careful about what it lets strangers add to it. None of that is the kind of progress you can screenshot.

It's the kind that keeps a project alive, though. The code is still at [fauxx](https://github.com/digital-grease/fauxx). Same invitations as before: issues, PRs, skeptical takes. There are just more of us reading them now.
