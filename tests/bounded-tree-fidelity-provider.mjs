import assert from "node:assert/strict";
import {
  BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  resetTreeFidelityTransientBuildState
} from "../src/shared/bounded-tree-fidelity-provider.js";

let captureResetCount = 0;
let fidelityResetCount = 0;
let snapshotReadCount = 0;

const runtime = {
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
assert.equal(BOUNDED_TREE_FIDELITY_PROVIDER_REVISION, "object-vegetation-natural-growth-v5-bounded-transients");
assert.equal(snapshotReadCount, 0, "bounded reset must not structured-clone retained capture/Fidelity state");
assert.equal(captureResetCount, 1, "Core Capture transient state resets once per completed package");
assert.equal(fidelityResetCount, 1, "Object Fidelity transient state resets once per completed package");
assert.deepEqual(receipt, { fidelityReset: true, captureReset: true });

console.log(JSON.stringify({
  status: "PASS",
  revision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  captureResetCount,
  fidelityResetCount,
  snapshotReadCount
}, null, 2));
