import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const steps = [
  ["legacy syntax baseline", "package.json", npm, ["run", "test:syntax"]],
  ["semantic core assembly syntax", "src/domains/prehistoric-rush/core-assembly.js", "node", ["--check", "src/domains/prehistoric-rush/core-assembly.js"]],
  ["semantic landform projection syntax", "src/domains/prehistoric-rush/world-landform-projection.js", "node", ["--check", "src/domains/prehistoric-rush/world-landform-projection.js"]],
  ["semantic World syntax", "src/domains/prehistoric-rush/world-implementation.js", "node", ["--check", "src/domains/prehistoric-rush/world-implementation.js"]],
  ["semantic Player binding syntax", "src/domains/prehistoric-rush/player-actor-binding.js", "node", ["--check", "src/domains/prehistoric-rush/player-actor-binding.js"]],
  ["semantic Player syntax", "src/domains/prehistoric-rush/player-implementation.js", "node", ["--check", "src/domains/prehistoric-rush/player-implementation.js"]],
  ["semantic Gameplay syntax", "src/domains/prehistoric-rush/gameplay-implementation.js", "node", ["--check", "src/domains/prehistoric-rush/gameplay-implementation.js"]],
  ["semantic Rendering syntax", "src/domains/prehistoric-rush/rendering-implementation.js", "node", ["--check", "src/domains/prehistoric-rush/rendering-implementation.js"]],
  ["semantic runtime syntax", "src/game-runtime-semantic-v2.js", "node", ["--check", "src/game-runtime-semantic-v2.js"]],
  ["shared GPU runtime syntax", "src/game-runtime-shared-gpu-v3.js", "node", ["--check", "src/game-runtime-shared-gpu-v3.js"]],
  ["portable dense contribution syntax", "src/domains/prehistoric-rush/dense-world-visual-contributions.js", "node", ["--check", "src/domains/prehistoric-rush/dense-world-visual-contributions.js"]],
  ["unified GPU world syntax", "src/domains/prehistoric-rush/gpu-native-world-scene.js", "node", ["--check", "src/domains/prehistoric-rush/gpu-native-world-scene.js"]],
  ["GPU-native ground-cover regression syntax", "src/domains/prehistoric-rush/gpu-native-ground-cover.js", "node", ["--check", "src/domains/prehistoric-rush/gpu-native-ground-cover.js"]],
  ["P0 world boundary", "tests/p0-world-boundary-baseline.mjs", "node", ["tests/p0-world-boundary-baseline.mjs"]],
  ["P1 course boundary", "tests/course-domain-boundary.mjs", "node", ["tests/course-domain-boundary.mjs"]],
  ["world recipe composition", "tests/world-recipe-composition.mjs", "node", ["tests/world-recipe-composition.mjs"]],
  ["resolution policy", "tests/prehistoric-rush-resolution-policy.mjs", "node", ["tests/prehistoric-rush-resolution-policy.mjs"]],
  ["Compute streaming contract", "tests/compute-streaming-contract.mjs", "node", ["tests/compute-streaming-contract.mjs"]],
  ["rendering streaming policy", "tests/rendering-streaming-policy.mjs", "node", ["tests/rendering-streaming-policy.mjs"]],
  ["portable dense visual composition", "tests/dense-visual-contribution-contract.mjs", "node", ["tests/dense-visual-contribution-contract.mjs"]],
  ["unified GPU world", "tests/unified-gpu-world-contract.mjs", "node", ["tests/unified-gpu-world-contract.mjs"]],
  ["GPU-native world layer regression", "tests/gpu-native-world-layer-contract.mjs", "node", ["tests/gpu-native-world-layer-contract.mjs"]],
  ["GPU-native product integration regression", "tests/gpu-native-product-integration.mjs", "node", ["tests/gpu-native-product-integration.mjs"]],
  ["visual fidelity contract", "tests/visual-fidelity-contract.mjs", "node", ["tests/visual-fidelity-contract.mjs"]]
];

for (const [name, file, command, args] of steps) {
  console.log(`\n[contract] ${name}`);
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? `exit ${result.status ?? 1}`;
    console.error(`::error file=${file}::Deterministic contract failed: ${name} (${detail})`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nActive semantic deterministic contracts passed.");
