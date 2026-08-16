import {
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SEGMENTS,
  FOUNDATION_TERRAIN_PATCH_SIZE
} from "./rendering-streaming-policy.js";

const GRID_SIZE = FOUNDATION_TERRAIN_PATCH_SEGMENTS * (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) + 1;
const TERRAIN_PATCH_COUNT = (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) ** 2;
const GRASS_CAPACITY = 2048;
const GRASS_MAX_DISTANCE = 105;
const GRASS_DENSITY = 0.76;
const PREFIX = "prehistoric-rush:gpu-native";

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function centeredBounds(state = {}) {
  const centerX = Math.floor(Number(state.x ?? 0) / FOUNDATION_TERRAIN_PATCH_SIZE);
  const centerZ = Math.floor(Number(state.z ?? 0) / FOUNDATION_TERRAIN_PATCH_SIZE);
  const minPatchX = centerX - FOUNDATION_TERRAIN_ACTIVE_RADIUS;
  const minPatchZ = centerZ - FOUNDATION_TERRAIN_ACTIVE_RADIUS;
  const span = FOUNDATION_TERRAIN_PATCH_SIZE * (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1);
  return Object.freeze({ centerX, centerZ, key: `${centerX}:${centerZ}`, minX: minPatchX * FOUNDATION_TERRAIN_PATCH_SIZE, minZ: minPatchZ * FOUNDATION_TERRAIN_PATCH_SIZE, span });
}

export function buildGPUHeightfield(world, state = {}) {
  if (!world?.sampleElevation) throw new TypeError("GPU ground cover requires World sampleElevation().");
  const bounds = centeredBounds(state);
  const step = bounds.span / (GRID_SIZE - 1);
  const heights = new Float32Array(GRID_SIZE * GRID_SIZE);
  for (let zIndex = 0; zIndex < GRID_SIZE; zIndex += 1) {
    const z = bounds.minZ + zIndex * step;
    for (let xIndex = 0; xIndex < GRID_SIZE; xIndex += 1) {
      const x = bounds.minX + xIndex * step;
      heights[zIndex * GRID_SIZE + xIndex] = Number(world.sampleElevation(x, z));
    }
  }
  return Object.freeze({ bounds, gridSize: GRID_SIZE, step, heights });
}

export function createGPUWorldLayerDescriptor(recipe = {}) {
  return Object.freeze({
    id: `${PREFIX}:${recipe.id ?? "world"}`,
    seed: hashText(recipe.seed ?? recipe.id ?? "prehistoric-rush"),
    terrainPatchCount: TERRAIN_PATCH_COUNT,
    terrainGridSize: GRID_SIZE,
    grassCapacity: GRASS_CAPACITY,
    grassDensity: GRASS_DENSITY,
    grassMaxDistance: GRASS_MAX_DISTANCE,
    zeroCopy: true,
    gpuCulling: true,
    gpuLod: true,
    indirectDraw: true,
    gpuReadbackBytes: 0,
    resources: Object.freeze({
      camera: `${PREFIX}:camera`,
      terrainHeights: `${PREFIX}:terrain-heights`,
      grassParams: `${PREFIX}:grass-params`,
      grassVisible: `${PREFIX}:grass-visible`,
      grassIndirect: `${PREFIX}:grass-indirect`
    })
  });
}

const RESET_WGSL = `
@group(0) @binding(0) var<storage, read_write> args: array<atomic<u32>>;
@compute @workgroup_size(1)
fn main() {
  atomicStore(&args[0], 6u);
  atomicStore(&args[1], 0u);
  atomicStore(&args[2], 0u);
  atomicStore(&args[3], 0u);
}
`;

const GENERATE_WGSL = `
struct Params {
  seed: u32,
  capacity: u32,
  gridSize: u32,
  _pad0: u32,
  minX: f32,
  minZ: f32,
  span: f32,
  maxDistance: f32,
  playerX: f32,
  playerZ: f32,
  density: f32,
  _pad1: f32,
};
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> heights: array<f32>;
@group(0) @binding(2) var<storage, read_write> visible: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> args: array<atomic<u32>>;
fn hash32(input: u32) -> u32 {
  var x = input;
  x = x ^ (x >> 16u);
  x = x * 0x7feb352du;
  x = x ^ (x >> 15u);
  x = x * 0x846ca68bu;
  x = x ^ (x >> 16u);
  return x;
}
fn unitFloat(value: u32) -> f32 { return f32(value & 0x00ffffffu) / 16777215.0; }
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let index = id.x;
  if (index >= params.capacity) { return; }
  let hx = hash32(params.seed ^ (index * 747796405u + 2891336453u));
  let hz = hash32(params.seed ^ (index * 277803737u + 1013904223u));
  let hd = hash32(params.seed ^ (index * 1597334677u + 3812015801u));
  if (unitFloat(hd) > params.density) { return; }
  let x = params.minX + unitFloat(hx) * params.span;
  let z = params.minZ + unitFloat(hz) * params.span;
  let dx = x - params.playerX;
  let dz = z - params.playerZ;
  let distance = sqrt(dx * dx + dz * dz);
  if (distance > params.maxDistance) { return; }
  let normalizedX = clamp((x - params.minX) / params.span, 0.0, 1.0);
  let normalizedZ = clamp((z - params.minZ) / params.span, 0.0, 1.0);
  let gx = min(params.gridSize - 1u, u32(round(normalizedX * f32(params.gridSize - 1u))));
  let gz = min(params.gridSize - 1u, u32(round(normalizedZ * f32(params.gridSize - 1u))));
  let y = heights[gz * params.gridSize + gx];
  let outputIndex = atomicAdd(&args[1], 1u);
  if (outputIndex >= params.capacity) { return; }
  let lodScale = select(0.52, 1.0, distance < params.maxDistance * 0.5);
  visible[outputIndex] = vec4<f32>(x, y + 0.02, z, lodScale);
}
`;

const GRASS_WGSL = `
struct Camera { viewProjection: mat4x4<f32> };
@group(0) @binding(0) var<uniform> camera: Camera;
@group(0) @binding(1) var<storage, read> grass: array<vec4<f32>>;
struct VertexOutput { @builtin(position) position: vec4<f32>, @location(0) shade: f32 };
@vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
  let record = grass[instanceIndex];
  let local = array<vec2<f32>, 6>(
    vec2<f32>(-0.10, 0.0), vec2<f32>(0.10, 0.0), vec2<f32>(0.0, 0.95),
    vec2<f32>(-0.10, 0.0), vec2<f32>(0.0, 0.95), vec2<f32>(-0.02, 0.46)
  );
  let blade = local[vertexIndex] * record.w;
  let world = vec3<f32>(record.x + blade.x, record.y + blade.y, record.z);
  var output: VertexOutput;
  output.position = camera.viewProjection * vec4<f32>(world, 1.0);
  output.shade = record.w;
  return output;
}
@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let color = mix(vec3<f32>(0.17, 0.40, 0.14), vec3<f32>(0.36, 0.66, 0.25), input.shade);
  return vec4<f32>(color, 0.76);
}
`;

function paramsBuffer(descriptor, heightfield, state) {
  const buffer = new ArrayBuffer(48);
  const u32 = new Uint32Array(buffer);
  const f32 = new Float32Array(buffer);
  u32[0] = descriptor.seed;
  u32[1] = descriptor.grassCapacity;
  u32[2] = heightfield.gridSize;
  f32[4] = heightfield.bounds.minX;
  f32[5] = heightfield.bounds.minZ;
  f32[6] = heightfield.bounds.span;
  f32[7] = descriptor.grassMaxDistance;
  f32[8] = Number(state.x ?? 0);
  f32[9] = Number(state.z ?? 0);
  f32[10] = descriptor.grassDensity;
  return new Uint8Array(buffer);
}

function cameraBuffer(camera) {
  camera.updateMatrixWorld?.();
  const matrix = camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse);
  return new Float32Array(matrix.elements);
}

export async function createPrehistoricRushGPUGroundCover({ hostElement, world, recipe, gpuHost, computeHost, renderProvider, onProgress = () => {} } = {}) {
  if (!hostElement || !world || !recipe || !gpuHost || !computeHost || !renderProvider) throw new TypeError("GPU ground cover requires hostElement, World, recipe, shared GPU Host, Compute Host, and WebGPU Render provider.");
  const descriptor = createGPUWorldLayerDescriptor(recipe);
  const canvas = document.createElement("canvas");
  canvas.dataset.prehistoricGpuNative = "ground-cover";
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "2" });
  hostElement.append(canvas);

  let disposed = false;
  let framePending = false;
  let heightfield = null;
  let heightfieldKey = null;
  let uploadedBytes = 0;
  let computeDispatches = 0;
  let renderSubmissions = 0;
  let skippedFrames = 0;
  let frameSequence = 0;
  let lastError = null;

  function resize() {
    const ratio = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor((hostElement.clientWidth || innerWidth || 1) * ratio));
    const height = Math.max(1, Math.floor((hostElement.clientHeight || innerHeight || 1) * ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  }

  resize();
  await renderProvider.initialize({ canvas, format: "bgra8unorm", alphaMode: "premultiplied" });

  async function ensureHeightfield(state) {
    const next = buildGPUHeightfield(world, state);
    if (heightfieldKey === next.bounds.key) return false;
    heightfield = next;
    heightfieldKey = next.bounds.key;
    await gpuHost.ensureResource({ id: descriptor.resources.terrainHeights, type: "buffer", byteLength: next.heights.byteLength, usage: ["storage", "copy-dst"], metadata: { product: "PrehistoricRush", role: "foundation-heightfield" } }, next.heights);
    uploadedBytes += next.heights.byteLength;
    return true;
  }

  async function ensureStaticResources(state) {
    const params = paramsBuffer(descriptor, heightfield, state);
    await gpuHost.ensureResource({ id: descriptor.resources.grassParams, type: "buffer", byteLength: params.byteLength, usage: ["uniform", "copy-dst"] }, params);
    await gpuHost.ensureResource({ id: descriptor.resources.grassVisible, type: "buffer", byteLength: descriptor.grassCapacity * 16, usage: ["storage"] });
    await gpuHost.ensureResource({ id: descriptor.resources.grassIndirect, type: "buffer", byteLength: 16, usage: ["storage", "indirect"] });
    uploadedBytes += params.byteLength;
  }

  async function computeGrass(state) {
    const params = paramsBuffer(descriptor, heightfield, state);
    await gpuHost.ensureResource({ id: descriptor.resources.grassParams, type: "buffer", byteLength: params.byteLength, usage: ["uniform", "copy-dst"] }, params);
    uploadedBytes += params.byteLength;
    await computeHost.executeGraph({
      graph: { id: "prehistoric-rush-gpu-ground-cover", nodes: [
        { id: "reset", kernelId: "reset", bindings: [descriptor.resources.grassIndirect], writes: [descriptor.resources.grassIndirect], dispatch: { x: 1, y: 1, z: 1 } },
        { id: "generate", kernelId: "generate", bindings: [descriptor.resources.grassParams, descriptor.resources.terrainHeights, descriptor.resources.grassVisible, descriptor.resources.grassIndirect], reads: [descriptor.resources.grassParams, descriptor.resources.terrainHeights], writes: [descriptor.resources.grassVisible, descriptor.resources.grassIndirect], dispatch: { x: Math.ceil(descriptor.grassCapacity / 64), y: 1, z: 1 } }
      ] },
      executionOrder: ["reset", "generate"],
      kernels: { reset: { id: "reset", entryPoint: "main", source: RESET_WGSL }, generate: { id: "generate", entryPoint: "main", source: GENERATE_WGSL } },
      buffers: {
        [descriptor.resources.grassParams]: { byteLength: 48, usage: ["uniform"] },
        [descriptor.resources.terrainHeights]: { byteLength: heightfield.heights.byteLength, usage: ["storage"] },
        [descriptor.resources.grassVisible]: { byteLength: descriptor.grassCapacity * 16, usage: ["storage"] },
        [descriptor.resources.grassIndirect]: { byteLength: 16, usage: ["storage", "indirect"] }
      }
    }, { requiredBackend: "webgpu", requiredFeatures: ["shared-gpu-host"], allowFallback: false });
    computeDispatches += 2;
  }

  async function renderGrass(camera) {
    const cameraData = cameraBuffer(camera);
    await gpuHost.ensureResource({ id: descriptor.resources.camera, type: "buffer", byteLength: cameraData.byteLength, usage: ["uniform", "copy-dst"] }, cameraData);
    uploadedBytes += cameraData.byteLength;
    await renderProvider.executePass({
      id: "prehistoric-rush-gpu-ground-cover-pass",
      pipeline: {
        id: "prehistoric-rush-gpu-ground-cover-pipeline",
        source: GRASS_WGSL,
        vertex: { entryPoint: "vs_main", buffers: [] },
        fragment: { entryPoint: "fs_main", targets: [{
          format: "bgra8unorm",
          blend: {
            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
            alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }
          }
        }] },
        primitive: { topology: "triangle-list", cullMode: "none" }
      },
      bindings: [
        { group: 0, binding: 0, resourceId: descriptor.resources.camera },
        { group: 0, binding: 1, resourceId: descriptor.resources.grassVisible }
      ],
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      loadOp: "clear",
      storeOp: "store",
      draw : { indirect: { resourceId: descriptor.resources.grassIndirect, offset: 0 } }
    });
    renderSubmissions += 1;
  }

  await ensureHeightfield({ x: 0, z: 0 });
  await ensureStaticResources({ x: 0, z: 0 });
  await computeGrass({ x: 0, z: 0 });
  onProgress(1, "Nexus GPU ground cover ready");

  function scheduleFrame({ state, camera } = {}) {
    if (disposed || !state || !camera) return;
    if (framePending) { skippedFrames += 1; return; }
    framePending = true;
    Promise.resolve().then(async () => {
      resize();
      const terrainChanged = await ensureHeightfield(state);
      if (terrainChanged || frameSequence % 4 === 0) await computeGrass(state);
      await renderGrass(camera);
      frameSequence += 1;
    }).catch((error) => {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error("PrehistoricRush GPU ground cover failed:", lastError);
    }).finally(() => { framePending = false; });
  }

  function snapshot() {
    return Object.freeze({
      active: !disposed && !lastError,
      backend: "webgpu",
      mode: "shared-gpu-ground-cover",
      sharedDeviceId: gpuHost.getDeviceDescriptor()?.id ?? null,
      terrainAuthority: "n:world:foundation",
      terrainHeightfieldResident: Boolean(gpuHost.getResource(descriptor.resources.terrainHeights)),
      terrainPatchCount: descriptor.terrainPatchCount,
      grassLogicalCount: descriptor.grassCapacity,
      gpuCulling: true,
      gpuLod: true,
      indirectDraw: true,
      zeroCopy: true,
      computeDispatches,
      renderSubmissions,
      frameSequence,
      skippedFrames,
      uploadedBytes,
      gpuReadbackBytes: 0,
      resourceCount: gpuHost.listResources().length,
      error: lastError?.message ?? null
    });
  }

  return Object.freeze({
    active: true,
    canvas,
    descriptor,
    scheduleFrame,
    resize,
    snapshot,
    dispose() {
      disposed = true;
      canvas.remove();
      for (const resourceId of Object.values(descriptor.resources)) {
        if (!gpuHost.getResource(resourceId)) continue;
        try { gpuHost.evictResource(resourceId); } catch {}
      }
    }
  });
}
