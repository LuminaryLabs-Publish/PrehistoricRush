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
  ["P0 world boundary", "tests/p0-world-boundary-baseline.mjs", "node", ["tests/p0-world-boundary-baseline.mjs"]],
  ["P1 course boundary", "tests/course-domain-boundary.mjs", "node", ["tests/course-domain-boundary.mjs"]],
  ["world recipe composition", "tests/world-recipe-composition.mjs", "node", ["tests/world-recipe-composition.mjs"]],
  ["resolution policy", "tests/prehistoric-rush-resolution-policy.mjs", "node", ["tests/prehistoric-rush-resolution-policy.mjs"]],
  ["Compute streaming contract", "tests/compute-streaming-contract.mjs", "node", ["tests/compute-streaming-contract.mjs"]],
  ["rendering streaming policy", "tests/rendering-streaming-policy.mjs", "node", ["tests/rendering-streaming-policy.mjs"]]
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
