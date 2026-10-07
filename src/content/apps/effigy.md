---
name: Effigy
tagline: Self-OSINT. See what's public about you, then clean it up.
status: pre-release
platforms: [android]
license: AGPL-3.0
accent: "#ffb000"
order: 7
---

## The problem

Before you can reduce your public exposure, you have to see it. Most
data-removal services charge a monthly fee, run scrapers you can't inspect, and
ask you to hand over every identifier you want removed, which is the exposure
they claim to fix. Effigy works the other way round. It runs open-source
intelligence against your own identity on your phone, shows you what it finds,
and gives you the removal links. You do the work, and nothing leaves your phone
unless you ask for it.

## How it works

You add identifiers (email, phone, username, name and address) and prove you
own the ones that can be verified. Email is verified by a round trip through
your own mail account: the code isn't shown in the app until the email has been
sent, so typing it back requires access to the inbox. In the full build, phone
numbers are verified by sending a code through the phone's own SMS.

The scanner then queries a deliberately small set of sources:

- **XposedOrNot** and **Hudson Rock Cavalier** check public breach data and
  infostealer logs without needing an account. They run by default.
- **Have I Been Pwned** adds per-breach detail if you supply your own API key,
  and is skipped otherwise.
- **Username checks** cover 15 public platforms, including GitHub, Reddit,
  Mastodon, Keybase, Lichess and Codeforces, using Sherlock-style signatures.
- **Search queries** run 14 curated dork queries per scan against DuckDuckGo,
  with no Google API and no keys.
- **People-search sites** (Spokeo, Whitepages, Radaris) get their opt-out links
  listed, marked `ASSUMED` because their bot checks make real detection
  unreliable.

Each finding links to the next step: the opt-out page, a prepared removal
email, or a note that a breach can't be withdrawn. The app tracks each one
through discovered, submitted, confirmed, removed, relisted and resubmitted.

## What Effigy won't do

There is no mode for looking up someone else, and there never will be, behind
any flag or setting. Nothing is synced to a cloud, so your findings only leave
the phone as the queries you start. It doesn't scrape people-search sites
either, because keeping scrapers working against sites that block them is
weekly maintenance for very little signal.

## Privacy

Findings are kept in an on-device SQLCipher database whose key is wrapped by the
hardware-backed Android Keystore. There is no telemetry or analytics, and no
Google services beyond Play distribution itself.

## Status

**v0.1 pre-release.** It works end to end. Two builds share one codebase and
signing key: `play`, where removal is manual, and `full`, which adds SMS phone
verification and is planned to resubmit opt-outs automatically in v0.2.
