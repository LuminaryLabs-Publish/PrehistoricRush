# Deploy Audit: Articulated Pose Fixture Gate

**Timestamp:** `2026-07-12T22-18-39-04-00`

## Summary

Current tests prove articulation adapter conversion, not end-to-end gameplay pose presentation. Deployment should not claim articulated player motion until source, built output, and Pages all prove the same pose commit reaches the visible skeleton.

## Plan ledger

**Goal:** define the executable gate for shipping articulated pose presentation.

- [x] Identify current unit proof boundary.
- [x] Define source-level fixtures.
- [x] Define browser and Pages frame proof.
- [x] Define failure and fallback fixtures.
- [ ] Implement and run later.

## Required unit fixtures

```txt
motion-frame binding
rig/profile/body identity admission
base-pose adaptation
articulated target-set construction
solver success
solver failure with typed fallback
solver failure without fallback
bone coverage and non-finite rejection
pose fingerprint stability
stale and duplicate rejection
```

## Required browser fixtures

```txt
running gait consumes articulated pose commit
jump pose consumes correct run/tick
turning pose binds Core Motion facing
hind-leg solve changes rendered bones
missing-bone result is visible in diagnostics
run restart rejects predecessor pose
public host reports the pose shown
first visible pose frame cites the commit
```

## Required deployment matrix

```txt
source modules
local built output
GitHub Pages output
WebGL renderer on supported desktop browser
fallback browser path if articulation solve is unavailable
```

## Release gate

Do not mark articulated presentation implemented until:

- The active game renderer consumes a committed pose result.
- The result cites run, tick, body, profile, rig, motion, and policy identities.
- Rejected or stale poses cause zero skeleton mutation.
- Fallback is typed and observable.
- Browser and Pages report the same pose fingerprint and first-frame acknowledgement.

## Validation boundary

No test, package, workflow, build, Pages, or runtime file changed. No fixture was executed.