---
name: Signet
tagline: Cryptographic multi-factor authentication for human relationships.
status: alpha
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/signet
privacy: https://github.com/digital-grease/signet/blob/main/PRIVACY.md
accent: "#00cccc"
downloads:
  github: https://github.com/digital-grease/signet/releases
screenshots:
  - src: /apps/signet/screens/01-home-paired-list.webp
    alt: "Home screen with the paired-contacts list."
  - src: /apps/signet/screens/02-verify-show-my-words.webp
    alt: "Verify screen showing the user's own current 4 BIP-39 words, so they can read them aloud to a caller."
  - src: /apps/signet/screens/03-verify-not-verified.webp
    alt: "Verify screen with a red rejection banner after an incorrect 4-word code."
  - src: /apps/signet/screens/04-pair-modes-sheet.webp
    alt: "Pair modes bottom sheet — in-person QR, long-distance transport package, and rekey options."
  - src: /apps/signet/screens/05-pair-qr-display.webp
    alt: "Pairing QR code display for in-person two-phone exchange."
  - src: /apps/signet/screens/06-transport-package-share.webp
    alt: "Transport package share sheet — encrypted long-distance pairing or lost-phone recovery payload."
  - src: /apps/signet/screens/07-peer-actions-menu.webp
    alt: "Per-peer actions menu — label, inspect, rekey, unpair."
  - src: /apps/signet/screens/08-liveness-challenge.webp
    alt: "Liveness challenge — a randomly generated physical prompt for video-call verification."
order: 4
---

## The problem

When someone who sounds like your mother calls in a panic asking for bail
money, Signet lets you verify it's actually her. The threat is voice and
video deepfakes targeting families for financial fraud; vishing attacks that
use scraped biographical data to impersonate people you know. Voice cloning
is now real-time and cheap. The old defenses — recognizing a voice,
remembering a shared anecdote — have a shelf life measured in quarters.

## How it works

Two phones pair **in person** by exchanging QR codes containing ephemeral
X25519 public keys; each device derives the same shared secret via
Diffie–Hellman and both display an identical 4-word confirmation phrase
derived from that secret. Once confirmed, the secret lives in the Android
Keystore (StrongBox when available) and is used to generate a rotating
**4 BIP-39 words every 30 seconds** via HKDF-SHA-256.

To verify a caller later: ask them to read their 4 current words aloud,
type what you hear into the 4-slot input. Green banner verified;
red banner rejected. Clock drift is tolerated by a ±1 window on verify.

**The two sides see different words each window.** A naïve design would
let an attacker reflect *"grandma, read me your words so I know it's you"*
and pass the verify. Signet binds each rotating code to a pair-time-derived
role — so reflecting the verifier's own displayed words back fails by
construction.

Words instead of digits because BIP-39 survives a stressed voice channel
("74" vs "47" under a bad connection is exactly how grandma gets scammed).
Four BIP-39 words ≈ 44 bits of entropy vs ~27 for eight digits, and the
words are phonetically distinct by design.

## Properties

- **No server, no cloud, no account.** The manifest has no `INTERNET`
  permission. There is no backend to subpoena, compromise, or shut down.
- **No telemetry, no analytics, no ads.** This is a trust product. Not
  now, not ever.
- **Hardware-backed secrets.** AES-GCM inside Android Keystore, StrongBox
  on supporting hardware.
- **Offline by construction.** Airplane mode does not affect any flow.
- **RFC-validated crypto.** X25519 against RFC 7748 §6.1; HKDF-SHA-256 via
  the audited `cryptography` Dart package. BIP-39 embedded in-tree. All
  reference vectors pass.

## Status

**v0.1 alpha, Android only.** Built on Flutter for future cross-platform
support; iOS is generated but not tested in this release. v0.2 work
(multi-peer, long-distance pairing, lost-phone recovery, challenge-response
grid, liveness prompts) is landed in the codebase but not yet
store-packaged.
