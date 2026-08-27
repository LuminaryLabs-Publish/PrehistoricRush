import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ASSET_IDS, describe, exportAsset, generate, validate } from "../src/factory.mjs";

const root = new URL("../../../", import.meta.url);
const modelRoot = new URL("assets/models/", root);
await mkdir(new URL("racers/", modelRoot), { recursive: true });
await mkdir(new URL("trees/", modelRoot), { recursive: true });

const assets = [];
for (const factoryId of ASSET_IDS) {
  const descriptor = describe(factoryId);
  const generated = generate(factoryId);
  const validation = validate(generated);
  if (validation.status !== "PASS") throw new Error(`${factoryId} failed generation validation: ${validation.failures.join(", ")}`);
  const buffer = await exportAsset(generated);
  const relativePath = `${descriptor.kind === "racer" ? "racers" : "trees"}/${descriptor.key}.glb`;
  await writeFile(new URL(relativePath, modelRoot), buffer);
  assets.push(Object.freeze({
    id: descriptor.key,
    kind: descriptor.kind,
    url: `./${relativePath}`,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    rigged: true,
    animations: validation.animationClips,
    geometry: validation.metrics,
    bounds: validation.bounds
  }));
  process.stdout.write(`generated ${factoryId} (${buffer.length} bytes)\n`);
}

const manifest = {
  schema: "prehistoric-rush.model-manifest/1",
  generator: "tools/prehistoric-asset-factory/src/factory.mjs",
  deterministic: true,
  assetCount: assets.length,
  racerCount: assets.filter((entry) => entry.kind === "racer").length,
  treeCount: assets.filter((entry) => entry.kind === "tree").length,
  assets
};
await writeFile(new URL("manifest.json", modelRoot), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`wrote ${fileURLToPath(new URL("manifest.json", modelRoot))}\n`);
