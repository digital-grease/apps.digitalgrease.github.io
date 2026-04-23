---
name: Fauxx
tagline: Data poisoning for your everyday tracking.
status: shipping
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/fauxx
privacy: https://github.com/digital-grease/fauxx/blob/main/PRIVACY.md
accent: "#00cc66"
downloads:
  github: https://github.com/digital-grease/fauxx/releases
screenshots:
  - src: /apps/fauxx/screens/01-dashboard.webp
    alt: "Dashboard — active status, daily and weekly action counts, category distribution donut, current synthetic persona, and noise ratio."
  - src: /apps/fauxx/screens/02-targeting-engine.webp
    alt: "Targeting Engine — toggles for Layer 1 (self-report), Layer 2 (adversarial scraper), Layer 3 (persona rotation); custom-interest entry; per-category weight bars."
  - src: /apps/fauxx/screens/03-modules.webp
    alt: "Modules — seven poison modules (Search Poisoning, Cookie Saturation, DNS Noise, Fingerprint Rotation, Ad Pollution, Location Spoofing, App Signals), each with an individual toggle."
  - src: /apps/fauxx/screens/04-action-log.webp
    alt: "Action Log — a scrollable, filterable list of timestamped actions the engine has taken (search queries, cookie hits, fingerprint rotations, URLs visited)."
  - src: /apps/fauxx/screens/05-settings.webp
    alt: "Settings — intensity (Low/Medium/High at 200 actions/hour), Wi-Fi-only toggle, battery pause threshold, active-hours window, destructive data-wipe."
order: 1
---

## The problem

Every search you make, every link you click, every location you visit is collected
by data brokers, ad networks, and analytics platforms. Over time, they build a
detailed profile of who you are, what you want, and what you're likely to do
next. That profile is sold, traded, and collated with other profiles — once
assembled, it is effectively impossible to delete.

Fauxx does not try to delete it. Fauxx buries it.

## How it works

Fauxx runs quietly in the background and generates continuous, plausible,
off-demographic synthetic activity — search queries, page visits, DNS lookups,
fingerprint rotation, ad-profile pollution, and optional GPS spoofing — across
seven independent modules. Your real behavioral signal is still present, but
drowned in statistical noise that data brokers cannot confidently separate from
truth.

The **Demographic Distancing Engine** targets the noise. Layer 0 gives you
uniform entropy across every content category. Layer 1 (optional self-report)
steers the noise *away* from your real interests. Layer 2 (opt-in) scrapes your
existing ad-platform profiles and aggressively fills the gaps those platforms
haven't yet assigned to you. Layer 3 rotates a weekly synthetic persona so
long-term pattern detection fails.

Timing is Poisson-distributed with circadian dampening; traffic looks like a
person, not a bot. Every URL is checked against a hardcoded blocklist, and a
per-domain rate limit (5s minimum, 200/hr ceiling) prevents abuse.

## Privacy

All demographic data, profile settings, and activity logs stay on-device in
an SQLCipher-encrypted database wrapped by an Android Keystore master key.
No telemetry, no analytics, no cloud sync, no account. The adversarial
platform scrapers are read-only. Sensitive attributes (race, religion,
orientation, gender identity, disability, political affiliation) are never
stored or used as steering inputs.

## Status

**Shipping.** Available as a full build via GitHub Releases and F-Droid.
A reduced Play Store build without location spoofing and ad-profile
pollution (excluded by Play's policies) is distributed separately.
