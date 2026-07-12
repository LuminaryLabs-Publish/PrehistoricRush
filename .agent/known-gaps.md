# Known Gaps: PrehistoricRush Player Character Profile Convergence

**Updated:** `2026-07-12T18-18-59-04-00`

## Implemented profile pieces

```txt
versioned v1 profile shape
canonical defaults
field normalization and clamps
deep recursive patch merge
localStorage capability fallback for reads
full-profile load/save/patch/reset
numeric revision and updatedAt metadata
BroadcastChannel publication
browser storage-event subscription
menu profile card projection
creator draft, controls, preview and 160 ms save scheduling
game boot-time profile consumption
public profileId/revision readback
```

## Primary current gap

```txt
no writer session or profile command identity
no expected predecessor revision/fingerprint
no atomic revision allocation
no content fingerprint or durable commit ID
no conflict detection or field-path merge policy
no typed storage write/readback result
no same-revision divergence detection
no duplicate BroadcastChannel/storage-event suppression
no stale delivery rejection
no pending-save rebase after remote commit
no creator save lease or navigation flush
no reset epoch/barrier
no runtime profile binding receipt
no first visible profile-dependent frame acknowledgement
```

## Concrete consequences

```txt
two tabs can both write different revision R+1 snapshots
last full snapshot can silently erase another tab's fields
an older delivery can replace a newer menu or creator projection
the same commit can be applied twice through two browser adapters
a predecessor-derived timer can overwrite a remote commit as R+2
Play/Menu can leave while the visible edit exists only in a timeout
storage failure can occur after preview/UI mutation with no terminal result
game can use the predecessor profile after immediate creator navigation
revision-only public readback cannot distinguish conflicting same-revision content
```

## Policy ambiguity

The current implementation does not classify profile operations as:

```txt
committed durable
committed merged
volatile only
rejected stale
rejected conflict
rejected duplicate
failed write
failed readback
cancelled superseded
navigation flushed
navigation rejected
runtime bound
visible-frame acknowledged
```

## Delivery ambiguity

```txt
BroadcastChannel and storage events have no shared event identity
no ordering exists across writers and adapters
same revision/same content is not distinguished from duplicate delivery
same revision/different content is not treated as a fault
subscriber projection state has no revision/fingerprint owner
listener callbacks receive profile objects but no delivery result
```

## Creator lifecycle ambiguity

```txt
save timer has no lease ID
external admission does not cancel/rebase timer
Play/Menu links bypass pending-save policy
beforeunload disposes preview but not persistence scheduler
profile subscription disposer is not retained
Saved status is not derived from durable readback
reset is a normal save rather than an invalidating barrier
```

## Runtime-binding ambiguity

```txt
game loads profile before runtime imports and holds it for the session
this stability is useful but unnamed
no commit ID or fingerprint is bound into game composition
public host exposes profileId/revision only
creature body and first frame do not cite the profile commit
later profile events have no explicit deferred-to-next-run result
```

## Retained architecture gaps

```txt
coordinated run reset remains unimplemented
Core Physics/Motion authorization parity remains incomplete
articulated production solving and pose binding remain incomplete
streamed content/outcome parity remains incomplete
browser input authority remains incomplete
render-surface/frame correlation remains incomplete
ordered runtime disposal remains absent
```

## Required fixtures

```txt
same-predecessor conflict returns one typed rejection
same-predecessor disjoint edits merge deterministically
same revision with different fingerprint is detected
one commit delivered by two adapters mutates projection once
lower revision delivery performs zero mutation
remote commit rebases/cancels pending local save
reset invalidates predecessor save leases
immediate Play/Menu resolves save before navigation
storage write/readback failure never reports Saved
runtime binding cites accepted commit/fingerprint
first visible game frame cites runtime binding
browser and deployed Pages behavior match
```

## Proof warning

A rising revision number, updated creator preview or `Saved` label does not prove persistence or convergence. Completion requires expected-predecessor admission, terminal commit results, monotonic duplicate-safe delivery, navigation binding and first-visible-frame evidence.