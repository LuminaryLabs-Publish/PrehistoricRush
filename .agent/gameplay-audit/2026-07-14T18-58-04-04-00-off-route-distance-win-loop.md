# Gameplay Audit: Off-Route Distance Win Loop

**Timestamp:** `2026-07-14T18-58-04-04-00`

## Summary

Course completion is currently a movement-budget loop. The player can leave the route, reverse, circle, or repeat one segment until cumulative movement reaches the goal threshold.

## Plan ledger

**Goal:** separate movement telemetry from valid authored-course advancement and require an eligible terminal checkpoint for victory.

- [x] Trace movement integration.
- [x] Trace route lookup and surface classification.
- [x] Trace goal proposal and terminal resolution.
- [x] Identify bypass variants.
- [ ] Implement progress admission and regression fixtures later.

## Current loop

```txt
steer and boost
  -> integrate dx and dz
  -> update world position
  -> add hypot(dx, dz) to distance
  -> query nearest route sample
  -> update routeIndex, routeProgress and region
  -> ignore route evidence for goal
  -> win when distance >= 3600
```

## Bypass variants

```txt
reverse along the route
circle near the start
oscillate over one segment
travel through forest away from route
re-enter at an earlier route sample
repeat already traversed checkpoints
```

All variants continue increasing `RunState.distance`.

## Required gameplay rules

```txt
totalMovementDistance remains diagnostic and scoring input
acceptedCourseDistance advances only from eligible forward traversal
checkpoint sequence prevents loops and skips
lateral tolerance rejects distant traversal
course goal requires the terminal checkpoint or finish volume
collision precedence remains unchanged
retry creates a fresh progress generation
```

## Validation boundary

No movement, speed, surface, collision, pickup, goal, score, route, retry, or terminal behavior changed.