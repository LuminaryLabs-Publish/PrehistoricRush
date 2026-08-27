import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as THREE from "three";

const root = new URL("../../../", import.meta.url);
const modelRoot = new URL("assets/models/", root);
const evidenceRoot = new URL("validation/model-factory/", root);
await mkdir(evidenceRoot, { recursive: true });
const manifest = JSON.parse(await readFile(new URL("manifest.json", modelRoot), "utf8"));
const { loadGltfFromFile } = await import("@headless-three/renderer");
const results = [];

for (const asset of manifest.assets) {
  const url = new URL(asset.url.replace(/^\.\//, ""), modelRoot);
  const buffer = await readFile(url);
  const loadStartedAt = performance.now();
  const gltf = await loadGltfFromFile(fileURLToPath(url));
  const loadMs = performance.now() - loadStartedAt;
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  let meshes = 0;
  let vertices = 0;
  let invalidNormals = 0;
  gltf.scene.traverse((node) => {
    if (!node.isMesh) return;
    meshes += 1;
    const positions = node.geometry.getAttribute("position");
    const normals = node.geometry.getAttribute("normal");
    vertices += positions?.count ?? 0;
    if (!normals || normals.count !== positions?.count) invalidNormals += positions?.count ?? 1;
    else for (let index = 0; index < normals.count; index += 1) {
      const length = Math.hypot(normals.getX(index), normals.getY(index), normals.getZ(index));
      if (!Number.isFinite(length) || length < 0.7 || length > 1.3) invalidNormals += 1;
    }
  });
  const failures = [];
  if (createHash("sha256").update(buffer).digest("hex") !== asset.sha256) failures.push("digest-mismatch");
  if (meshes < 3 || vertices < 300) failures.push("geometry-detail");
  if (invalidNormals) failures.push("invalid-normals");
  if (gltf.animations.length !== asset.animations.length) failures.push("animation-count");
  if (box.min.y < -0.002) failures.push("ground-contact");
  if (![size.x, size.y, size.z].every((value) => Number.isFinite(value) && value > 0)) failures.push("bounds");
  results.push({ id: asset.id, kind: asset.kind, status: failures.length ? "FAIL" : "PASS", failures, bytes: buffer.length, loadMs, meshes, vertices, invalidNormals, animationClips: gltf.animations.map((clip) => clip.name), bounds: { min: box.min.toArray(), max: box.max.toArray(), size: size.toArray() } });
}

const totalBytes = results.reduce((sum, entry) => sum + entry.bytes, 0);
const maximumBytes = Math.max(...results.map((entry) => entry.bytes));
const maximumLoadMs = Math.max(...results.map((entry) => entry.loadMs));
const totalLoadMs = results.reduce((sum, entry) => sum + entry.loadMs, 0);
const report = {
  schema: "prehistoric-rush.model-validation/1",
  status: results.every((entry) => entry.status === "PASS") ? "PASS" : "FAIL",
  expected: manifest.assetCount,
  validated: results.length,
  rendererLoader: "@headless-three/renderer.loadGltfFromFile",
  performance: {
    totalBytes,
    maximumBytes,
    totalLoadMs,
    maximumLoadMs,
    budgets: { selectedRacerMaximumBytes: 524288, fullCatalogMaximumBytes: 12582912, advisoryMaximumHeadlessLoadMs: 250 },
    selectedRacersWithinByteBudget: results.filter((entry) => entry.kind === "racer").every((entry) => entry.bytes <= 524288),
    catalogWithinByteBudget: totalBytes <= 12582912,
    headlessLoadAdvisoryPassed: maximumLoadMs <= 250
  },
  results
};
if (!report.performance.selectedRacersWithinByteBudget || !report.performance.catalogWithinByteBudget) report.status = "FAIL";
await writeFile(new URL("mesh-integrity-report.json", evidenceRoot), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, validated: report.validated }, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
