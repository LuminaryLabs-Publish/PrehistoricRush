# Run Restart and Render Generation Loop

**Timestamp:** `2026-07-17T06-23-59-04-00`

## Interaction loop

```txt
player starts or restarts a run
  -> game state resets
  -> dynamic pickup state refreshes
  -> stream focus primes the center patch
  -> camera follow resets
  -> existing render host continues
  -> RAF keeps ticking and rendering
```

A normal run restart intentionally reuses the current host. The risk appears when a route, page, WebGL context or outer runtime generation is replaced. The current host exposes no retirement command, so the product cannot distinguish reusable run state from a retired browser/render generation.

## Gameplay authority boundary

Gameplay truth should remain in the existing engine and PrehistoricRush domains. Render-host retirement must not alter:

```txt
run id and deterministic seed
route samples and progress
surface multiplier
movement and jump resolution
collision and pickup outcomes
score, fail and win settlement
player profile and pose
pause behavior
```

## Required loop

```txt
run restart inside active host
  -> preserve RenderHostGeneration
  -> reset game/camera/stream state only

route exit, remount, runtime replacement or WebGL recovery
  -> close input/frame/patch admission for old host
  -> issue RenderHostRetirementCommand
  -> settle old resources and callbacks
  -> admit replacement host generation
  -> render first replacement frame
```

## Required results

```txt
RunRestartResult
RenderHostRetirementResult
RenderHostReplacementResult
FirstRetiredRenderHostAck
FirstReplacementRenderHostFrameAck
```

## Fixtures

- Restart a run repeatedly without replacing the renderer.
- Retire and recreate the route host in one document.
- Assert gameplay seed and route behavior remain unchanged.
- Assert one renderer canvas and one active RAF generation.
- Reject late patch and Worker results from the retired host.

## Boundary

No gameplay defect was reproduced. The gap is lifecycle arbitration between run restart and render-host replacement.