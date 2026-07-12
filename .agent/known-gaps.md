# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T22-29-24-04-00`

## Summary

The current leading observation gap is the public browser host. It exposes live mutable subsystem owners and independently samples them for `getState()`. Existing creator, streaming, collision, cadence, readiness, frame, reset and lifecycle gaps remain open.

## Plan ledger

**Goal:** make public diagnostics immutable and coherent, and require every public mutation to pass through typed capability and epoch admission.

- [x] Preserve creator and runtime gap history.
- [x] Add raw-owner exposure and independently sampled read-model gaps.
- [x] Add host command, epoch and fixture requirements.
- [ ] Close gaps through existing subsystem owners in dependency order.

## Public host capability gaps

```txt
live Nexus Engine instance exposed
live physics API exposed
live Three adapter exposed
live patch controller exposed
live camera-follow service exposed
scene, renderer, camera and Object3D references reachable
active patch and collider mutations reachable
no capability descriptor
no command envelope or command ID
no expected run/epoch admission
no duplicate or stale-command result
no raw-owner quarantine
```

## Public read-model gaps

```txt
getState independently samples mutable owners
no committedFrameId
no runtimeSessionId or hostGeneration
no shared run/stream/Worker/collider/frame epoch set
no profile or world-content fingerprint correlation
no render/HUD commit results
no immutable deep-detached read model
no bounded command/read journal
```

## Consequences

```txt
same-page scripts can tick the engine outside RAF
streaming can mutate outside activation authority
colliders and physics can mutate outside patch/frame admission
camera and renderer can mutate outside frame ownership
public diagnostics can combine values from different moments
browser validation can create states the product loop never admits
stale automation can mutate a replacement run
```

## Retained gaps

```txt
creator draft dirty-field and durable commit authority
preview descriptor convergence and projection-correct framing
profile/game fingerprint parity
patch activation/release acknowledgement
exact collider retirement and contact provenance
30/60/120 Hz stream cadence and hidden-tab policy
world readiness before movement
committed gameplay-frame receipts
coordinated run/stream/Worker/collider/frame epochs
startup rollback and ordered disposal
```

## Missing proof matrix

```txt
public owner isolation fixture
prototype and returned-value traversal fixture
unsupported-command zero-mutation fixture
stale-run and stale-epoch command fixtures
duplicate command fixture
committed read-model coherence fixture
deep clone and immutability fixture
browser public-host smoke
Pages public-host smoke
```

## Priority

```txt
1. route/profile handoff proof
2. creator draft/commit/preview authority
3. patch activation/release
4. collider replacement/collision admission
5. cadence and readiness
6. committed gameplay frame
6a. public host gateway and committed read model
7. coordinated reset epochs
8. lifecycle and disposal
```

## Do not do next

```txt
do not work on TheCavalryOfRome
do not create a branch
do not expose a second diagnostics object with the same raw owners
do not wrap raw owners in shallow proxies and call them safe
do not let host commands bypass existing domain owners
do not build a read model by independently sampling mutable owners
do not treat a command result as a committed visible frame
```