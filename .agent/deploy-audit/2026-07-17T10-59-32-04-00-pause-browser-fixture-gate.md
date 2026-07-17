# Pause Browser Fixture Gate

**Timestamp:** `2026-07-17T10-59-32-04-00`

## Required source checks

- Pause policy is explicit and singular.
- Open clears held gameplay input.
- Gameplay keyboard commands are rejected while true pause is active.
- Simulation/physics/streaming advancement is gated by the accepted pause generation.
- Resume rebases time and rejects stale close results.
- Focus enters the menu and returns to the prior control.

## Required browser fixture

```txt
start run
hold steer + boost
open Pause
sample several RAF frames
assert player, route, physics and streaming revisions are stable
assert menu remains operable
close Pause
assert no catch-up step
assert first resumed frame matches PauseCloseResult
repeat open/close rapidly
assert apply-once behavior
```

## Release boundary

Do not claim true-pause correctness, accessible focus behavior, artifact parity or Pages parity until source, browser, built-output and deployed-origin fixtures pass.
