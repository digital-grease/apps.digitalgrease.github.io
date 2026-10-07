---
name: Tangible
tagline: Self-hosted preservation and burning for the discs you own.
status: pre-release
platforms: [linux]
license: AGPL-3.0
accent: "#c9a227"
icon: /apps/tangible/icon.svg
order: 3
---

## The problem

Publishers keep moving toward digital-only releases, where buying something
gets you a license that can be revoked, and a title that's delisted is simply
gone. Discs don't work that way. Tangible keeps the discs you already own
readable and verifiable, and lets you make faithful copies, on hardware you
control.

Most media managers are built around playable files like episodes, songs and
ROMs. Disc images need more than that. A disc can hold several tracks and
sessions, pregaps and subchannel data that an ISO can't represent, and a burn
that finished without an error isn't necessarily a good copy.

## How it works

Tangible treats the disc image as the thing to preserve.

- **Library.** Images come in by upload or from folders an administrator sets up
  to watch. ISO 9660, UDF, CUE/BIN and cdrdao TOC/BIN images are recognized by
  their structure rather than their file names. Each file is stored once,
  identified by its SHA-256 hash and never modified, alongside a manifest from
  which the whole catalog can be rebuilt.
- **Burning.** Each optical drive gets its own burn worker in its own container,
  with access to that drive and nothing else. xorriso writes ISO images to CD,
  DVD and Blu-ray, and cdrdao handles CDs with audio tracks, mixed-mode layouts
  and pregaps. Every burn is written from a local copy whose hash is checked
  first, then the disc is read back, and the record says how it was verified.
- **Derivatives.** CHD files are made with chdman and kept only if they extract
  back to an exact match of the original, track by track. Games you choose can
  be exported into RomM's library folder.
- **Running it.** There's a web interface and a documented REST API, three user
  roles, and an audit log of who did what.

## Principles

Originals are never changed; conversions are stored as new files that record
where they came from. Imported images are treated as untrusted and are never
mounted on the host. Only the burn workers can reach a drive, and no container
runs privileged. You install it from a tagged release and a Compose file you can
read first, never by piping a script into a shell.

Tangible is meant for content you have the right to keep and copy. It doesn't
include release indexers, decryption keys, or anything for getting around copy
protection.

## Status

**Pre-release.** Everything described here works and is tested, including on a
real optical drive. The first tagged release, 0.1.0, is being prepared. It runs
on Linux with Docker Compose.
