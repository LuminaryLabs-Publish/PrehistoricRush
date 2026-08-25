import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [runtime, rendering, gameplay, core, compatibility] = await Promise.all([
  readFile(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/rendering-implementation.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/gameplay-implementation.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/core-assembly.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/player-implementation.js", import.meta.url), "utf8")
]);

assert.match(runtime, /resolvePlayableRacerProfile\(requestedRacerId \?\? undefined\)/, "runtime resolves one playable RacerProfile");
assert.match(runtime, /installPrehistoricRushPlayerActor\(engine, \{ profile: racerProfile \}\)/, "actor binding receives the RacerProfile");
assert.match(runtime, /createPrehistoricRushPlayerImplementation\(\{ engine, course, world, profile: racerProfile \}\)/, "controller receives the RacerProfile");
assert.match(runtime, /racerPresentation, diagnosticFoundationOnly/, "renderer receives the racer presentation descriptor");
assert.match(runtime, /padding: racerProfile\.camera\.padding/, "camera framing receives profile tuning");
assert.match(runtime, /gameplay\.setInput\(\{ ability: true \}\)/, "keyboard input publishes normalized ability intent");

assert.match(rendering, /racerPresentation = null/, "renderer retains a compatibility-safe racer presentation seam");
assert.match(rendering, /Number\(state\.steer \?\? 0\)/, "pose generation consumes live controller steering");
assert.doesNotMatch(rendering, /createPose\([^\n]+turn: 0/, "generic racer pose does not hard-code zero turning");
assert.match(gameplay, /ability: false/, "race session owns one-frame ability input");
assert.match(core, /actions: \{ jump: \{\}, boost: \{\}, ability: \{\}/, "Nexus input kit declares the ability action");
assert.match(compatibility, /createPrehistoricRushRacerImplementation/, "the old Player export delegates to the generic racer controller");

console.log("racer runtime integration contract ok");
