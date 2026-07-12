# Deploy Audit: Authoritative Start/Restart Fixture Gate

**Generated:** `2026-07-12T09-01-44-04-00`

## Current proof

```txt
pure outcome-policy Node test: present
browser start/retry fixture: absent
Rapier integration fixture: absent
stream/Worker epoch fixture: absent
first-frame receipt fixture: absent
Pages start/retry smoke: absent
```

## Required fixtures

```txt
initial start and retry parity
duplicate command idempotency
stale predecessor rejection
participant failure rollback
physics body reset under run epoch
stream/Worker stale-result rejection
active-content/collider epoch parity
camera/scene reset parity
first committed tick acknowledgement
first visible frame acknowledgement
public readback no mixed epoch
```

## Deployment rule

Do not claim authoritative restart or end-to-end outcome integration from the pure policy test alone. Local browser and deployed Pages evidence must prove one compatible run epoch across simulation, physics, streaming, content, camera, scene and visible frame.

## Validation status

```txt
runtime source changed: no
deployment configuration changed: no
fixtures implemented by audit: no
fixtures run: no
```
