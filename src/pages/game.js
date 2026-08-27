import { RUNTIME_URLS } from "../shared/runtime-versions.js";

const requiredModules = [
  ["NexusEngine", RUNTIME_URLS.nexus],
  ["NexusEngine Runtime", RUNTIME_URLS.nexusRuntime],
  ["NexusEngine Actor", RUNTIME_URLS.nexusActor],
  ["NexusEngine Spatial", RUNTIME_URLS.nexusSpatial],
  ["NexusEngine Interaction", RUNTIME_URLS.nexusInteraction],
  ["NexusEngine Simulation", RUNTIME_URLS.nexusSimulationRuntime],
  ["NexusEngine Motion", RUNTIME_URLS.nexusMotion],
  ["NexusEngine Physics", RUNTIME_URLS.nexusPhysics],
  ["NexusEngine Assets", RUNTIME_URLS.nexusAsset],
  ["NexusEngine World", RUNTIME_URLS.nexusWorld],
  ["NexusEngine Presentation", RUNTIME_URLS.nexusPresentation],
  ["NexusEngine Render", RUNTIME_URLS.nexusRender],
  ["Three.js", RUNTIME_URLS.three]
];

const results = await Promise.allSettled(requiredModules.map(([, url]) => import(url)));
const failedIndex = results.findIndex((result) => result.status === "rejected");

if (failedIndex >= 0) {
  const [label, url] = requiredModules[failedIndex];
  const reason = results[failedIndex].reason;
  const detail = reason instanceof Error ? reason.message : String(reason);
  const error = new Error(`Failed to load ${label} from ${url}: ${detail}`);
  console.error(error);
  document.body.textContent = `Could not start PrehistoricRush: ${error.message}`;
  throw error;
}

await import("../game-runtime-shared-gpu-v3.js");
