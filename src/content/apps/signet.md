---
name: Signet
tagline: Cryptographic multi-factor authentication for human relationships.
status: beta
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/signet
privacy: https://github.com/digital-grease/signet/blob/main/PRIVACY.md
accent: "#00cccc"
downloads:
  github: https://github.com/digital-grease/signet/releases
  fdroid: https://f-droid.org/packages/dev.digitalgrease.signet/
screenshots:
  - src: /apps/signet/screens/01-home-paired-list.webp
    alt: "Home screen with the paired-contacts list."
  - src: /apps/signet/screens/02-verify-show-my-words.webp
    alt: "Verify screen showing the user's own current 4 BIP-39 words, so they can read them aloud to a caller."
  - src: /apps/signet/screens/03-verify-not-verified.webp
    alt: "Verify screen with a red rejection banner after an incorrect 4-word code."
  - src: /apps/signet/screens/04-pair-modes-sheet.webp
    alt: "Pair modes sheet with in-person QR, long-distance transport package, and rekey options."
  - src: /apps/signet/screens/05-pair-qr-display.webp
    alt: "Pairing QR code display for in-person two-phone exchange."
  - src: /apps/signet/screens/06-transport-package-share.webp
    alt: "Transport package share sheet for an encrypted long-distance pairing or lost-phone recovery payload."
  - src: /apps/signet/screens/07-peer-actions-menu.webp
    alt: "Per-contact actions menu: label, inspect, rekey, unpair."
  - src: /apps/signet/screens/08-liveness-challenge.webp
    alt: "Liveness challenge showing a randomly generated physical prompt for video-call verification."
order: 2
---

## The problem

When someone who sounds like your mother calls in a panic asking for bail
money, Signet lets you check that it's really her. Voice and video deepfakes are
now used against families for financial fraud, and vishing calls use scraped
personal details to impersonate people you know. Voice cloning is cheap and
works in real time, so recognizing a voice or remembering a shared story won't
protect you for long.

## How it works

Two phones pair **in person** by scanning each other's QR codes, which carry
ephemeral X25519 public keys. Each phone derives the same shared secret through
Diffie-Hellman, and both show the same 4-word confirmation phrase derived from
it. Once you confirm, the secret is stored in the Android Keystore (StrongBox
where available) and used to generate **4 BIP-39 words every 30 seconds** with
HKDF-SHA-256.

To check a caller later, ask them to read out their 4 current words and type
what you hear into the 4 slots. A green banner means verified and a red one
means rejected. Verification accepts the windows either side of the current one,
to allow for clock drift.

**Each side sees different words.** With a simpler design, an attacker could
ask "read me your words so I know it's you" and repeat them back to pass the
check. Signet ties each side's words to a role fixed at pairing time, so words
read back to their owner always fail.

Signet uses words rather than digits because BIP-39 words hold up on a bad line
with a stressed voice, where "74" and "47" are easy to confuse. Four BIP-39 words
carry about 44 bits of entropy against about 27 for eight digits, and the word
list is designed so the words sound distinct.

## Properties

- **No server or account.** The app doesn't request the `INTERNET` permission,
  so there's no backend that could be subpoenaed or shut down.
- **No telemetry, analytics or ads,** now or later.
- **Hardware-backed secrets.** AES-GCM inside the Android Keystore, using
  StrongBox on hardware that has it.
- **Works offline.** Airplane mode doesn't affect anything.
- **Tested crypto.** X25519 is checked against RFC 7748 §6.1, and HKDF-SHA-256
  comes from the audited `cryptography` Dart package. BIP-39 is built in, and all
  reference vectors pass.

## Status

**Beta, Android only.** Available from GitHub Releases and F-Droid. It's built
with Flutter so other platforms can follow; an iOS build exists but hasn't been
tested in this release. The v0.2 features (multiple contacts, long-distance
pairing, lost-phone recovery, a challenge-response grid and liveness prompts)
are in the codebase but not yet in a published release.
