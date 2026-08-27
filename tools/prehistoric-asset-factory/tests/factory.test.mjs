import assert from "node:assert/strict";
import { ASSET_IDS, describe, factory, generate, reroll, validate } from "../src/factory.mjs";

assert.equal(ASSET_IDS.length, 24);
assert.deepEqual(Object.keys(factory).sort(), ["describe", "export", "generate", "randomize", "reroll", "validate"]);
for (const id of ASSET_IDS) {
  assert.equal(describe(id).deterministic, true);
  const first = generate(id);
  const second = reroll(id, "default", 0);
  assert.equal(validate(first).status, "PASS", id);
  assert.equal(validate(second).status, "PASS", `${id}:reroll`);
}
console.log("Prehistoric asset factory contract passed");
