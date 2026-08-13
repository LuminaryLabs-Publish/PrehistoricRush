import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(process.env.PREHISTORIC_TREE_ASSET_DIR ?? "assets/tree-fidelity");
const metricsFile = path.resolve(".agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade/metrics/tree-fidelity-compile.json");
const manifestPath = path.join(outputRoot, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

assert.equal(manifest.schema, "prehistoric-rush.prebuilt-tree-fidelity-manifest/1");
assert.equal(manifest.speciesCount, 12);
assert.equal(manifest.packages.length, 12);

const verified = [];
for (const entry of manifest.packages) {
  const descriptor = await stat(path.join(outputRoot, entry.file));
  const atlas = await stat(path.join(outputRoot, entry.atlas));
  assert.ok(descriptor.size > 0, `${entry.file} must be non-empty`);
  assert.ok(atlas.size > 0, `${entry.atlas} must be non-empty`);
  verified.push({ archetypeId: entry.archetypeId, descriptorBytes: descriptor.size, atlasBytes: atlas.size });
}

const evidence = {
  status: "PASS",
  mode: "prebuilt-reuse",
  gate: "semantic-foundation-gate-1",
  vegetationEnabled: false,
  packageCount: verified.length,
  sourceManifestCommit: manifest.sourceCommit,
  reason: "Gate 1 keeps vegetation disabled; existing prebuilt Fidelity assets are integrity-checked without invoking retired vegetation runtime APIs.",
  packages: verified
};
await mkdir(path.dirname(metricsFile), { recursive: true });
await writeFile(metricsFile, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
