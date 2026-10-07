---
name: Obscura
tagline: Plausible biographical noise that blurs what LLMs can say about you.
status: pre-release
platforms: [android]
license: AGPL-3.0
accent: "#a89cc8"
icon: /apps/obscura/icon.svg
order: 6
---

## The problem

Ask a commercial LLM or an AI search product (Bing, Google AI Overviews,
Perplexity, or the RAG-based people-search tools coming next) to tell you about
a person, and it will answer confidently from whatever it can retrieve on the
public web. For journalists, activists, dissidents and domestic-violence
survivors, the safest answer to that question is a thin and inconsistent one.

Deletion doesn't get you there. By the time anything is deleted, search engines
and model training have usually picked it up already.

## How it works

Obscura's approach is fog rather than deletion. The real details stay online but
faint, surrounded by plausible, internally consistent variants spread across
enough public sites that retrieval systems pick them up as authoritative. Ask an
LLM about someone fogged this way and you get a confident answer that is
consistent with itself and wrong.

The v0.1 foundation is in place: encrypted storage (Room and SQLCipher) behind a
biometrically unlocked key, a lock screen at launch, Play and F-Droid builds,
and CI for both. Still to come are the record dashboard, the ethics filter,
on-device and cloud generators, publishing to GitHub READMEs and Pages, and a
check that confirms the generated content is actually being picked up.

## Limits built into the code

Generated content will never claim a job or a degree at a real organization,
claim a relationship with a real person, put words or actions in a real
person's mouth, or link the user to crimes, sexual misconduct, medical
conditions or extremist groups. Everything it writes is about the user, never
written as someone else, and it only works on identifiers the user has proved
they own. The aim is details plausible enough to be boring, and when a case is
unclear the code refuses.

## Privacy

Obscura is licensed under the AGPL-3.0 on purpose, so nobody can turn it into a
hosted service that collects everyone's real records in one place, which would
be the worst possible outcome for a tool like this. There's no cloud sync,
telemetry or account, and secrets are kept in hardware-backed storage.

## Status

**v0.1 in progress** and not yet feature-complete.
