# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T10-59-32-04-00`  
**Status:** `pause-overlay-input-context-simulation-arbitration-authority-audited`

## Summary

The current Pause overlay does not own gameplay input or simulation participation. It captures pointer interaction while keyboard commands, physics, world streaming and the frame tick continue.

## Pause arbitration gaps

```txt
accepted pause semantic mode: absent
PauseGeneration: absent
input-context arbitration: absent
held gameplay input retirement: absent
gameplay command rejection while open: absent
simulation participant suspension: absent
physics suspension: absent
world-streaming suspension: absent
focus capture/restoration receipt: absent
resume clock rebase: absent
PauseOpenResult: absent
PauseCloseResult: absent
FirstPausedFrameAck: absent
FirstResumedGameplayFrameAck: absent
browser fixture: absent
```

## Retained render-host gaps

```txt
parent RenderHostGeneration retirement: absent
base adapter dispose(): absent
RAF, Worker and listener retirement: absent
base renderer/context/canvas retirement: absent
atmosphere restoration: absent
stale callback/result rejection: absent
```

## Validation gaps

```txt
npm test execution by this audit: not run
pause browser fixture: absent
focus restoration fixture: absent
rapid open/close fixture: absent
built artifact smoke: not run
Pages smoke: not run
```

## Risk boundary

No collision, lost run, inaccessible focus or deployment incident was reproduced. The source-backed risk is that a UI labeled Pause can cover the world while the authoritative run continues.
