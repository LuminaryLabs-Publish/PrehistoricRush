import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pageSource = await readFile(new URL("../src/pages/character-creator.js", import.meta.url), "utf8");
const transitionSource = await readFile(new URL("../src/character-creator/character-preview-transition.js", import.meta.url), "utf8");

assert.match(pageSource, /\.\.\.NexusEngine\.createCoreCreatureDomain\(\)/, "the creator installs Core Creature");
assert.match(pageSource, /\.\.\.NexusEngine\.createCoreCharacterDomain\(\)/, "the creator installs Core Character");
assert.match(pageSource, /\.\.\.NexusEngine\.createCoreMotionDomain\(\)/, "the creator installs articulated motion through Core Motion");
assert.match(pageSource, /NexusEngine\.createCoreCameraFramingKit\(\)/, "the creator installs Core Camera Framing");
assert.doesNotMatch(pageSource, /createCorePlayerDomain/, "the creator does not install player control authority");
assert.match(pageSource, /const PLATFORM_TOP_Y = PLATFORM_CENTER_Y \+ PLATFORM_HEIGHT \* 0\.5;/, "the platform owns a fixed support plane");
assert.match(pageSource, /resolved\?\.creature\?\.presentation\?\.metadata\?\.bounds/, "camera framing reads composed Character presentation bounds");
assert.match(pageSource, /const horizontalRadius = Math\.hypot\(/, "camera framing remains stable while the long character rotates");
assert.match(pageSource, /framingController\.update\(\{/, "camera framing comes from the Core framing controller");
assert.match(pageSource, /42 - Math\.log2\(height \/ REFERENCE_CHARACTER_HEIGHT\) \* 5/, "FOV responds to character height");

assert.match(transitionSource, /installPrehistoricRushPlayerCharacter\(\{/, "the preview uses the shared player-character composition");
assert.match(transitionSource, /includePlayer: false/, "the preview creates a character without player possession");
assert.match(
  transitionSource,
  /return platformTopY - minimumY \* Math\.max\(0\.0001, finite\(scaleY, 1\)\);/,
  "the character body offsets to the fixed platform from composed local bounds"
);
assert.match(transitionSource, /sampleHeight: \(\) => platformTopY/, "creator IK targets the fixed platform plane");
assert.match(transitionSource, /articulatedMotion\.evaluatePose\(\{ rigId, pose: basePose \}\)/, "the creator evaluates the procedural source pose");
assert.match(transitionSource, /articulatedMotion\.solve\(\{[\s\S]*?targets,/, "the creator solves the same articulated target path as the game");
assert.match(transitionSource, /coreCharacter\.setPose\(targetComposition\.characterId, frame\.pose\.id\)/, "the creator publishes pose authority through Core Character");

console.log("character creator authority test ok");
