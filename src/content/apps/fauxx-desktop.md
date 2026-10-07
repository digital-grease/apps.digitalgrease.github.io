---
name: Fauxx Desktop
tagline: The desktop companion to Fauxx, running the same decoy personas as your phone.
status: alpha
platforms: [linux, macos, windows]
license: AGPL-3.0
repo: https://github.com/digital-grease/fauxx-desktop
accent: "#00cc66"
downloads:
  github: https://github.com/digital-grease/fauxx-desktop/releases
order: 5
---

## The problem

A phone is only part of the picture data brokers build. If the decoys stop at
your phone, your desktop browsing still tells the real story. Fauxx Desktop
brings [Fauxx](/fauxx)'s decoy personas to the desktop, sharing the same persona
model so a household can present one coherent, deliberately misleading picture
across phone and desktop.

## How it works

- **Synthetic personas.** Coherent, plausible decoy identities drawn from real
  US Census microdata, kept in lockstep with the Android app.
- **A real browser.** Decoy activity runs in a dedicated, isolated Chromium
  profile, so it is real browsing rather than synthesized requests, and it never
  touches your own browser profile.
- **Cross-device.** Pairs with the phone over your local network through a
  sealed channel, so devices can run the same persona and rotate together.
- **Measurement.** Drift and treated-versus-control measures, with exportable
  snapshots, so you can see whether the noise is working.
- **Network routing.** Each persona can be sent through its own proxy, Tor or
  VPN, with its own DNS settings. These apply only to the decoy browser, and if
  a route is unreachable the persona pauses instead of falling back to your real
  connection.
- **Homelab mode.** A headless CLI with a 24/7 `serve` mode and an optional
  Home Assistant bridge.

## Privacy

It only ever runs decoys. It never signs in anywhere, and a blocklist refuses
sign-in pages outright. There's no telemetry and no account. Personas and
secrets are kept in an encrypted store whose key is held by your operating
system's keystore. The only request it makes about the app itself is the update
check, and only when you ask for one.

## Status

**Early.** Tagged releases are available for Linux (including an AppImage),
macOS and Windows. Each comes with a checksum and signed build provenance.
Interfaces and on-disk formats can still change.
