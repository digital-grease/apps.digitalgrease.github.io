---
name: Obscura
tagline: Fog, not deletion — plausible bio-noise for the LLM era.
status: pre-release
platforms: [android]
license: AGPL-3.0
repo: https://github.com/digital-grease/obscura
accent: "#a89cc8"
downloads:
  github: https://github.com/digital-grease/obscura/releases
order: 2
---

## The problem

Commercial LLMs and AI-powered search products — Bing, Google AI Overviews,
Perplexity, and the next generation of RAG-based people-search tools — will
confidently answer *"tell me what you know about $NAME"* using whatever is
retrievable on the public web. Journalists, activists, dissidents, and
domestic-violence survivors increasingly need the answer to that question to
be *"not much, and not consistently."*

Classic deletion-based privacy tools fight the wrong battle. The internet does
not forget. The retrievers do not forget. By the time anything is "deleted"
it has already been scraped, indexed, and trained on.

## How it works

Obscura operates on a different metaphor: **fog, not deletion.** The real
signal stays present but faint; around it sits a cloud of plausible-but-false
biographical variants — internally consistent, distributed across enough
public surfaces that retrievers absorb them as authoritative. Ask an LLM
about a fogged subject and it produces consistent-but-false output.

The v0.1 foundation is in place: encrypted Room + SQLCipher storage with a
biometrically-unlocked master key, Compose lock screen at boot, Play and
F-Droid flavors, CI for both. Subsequent work lands the canonical-record
dashboard, ethical-constraint filter, on-device + cloud generators, GitHub
README and Pages publishers, and the verification loop that confirms
generated content is actually being retrieved.

## The ethical floor

Generated content is codebase-enforced to never: claim employment or
education at any real organization, claim relationships with real people,
attribute actions or quotes to real people, or attribute criminal activity,
sexual misconduct, medical conditions, or extremist affiliations to the user.
The tool generates content *about* the user, not *as* other people, and only
operates on identifiers the user has verified ownership of. Plausible-boring
is the target. The codebase fails closed on ambiguous cases.

## Privacy

Obscura is AGPL-3.0 deliberately — to prevent SaaS centralization of canonical
records, which would be the worst possible privacy failure for a tool of this
kind. No cloud sync. No telemetry. No account. Hardware-backed secrets.

## Status

**v0.1 in progress.** Not yet at feature-complete. Follow the repo for
releases.
