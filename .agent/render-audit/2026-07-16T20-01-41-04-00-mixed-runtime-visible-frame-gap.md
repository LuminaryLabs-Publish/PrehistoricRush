# Render Audit: Mixed Runtime Visible-Frame Gap

**Timestamp:** `2026-07-16T20-01-41-04-00`

## Goal

Require every visible creator and gameplay frame to identify one accepted runtime generation shared by the host, kit descriptors, object primitives, providers and renderer.

## Current frame path

```txt
route import map
  -> official kit module linkage
shared dynamic runtime URL
  -> host engine creation
kit factories
  -> descriptors and APIs
host adapters
  -> Three.js resources and render submission
visible frame
```

## Gap

The creator and game import maps point the bare `nexusengine` specifier at different older commits, while both hosts dynamically import `80146b8…`. A frame can therefore contain data produced by multiple Nexus Engine namespaces without reporting that split.

## Missing render proof

```txt
accepted RuntimeModuleGeneration: absent
engine namespace digest: absent
kit namespace digest: absent
descriptor provenance digest: absent
provider provenance digest: absent
frame runtime digest: absent
FirstSingleRuntimeCreatorFrameAck: absent
FirstSingleRuntimeGameFrameAck: absent
```

## Required frame contract

```txt
RuntimeModuleAdmissionResult
  -> exact creator/game route generation
  -> exact kit and provider namespaces
  -> render snapshot binds the generation digest
  -> renderer presents the matching snapshot
  -> matching first-frame acknowledgement
```

## Risk boundary

No visible corruption was reproduced. The source establishes an unproven frame provenance boundary, not a confirmed current rendering defect.