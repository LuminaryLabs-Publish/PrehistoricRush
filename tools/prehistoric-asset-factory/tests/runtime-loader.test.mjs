import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { createThreePrebuiltRacerModel } from "../../../src/render/three-prebuilt-racer-model.js";

globalThis.ProgressEvent ??= class ProgressEvent extends Event {
  constructor(type, options = {}) { super(type); this.lengthComputable = Boolean(options.lengthComputable); this.loaded = options.loaded ?? 0; this.total = options.total ?? 0; }
};
const file = new URL("../../../assets/models/racers/velociraptor.glb", import.meta.url);
const bytes = await readFile(file);
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const presentation = await createThreePrebuiltRacerModel(THREE, buffer, {
  loaderModuleUrl: new URL("../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js", import.meta.url).href
});
assert.ok(presentation.object.isObject3D);
assert.deepEqual([...presentation.animations].sort(), ["ability", "idle", "run"]);
presentation.update({ speed: 15, abilityStatus: "active" }, 1 / 60);
presentation.dispose();
console.log("Prebuilt racer runtime loader passed");
