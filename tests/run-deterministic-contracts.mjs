import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const steps = [
  ["syntax", "package.json", npm, ["run", "test:syntax"]],
  ["P0 world boundary", "tests/p0-world-boundary-baseline.mjs", "node", ["tests/p0-world-boundary-baseline.mjs"]],
  ["P1 course boundary", "tests/course-domain-boundary.mjs", "node", ["tests/course-domain-boundary.mjs"]],
  ["world recipe composition", "tests/world-recipe-composition.mjs", "node", ["tests/world-recipe-composition.mjs"]],
  ["world recipe patch generation", "tests/world-recipe-patch-generation.mjs", "node", ["tests/world-recipe-patch-generation.mjs"]],
  ["vegetation module imports", "tests/vegetation-module-imports.mjs", "node", ["tests/vegetation-module-imports.mjs"]],
  ["foliage card system", "tests/foliage-card-system.mjs", "node", ["tests/foliage-card-system.mjs"]],
  ["vegetation heuristic generation", "tests/vegetation-heuristic-generation-review.mjs", "node", ["tests/vegetation-heuristic-generation-review.mjs"]],
  ["natural growth authority", "tests/natural-growth-single-authority.mjs", "node", ["tests/natural-growth-single-authority.mjs"]],
  ["production forest visuals", "tests/production-forest-visuals.mjs", "node", ["tests/production-forest-visuals.mjs"]],
  ["resolution policy", "tests/prehistoric-rush-resolution-policy.mjs", "node", ["tests/prehistoric-rush-resolution-policy.mjs"]],
  ["player articulation", "tests/player-articulation.mjs", "node", ["tests/player-articulation.mjs"]],
  ["player character composition", "tests/player-character-composition.mjs", "node", ["tests/player-character-composition.mjs"]],
  ["player pose authority", "tests/player-pose-authority.mjs", "node", ["tests/player-pose-authority.mjs"]],
  ["character creator authority", "tests/character-creator-authority.mjs", "node", ["tests/character-creator-authority.mjs"]],
  ["pause menu authority", "tests/pause-menu-authority.mjs", "node", ["tests/pause-menu-authority.mjs"]],
  ["patch streaming authority", "tests/patch-owned-streaming-authority.mjs", "node", ["tests/patch-owned-streaming-authority.mjs"]],
  ["terrain LOD authority", "tests/terrain-lod-renderer-authority.mjs", "node", ["tests/terrain-lod-renderer-authority.mjs"]],
  ["tree fidelity assets", "tests/tree-fidelity-assets.mjs", "node", ["tests/tree-fidelity-assets.mjs"]],
  ["tree fidelity frame addressing", "tests/tree-fidelity-frame-addressing.mjs", "node", ["tests/tree-fidelity-frame-addressing.mjs"]],
  ["tree spawn variation", "tests/tree-spawn-variation.mjs", "node", ["tests/tree-spawn-variation.mjs"]],
  ["bounded tree fidelity provider", "tests/bounded-tree-fidelity-provider.mjs", "node", ["tests/bounded-tree-fidelity-provider.mjs"]],
  ["headless visual contract", "tests/headless-visual-contract.mjs", "node", ["tests/headless-visual-contract.mjs"]],
  ["forest seed sweep", "tests/forest-seed-sweep.mjs", "node", ["tests/forest-seed-sweep.mjs"]]
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

console.log("\nAll deterministic contracts passed.");
