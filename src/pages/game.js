import { NEXUS_COMMIT, RUNTIME_URLS, THREE_VERSION } from "../shared/runtime-versions.js";
import { loadPinnedModule } from "../shared/pinned-module-loader.js";
import {
  confirmRequiredApiSurface,
  createGamePreflightResult,
  requiredModuleChecks,
  validateImports
} from "../shared/game-preflight.js";

const requiredModules = [
  ["NexusEngine Core", RUNTIME_URLS.nexusCore],
  ["NexusEngine Host", RUNTIME_URLS.nexusHost],
  ["NexusEngine World", RUNTIME_URLS.nexusWorld],
  ["NexusEngine Foundation", RUNTIME_URLS.nexusFoundation],
  ["NexusEngine World Terrain", RUNTIME_URLS.nexusWorldTerrain],
  ["NexusEngine World Landform", RUNTIME_URLS.nexusWorldLandform],
  ["NexusEngine World Hydrology", RUNTIME_URLS.nexusWorldHydrology],
  ["NexusEngine World Ecology", RUNTIME_URLS.nexusWorldEcology],
  ["NexusEngine World Atmosphere", RUNTIME_URLS.nexusWorldAtmosphere],
  ["NexusEngine Compute", RUNTIME_URLS.nexusCompute],
  ["NexusEngine Render", RUNTIME_URLS.nexusRender],
  ["NexusEngine Render Contracts", RUNTIME_URLS.nexusRenderContracts],
  ["NexusEngine Math", RUNTIME_URLS.nexusMath],
  ["NexusEngine Rig", RUNTIME_URLS.nexusRig],
  ["NexusEngine IK", RUNTIME_URLS.nexusIK],
  ["NexusEngine Creature", RUNTIME_URLS.nexusCreature],
  ["NexusEngine Creature Proto", RUNTIME_URLS.nexusCreatureProto],
  ["NexusEngine Presentation", RUNTIME_URLS.nexusPresentation],
  ["NexusEngine Presentation Archetype", RUNTIME_URLS.nexusPresentationArchetype],
  ["NexusEngine Presentation Fidelity", RUNTIME_URLS.nexusPresentationFidelity],
  ["NexusEngine Presentation Artifact", RUNTIME_URLS.nexusPresentationArtifact],
  ["NexusEngine Input", RUNTIME_URLS.nexusInput],
  ["NexusEngine Content", RUNTIME_URLS.nexusContent],
  ["NexusEngine Vehicle", RUNTIME_URLS.nexusVehicle],
  ["NexusEngine Gameplay", RUNTIME_URLS.nexusGameplay],
  ["NexusEngine Player", RUNTIME_URLS.nexusPlayer],
  ["NexusEngine Runtime", RUNTIME_URLS.nexusRuntime],
  ["NexusEngine Runtime Sequence", RUNTIME_URLS.nexusRuntimeSequence],
  ["NexusEngine Schedule", RUNTIME_URLS.nexusSchedule],
  [`three.js ${THREE_VERSION}`, RUNTIME_URLS.three]
];

const results = await validateImports(requiredModules, 10000);
const failed = requiredModuleChecks(results);
if (failed.length) {
  throw new Error(`Preflight failed: ${failed.map((item) => `${item.name} (${item.error || item.status})`).join(", ")}`);
}

const modules = Object.fromEntries(await Promise.all(requiredModules.map(async ([name, url]) => [name, await loadPinnedModule(url)])));
const surface = confirmRequiredApiSurface(modules, [
  ["NexusEngine Foundation", "createWorldFoundationKit"],
  ["NexusEngine Host", "createGPUHost"],
  ["NexusEngine Host", "createWebGPUHostProvider"],
  ["NexusEngine Compute", "createComputeHost"],
  ["NexusEngine Compute", "createWebGPUComputeProvider"],
  ["NexusEngine Render", "createWebGPURenderProvider"],
  ["NexusEngine Creature", "createCreatureKit"],
  ["NexusEngine Creature Proto", "createProtoCreatureKit"],
  ["NexusEngine Presentation Archetype", "createArchetypeKit"],
  ["NexusEngine Presentation Fidelity", "createPresentationFidelityKit"],
  ["NexusEngine Presentation Artifact", "createPresentationArtifactKit"],
  ["NexusEngine Runtime Sequence", "createRuntimeSequenceKit"],
  ["NexusEngine Schedule", "createScheduleKit"]
]);
if (!surface.ok) {
  throw new Error(`Preflight API surface failed: ${surface.failures.join(", ")}`);
}

globalThis.__PREHISTORIC_PREFLIGHT = createGamePreflightResult(results, surface, {
  nexusCommit: NEXUS_COMMIT,
  threeVersion: THREE_VERSION,
  sharedGPUContract: true
});

await import("../game-runtime-shared-gpu-v3.js");
