# Gameplay Audit: Core Player Character Composition Loop

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Document how the new composition path becomes the playable dinosaur authority and where partial adoption can affect game startup, control and pose publication.

## Current game loop

```txt
profile boot
  -> create Core Creature, Character and Player domains
  -> procedural body descriptor
  -> articulated rig registration
  -> creature definition registration/replacement
  -> character registration/replacement
  -> player registration and possession
  -> initial PlayerPose solve

run frame
  -> Core Player resolves controlled character
  -> character supplies motionActorId and physicsBodyId
  -> run movement commits Core Motion and Physics requests
  -> legacy gait becomes articulated base pose
  -> terrain targets feed articulated solve
  -> Core Character pose binding is updated
  -> PlayerPose resource is replaced
  -> renderer consumes the controlled creature and pose
```

## Implemented improvement

The product no longer treats a procedural body ID as sufficient gameplay identity. The controlled path now resolves:

```txt
Player -> Character -> Creature -> Body/Rig
```

This is the correct bounded composition model.

## Remaining gameplay gaps

- Composition installation has no aggregate startup result.
- A rig can be registered before creature creation or character binding fails.
- A creature can be replaced before character/player adoption fails.
- Player possession can increment `controlGeneration` independently of an aggregate composition generation.
- Character replacement preserves a prior pose ID even when the creature/rig changes; no compatibility result proves that pose belongs to the successor rig.
- Product startup does not retain participant receipts or the final composition fingerprint.
- Run restart and profile replacement have no explicit composition-generation fence.
- Gameplay diagnostics do not expose body/rig/creature/character/player revision agreement.

## Required gameplay result

```txt
PlayerCharacterCompositionResult
  attemptId
  generation
  profileRevision
  bodyReceipt
  rigReceipt
  creatureReceipt
  characterReceipt
  playerReceipt
  possessionReceipt
  poseCompatibility
  terminalStatus
```

## Policy requirements

- Startup cannot enable player control until the full composition result is accepted.
- A changed rig must explicitly validate or clear a predecessor pose binding.
- Duplicate composition must not increment character lifecycle or player control generations.
- Failed composition must preserve the prior controlled-character chain.
- Run restart must identify which composition generation is being reactivated.
- Renderer and diagnostics must resolve the same accepted chain as simulation.

## Completion gate

The gameplay composition loop is complete when startup, restart and profile replacement can prove one accepted Player/Character/Creature/Body/Rig chain and every rejected attempt preserves the prior playable chain.