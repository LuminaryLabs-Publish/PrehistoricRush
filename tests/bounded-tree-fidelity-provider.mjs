import assert from "node:assert/strict";
import {
  BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  PREBUILT_TREE_FIDELITY_SCHEMA,
  matchesPrebuiltTreeFidelityManifest,
  resetTreeFidelityTransientBuildState
} from "../src/shared/bounded-tree-fidelity-provider.js";

let captureResetCount = 0;
let fidelityResetCount = 0;
let snapshotReadCount = 0;

const runtime = {
  treeGrowthRevision: "natural-growth-v4-volumetric-canopy",
  treeGrowthDigest: "growth-digest",
  foliageAtlasRevision: "prehistoric-foliage-cards-v3-chunky-canopy",
  engine: {
    n: {
      coreCapture: {
        getSnapshot() {
          snapshotReadCount += 1;
          throw new Error("transient reset must not clone capture state");
        },
        reset() {
          captureResetCount += 1;
        }
      },
      objectFidelity: {
        getSnapshot() {
          snapshotReadCount += 1;
          throw new Error("transient reset must not clone fidelity state");
        },
        reset() {
          fidelityResetCount += 1;
        }
      }
    }
  }
};

const receipt = resetTreeFidelityTransientBuildState(runtime);
assert.equal(BOUNDED_TREE_FIDELITY_PROVIDER_REVISION, "object-vegetation-natural-growth-v7-prebuilt-first");
assert.equal(snapshotReadCount, 0, "bounded reset must not structured-clone retained capture/Fidelity state");
assert.equal(captureResetCount, 1, "Core Capture transient state resets once per completed runtime-generated package");
assert.equal(fidelityResetCount, 1, "Object Fidelity transient state resets once per completed runtime-generated package");
assert.deepEqual(receipt, { fidelityReset: true, captureReset: true });

const manifest = {
  schema: PREBUILT_TREE_FIDELITY_SCHEMA,
  packageVersion: "5",
  providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  growthRevision: runtime.treeGrowthRevision,
  growthDigest: runtime.treeGrowthDigest,
  foliageAtlasRevision: runtime.foliageAtlasRevision,
  packages: Array.from({ length: 12 }, (_, index) => ({ archetypeId: `tree-${index}`, file: `tree-${index}.json` }))
};
assert.equal(matchesPrebuiltTreeFidelityManifest(manifest, runtime), true, "matching compiled tree assets are accepted");
assert.equal(matchesPrebuiltTreeFidelityManifest({ ...manifest, growthDigest: "stale" }, runtime), false, "stale compiled tree assets fall back to runtime generation");

console.log(JSON.stringify({
  status: "PASS",
  revision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  captureResetCount,
  fidelityResetCount,
  snapshotReadCount,
  prebuiltManifestMatch: true
}, null, 2));
