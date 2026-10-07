---
name: Fauxx
tagline: Data poisoning for your everyday tracking.
status: beta
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/fauxx
privacy: https://github.com/digital-grease/fauxx/blob/main/PRIVACY.md
accent: "#00cc66"
downloads:
  github: https://github.com/digital-grease/fauxx/releases
  fdroid: https://f-droid.org/packages/com.fauxx.full/
screenshots:
  - src: /apps/fauxx/screens/01-dashboard.webp
    alt: "Dashboard showing active status, daily and weekly action counts, a category distribution chart, the current synthetic persona, and the noise ratio."
  - src: /apps/fauxx/screens/02-targeting-engine.webp
    alt: "Targeting Engine with toggles for Layer 1 (self-report), Layer 2 (adversarial scraper) and Layer 3 (persona rotation), custom-interest entry, and per-category weight bars."
  - src: /apps/fauxx/screens/03-modules.webp
    alt: "Modules screen listing seven poison modules (Search Poisoning, Cookie Saturation, DNS Noise, Fingerprint Rotation, Ad Pollution, Location Spoofing, App Signals), each with its own toggle."
  - src: /apps/fauxx/screens/04-action-log.webp
    alt: "Action Log: a scrollable, filterable list of timestamped actions the engine has taken, such as search queries, cookie hits, fingerprint rotations and URLs visited."
  - src: /apps/fauxx/screens/05-settings.webp
    alt: "Settings with intensity (Low, Medium, High at 200 actions per hour), a Wi-Fi-only toggle, a battery pause threshold, an active-hours window, and a data wipe."
order: 1
---

## The problem

Data brokers, ad networks and analytics platforms collect the searches you
make, the links you click and the places you go. Over time they build a
detailed profile of who you are and what you're likely to do next, and that
profile gets sold and merged with others. Once it exists, you can't
realistically get it deleted.

So instead of trying to delete it, Fauxx buries it in noise.

## How it works

Fauxx runs in the background and generates continuous, plausible activity that
doesn't match your real demographics: search queries, page visits, DNS lookups,
fingerprint rotation, ad-profile pollution and optional GPS spoofing, spread
across seven independent modules. Your real activity is still there, mixed with
enough synthetic activity that data brokers can't confidently tell the two
apart.

The **Demographic Distancing Engine** decides where the noise goes, in four
layers. The base layer (Layer 0) spreads it evenly across every content
category. An optional self-report (Layer 1) steers it away from your real
interests. If you opt in, Layer 2 reads the interests your existing ad-platform
profiles have already assigned you and fills in the gaps. On top of that, a
weekly synthetic persona (Layer 3) rotates so that long-term pattern detection
fails.

Timing follows a Poisson distribution, slowed down at night, so the traffic
looks like a person rather than a bot. Every URL is checked against a built-in
blocklist, and a per-domain rate limit (at least 5 seconds apart, at most 200 an
hour) prevents abuse.

## Privacy

Your demographic data, settings and activity log stay on the phone, in a
SQLCipher database whose key is wrapped by the Android Keystore. There's no
telemetry, analytics, cloud sync or account. The ad-platform scrapers only read.
Sensitive attributes (race, religion, sexual orientation, gender identity,
disability, political affiliation) are never stored or used to steer the noise.

## Status

**Beta.** The full build is available from GitHub Releases and F-Droid. A
reduced Play Store build, without location spoofing and ad-profile pollution
(which Play's policies don't allow), is distributed separately.
