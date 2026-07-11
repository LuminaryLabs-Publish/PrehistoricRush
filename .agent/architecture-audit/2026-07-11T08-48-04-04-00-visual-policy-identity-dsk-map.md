# Architecture Audit: Visual Policy Identity DSK Map

**Timestamp:** `2026-07-11T08-48-04-04-00`

## Summary

The source graph, procedural creature topology and local grass/shadow settings jointly determine visible output, but they are owned by unrelated constants and constructors. A visual-policy identity domain should compose these inputs without absorbing renderer implementation or duplicating the shared creature generator.

## Plan ledger

**Goal:** define the smallest DSK boundary that turns fragmented visible-state inputs into one admitted, versioned and observable policy.

- [x] Map current owners.
- [x] Separate reusable generator identity from product render policy.
- [x] Define candidate kits and services.
- [x] Define admission, binding and frame boundaries.
- [x] Preserve patch activation as the prerequisite world-content transaction.

## Current ownership

```txt
src/game.js constants
  -> module pins

procedural-creature-body-kit
  -> recipe, geometry, topology, skeleton, skinning, collision and pose

createCreatureMesh()
  -> Three geometry, material, skeleton and mesh

grassGeometry() / grassMaterial()
  -> card geometry, alpha shader and color policy

createThreeAdapter()
  -> shadow map, directional light and object caster flags

render()
  -> pose, camera, grass time, light position and frame submission

PrehistoricRushHost
  -> mutable owners plus incomplete aggregate labels
```

## Proposed parent domain

```txt
prehistoric-rush-visual-policy-domain
```

Responsibilities:

```txt
admit module graph
compose immutable visual policy
validate exact creature identity
validate grass and shadow policy
issue policy revision and fingerprint
coordinate consumer binding results
correlate committed render frames
publish bounded detached observations
```

## Candidate kits

```txt
runtime-module-graph-manifest-kit
visual-policy-schema-kit
creature-topology-policy-kit
creature-geometry-identity-kit
grass-card-geometry-policy-kit
grass-alpha-shader-policy-kit
grass-palette-policy-kit
shadow-map-policy-kit
shadow-camera-policy-kit
shadow-caster-policy-kit
render-policy-fingerprint-kit
render-policy-admission-kit
render-binding-result-kit
render-frame-policy-correlation-kit
visual-policy-observation-kit
visual-policy-fixture-kit
```

## Service contracts

```txt
createModuleGraphManifest(input) -> immutable manifest
fingerprintModuleGraph(manifest) -> canonical hash
createVisualPolicy(input) -> immutable descriptor
validateVisualPolicy(policy) -> typed result
fingerprintVisualPolicy(policy) -> canonical hash
prepareVisualBindings(policy) -> prepared binding plan
commitVisualBindings(plan) -> binding result
rollbackVisualBindings(plan) -> rollback result
acknowledgeRenderFrame(input) -> frame receipt
getVisualPolicyObservation() -> detached bounded snapshot
```

## Required identities

```txt
runSessionId
runEpoch
streamEpoch
resourceEpoch
moduleGraphSchemaVersion
moduleGraphFingerprint
visualPolicySchemaVersion
visualPolicyRevision
visualPolicyFingerprint
creatureDescriptorHash
creatureGeometryHash
grassPolicyHash
shadowPolicyHash
bindingRevision
poseRevision
cameraRevision
patchConsumerRevision
frameId
```

## Admission order

```txt
validate session and epochs
  -> validate module graph
  -> validate creature descriptor/geometry
  -> validate grass and shadow descriptors
  -> compute aggregate policy fingerprint
  -> prepare Three/Rapier consumers
  -> commit bindings
  -> assign visualPolicyRevision
  -> admit frames
```

## Ownership rule

The shared `procedural-creature-body-kit` remains generator authority. Product-side kits own Three/Rapier binding and product visual policy. Reusable graph/fingerprint primitives should move to NexusEngine or NexusEngine-Kits only when their semantics are stable across products.

## Relationship to P0

The visual-policy domain consumes `patchConsumerRevision`; it does not replace patch activation. No frame may claim full world readiness until patch consumers have one acknowledged revision.

## Acceptance

```txt
any source pin change changes moduleGraphFingerprint
any creature payload change changes creatureGeometryHash
any grass policy change changes grassPolicyHash
any shadow policy change changes shadowPolicyHash
aggregate visualPolicyFingerprint is deterministic
binding result retains exact accepted hashes
frame receipt references accepted binding and world-content revisions
```