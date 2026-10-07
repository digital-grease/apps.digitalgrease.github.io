---
name: Squib
tagline: An offline-first shot timer and training journal for the range.
status: pre-release
platforms: [android]
license: AGPL-3.0
accent: "#e05a47"
icon: /apps/squib/icon.svg
order: 4
---

## The problem

Useful practice needs a timer and a record of what you did, and the conditions
on the day matter too. Usually that means buying a dedicated hardware timer and
checking a weather app that doesn't say where its numbers come from. Squib is
meant to be useful with nothing but a phone, and to make use of better
equipment as you add it.

## How it works

The home screen has four sections: Timer, Practice, Conditions and History.
There's no setup wizard and no account to create.

- **Timer.** A par timer that works without the microphone or location
  permission. Live shot detection is also available, and before each run it
  checks whether this phone and audio setup can be relied on.
- **Journal.** Runs are saved with their drill, score and notes. You can correct
  a result while the original record is kept, and comparisons show how many runs
  they're based on, so a few mixed sessions can't suggest a trend that isn't
  there.
- **Conditions.** Pressure, temperature, humidity and elevation come from the
  phone, nearby weather stations or public weather data. Each value shows where
  it came from and how old it is, and you can override any of them.
- **Your data.** Export a full archive or a CSV. A coach can keep separate local
  profiles for several shooters on one phone, and nothing is uploaded
  automatically.

## Privacy

The core features work without a network connection, an account or location
access. Raw audio isn't kept by default, and location and photos are stripped
when you share a run.

## Status

**In design.** Android comes first, built on a shared Rust core. It isn't
available yet.
