# Frame authority audit: scheduler, live loop, and presentation pass contract

Timestamp: `2026-07-10T16-28-47-04-00`

## Observed clocks

```txt
clock A: tick-scheduler-kit
  status: constructed
  running: false until start() is called
  current live use: none

clock B: runtime-terrain-v6 RAF
  status: authoritative simulation and primary presentation

clock C: game.js presentation RAF
  status: secondary overlapping presentation and render
```

## Contract failure

The architecture exposes a scheduler service but does not select it as authority. The live monolith creates its own clock, and the composition layer creates another clock after import.

This means the domain boundary is documentary rather than operational:

```txt
domainHost.tick is available
domainHost.tick is not called
dino pose listener is installed
runner.moved is not emitted
camera/HUD descriptors exist
direct constants and DOM writes are used instead
```

## Required single-owner rule

```txt
exactly one source frame clock
exactly one input snapshot per source frame
exactly one simulation transaction per source frame
exactly one presentation request per source frame
at most one accepted render commit per source frame
all secondary requests are skipped with typed reasons
```

## Recommended cut

Use the existing scheduler API as the clock contract, but allow the current live runtime to remain the RAF adapter during migration. The key requirement is that both simulation and presentation are called from the same source frame transaction.
