# Validation — Playable Race and Streamed-World Verification

## Required order

```text
deterministic contracts
→ world-update contract
→ browser framebuffer capture
→ movement and camera probe
→ world-focus and patch-update probe
→ Pages deployment and smoke
→ NexusEngine-Editor Headless lifecycle
```

## World-update gates

- selected world ID remains stable;
- world recipe revision remains stable;
- player distance and world position increase;
- world focus cell changes after traversal;
- terrain ring remains nine unique patches;
- forest patches remain active;
- streaming-hole count is zero;
- seeded patch plans reproduce identically;
- runtime and asset errors remain empty.

## Visual gates

The screenshots must show the complete race composition: dinosaur, procedural track, scenery, camera framing, HUD, and movement state. The character-selection card must not appear in `game.html`.

## Final evidence

The final source SHA must have fresh evidence in:

```text
.agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade/after/
```

The final Headless lifecycle must report all nine stages as passing, and Pages smoke must verify the deployed `game.html`.
