---
title: From Noise to Deception
description: "Fauxx stopped trying to drown trackers in random noise. Since June it builds believable, coherent personas instead, because data brokers can filter noise far more easily than they can filter people."
date: 2026-10-05
category: Digital
tags:
  - privacy
  - engineering
authors:
  - digitalgrease
comments: true
app: fauxx
---

In June I wrote about [maintaining Fauxx](/posts/fauxx-maintaining-the-signal): the reversals, the scrapers I deleted, the storefront I walked away from. Since then the app has shipped v0.6 through v0.9, and just before the first of those the tagline changed. It used to say "Privacy through noise." Now it says "Privacy through deception."

That one word carries most of what happened. Fauxx started out spraying synthetic activity at the ad networks and hoping the volume would bury the real me. What it builds now are believable, coherent personas: decoys that read as real people, not filterable static. The reason fits in one breath. Ad brokers can filter noise too easily; they can't filter people nearly as easily.

## Noise is the easy part to throw away

Random activity has a shape, and the shape is the problem. Researchers have been measuring this for years. Beugin and colleagues (PETS 2024) found that noise drawn uniformly across interest categories gets picked out by a detector about 94% of the time. Work going back to Degeling (WPES 2018) and HARPO (NDSS 2022) found that small amounts of targeted noise, around 5 to 10%, work better than 20% random. Fauxx's own always-on baseline layer still starts every category at the same weight. The persona reshapes that mix, but the baseline is next in line to change, toward visits weighted by how popular sites really are.

Fauxx had its own version of that problem, closer to the metal. Before v0.6, every rotation drew a fresh random User-Agent, and the JavaScript layer randomized hardware values on every read. Real phones don't do that. A device that changes its story every time you look at it isn't hiding in a crowd; it's waving. Issue #242 wrote the v0.6 goal down plainly: a stable device identity per persona, not random User-Agent rotation.

## One persona, one device

Each persona now presents one stable, believable device. The device isn't chosen at random and stored. It's derived: the persona's id picks a template from a small catalog (six real phone models, four desktop configurations) through a SHA-256 selection. Its creation date once fixed its Chrome version too, starting at 142 in January and moving one major every 28 days. Since v0.9 the phone reports the installed WebView's real version instead, and only the desktop still uses the calendar.

Deriving instead of storing pays off on the desktop side. The companion app computes the same device from the same persona, so nothing about the device ever has to cross the local network. To keep the Kotlin and Rust versions from quietly drifting apart, there's a frozen cross-language test vector: three fixed personas whose devices both implementations have to reproduce byte for byte, with values transcribed from the Kotlin tests so the Rust side can't grade its own homework. (The catalog has its own guard, a pinned checksum, and it earned its keep early: a Windows checkout converted the catalog's line endings, the checksum test caught it, and the JSON is now pinned to LF.)

The same release cycle cleaned out the User-Agent pool itself. v0.6.1 removed bot and headless-browser strings, including one that could have been used for search traffic. Hard to blend in while occasionally announcing yourself as a crawler.

## Nobody clears their cookies every nine days

Personas used to live about nine days. In v0.8 that became a random lifetime between 30 and 90 days, drawn fresh each cycle. Nine days of cookie history reads as a burner account, and rotating roughly forty times a year on a regular schedule was its own signature. Four to twelve irregular rotations a year looks like someone who cleared their browser or bought a new phone.

Longer lives needed real memory. Each persona now gets its own cookie jar, site storage and cache, deleted when the persona retires, so trackers can't stitch personas together through shared cookies. That depends on the installed WebView supporting multiple profiles; where it doesn't, Fauxx falls back to one shared jar.

There's a limit here I'd rather say than have someone find. Every persona still lives on one phone, one network address, one graphics and font stack. A tracker that fingerprints instead of reading cookies can still tell they're the same device.

The custom User-Agent setting went away in the same release. A bare UA string can't carry the matching screen and navigator values, so it produced exactly the contradiction the rest of the work was removing: a phone claiming to be a Pixel 8 while reporting another handset's screen.

## Measuring the decoy

The biggest change in how I worked on Fauxx this quarter was that I stopped assuming and started measuring.

Location spoofing went first. Measured on Android 14, the module turned out to register its own location provider instead of replacing the system one, so apps that ask for location the normal way never saw the fake coordinates. It's now experimental and off by default, and the README says plainly that it does not currently do what its name suggests.

A static audit of the fingerprint layer came back with two lines I keep returning to. "The thin layer varies and the thick layer does not." And: "the highest-value work is deletion."

Then I built a probe: an instrumented test that serves a page from the phone itself and records exactly what a website sees through Fauxx's real browser pool, request headers and JavaScript, in the main frame and an iframe. On WebView 151 it found the disguise leaking from several directions at once:

- every request announced itself as Android WebView in its client hints, whatever the User-Agent claimed
- every request carried the app's own package name in `X-Requested-With`, so any server could drop all Fauxx traffic by matching one header
- persona User-Agents used a format Chrome stopped sending at version 110
- the injected JavaScript contradicted itself and the network, down to reporting 8 GB of memory in script and 2 in the header, and the windows measured zero by zero

The fix was subtraction. Fauxx now presents one identity: Chrome for Android at the installed WebView's real version, with client hints built from WebView's own defaults and the brand renamed to Google Chrome. It no longer injects canvas noise or overrides navigator values at all, because each override was a contradiction a page could read. The package-name header is blanked wherever WebView allows it. Where it can't be (older WebView builds), the dashboard says so and points you at an update. And image loading is now a setting, because a browser that never loads images never fires a tracking pixel, and is unusual in its own right.

## Why Fauxx stays on WebView

After all of that, the fair question is whether WebView is the right engine at all. Three independent comparisons of the alternatives came back the same way: stay.

Only WebView gives Fauxx a byte-true Android Chrome network fingerprint, at no cost to the app's size. GeckoView would make every persona claim to be Firefox, which is under 1% of mobile browsing, add 60 to 90 MB per CPU architecture, and make the F-Droid build a standing burden. TLS-impersonating clients run no JavaScript, and their newest Android Chrome profile trails the real browser by more than twenty versions. Bundled Chromium has had no supported route since WebLayer died, and costs 100 MB or more; Cronet only handles the network. So the phone stays on WebView, and heavy browsing belongs to the desktop companion, which complements the phone rather than replacing it.

## Custom DNS, without breaking the disguise

People running Pi-hole, NextDNS, Rethink or a filtering VPN had a problem: their resolver blocked the very tracker domains Fauxx exists to reach. WebView has no DNS setting, so v0.9 runs a small, password-protected proxy on the phone and points only Fauxx's own browser at it, resolving through whatever you choose: Quad9 by default, Cloudflare, Mullvad, Google, a custom DoH URL or a plain DNS server. TLS stays end to end, so the fingerprint work above is untouched. If your chosen resolver fails, Fauxx falls back to the device's DNS and tells you. Before the release, a three-reviewer adversarial sweep found no release blockers, but several real faults.

## The desktop half

fauxx-desktop 0.3.0 ships alongside. It shares the phone's persona model so a household can present one coherent, deliberately misleading picture across phone and desktop, and it emits only the desktop identity, because a phone's User-Agent over desktop TLS would recreate the mismatch the whole project is trying to remove. In 0.3.0, decoy traffic is confined to TCP port 443 with QUIC off, and the update check, the one request that identifies the app, never shares an exit with a persona's traffic.

## What I don't know yet

Fauxx's personas browse signed out, in their own cookie jars, and mobile broker profiles key on things that browsing never touches: advertising IDs, hashed emails, signed-in accounts. The likely way in is a tracker linking the decoys to you by IP address or fingerprint. Whether the decoy traffic reaches your real profile at all, and by how much, is untested. The first thing to build is a harness that measures it, segment by segment.

The other next step is already filed as issue #322: behavioural realism. Real people browse in sessions, wander around inside a site, keep a handful of habit sites and live on a daily and weekly rhythm. The noise stream should too.

March's goal hasn't changed; the repo still describes it as data poisoning for your everyday tracking. The method finally looks like a person.
