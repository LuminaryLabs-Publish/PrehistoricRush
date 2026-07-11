# Validation: PrehistoricRush

**Updated:** `2026-07-11T14-20-32-04-00`

## Scope

Documentation-only audit of streamed patch collider membership, pinned Rapier fixed-collider replacement, contact collection, product-side collision admission, visual/physics parity and terminal failure proof.

## Plan ledger

**Goal:** separate source-confirmed collider-retirement facts from executable proof and define the exact release blockers.

- [x] Verify generated collider descriptors.
- [x] Verify active collider list is rebuilt from active patches.
- [x] Verify release removes descriptors from browser active membership.
- [x] Verify pinned ProtoKit retains removed runtime fixed bodies/colliders.
- [x] Verify contact collection iterates retained runtime colliders.
- [x] Verify product accepts any dino Rapier contact.
- [x] Verify fallback uses a different current-descriptor overlap rule.
- [x] Verify domains, kits and services.
- [x] Add required documentation outputs.
- [ ] Execute Node and browser collision fixtures after implementation.

## Selection verification

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected oldest eligible repository: LuminaryLabs-Publish/PrehistoricRush
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
target branch: main
branch created: no
pull request created: no
```

## Source facts verified

```txt
patch collider source:
  src/world/prehistoric-patch-generator.js

tree collider descriptor:
  shape ball
  x/y/z from tree ground point
  radius trunk radius * 1.3
  tags hazard, tree

active collider reconstruction:
  src/game.js -> rebuildActiveContent
  view.colliders reset and rebuilt from activePatches
  physics.setFixedColliders(view.colliders)

patch release:
  activePatches.delete
  terrain hidden
  tree cells released
  rebuildActiveContent called

pinned physics source:
  NexusEngine-ProtoKits@11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
  protokits/rapier-physics-domain-kit/index.js
```

## ProtoKit facts verified

```txt
runtime maps:
  actorBodies
  actorColliders
  fixedBodies
  fixedColliders

setFixedColliders:
  normalizes submitted values
  creates or moves submitted IDs
  replaces serialized state.colliders
  does not diff removed IDs
  does not remove fixed collider instances
  does not remove fixed rigid bodies
  does not delete runtime map entries

collectContacts:
  iterates runtime.fixedColliders
  first checks Rapier intersectionPair
  can emit contact for ID absent from state.colliders
```

## Product admission facts verified

```txt
actor transform submitted each game frame: yes
manual Rapier step: yes
any contact with actorId dino is fatal: yes
colliderId current-membership check: no
patchId check: no
hazard tag check: no
membership revision check: no
contact enter/stay/exit distinction: no

fallback path:
  current view.colliders only
  XZ distance
  collider radius + player radius
  jumpHeight < 1.05
```

## Existing runtime identity

```txt
NexusEngine: e8252e51878a08eeef46f54b1aae9e8349a2442b
NexusEngine-Kits: d6630367d557782d9ec965947aeb1c197d37ea15
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three.js: 0.179.1
Rapier: 0.15.0
prehistoric-rush-domain-kit: 0.5.0
root package.json: absent
```

## Documentation output

```txt
required root .agent files updated: yes
new tracker folder: yes
new turn-ledger entry: yes
architecture audit: yes
render audit: yes
gameplay audit: yes
interaction audit: yes
collision authority audit: yes
deploy audit: yes
runtime source changed by this pass: no
rendering changed by this pass: no
physics implementation changed by this pass: no
deployment changed by this pass: no
```

## Validation not executed

```txt
exact fixed-collider replacement fixture
removed Rapier body/collider fixture
released-patch invisible-tree fixture
contact current-membership fixture
contact enter/stay/exit fixture
Rapier/fallback parity fixture
single failure transaction fixture
terminal frame correlation fixture
browser stale-collider smoke
Pages smoke
```

No runnable checkout or browser session was available through the connector, so no executable collision-correctness claim is made.

## Required future proof

```txt
live Rapier collider IDs exactly equal committed collider membership
removed IDs disappear from state, runtime maps and Rapier world
released patch cannot create a later contact
contact identifies actor, collider, patch, membership revision and source
retired or prior-epoch contact is rejected
one admitted contact creates one failure result
visual active tree set and physics hazard set remain in parity
terminal frame identifies the admitted failure result
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-fixed-collider-replacement-fixture.mjs
node scripts/prehistoric-rush-released-patch-collision-fixture.mjs
node scripts/prehistoric-rush-contact-admission-fixture.mjs
node scripts/prehistoric-rush-collision-source-parity-fixture.mjs
node scripts/prehistoric-rush-single-failure-transaction-fixture.mjs
node scripts/prehistoric-rush-collision-terminal-frame-fixture.mjs
node scripts/prehistoric-rush-browser-stale-collider-smoke.mjs
```

## Readiness statement

The source currently proves that active browser collider descriptors can diverge from live Rapier fixed colliders. Patch release and collision correctness must not be treated as safe until exact replacement, retirement acknowledgement, contact admission and stale-collider fixtures pass.
