# Visual Policy Audit: Module Graph, Creature, Shadow and Grass Contract

**Timestamp:** `2026-07-11T08-48-04-04-00`

## Summary

The latest runtime update is a coordinated visual-policy revision spread across an upstream source pin and local host literals. The product needs a canonical descriptor and fingerprint rather than relying on commit coordinates plus a human-authored renderer label.

## Plan ledger

**Goal:** specify the complete semantic payload that determines current creature, grass and shadow output.

- [x] Record source graph.
- [x] Record creature topology change.
- [x] Record grass policy.
- [x] Record shadow policy.
- [x] Record current observation.
- [x] Define canonical policy and fingerprint inputs.

## Module graph contract

```txt
NexusEngine
NexusEngine-Kits
NexusEngine-ProtoKits
Three
Rapier
product runtime source
product domain version
patch generator version
```

Each row needs:

```txt
id
version or commit
source URL identity
integrity when available
environment
admission status
```

## Creature contract

```txt
descriptor schema
generator version
source identity
recipe hash
positions hash
normals hash
colors hash
indices hash
skin hash
skeleton hash
attachments hash
collision hash
bounds hash
material hash
full descriptor hash
connected-component count
front-face/winding/space declarations
```

## Grass contract

```txt
plane segment layout
card count per cluster
X scale 0.62
translation and rotations
shader language/version
vertex shader hash
fragment shader hash
alphaTest 0.34
alpha silhouette constants
vertical shade constants
palette
wind defaults
material side/depth/transparency policy
instance capacity and active revision
```

## Shadow contract

```txt
enabled
map type PCFSoftShadowMap
map size 2048
camera left/right/top/bottom
camera near/far
bias
normalBias
light intensity/color
caster table
receiver table
per-frame light-follow rule
```

## Aggregate fingerprint

```txt
visualPolicyFingerprint = hash(
  moduleGraphFingerprint,
  creaturePolicyHash,
  grassPolicyHash,
  shadowPolicyHash,
  cameraPolicyHash,
  renderPipelinePolicyHash
)
```

The renderer label may remain a human-readable alias, but it must not be used as the authoritative identity.

## Current observation gap

```txt
host:
  player body id
  incomplete contentHash
  topology counts
  renderer label

missing:
  exact module graph
  exact geometry hash
  grass policy
  shadow policy
  binding revision
  frame receipt
```

## Policy revision rule

Any semantic change to source pins, exact creature payload, grass geometry/shader/palette, shadow settings/caster flags, camera policy or pipeline settings must change the aggregate fingerprint.

## Fixture matrix

```txt
same semantic policy -> same fingerprint
key-order or container change -> same fingerprint
source pin change -> different fingerprint
neck station/index/normal change -> different fingerprint
grass card width change -> different fingerprint
fragment shader change -> different fingerprint
palette change -> different fingerprint
shadow type/bounds/bias change -> different fingerprint
caster flag change -> different fingerprint
manual label-only change -> fingerprint unchanged
```