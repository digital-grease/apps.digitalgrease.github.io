---
name: Effigy
tagline: Self-OSINT — see what's public about you, then remediate.
status: pre-release
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/effigy
privacy: https://github.com/digital-grease/effigy/blob/main/PRIVACY.md
accent: "#ffb000"
downloads:
  github: https://github.com/digital-grease/effigy/releases
order: 3
---

## The problem

Before you can reduce your public exposure, you have to see it. Most data-removal
services charge monthly, run opaque scrapers, and demand you hand over every
identifier you want scrubbed — the exact threat model they claim to fix.
Effigy takes the opposite approach: it runs open-source intelligence against
*your own identity* on-device, tells you what's out there, and hands you the
remediation links. You do the work; nothing leaves your phone that you did
not explicitly request.

## How it works

You add identifiers (email, phone, username, name+address) and prove ownership
of the verifiable ones. Email is verified by SMTP round-trip using your own
credentials — the verification token never appears in the app before the
email is sent, so typing it back requires actual inbox access. Phone (full
build only) uses the device's own `SmsManager` to send a code directly to
the claimed number.

The scanner then queries a narrow, deliberate set of sources:

- **XposedOrNot** and **Hudson Rock Cavalier** for credential-free breach
  detection across public breach corpora and the infostealer corpus. Run
  by default, zero configuration.
- **Have I Been Pwned** for richer per-breach metadata if you supply your
  own API key. Otherwise skipped silently.
- **Username enumeration** across 15 hand-picked public platforms (GitHub,
  Reddit, Mastodon, Keybase, Lichess, Codeforces, and more) via
  Sherlock-style signatures.
- **Dork search** against DuckDuckGo with 14 curated dork queries per scan
  (no Google API, no keys).
- **People-search aggregators** (Spokeo, Whitepages, Radaris) surface
  opt-out URLs — labeled `ASSUMED` to distinguish them from confirmed
  detections, since their anti-bot gates defeat meaningful scraping.

For each finding, tap through to a remediation action — opening the opt-out
page, composing a removal email, or acknowledging breaches that cannot be
withdrawn. The app tracks state transitions (discovered → submitted →
confirmed → verified-removed → relisted → re-submitted).

## What Effigy will not do

- **No "look up someone else" mode.** No flag, no setting, no env var. Ever.
- **No cloud sync.** Findings never leave your device except as queries you
  explicitly trigger.
- **No HTML scraping of people-search aggregators.** That path is a
  weekly-maintenance trap against sites that barely give signal.

## Privacy

On-device SQLCipher database, hardware-backed Android Keystore key wrap,
no telemetry, no analytics, no Google services beyond Play distribution
itself.

## Status

**v0.1 pre-release.** Functional end-to-end. Two flavors share a codebase
and signing key: `play` (manual remediation only) and `full` (device-based
SMS verification; roadmapped for automated opt-out resubmission in v0.2).
