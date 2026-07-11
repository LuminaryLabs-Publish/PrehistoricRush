# Gameplay Audit: Focus, Ready and Active World Loop

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

Gameplay readiness currently follows controller delivery rather than a committed world revision. Movement, collision, pickups and height sampling can continue while desired patches are generating or while a newly controller-active patch is only partially consumed.

## Current loop

```txt
run state advances
  -> controller focus changes
  -> desired active set changes
  -> old controller-active IDs move to released
  -> host retires consumers
  -> generation and Worker work continue
  -> ready record is marked controller-active
  -> host mutates world consumers
  -> physics step and manual collision checks run
  -> pickup tests run
  -> render continues
```

## Gameplay authority gaps

```txt
controller-active does not prove collision-ready
controller-active does not prove pickup-ready
controller-active does not prove height-ready
desired but inactive patches have fallback height and no patch hazards
manual collision and Rapier contacts are separate unclassified sources
pickup IDs are trusted without patch admission result
collision and pickup outcomes carry no activation revision
run movement is not fenced by forward safety-ring readiness
```

## Concrete risk

A patch can be marked active, then fail during terrain, tree or dynamic-content mutation. The run still proceeds into physics and pickup evaluation using whatever subset of the consumer mutation completed. The host has no typed state that means `ready for gameplay`.

## Required gameplay states

```txt
missing
generating
content-ready
admission-rejected
consumer-prepared
committed
render-acknowledged
physics-acknowledged
gameplay-ready
releasing
released
faulted
```

## Required readiness policy

```txt
player patch: gameplay-ready required
immediate forward patch: height and collision ready required
remaining active ring: committed required
prefetch ring: content-ready is sufficient
```

The exact safety radius can remain product-configured, but the policy must produce a result instead of silently mixing fallback and committed world state.

## Required outcome correlation

Every collision and pickup result should include:

```txt
runSessionId
streamEpoch
patchId
activationId
consumerRevision
physicsRevision
frameId
source: rapier | manual | pickup-query
```

## Fixture requirements

- Delay patch consumer commit while the player approaches a boundary.
- Reject one patch payload and prove the player cannot enter an unclassified hazard state.
- Inject a partial consumer failure and prove no collision or pickup query uses that candidate revision.
- Prove manual and Rapier collision outcomes are classified and deduplicated.
- Prove height, collision, pickup and render consumers share the same committed patch digest.

No gameplay source changed during this audit.