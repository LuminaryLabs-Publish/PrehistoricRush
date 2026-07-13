# Viewport Audit: Central Ledger Reconciliation

**Timestamp:** `2026-07-13T00-58-50-04-00`

## Summary

The repo-local viewport authority audit was complete at `00-49-53` while the central ledger still pointed to the older articulated-pose audit. This reconciliation aligns the source-backed viewport findings, 45-surface census and current documentation head.

## Plan ledger

**Goal:** make repo-local and central records agree without changing the implementation boundary or overstating validation.

- [x] Confirm current Publish inventory and exclusion rule.
- [x] Confirm PrehistoricRush root `.agent` state is newer than central tracking.
- [x] Re-read the viewport tracker and source resize path.
- [x] Preserve all prior articulation and run-start findings.
- [x] Add a timestamped reconciliation family.
- [x] Prepare central ledger and change-log updates.
- [ ] Implement viewport authority and fixtures later.

## Reconciled state

```txt
status: game-viewport-render-surface-central-reconciled
technical audit: 2026-07-13T00-49-53-04-00
reconciliation audit: 2026-07-13T00-58-50-04-00
implemented viewport authority count: 0
viewport commit result count: 0
first viewport frame ack count: 0
kit/service surfaces retained: 45
```

## Retained findings

```txt
camera and renderer derive size from browser globals
actual host is not measured
DPR is startup-only
resize has no typed admission or commit
zero/stale/duplicate candidates are not handled
public readback omits surface provenance
visible frame has no viewport acknowledgement
```

## Retained audits

```txt
articulated-pose-presentation-authority-audited
run-start-restart-central-reconciled
runtime-lifecycle authority audit
```

## Non-claim

This reconciliation does not make the viewport implementation atomic, DPR-aware, bounded, observable or fixture-proven.