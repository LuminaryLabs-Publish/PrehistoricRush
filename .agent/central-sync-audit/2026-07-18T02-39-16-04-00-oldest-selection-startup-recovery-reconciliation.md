# Oldest Selection / Startup Recovery Reconciliation

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Selection

The full `LuminaryLabs-Publish` inventory contains 11 repositories. `TheCavalryOfRome` was excluded. The remaining ten repositories had central ledger coverage, root `.agent` coverage at their documented heads, and `main` heads matching the recorded repo-local documentation heads. No new, missing-ledger, root-agent-missing, undocumented or runtime-ahead repository took priority.

PrehistoricRush was selected because its prior central timestamp, `2026-07-17T16-40-37-04-00`, was the oldest eligible synchronized documentation timestamp.

## Reconciliation

```txt
selected repository: LuminaryLabs-Publish/PrehistoricRush
pre-audit repository head: 791f273d96a136e15fc15c077913ca377a017b2a
runtime source revision retained: 06e2bc0439643e46153b8c7f7f42a4e91a2db5e1
runtime delta: none
focused audit: required startup asset failure recovery
central ledger target: repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
central change log target: internal-change-log/2026-07-18T02-39-16-04-00-prehistoric-rush-startup-failure-recovery.md
```

## Claim boundary

This run reconciles documentation only. The proposed recovery authority is not implemented, and no runtime or release validation is claimed.