# Gameplay Audit: Restart Authority Reconciliation Loop

**Timestamp:** `2026-07-12T16-20-55-04-00`

## Summary

The active gameplay restart defect remains the unconditional Enter path. It can replace an in-progress run without phase admission while other participants retain predecessor state.

## Plan ledger

**Goal:** make initial start, terminal retry, run-again and intentional quick restart distinct admitted commands with idempotent results.

- [x] Verify button, Space and Enter activation paths.
- [x] Verify Enter can call start during active gameplay.
- [x] Verify product state advances before cross-domain reset proof exists.
- [x] Preserve the current coordinated-reset gameplay finding.
- [ ] Implement phase admission and duplicate/repeat rejection.

## Failure loop

```txt
run N active
  -> Enter keydown
  -> browser start() executes without status admission
  -> product RunState becomes run N+1
  -> InputState and Core Simulation resolution reset
  -> camera/content refresh begin
  -> motion, physics, articulation, Worker and stream state may remain from run N
  -> public state can expose run N+1 before one compatible visible frame exists
```

## Required gameplay policy

```txt
menu start: admitted when no active run exists
terminal retry: admitted from run-over
run again: admitted from win
active-run Enter: rejected by default
intentional quick restart: separate command and policy
auto-repeat/duplicate activation: idempotent zero-extra-run result
```

No gameplay behavior was changed by this audit.