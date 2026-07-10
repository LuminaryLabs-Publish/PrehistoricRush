# Interaction Audit: Keyboard Input Source Result Map

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current input surface

```txt
keydown
  -> ArrowLeft / KeyA set left
  -> ArrowRight / KeyD set right
  -> ArrowUp / KeyW set boost
  -> Space starts or sets jump
  -> Enter starts
keyup
  -> clears left / right / boost
```

## Current issue

Inputs mutate `app.input` directly. The frame loop consumes the flags and mutates runner state, but there is no source-owned input result row.

## Required input result rows

```txt
accepted:start
accepted:left_down
accepted:right_down
accepted:boost_down
accepted:jump_start
rejected:jump_airborne
accepted:left_up
accepted:right_up
accepted:boost_up
noop:not_game_scene
```

## Why this matters

The next fixture must prove which input caused each movement, scene, pose, camera, HUD, and render row. Without input result rows, downstream proof cannot explain why a frame moved, jumped, stayed unchanged, or changed scene.
