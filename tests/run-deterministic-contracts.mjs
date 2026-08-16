import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["--check", "src/game-runtime-semantic-v2.js"]],
  ["node", ["--check", "src/game-runtime-shared-gpu-v3.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/gpu-native-ground-cover.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/world-implementation.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/course-implementation.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/gameplay-implementation.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/player-presentation-implementation.js"]],
  ["node", ["--check", "src/domains/prehistoric-rush/rendering-implementation.js"]],
  ["node", ["--check", "src/render/three-procedural-creature.js"]],
  ["node", ["--check", "src/render/three-tree-fidelity-layer.js"]],
  ["node", ["--check", "src/render/lush-jungle-atmosphere.js"]],
  ["node", ["tests/game-runtime-semantic-contract.mjs"]],
  ["node", ["tests/gpu-native-world-layer-contract.mjs"]],
  ["node", ["tests/game-startup-performance.mjs"]],
  ["node", ["tests/rendering-streaming-policy.mjs"]],
  ["node", ["tests/tree-fidelity-contract.mjs"]],
  ["node", ["tests/prehistoric-domain-packaging.mjs"]],
  ["node", ["tests/preflight-static-validation.mjs"]],
  ["node", ["tests/prebuilt-startup-validation.mjs"]]
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("PrehistoricRush deterministic contract suite passed.");
