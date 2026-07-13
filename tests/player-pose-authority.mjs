import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const domainSource = await readFile(
  new URL("../src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js", import.meta.url),
  "utf8"
);
const gameSource = await readFile(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = await readFile(new URL("../src/shared/runtime-versions.js", import.meta.url), "utf8");

assert.match(
  domainSource,
  /PlayerPose:\s*defineResource\("prehistoric-rush\.player-pose"\)/,
  "the game domain declares an authoritative player pose resource"
);
assert.match(
  domainSource,
  /const playerPose = resolvePlayerPose\(next, input, tick\);\s*if \(playerPose\) world\.setResource\(resources\.PlayerPose, playerPose\);/,
  "the simulation tick commits the resolved articulated pose"
);
assert.match(
  domainSource,
  /const evaluatedPose = articulatedMotionRef\.evaluatePose\(\{\s*rigId: playerRigId,\s*pose: basePose\s*\}\);/,
  "the authoritative solve evaluates the animated source pose through generic FK"
);
assert.match(
  domainSource,
  /const targets = heightSamplerReady\s*\? createPlayerGroundLegTargets\(\{/,
  "terrain targets are generated only after the height sampler is installed"
);
assert.match(
  domainSource,
  /const articulatedFrame = articulatedMotionRef\.solve\(\{[\s\S]*?pose: basePose,\s*targets,/,
  "terrain targets feed the authoritative articulated solve"
);
assert.match(
  domainSource,
  /heightSampler = nextSampler;\s*heightSamplerReady = true;/,
  "installing terrain height sampling enables ground-leg IK"
);
assert.match(
  domainSource,
  /getPlayerPose:\s*\(\) => clone\(world\.getResource\(resources\.PlayerPose\)\)/,
  "the game API exposes the authoritative pose"
);
assert.match(
  domainSource,
  /playerPose:\s*clone\(world\.getResource\(resources\.PlayerPose\)\)/,
  "snapshots include the authoritative pose"
);
assert.match(
  gameSource,
  /import \{ applyCreaturePoseDamped, createCreatureMesh \}/,
  "the renderer imports damped pose application"
);
assert.match(
  gameSource,
  /const playerPose = game\.getPlayerPose\(\);\s*if \(playerPose\) applyCreaturePoseDamped\(player, playerPose, dt, 18\);/,
  "the renderer consumes the simulation-owned pose"
);
assert.doesNotMatch(
  gameSource,
  /game\.createPlayerPose\(/,
  "the render loop no longer generates animation truth"
);
assert.ok(
  gameSource.indexOf("engine.tick(dt);") < gameSource.indexOf("adapter.render(state, dt);"),
  "rendering observes the pose after the authoritative simulation tick"
);
assert.match(
  runtimeSource,
  /NEXUS_COMMIT = "f3c880b7a433dbefb19892389b03607b33f5c267"/,
  "the game pins the current-pose articulated solver"
);

console.log("player pose authority test ok");
