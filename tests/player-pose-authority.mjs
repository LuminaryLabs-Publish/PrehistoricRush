import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const domainSource = await readFile(
  new URL("../src/domains/prehistoric-rush/prehistoric-rush-domain-runtime.js", import.meta.url),
  "utf8"
);
const compositionSource = await readFile(
  new URL("../src/domains/prehistoric-rush/player-character-composition.js", import.meta.url),
  "utf8"
);
const gameSource = await readFile(new URL("../src/game-runtime.js", import.meta.url), "utf8");
const adapterSource = await readFile(new URL("../src/render/three-patch-stream-adapter.js", import.meta.url), "utf8");
const runtimeSource = await readFile(new URL("../src/shared/runtime-versions.js", import.meta.url), "utf8");

assert.match(domainSource, /\.\.\.createCoreCreatureDomain\(\)/, "the game installs Core Creature");
assert.match(domainSource, /\.\.\.createCoreCharacterDomain\(\)/, "the game installs Core Character");
assert.match(domainSource, /\.\.\.createCorePlayerDomain\(\)/, "the game installs Core Player");
assert.match(domainSource, /"n:core-creature"/, "the game requires Core Creature");
assert.match(domainSource, /"n:core-character"/, "the game requires Core Character");
assert.match(domainSource, /"n:core-player"/, "the game requires Core Player");
assert.match(domainSource, /installPrehistoricRushPlayerCharacter\(\{/, "the game uses the shared composition authority");
assert.match(
  compositionSource,
  /corePlayer\.possess\(resolvedPlayerId, character\.id\)/,
  "the player possesses the composed character"
);
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
  /const evaluatedPose = articulatedMotionRef\.evaluatePose\(\{ rigId, pose: basePose \}\);/,
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
  /engineRef\.coreCharacter\.setPose\(character\.id, articulatedFrame\.pose\.id\)/,
  "the articulated pose binding is published through Core Character"
);
assert.match(domainSource, /bodyId: physicsBodyId/, "motion requests use the Character physics binding");
assert.match(domainSource, /actorId: motionActorId/, "motion intent uses the Character motion binding");
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
assert.match(domainSource, /creature: engine\.coreCreature\.getSnapshot\(\)/, "snapshots include Core Creature");
assert.match(domainSource, /character: engine\.coreCharacter\.getSnapshot\(\)/, "snapshots include Core Character");
assert.match(domainSource, /player: engine\.corePlayer\.getSnapshot\(\)/, "snapshots include Core Player");
assert.match(
  adapterSource,
  /import \{ applyCreaturePoseDamped, createCreatureMesh \}/,
  "the renderer imports damped pose application"
);
assert.match(
  adapterSource,
  /const playerPose = game\.getPlayerPose\(\);\s*if \(playerPose\) applyCreaturePoseDamped\(player, playerPose, dt, 18\);/,
  "the renderer consumes the simulation-owned pose"
);
assert.doesNotMatch(adapterSource, /game\.createPlayerPose\(/, "the render loop no longer generates animation truth");
assert.ok(
  gameSource.indexOf("engine.tick(dt);") < gameSource.indexOf("adapter.render(state, dt);"),
  "rendering observes the pose after the authoritative simulation tick"
);
assert.match(
  runtimeSource,
  /NEXUS_COMMIT = "682c9fa697a36a6bf6262762a6e647ffc3a5e289"/,
  "the game pins the Core Creature Character Player runtime"
);

console.log("player pose authority test ok");
