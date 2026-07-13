# Interaction Audit: Start, Frame and Stop Result Map

**Timestamp:** `2026-07-12T20-10-25-04-00`

## Summary

Browser events and the public host can drive a running game, but no interaction can request or observe deterministic runtime shutdown. Input listeners are anonymous global registrations, and the public host is assigned directly to `globalThis` without a publication lease or revocation result.

## Plan ledger

**Goal:** map every external runtime interaction to typed admission and terminal results, including stop and stale-generation rejection.

- [x] Map keyboard, blur, resize and public-host inputs.
- [x] Map RAF-produced frame work.
- [x] Identify missing stop and revocation surfaces.
- [x] Define command/result relationships.
- [ ] Wire browser and public-host adapters to lifecycle authority.

## Current map

```txt
keydown/keyup
  -> mutate local input flags or call game.start()/setInput()
  -> no browser-listener lease

blur
  -> clear input
  -> no lifecycle change

resize
  -> mutate camera and renderer directly
  -> no stale-session admission

PrehistoricRushHost
  -> exposes engine, physics, adapter, controller and camera objects
  -> no capability classification or revocation

RAF
  -> mutates engine, streaming, renderer and HUD
  -> no frame lease or generation check

stop
  -> absent
```

## Required commands and results

```txt
StartRuntimeCommand
  -> RuntimeStarted | RuntimeStartRejected | RuntimeStartFailed

SubmitBrowserInputCommand
  -> InputAccepted | InputRejectedStopping | InputRejectedStaleRuntime

ResizeRuntimeSurfaceCommand
  -> ResizeAccepted | ResizeRejectedStopping | ResizeRejectedStaleRuntime

StopRuntimeCommand
  -> RuntimeStopped | RuntimeAlreadyStopped | RuntimeStopRejectedStale | RuntimeStopFailed

FrameCallback
  -> FrameAccepted | FrameRejectedStopping | FrameRejectedStaleRuntime | FrameFailed

PublishPublicHostCommand
  -> HostPublished | HostPublicationRejected

RevokePublicHostCommand
  -> HostRevoked | HostAlreadyRevoked
```

## Required receipt chain

```txt
runtimeSessionId
  -> runtimeGeneration
  -> callback/listener/publication lease IDs
  -> frame or command ID
  -> terminal result
  -> retirement journal entry
```

## Safety rule

Once stop admission succeeds, browser input, resize callbacks, Worker completions, public-host commands and RAF callbacks from that generation must produce zero mutation.