# Menu-Open Active Run Loop

**Timestamp:** `2026-07-17T10-59-32-04-00`

## Interaction loop

```txt
running
  -> player holds steer or boost
  -> Escape opens Pause
  -> overlay captures pointer
  -> held or new keyboard input remains admitted
  -> engine tick continues
  -> route distance, collisions, pickups, score and outcome may change
  -> player closes menu into a different run state
```

## Gameplay risk

The player may lose distance, collide, collect items, reach a terminal outcome or stream into new world content while reading Settings or deciding whether to Exit. This is source-backed behavior, not a reproduced incident.

## Required policy

Prefer a true-pause policy for the surface currently labeled Pause:

- clear held steer, boost and jump at open;
- reject gameplay commands while open;
- suspend product simulation, physics and streaming;
- continue rendering the accepted paused snapshot and menu UI;
- rebase time before resuming;
- apply open/close once per pause generation.
