import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createPrehistoricRushCoreKits } from "../src/domains/prehistoric-rush/core-assembly.js";

const [runtime, rendering, gameplay, core, compatibility] = await Promise.all([
  readFile(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/rendering-implementation.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/gameplay-implementation.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/core-assembly.js", import.meta.url), "utf8"),
  readFile(new URL("../src/domains/prehistoric-rush/player-implementation.js", import.meta.url), "utf8")
]);

assert.match(runtime, /loadSelectedRacerId\(globalThis\.location\)/, "runtime resolves persisted roster selection");
assert.match(runtime, /resolvePlayableRacerProfile\(requestedRacerId\)/, "runtime resolves one playable RacerProfile");
assert.match(runtime, /installPrehistoricRushPlayerActor\(engine, \{ profile: racerProfile \}\)/, "actor binding receives the RacerProfile");
assert.match(runtime, /createPrehistoricRushPlayerImplementation\(\{ engine, course, world, profile: racerProfile \}\)/, "controller receives the RacerProfile");
assert.match(runtime, /racerPresentation,[\s\S]{0,180}diagnosticFoundationOnly/, "renderer receives the racer presentation descriptor");
assert.match(runtime, /padding: racerProfile\.camera\.padding/, "camera framing receives profile tuning");
assert.match(runtime, /gameplay\.setInput\(\{ ability: true \}\)/, "keyboard input publishes normalized ability intent");

assert.match(rendering, /racerPresentation = null/, "renderer retains a compatibility-safe racer presentation seam");
assert.match(rendering, /Number\(state\.steer \?\? 0\)/, "pose generation consumes live controller steering");
assert.doesNotMatch(rendering, /createPose\([^\n]+turn: 0/, "generic racer pose does not hard-code zero turning");
assert.match(gameplay, /ability: false/, "race session owns one-frame ability input");
assert.match(core, /actions: \{ jump: \{\}, boost: \{\}, ability: \{\}/, "Nexus input kit declares the ability action");
assert.match(core, /createAssetRegistryKit\(\{[\s\S]{0,100}id: "asset-registry-kit"/, "Core Assets preserves the Nexus kit's canonical manifest identity");
assert.match(compatibility, /createPrehistoricRushRacerImplementation/, "the old Player export delegates to the generic racer controller");

const staticKit = (id) => () => Object.freeze({ id });
let assetRegistryOptions = null;
createPrehistoricRushCoreKits({
  Nexus: {
    defineDomainServiceKit(options) { return Object.freeze({ id: options.id }); },
    createCompositionDomain() { return []; }
  },
  Runtime: {
    createRuntimeLifecycleKit: staticKit("runtime-lifecycle"),
    createStartupKit: staticKit("startup")
  },
  Actor: {
    createActorRegistryKit: staticKit("actor-registry"),
    createCreatureKit: staticKit("creature"),
    createCharacterKit: staticKit("character"),
    createPlayerKit: staticKit("player")
  },
  Spatial: { createSpatialKit: staticKit("spatial") },
  Interaction: {
    createInteractionKit: staticKit("interaction"),
    createInputKit: staticKit("input")
  },
  Simulation: {
    createSimulationKit: staticKit("simulation"),
    createMotionKit: staticKit("motion"),
    createPhysicsKit: staticKit("physics")
  },
  Asset: {
    createAssetRegistryKit(options) {
      if (options.id !== "asset-registry-kit") throw new TypeError(`Nexus manifest expected asset-registry-kit; received ${options.id}`);
      assetRegistryOptions = options;
      return Object.freeze({ id: options.id });
    }
  },
  World: {
    createWorldDomain: staticKit("world"),
    createSceneKit: staticKit("scene")
  },
  Presentation: { createPresentationDomain() { return []; } },
  Graphics: { createGraphicsKit: staticKit("graphics") },
  Animation: { createAnimationKit: staticKit("animation") },
  Render: { createRenderDomain() { return []; } }
});
assert.equal(assetRegistryOptions.id, "asset-registry-kit");
assert.equal(assetRegistryOptions.domainPath, "n:asset");
assert.equal(assetRegistryOptions.apiName, "asset");
assert.deepEqual(assetRegistryOptions.metadata, { product: "prehistoric-rush", singleOwner: true });

console.log("racer runtime integration contract ok");
