import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createPrehistoricRushCoreKits } from "../src/domains/prehistoric-rush/core-assembly.js";

const semanticRuntime = await readFile(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8");
const runtimeVersions = await readFile(new URL("../src/shared/runtime-versions.js", import.meta.url), "utf8");
let productKitOptions = null;
const staticKit = (id) => () => Object.freeze({ id });

const kits = createPrehistoricRushCoreKits({
  Nexus: {
    defineDomainServiceKit(options) {
      if (options.domainPath === "n:prehistoric-rush") productKitOptions = options;
      return Object.freeze({ id: options.id, options });
    },
    createCompositionDomain() { return []; }
  },
  Runtime: {
    createRuntimeLifecycleKit: staticKit("runtime-lifecycle-kit"),
    createStartupKit: staticKit("runtime-startup-kit")
  },
  Actor: {
    createActorRegistryKit: staticKit("actor-registry"),
    createCreatureKit: staticKit("creature"),
    createCharacterKit: staticKit("character"),
    createPlayerKit: staticKit("player")
  },
  Spatial: { createSpatialKit: staticKit("spatial") },
  Interaction: { createInteractionKit: staticKit("interaction"), createInputKit: staticKit("input") },
  Simulation: {
    createSimulationKit: staticKit("simulation"),
    createMotionKit: staticKit("motion"),
    createPhysicsKit: staticKit("physics")
  },
  Asset: { createAssetRegistryKit: staticKit("asset-registry-kit") },
  World: { createWorldDomain: staticKit("world"), createSceneKit: staticKit("scene") },
  Presentation: { createPresentationDomain() { return []; } },
  Graphics: { createGraphicsKit: staticKit("graphics") },
  Animation: { createAnimationKit: staticKit("animation") },
  Render: { createRenderDomain() { return []; } }
});

assert.ok(kits.some((kit) => kit.id === "runtime-lifecycle-kit"), "Nexus Runtime Lifecycle is composed");
assert.ok(kits.some((kit) => kit.id === "runtime-startup-kit"), "Nexus Core Startup is composed");
assert.match(runtimeVersions, /nexusRuntime:.*core-domains\/runtime\/index\.js/, "the browser imports canonical Nexus Runtime APIs");
assert.match(semanticRuntime, /globalThis\.PrehistoricRushEngine = engine/, "the browser publishes the actual Nexus Engine");
assert.doesNotMatch(semanticRuntime, /PrehistoricRushHost/, "the active semantic runtime contains no Host facade");
assert.match(semanticRuntime, /startup\.launch\(/, "Core Startup owns launch truth");
assert.match(semanticRuntime, /startup\.presentFirstFrame\(/, "Core Startup receives the first-frame receipt");
assert.match(semanticRuntime, /startup\.enter\(\{ inputReady: true \}\)/, "Core Startup alone enters playable state");
assert.doesNotMatch(semanticRuntime, /localFidelityReady|fullFidelityReady/, "post-play fidelity is not shadowed in Core Startup");
assert.ok(
  semanticRuntime.indexOf("const renderSurface = measureStartup") < semanticRuntime.indexOf("const world = measureStartup"),
  "the browser canvas is created before synchronous World construction"
);

const product = productKitOptions.createApi();
const world = { snapshot: () => ({ id: "world" }) };
const gameplay = { snapshot: () => ({ status: "ready" }) };
const simulation = { world, gameplay };
assert.strictEqual(product.bindSimulation(simulation), product.bindSimulation(simulation), "identical simulation binding is idempotent");
assert.throws(() => product.bindSimulation({ world: {} }), /already bound/, "conflicting simulation rebinding fails");
assert.strictEqual(product.getComponent("world"), world, "product composition preserves live reference identity");

const rendering = { snapshot: () => ({ terrainPatchCount: 9 }) };
product.bindPresentation({ rendering });
assert.deepEqual(product.getSnapshot().presentation, { terrainPatchCount: 9 }, "default snapshot reads the live Presentation reference");
const liveReader = () => ({ gameplay: gameplay.snapshot(), rendering: rendering.snapshot() });
assert.strictEqual(product.bindSnapshotReader(liveReader), product.bindSnapshotReader(liveReader), "identical snapshot binding is idempotent");
assert.throws(() => product.bindSnapshotReader(() => ({})), /already bound/, "conflicting snapshot reader fails");
assert.deepEqual(product.getSnapshot(), liveReader(), "product snapshot delegates to authoritative live readers");

let frameCount = 0;
const removeHook = product.registerFrameHook(() => { frameCount += 1; });
product.dispatchFrame({});
removeHook();
product.dispatchFrame({});
assert.equal(frameCount, 1, "frame hook ownership remains in product composition");

console.log("Nexus Core Startup and Prehistoric Rush product composition contract passed");
