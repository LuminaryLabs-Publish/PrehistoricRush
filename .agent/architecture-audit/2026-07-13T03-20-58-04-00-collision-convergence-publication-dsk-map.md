# Architecture Audit: Collision Convergence Publication DSK Map

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The runtime has two collision evidence producers but no bounded authority that owns collider-set identity, source comparison and the terminal gameplay decision.

## Plan ledger

**Goal:** define the minimum DSK boundary that turns two source-specific observations into one revisioned collision result.

- [x] Identify source producers and consumers.
- [x] Preserve current physics-first behavior as an explicit policy candidate.
- [x] Define identity, evidence, comparison, decision and frame-proof services.
- [ ] Implement and validate later.

## Current domain split

```txt
streaming domain
  owns patch membership and collider descriptors

Core Physics/Rapier domain
  owns provider representation and contact frames

browser host fallback domain
  owns radial tree sampling and jump cutoff

gameplay resolution domain
  owns fail/pickup/goal precedence

presentation domain
  owns creature, camera, HUD and visible frame
```

The missing parent authority is:

```txt
prehistoric-rush-collision-source-convergence-authority-domain
```

## Required services

| Service | Responsibility |
|---|---|
| collider-set identity | ID, revision, predecessor, fingerprint and active generation |
| collider publication result | atomic commit and consumer application receipts |
| evaluation admission | session, run, tick, player candidate and source-policy validation |
| physics evidence | normalized provider contact result |
| fallback evidence | normalized radial-sampler result |
| source comparison | agreement, disagreement, absence and degradation classification |
| canonical decision | explicit source policy and exact-once gameplay outcome |
| journal | bounded immutable evidence and decision history |
| presentation receipt | first visible frame citing decision and collider revision |

## Candidate kits

```txt
collision-session-id-kit
collider-set-id-kit
collider-set-revision-kit
collider-set-fingerprint-kit
active-collider-commit-result-kit
collision-evaluation-command-kit
collision-source-policy-kit
physics-collision-evidence-kit
fallback-collision-evidence-kit
collision-candidate-normalization-kit
collision-source-comparison-kit
collision-disagreement-result-kit
stale-collider-evidence-rejection-kit
collision-decision-result-kit
collision-decision-journal-kit
collision-visible-frame-ack-kit
```

## Boundary rule

Streaming publishes collider state. Physics and fallback produce evidence. Gameplay consumes only the committed collision decision. Presentation proves the committed decision became visible. No source-specific representation should directly terminate the run.
