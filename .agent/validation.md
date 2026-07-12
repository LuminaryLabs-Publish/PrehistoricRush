# Validation: PrehistoricRush Streamed Content / Outcome Parity

**Updated:** `2026-07-12T11-11-34-04-00`

## Scope

Documentation-only review through repository revision `6430c623d4e1fa5afb7ed460d5d1624799fbe65d`, using the pinned Nexus Engine revision `c5548de504072bf09eb68986b98aca0292903803` and pinned Rapier ProtoKit revision `ae0f42fea49be7887c4646ed803bd4886e8db631`.

## Plan ledger

**Goal:** distinguish the implemented outcome-policy baseline from missing executable proof that simulation observations and the rendered streamed-content set share one revision.

- [x] Compare the Publish inventory and central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush`.
- [x] Review the current product domain, resolution policy, game host and runtime versions.
- [x] Review Nexus Engine `core-simulation` proposal/observation/commit behavior.
- [x] Review the pinned Rapier provider's collider synchronization, motion request and step behavior.
- [x] Confirm streaming release/activation runs after `engine.tick()` and before render.
- [x] Confirm no shared content revision is present.
- [x] Change no runtime source, dependencies or deployment configuration.
- [x] Create no branch or pull request.

## Executable proof currently present

```txt
npm test command exists
pure outcome-policy tests exist
collision/goal/pickup precedence cases exist
runtime module preflight reports the first failure
```

## Proof currently absent

```txt
real browser Nexus Engine + Rapier integration fixture
active-content revision fixture
released-collider invisible-failure fixture
activated-collider delayed-admission fixture
activated-pickup delayed-admission fixture
mixed proposal/observation revision rejection
content/physics atomic commit and rollback
stale Worker result rejection
first visible content-frame acknowledgement
browser/Pages stream traversal parity
```

## Commands not run in this pass

```txt
npm test
browser smoke
Pages smoke
```

The connector supplied current source and write access but no checked-out runtime. No new executable correctness claim is made.

## Change-state validation

```txt
runtime source changed by audit: no
gameplay changed by audit: no
physics changed by audit: no
streaming changed by audit: no
render behavior changed by audit: no
package/dependencies changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
.agent documentation changed: yes
```

## Completion boundary

Do not claim stream/outcome parity until one admitted content revision is shared by physics, fallback collision, pickup sampling, outcome resolution, active-content/physics commit, public readback and the first visible frame, with rollback and stale-result rejection.
