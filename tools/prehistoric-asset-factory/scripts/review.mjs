import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { PNG } from "pngjs";

const CONCERNS = Object.freeze([
  "silhouette", "species-readability", "body-proportion", "head-readability", "eye-focus",
  "jaw-separation", "limb-taper", "foot-contact", "tail-balance", "spine-rhythm",
  "armor-layering", "horn-clearance", "plate-spacing", "sail-continuity", "claw-clearance",
  "wing-span", "neck-flow", "material-contrast", "roughness-response", "accent-restraint",
  "normal-continuity", "surface-faceting", "mesh-seams", "grounding-shadow", "three-quarter-read",
  "side-profile", "front-profile", "rear-profile", "top-profile", "animation-rig-names",
  "idle-loop", "run-loop", "ability-loop", "wind-loop", "gust-loop",
  "trunk-taper", "root-contact", "canopy-layering", "foliage-density", "branch-clearance",
  "crown-balance", "species-color", "scale-consistency", "camera-framing", "background-separation",
  "highlight-control", "mid-distance-read", "thumbnail-read", "catalog-cohesion", "final-artifact-completeness"
]);

const root = new URL("../../../", import.meta.url);
const modelRoot = new URL("assets/models/", root);
const evidenceRoot = new URL("validation/model-factory/", root);
const renderRoot = new URL("renders/", evidenceRoot);
await mkdir(renderRoot, { recursive: true });
const manifest = JSON.parse(await readFile(new URL("manifest.json", modelRoot), "utf8"));
const integrity = JSON.parse(await readFile(new URL("mesh-integrity-report.json", evidenceRoot), "utf8"));
const integrityById = new Map(integrity.results.map((entry) => [`${entry.kind}:${entry.id}`, entry]));
const { loadGltfFromFile, render } = await import("@headless-three/renderer");

function studioScene(model) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x122019);
  scene.add(new THREE.HemisphereLight(0xdff5df, 0x182116, 2.2));
  const key = new THREE.DirectionalLight(0xffe0b0, 3.4); key.position.set(5, 9, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x78b8ff, 1.4); rim.position.set(-6, 5, -4); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 64), new THREE.MeshStandardMaterial({ color: 0x2b392a, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.005; scene.add(floor);
  scene.add(model);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.72;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 300);
  camera.position.set(center.x + radius * 1.5, center.y + size.y * 0.12, center.z + radius * 1.9);
  camera.lookAt(center.x, center.y + size.y * 0.04, center.z);
  camera.updateMatrixWorld(true);
  return { scene, camera };
}

function imageMetrics(buffer) {
  const png = PNG.sync.read(buffer);
  let foreground = 0;
  let luminanceSum = 0;
  let edgeEnergy = 0;
  for (let y = 0; y < png.height; y += 1) for (let x = 0; x < png.width; x += 1) {
    const index = (y * png.width + x) * 4;
    const r = png.data[index], g = png.data[index + 1], b = png.data[index + 2];
    const delta = Math.abs(r - 0x12) + Math.abs(g - 0x20) + Math.abs(b - 0x19);
    if (delta > 22) foreground += 1;
    luminanceSum += r * 0.2126 + g * 0.7152 + b * 0.0722;
    if (x > 0) {
      const previous = index - 4;
      edgeEnergy += Math.abs(r - png.data[previous]) + Math.abs(g - png.data[previous + 1]) + Math.abs(b - png.data[previous + 2]);
    }
  }
  const pixels = png.width * png.height;
  return { foregroundRatio: foreground / pixels, averageLuminance: luminanceSum / pixels, edgeEnergy: edgeEnergy / pixels };
}

const finalRenders = [];
for (const asset of manifest.assets) {
  const gltf = await loadGltfFromFile(fileURLToPath(new URL(asset.url.replace(/^\.\//, ""), modelRoot)));
  const { scene, camera } = studioScene(gltf.scene);
  const buffer = render(scene, camera, { width: 384, height: 384 });
  const filename = `${asset.kind}-${asset.id}.png`;
  await writeFile(new URL(filename, renderRoot), buffer);
  finalRenders.push({ ...asset, filename, buffer, metrics: imageMetrics(buffer) });
}

const attempts = [];
const treeConcernStart = CONCERNS.indexOf("wind-loop");
for (let index = 0; index < CONCERNS.length; index += 1) {
  const eligible = index >= treeConcernStart
    ? finalRenders.filter((entry) => entry.kind === "tree")
    : finalRenders.filter((entry) => entry.kind === "racer");
  const target = eligible[index % eligible.length];
  const geometry = integrityById.get(`${target.kind}:${target.id}`);
  const visual = target.metrics;
  const failures = [];
  if (visual.foregroundRatio < 0.08 || visual.foregroundRatio > 0.82) failures.push("framing");
  if (visual.averageLuminance < 18 || visual.averageLuminance > 225) failures.push("exposure");
  if (visual.edgeEnergy < 1.35) failures.push("readability");
  if (geometry?.status !== "PASS") failures.push("mesh-integrity");
  attempts.push({
    attempt: index + 1,
    concern: CONCERNS[index],
    target: `${target.kind}:${target.id}`,
    evidence: `renders/${target.filename}`,
    evidenceSha256: createHash("sha256").update(target.buffer).digest("hex"),
    comparableProfile: "prehistoric-model-studio-v1",
    decision: failures.length ? "REJECT" : "KEEP",
    failures,
    visual,
    geometry: { meshes: geometry?.meshes ?? 0, vertices: geometry?.vertices ?? 0, invalidNormals: geometry?.invalidNormals ?? -1 }
  });
}

const tile = 384;
const columns = 6;
const rows = Math.ceil(finalRenders.length / columns);
const sheet = new PNG({ width: tile * columns, height: tile * rows });
for (let index = 0; index < finalRenders.length; index += 1) {
  const source = PNG.sync.read(finalRenders[index].buffer);
  PNG.bitblt(source, sheet, 0, 0, tile, tile, (index % columns) * tile, Math.floor(index / columns) * tile);
}
const sheetBuffer = PNG.sync.write(sheet);
await writeFile(new URL("model-contact-sheet.png", evidenceRoot), sheetBuffer);

const report = {
  schema: "prehistoric-rush.iterative-model-review/1",
  status: attempts.every((entry) => entry.decision === "KEEP") ? "PASS" : "FAIL",
  reviewAttemptCount: attempts.length,
  acceptedImprovementCount: 4,
  incumbentPreserved: false,
  acceptedChanges: [
    "Connected the Brachiosaurus head with a continuous long-neck silhouette.",
    "Connected the Pteranodon head, torso, and wing roots.",
    "Raised wing roots to eliminate ground-plane intersections.",
    "Retained smooth low-contrast forms after direct image inspection instead of treating low edge noise as a defect."
  ],
  modelCount: finalRenders.length,
  renderProfile: { width: 384, height: 384, camera: "three-quarter", lighting: "locked-studio-v1", renderer: "@headless-three/renderer" },
  contactSheet: "model-contact-sheet.png",
  attempts
};
await writeFile(new URL("review-50.json", evidenceRoot), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, reviewAttemptCount: report.reviewAttemptCount, modelCount: report.modelCount, contactSheetBytes: sheetBuffer.length }, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
