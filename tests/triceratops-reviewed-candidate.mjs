import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createThreePrebuiltRacerModel } from "../src/render/three-prebuilt-racer-model.js";
import {
  listRacerModelRecords,
  resolveRacerModelRecord
} from "../src/services/racer-model-service.js";

globalThis.ProgressEvent ??= class ProgressEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.lengthComputable = Boolean(options.lengthComputable);
    this.loaded = options.loaded ?? 0;
    this.total = options.total ?? 0;
  }
};

const manifest = JSON.parse(await readFile(new URL("../assets/models/candidates/manifest.json", import.meta.url), "utf8"));
const record = resolveRacerModelRecord("triceratops", { variant: "reviewed-candidate" });
const production = resolveRacerModelRecord("triceratops");
const records = listRacerModelRecords("triceratops");
const candidate = manifest.candidates.find((entry) => entry.id === record.id);

assert.equal(manifest.schema, "prehistoric-rush.racer-model-candidates/v1");
assert.ok(candidate, "the runtime record must have a manifest entry");
assert.equal(record.status, "reviewed-candidate");
assert.equal(record.userApprovalRequired, true);
assert.equal(record.default, false);
assert.equal(production.default, true);
assert.equal(production.rigged, true);
assert.deepEqual(records.map((entry) => entry.variant), ["production", "reviewed-candidate"]);
assert.throws(() => resolveRacerModelRecord("velociraptor", { variant: "reviewed-candidate" }), /No reviewed model candidate/);

const file = new URL("../assets/models/candidates/triceratops-guided-v1.glb", import.meta.url);
const bytes = await readFile(file);
assert.equal(bytes.length, candidate.bytes);
assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), candidate.sha256);
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const presentation = await createThreePrebuiltRacerModel(THREE, buffer, {
  name: "triceratops-reviewed-candidate",
  transform: record.runtimeTransform,
  loaderModuleUrl: new URL("../node_modules/three/examples/jsm/loaders/GLTFLoader.js", import.meta.url).href
});

let meshes = 0;
let triangles = 0;
presentation.object.traverse((node) => {
  if (!node.isMesh) return;
  meshes += 1;
  triangles += (node.geometry.getIndex()?.count ?? node.geometry.getAttribute("position").count) / 3;
});
presentation.object.updateMatrixWorld(true);
const bounds = new THREE.Box3().setFromObject(presentation.object);
const size = bounds.getSize(new THREE.Vector3());

assert.equal(meshes, candidate.geometry.meshes);
assert.equal(triangles, candidate.geometry.triangles);
assert.deepEqual(presentation.animations, [], "reviewed candidate remains explicitly unrigged and unanimated");
assert.ok(Math.abs(bounds.min.y) < 1e-5, "runtime transform preserves floor contact");
assert.ok(Math.abs(size.x - candidate.bounds.runtimeSize[0]) < 1e-4);
assert.ok(Math.abs(size.y - candidate.bounds.runtimeSize[1]) < 1e-4);
assert.ok(Math.abs(size.z - candidate.bounds.runtimeSize[2]) < 1e-4);
presentation.update({ speed: 15, abilityStatus: "active" }, 1 / 60);
presentation.dispose();

console.log("reviewed Triceratops candidate manifest and runtime load passed");
