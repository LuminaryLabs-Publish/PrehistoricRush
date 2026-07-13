# PrehistoricRush Next Steps

**Audit:** `2026-07-13T03-12-30-04-00`  
**Authority:** `prehistoric-rush-browser-input-core-adoption-authority-domain`

## Summary

The next implementation should replace direct window-listener mutation with one Core Input path that owns focus, lifecycle generations, held actions, one-shot edges, repeat policy, command results and visible-frame correlation.

## Plan ledger

**Goal:** make Core Input authoritative for every admitted browser steering, boost, jump, start and retry action.

### Phase 1: Input identity and surface ownership

- [ ] Add input-session, surface and focus-generation identities.
- [ ] Make the game host/canvas explicitly focusable and route-owned.
- [ ] Exclude editable and non-game targets.
- [ ] Add lifecycle generation for blur, visibility, pagehide and disposal.

### Phase 2: Core Input adoption

- [ ] Map A/D and arrows to the `steer` axis.
- [ ] Map W/ArrowUp to held `boost`.
- [ ] Map Space to one-shot `jump`.
- [ ] Map Enter and the visible button to explicit `start` or `retry` commands according to current status.
- [ ] Remove direct browser mutation of product `InputState`.

### Phase 3: Repeat and command policy

- [ ] Treat steer/boost as generation-bound held actions.
- [ ] Reject repeated keydown for jump/start/retry by default.
- [ ] Add command IDs and monotonic sequences.
- [ ] Return sealed duplicate results for repeated command IDs.
- [ ] Reject stale focus/lifecycle generations with zero mutation.

### Phase 4: Gameplay consumer contracts

- [ ] Add typed `RunCommandResult`, `JumpCommandResult` and `HeldInputResult` consumers.
- [ ] Reject Enter-based restart during an active run unless an explicit restart policy is selected.
- [ ] Keep run lifecycle participant reset/preserve work under the retained run-lifecycle authority.
- [ ] Publish product input-consumption receipts.

### Phase 5: Lifecycle fencing

- [ ] On blur, visibility loss, pagehide, route exit or disposal, close the current generation.
- [ ] Release held state and publish `InputClearResult`.
- [ ] Start successor generations from neutral state.
- [ ] Reject predecessor-generation events and pending commands.

### Phase 6: Observation and presentation

- [ ] Expose input session, generation, held state and terminal results through `PrehistoricRushHost`.
- [ ] Add repeat, stale, duplicate and rejection counters.
- [ ] Correlate input results with run ID, simulation revision and render frame.
- [ ] Publish `FirstInputFrameAck`.

### Phase 7: Fixtures

- [ ] Focus and editable-target admission.
- [ ] A/D/W and arrow held-state parity.
- [ ] Enter mid-run rejection and key-repeat rejection.
- [ ] Space repeat produces one edge command.
- [ ] Blur/visibility/page lifecycle generation fences.
- [ ] Button/keyboard result parity.
- [ ] Duplicate and stale zero-mutation behavior.
- [ ] Source, built output and Pages parity.

## Completion gate

Do not mark the authority implemented until the browser host submits exclusively through Core Input, one-shot actions are edge-triggered, lifecycle boundaries retire predecessor state, rejected samples have zero effects, button and keyboard paths share terminal results, and the first visible frame cites the accepted input result.