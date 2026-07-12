import { RUNTIME_URLS } from "../shared/runtime-versions.js";

const requiredModules = [
  ["NexusEngine", RUNTIME_URLS.nexus],
  ["NexusEngine seed kit", RUNTIME_URLS.seedKit],
  ["procedural creature kit", RUNTIME_URLS.creatureKit],
  ["instanced render batch kit", RUNTIME_URLS.batchKit],
  ["seeded world patch controller kit", RUNTIME_URLS.patchKit],
  ["camera smooth follow kit", RUNTIME_URLS.cameraKit],
  ["Three.js", RUNTIME_URLS.three],
  ["Rapier", RUNTIME_URLS.rapier],
  ["Rapier physics ProtoKit", RUNTIME_URLS.rapierKit]
];

const results = await Promise.allSettled(
  requiredModules.map(([, url]) => import(url))
);
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

await import("../game.js");
