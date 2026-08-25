# Headless Editor Run Report

Run: 2026-08-09-prehistoric-headless-visual-upgrade
Goal: # PrehistoricRush Playable Race and Streamed-World Verification Target

Run: `2026-08-25-prehistoric-race-world-update-verification`

## Goal

Verify the actual `game.html` race: the selected dinosaur is visible and controllable, the procedural track and camera are live, Nexus World focus updates during traversal, streamed terrain and forest patches remain valid, and the deployed page matches the validated source.

## Architectural constraints

- Keep Nexus World, Course, Player, Camera, HUD, and Renderer as the existing authorities.
- Do not create a second world manager or parallel track system.
- Keep the character-selection card out of the race scene.
- Validate source changes through deterministic tests, browser framebuffer evidence, Pages smoke, and NexusEngine-Editor Headless.

## Race target

- `game.html` shows the dinosaur, procedural track, scenery, HUD, and camera framing.
- Input advances the character and changes the camera state.
- World focus changes after crossing a streaming cell.
- Terrain and forest patch IDs remain valid and unique.
- No terrain streaming holes are reported.

## Quantitative acceptance

- deterministic world-update contract passes;
- world focus cell changes during traversal;
- terrain ring contains nine unique patches;
- active forest patch set is non-empty;
- streaming-hole count is zero;
- browser reports zero page and console errors;
- race screenshots include before and after movement;
- Pages smoke and Headless lifecycle pass.

## Required visual evidence

```text
world-before.png
race-before.png
race-after.png
world-after-movement.png
```

The older forest visual labs remain historical evidence and are not deleted.

## Definition of done

- World recipe, focus, patch movement, route readability, determinism, streaming, browser startup, and race composition pass.
- Before/after evidence is retained by the Headless/CI workflow.
- The final ledger contains only `PASS`, `BLOCKED`, or explicitly documented external hardware exclusions.
- Main remains playable and the deployed GitHub Pages game is reachable from the `main` revision.


- read: ok
- capture-before: ok
- plan: ok
- validate: ok
- submit: ok
- observe: ok
- verify: ok
- capture-after: ok
- observed-differences: ok
