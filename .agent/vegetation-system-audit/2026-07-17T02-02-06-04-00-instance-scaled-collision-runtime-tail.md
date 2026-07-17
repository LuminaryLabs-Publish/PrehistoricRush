# Instance-Scaled Collision Runtime Tail

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Runtime commit:** `25691598bd4ff5fd38bfdd25c46edb8a9e2cfece`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Reconciled change

The patch generator now computes the tree collider radius from the accepted instance-scaled visual trunk radius:

```txt
previous collider radius = archetype trunk radius × 1.3
current collider radius  = varied instance radius × 1.3
```

This preserves deterministic vegetation scale variation in collision projection and removes one immediate visual/collision mismatch from the reviewed runtime.

## Remaining boundary

The fix improves per-instance collision convergence but does not create a composite semantic generation. The collider, species, package, cache, Worker patch, and frame still need one admitted generation and matching receipts.

## Validation

The one-line runtime diff was inspected. No collision fixture, replay fixture, browser run, build smoke, or Pages smoke was executed by this documentation pass.
