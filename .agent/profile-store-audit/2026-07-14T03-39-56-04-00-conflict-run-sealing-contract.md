# Profile Store Conflict and Run-Sealing Contract

**Timestamp:** `2026-07-14T03-39-56-04-00`

## Summary

A numeric revision alone is insufficient for concurrent browser documents. The profile store needs immutable artifacts, compare-and-set writes, monotonic message admission and lifecycle retirement.

## Plan ledger

**Goal:** make the profile store deterministic under concurrent tabs, delayed providers, pending creator saves and page retirement.

- [x] Identify writer, sequencing and lifecycle gaps.
- [x] Keep browser persistence outside engine core.
- [x] Define accepted artifact and conflict rules.
- [ ] Implement with browser fixtures.

## Contract

```txt
AcceptedProfileArtifact {
  profileId
  schemaVersion
  revision
  fingerprint
  writerId
  writeId
  committedAt
}

ProfileWriteCommand {
  expectedRevision
  expectedFingerprint
  writerId
  documentGeneration
  writeId
  candidate
}

ProfileWriteResult {
  result
  acceptedArtifact
  observedPredecessor
  conflict
}
```

## Invariants

```txt
one revision maps to one fingerprint
same write ID is idempotent
lower revisions never replace higher revisions
same-revision different fingerprints are conflicts
pending local writes are cancelled or rebased explicitly
active runs never mutate from ambient storage events
page retirement removes listeners and closes owned channels
```
