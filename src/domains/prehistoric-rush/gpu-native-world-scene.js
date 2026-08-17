import {
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SEGMENTS,
  FOUNDATION_TERRAIN_PATCH_SIZE
} from "./rendering-streaming-policy.js";

const GRID_SIZE = FOUNDATION_TERRAIN_PATCH_SEGMENTS * (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) + 1;
const TERRAIN_PATCH_COUNT = (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) ** 2;
const GRASS_CAPACITY = 2048;
const TREE_SLOT_CAPACITY = 320;
const TREE_LOD_COUNT = 2;
const TREE_NEAR_DISTANCE = 72;
const TREE_MAX_DISTANCE = 250;
const PREFIX = "prehistoric-rush:gpu-world";

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

function buildHeightfield(world, state = {}) {
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

function cameraBuffer(camera, elapsed = 0, exposure = 1) {
  camera.updateMatrixWorld?.();
  const matrix = camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse);
  const output = new Float32Array(24);
  output.set(matrix.elements, 0);
  output[16] = Number(camera.position?.x ?? 0);
  output[17] = Number(camera.position?.y ?? 0);
  output[18] = Number(camera.position?.z ?? 0);
  output[20] = 0.0062;
  output[21] = Number(elapsed) || 0;
  output[22] = Number(exposure) || 1;
  return output;
}

function terrainParams(heightfield) {
  const output = new ArrayBuffer(32);
  const u32 = new Uint32Array(output);
  const f32 = new Float32Array(output);
  u32[0] = heightfield.gridSize;
  f32[1] = heightfield.bounds.minX;
  f32[2] = heightfield.bounds.minZ;
  f32[3] = heightfield.step;
  f32[4] = heightfield.bounds.span;
  return new Uint8Array(output);
}

function grassParams(seed, heightfield, state) {
  const output = new ArrayBuffer(48);
  const u32 = new Uint32Array(output);
  const f32 = new Float32Array(output);
  u32[0] = seed;
  u32[1] = GRASS_CAPACITY;
  u32[2] = heightfield.gridSize;
  f32[4] = heightfield.bounds.minX;
  f32[5] = heightfield.bounds.minZ;
  f32[6] = heightfield.bounds.span;
  f32[7] = 105;
  f32[8] = Number(state.x ?? 0);
  f32[9] = Number(state.z ?? 0);
  f32[10] = 0.76;
  return new Uint8Array(output);
}

function combinedBounds(trunk, crown) {
  const min = [0, 1, 2].map((axis) => Math.min(Number(trunk.bounds.min[axis]), Number(crown.bounds.min[axis])));
  const max = [0, 1, 2].map((axis) => Math.max(Number(trunk.bounds.max[axis]), Number(crown.bounds.max[axis])));
  const center = min.map((value, axis) => (value + max[axis]) * 0.5);
  const size = min.map((value, axis) => max[axis] - value);
  return { min, max, center, size };
}

function treeModelMatrix(record, packageValue) {
  const variation = record.trunk.metadata?.variation ?? record.crown.metadata?.variation ?? {};
  const bounds = record.bounds;
  const source = packageValue?.source?.bounds ?? {};
  const sourceSize = source.size ?? [source.width ?? 1, source.height ?? 1, source.depth ?? source.width ?? 1];
  const sx = bounds.size[0] / Math.max(0.001, Number(sourceSize[0] ?? 1));
  const sy = bounds.size[1] / Math.max(0.001, Number(sourceSize[1] ?? 1));
  const sz = bounds.size[2] / Math.max(0.001, Number(sourceSize[2] ?? 1));
  const yaw = Number(variation.yawRadians ?? 0);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
  return [
    c * sx, 0, -s * sx, 0,
    0, sy, 0, 0,
    s * sz, 0, c * sz, 0,
    Number(ground[0]), Number(ground[1]), Number(ground[2]), 1
  ];
}

function flattenTreeInput(denseState) {
  const packages = denseState.treePackages ?? [];
  const records = [];
  const patches = [...(denseState.forestPatches ?? [])].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const patch of patches) {
    patch.trees.forEach((treeSet, typeIndex) => {
      const packageValue = packages[typeIndex];
      if (!packageValue) return;
      const count = Math.min(treeSet.trunks.length, treeSet.crowns.length);
      for (let index = 0; index < count; index += 1) {
        const trunk = treeSet.trunks[index];
        const crown = treeSet.crowns[index];
        const bounds = combinedBounds(trunk, crown);
        const matrix = treeModelMatrix({ trunk, crown, bounds }, packageValue);
        const tint = trunk.metadata?.variation?.tint ?? crown.metadata?.variation?.tint ?? [1, 1, 1];
        const radius = Math.max(bounds.size[0], bounds.size[1], bounds.size[2]) * 0.5;
        records.push({ matrix, tint, typeIndex, center: bounds.center, radius });
      }
    });
  }
  const output = new Float32Array(records.length * 24);
  records.forEach((record, index) => {
    const offset = index * 24;
    output.set(record.matrix, offset);
    output[offset + 16] = Number(record.tint[0] ?? 1);
    output[offset + 17] = Number(record.tint[1] ?? 1);
    output[offset + 18] = Number(record.tint[2] ?? 1);
    output[offset + 19] = record.typeIndex;
    output[offset + 20] = record.center[0];
    output[offset + 21] = record.center[1];
    output[offset + 22] = record.center[2];
    output[offset + 23] = record.radius;
  });
  return { data: output, count: records.length };
}

function treeParams(treeCount, speciesCount, state) {
  const output = new ArrayBuffer(32);
  const u32 = new Uint32Array(output);
  const f32 = new Float32Array(output);
  u32[0] = treeCount;
  u32[1] = speciesCount;
  u32[2] = TREE_SLOT_CAPACITY;
  u32[3] = speciesCount * TREE_LOD_COUNT;
  f32[4] = Number(state.x ?? 0);
  f32[5] = Number(state.z ?? 0);
  f32[6] = TREE_NEAR_DISTANCE;
  f32[7] = TREE_MAX_DISTANCE;
  return new Uint8Array(output);
}

function expandedGeometry(portable = {}) {
  const positions = portable.positions ?? [];
  const indices = portable.indices ?? [];
  const normal = portable.attributes?.normal?.values ?? null;
  const color = portable.attributes?.color?.values ?? null;
  const output = new Float32Array(indices.length * 9);
  for (let index = 0; index < indices.length; index += 1) {
    const sourceIndex = Number(indices[index]);
    const target = index * 9;
    output[target] = Number(positions[sourceIndex * 3] ?? 0);
    output[target + 1] = Number(positions[sourceIndex * 3 + 1] ?? 0);
    output[target + 2] = Number(positions[sourceIndex * 3 + 2] ?? 0);
    output[target + 3] = Number(normal?.[sourceIndex * 3] ?? 0);
    output[target + 4] = Number(normal?.[sourceIndex * 3 + 1] ?? 1);
    output[target + 5] = Number(normal?.[sourceIndex * 3 + 2] ?? 0);
    output[target + 6] = Number(color?.[sourceIndex * 3] ?? 0.34);
    output[target + 7] = Number(color?.[sourceIndex * 3 + 1] ?? 0.58);
    output[target + 8] = Number(color?.[sourceIndex * 3 + 2] ?? 0.28);
  }
  return output;
}

const GRASS_RESET_WGSL = `
@group(0) @binding(0) var<storage, read_write> args: array<atomic<u32>>;
@compute @workgroup_size(1) fn main() {
  atomicStore(&args[0], 6u); atomicStore(&args[1], 0u); atomicStore(&args[2], 0u); atomicStore(&args[3], 0u);
}`;

const GRASS_GENERATE_WGSL = `
struct Params { seed:u32, capacity:u32, gridSize:u32, pad:u32, minX:f32, minZ:f32, span:f32, maxDistance:f32, playerX:f32, playerZ:f32, density:f32, pad2:f32 };
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> heights: array<f32>;
@group(0) @binding(2) var<storage, read_write> visible: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> args: array<atomic<u32>>;
fn hash32(input:u32)->u32 { var x=input; x=x^(x>>16u); x=x*0x7feb352du; x=x^(x>>15u); x=x*0x846ca68bu; return x^(x>>16u); }
fn unitFloat(v:u32)->f32 { return f32(v & 0x00ffffffu)/16777215.0; }
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>) {
  let index=id.x; if(index>=params.capacity){return;}
  let x=params.minX+unitFloat(hash32(params.seed^(index*747796405u+2891336453u)))*params.span;
  let z=params.minZ+unitFloat(hash32(params.seed^(index*277803737u+1013904223u)))*params.span;
  if(unitFloat(hash32(params.seed^(index*1597334677u+3812015801u)))>params.density){return;}
  let dx=x-params.playerX; let dz=z-params.playerZ; let distance=sqrt(dx*dx+dz*dz); if(distance>params.maxDistance){return;}
  let gx=min(params.gridSize-1u,u32(round(clamp((x-params.minX)/params.span,0.0,1.0)*f32(params.gridSize-1u))));
  let gz=min(params.gridSize-1u,u32(round(clamp((z-params.minZ)/params.span,0.0,1.0)*f32(params.gridSize-1u))));
  let y=heights[gz*params.gridSize+gx]; let outputIndex=atomicAdd(&args[1],1u); if(outputIndex>=params.capacity){return;}
  visible[outputIndex]=vec4<f32>(x,y+0.02,z,select(0.52,1.0,distance<params.maxDistance*0.5));
}`;

const TREE_RESET_WGSL = `
@group(0) @binding(0) var<storage, read_write> args: array<atomic<u32>>;
@group(0) @binding(1) var<storage, read> vertexCounts: array<u32>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>) {
  let slot=id.x; if(slot>=arrayLength(&vertexCounts)){return;} let base=slot*4u;
  atomicStore(&args[base],vertexCounts[slot]); atomicStore(&args[base+1u],0u); atomicStore(&args[base+2u],0u); atomicStore(&args[base+3u],slot*${TREE_SLOT_CAPACITY}u);
}`;

const TREE_CULL_WGSL = `
struct TreeInput { m0:vec4<f32>, m1:vec4<f32>, m2:vec4<f32>, m3:vec4<f32>, tintType:vec4<f32>, centerRadius:vec4<f32> };
struct TreeInstance { m0:vec4<f32>, m1:vec4<f32>, m2:vec4<f32>, m3:vec4<f32>, tint:vec4<f32> };
struct Params { treeCount:u32, speciesCount:u32, slotCapacity:u32, slotCount:u32, playerX:f32, playerZ:f32, nearDistance:f32, maxDistance:f32 };
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> inputTrees: array<TreeInput>;
@group(0) @binding(2) var<storage, read_write> visibleTrees: array<TreeInstance>;
@group(0) @binding(3) var<storage, read_write> args: array<atomic<u32>>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>) {
  let index=id.x; if(index>=params.treeCount){return;} let tree=inputTrees[index];
  let dx=tree.centerRadius.x-params.playerX; let dz=tree.centerRadius.z-params.playerZ; let distance=sqrt(dx*dx+dz*dz); if(distance>params.maxDistance){return;}
  let typeIndex=min(params.speciesCount-1u,u32(max(0.0,tree.tintType.w))); let lod=select(1u,0u,distance<params.nearDistance); let slot=typeIndex*2u+lod; let base=slot*4u;
  let outputIndex=atomicAdd(&args[base+1u],1u); if(outputIndex>=params.slotCapacity){return;} let outputSlotIndex=slot*params.slotCapacity+outputIndex;
  visibleTrees[outputSlotIndex]=TreeInstance(tree.m0,tree.m1,tree.m2,tree.m3,vec4<f32>(tree.tintType.xyz,1.0));
}`;

const COMMON_CAMERA = `
struct Camera { viewProjection:mat4x4<f32>, cameraPosition:vec4<f32>, fog:vec4<f32> };
@group(0) @binding(0) var<uniform> camera:Camera;
fn hash21(p:vec2<f32>)->f32 { return fract(sin(dot(p,vec2<f32>(127.1,311.7)))*43758.5453); }
fn surfaceNoise(p:vec2<f32>)->f32 {
  let i=floor(p); let f=fract(p); let u=f*f*(vec2<f32>(3.0)-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2<f32>(1.0,0.0)),u.x),mix(hash21(i+vec2<f32>(0.0,1.0)),hash21(i+vec2<f32>(1.0,1.0)),u.x),u.y);
}
fn filmicGrade(input:vec3<f32>)->vec3<f32> {
  var color=max(vec3<f32>(0.0),input-vec3<f32>(0.004));
  color=(color*(6.2*color+vec3<f32>(0.5)))/(color*(6.2*color+vec3<f32>(1.7))+vec3<f32>(0.06));
  let luma=dot(color,vec3<f32>(0.2126,0.7152,0.0722));
  return clamp(mix(vec3<f32>(luma),color,1.08)*vec3<f32>(1.025,1.015,0.975)*camera.fog.z,vec3<f32>(0.0),vec3<f32>(1.0));
}`;
const TERRAIN_WGSL = `${COMMON_CAMERA}
struct Terrain { gridSize:u32, minX:f32, minZ:f32, step:f32, span:f32, pad0:f32, pad1:f32, pad2:f32 };
@group(0) @binding(1) var<uniform> terrain:Terrain; @group(0) @binding(2) var<storage,read> heights:array<f32>;
struct Out { @builtin(position) position:vec4<f32>, @location(0) baseColor:vec3<f32>, @location(1) worldPos:vec3<f32> };
fn point(index:u32)->vec3<f32>{ let cells=terrain.gridSize-1u; let tri=index/3u; let corner=index%3u; let cell=tri/2u; let which=tri%2u; let cx=cell%cells; let cz=cell/cells; var ox=0u; var oz=0u;
 if(which==0u){ if(corner==1u){ox=1u;} if(corner==2u){oz=1u;} } else { if(corner==0u){ox=1u;} if(corner==1u){ox=1u;oz=1u;} if(corner==2u){oz=1u;} }
 let gx=cx+ox; let gz=cz+oz; return vec3<f32>(terrain.minX+f32(gx)*terrain.step,heights[gz*terrain.gridSize+gx],terrain.minZ+f32(gz)*terrain.step); }
@vertex fn vs_main(@builtin(vertex_index) index:u32)->Out{ let p=point(index); var out:Out; out.position=camera.viewProjection*vec4<f32>(p,1.0); let e=clamp((p.y+55.0)/150.0,0.0,1.0); let base=mix(vec3<f32>(0.12,0.27,0.12),vec3<f32>(0.39,0.43,0.27),e); let wet=clamp(0.17+sin(p.x*0.016+p.z*0.011)*0.1,0.0,0.34); out.baseColor=mix(base,vec3<f32>(0.10,0.22,0.13),wet); out.worldPos=p; return out; }
@fragment fn fs_main(input:Out)->@location(0) vec4<f32>{
  let normal=normalize(cross(dpdy(input.worldPos),dpdx(input.worldPos)));
  let slope=1.0-clamp(abs(normal.y),0.0,1.0);
  let macro=surfaceNoise(input.worldPos.xz*0.035);
  let detail=surfaceNoise(input.worldPos.xz*0.42+vec2<f32>(7.2,-4.1));
  let moss=smoothstep(0.48,0.78,macro)*(1.0-slope);
  let rock=smoothstep(0.3,0.78,slope+detail*0.24);
  var color=input.baseColor*mix(0.84,1.14,macro);
  color=mix(color,vec3<f32>(0.14,0.34,0.13)*mix(0.82,1.18,detail),moss*0.48);
  color=mix(color,vec3<f32>(0.31,0.34,0.29)*mix(0.84,1.12,detail),rock*0.5);
  let sun=max(0.0,dot(normal,normalize(vec3<f32>(-0.35,0.83,-0.28))));
  let contactAO=mix(0.72,1.0,smoothstep(0.1,0.68,abs(normal.y)));
  color*=contactAO*(0.58+sun*0.72);
  let d=distance(camera.cameraPosition.xyz,input.worldPos); let fog=1.0-exp(-camera.fog.x*camera.fog.x*d*d);
  color=mix(color,vec3<f32>(0.52,0.68,0.59),clamp(fog,0.0,0.94)); return vec4<f32>(filmicGrade(color),1.0); }`;

const TREE_WGSL = `${COMMON_CAMERA}
struct Instance { m0:vec4<f32>, m1:vec4<f32>, m2:vec4<f32>, m3:vec4<f32>, tint:vec4<f32> }; @group(0) @binding(1) var<storage,read> instances:array<Instance>;
struct Out { @builtin(position) position:vec4<f32>, @location(0) color:vec3<f32>, @location(1) normal:vec3<f32>, @location(2) worldPos:vec3<f32>, @location(3) localPos:vec3<f32> };
@vertex fn vs_main(@location(0) sourceP:vec3<f32>,@location(1) n:vec3<f32>,@location(2) c:vec3<f32>,@builtin(instance_index) instanceIndex:u32)->Out {
  let i=instances[instanceIndex]; let model=mat4x4<f32>(i.m0,i.m1,i.m2,i.m3); var p=sourceP;
  let heightWeight=smoothstep(0.3,14.0,max(0.0,p.y)); let phase=i.m3.x*0.021+i.m3.z*0.017;
  let trunkSway=sin(camera.fog.y*0.31+phase)*0.055*heightWeight;
  let leafFlutter=sin(camera.fog.y*1.53+dot(p,vec3<f32>(0.37,0.19,0.29))+phase)*0.016*heightWeight;
  p.x+=trunkSway+leafFlutter; p.z+=trunkSway*0.34-leafFlutter*0.58;
  let wp=model*vec4<f32>(p,1.0); var out:Out; out.position=camera.viewProjection*wp; out.worldPos=wp.xyz; out.localPos=sourceP; out.normal=normalize((model*vec4<f32>(n,0.0)).xyz); out.color=c*i.tint.xyz; return out; }
@fragment fn fs_main(input:Out)->@location(0) vec4<f32>{
  let foliage=smoothstep(0.015,0.11,input.color.g-max(input.color.r,input.color.b));
  let grain=surfaceNoise(input.localPos.xy*vec2<f32>(2.8,0.44)+input.localPos.zy*0.17);
  let ridges=sin(input.localPos.y*8.5+grain*7.0)*0.5+0.5;
  let baseAO=mix(0.58,1.0,smoothstep(0.0,3.6,input.localPos.y));
  let bark=input.color*mix(0.68,1.18,grain*0.58+ridges*0.42)*baseAO;
  let leaf=input.color*mix(0.76,1.18,surfaceNoise(input.localPos.xz*0.62));
  let n=normalize(input.normal); let sun=max(0.0,dot(n,normalize(vec3<f32>(-0.35,0.83,-0.28))));
  let back=max(0.0,dot(-n,normalize(vec3<f32>(-0.35,0.83,-0.28))));
  var color=mix(bark,leaf,foliage)*(0.46+sun*0.72)+leaf*vec3<f32>(1.05,1.18,0.7)*back*foliage*0.18;
  let d=distance(camera.cameraPosition.xyz,input.worldPos); let fog=1.0-exp(-camera.fog.x*camera.fog.x*d*d); color=mix(color,vec3<f32>(0.52,0.68,0.59),clamp(fog,0.0,0.94)); return vec4<f32>(filmicGrade(color),1.0); }`;

const GRASS_WGSL = `${COMMON_CAMERA}
@group(0) @binding(1) var<storage,read> grass:array<vec4<f32>>; struct Out{@builtin(position) position:vec4<f32>,@location(0) shade:f32,@location(1) worldPos:vec3<f32>,@location(2) height:f32};
@vertex fn vs_main(@builtin(vertex_index) vertexIndex:u32,@builtin(instance_index) instanceIndex:u32)->Out {
  let record=grass[instanceIndex]; let local=array<vec2<f32>,6>(vec2<f32>(-0.10,0.0),vec2<f32>(0.10,0.0),vec2<f32>(0.0,0.95),vec2<f32>(-0.10,0.0),vec2<f32>(0.0,0.95),vec2<f32>(-0.02,0.46)); var blade=local[vertexIndex]*record.w;
  let phase=record.x*0.071+record.z*0.053; blade.x+=sin(camera.fog.y*1.28+phase)*0.075*blade.y*blade.y;
  let world=vec3<f32>(record.x+blade.x,record.y+blade.y,record.z); var out:Out; out.position=camera.viewProjection*vec4<f32>(world,1.0); out.shade=record.w; out.worldPos=world; out.height=clamp(blade.y,0.0,1.0); return out; }
@fragment fn fs_main(input:Out)->@location(0) vec4<f32>{ var color=mix(vec3<f32>(0.13,0.34,0.11),vec3<f32>(0.34,0.64,0.22),input.shade); color*=0.72+input.height*0.36; color+=color*vec3<f32>(1.04,1.18,0.72)*input.height*0.12; let d=distance(camera.cameraPosition.xyz,input.worldPos); let fog=1.0-exp(-camera.fog.x*camera.fog.x*d*d); color=mix(color,vec3<f32>(0.52,0.68,0.59),clamp(fog,0.0,0.94)); return vec4<f32>(filmicGrade(color),1.0); }`;

export async function createPrehistoricRushGPUWorldScene({ hostElement, world, recipe, gpuHost, computeHost, frameExecutor, rendering, qualityProfile = null, contributions = [], onProgress = () => {} } = {}) {
  if (!hostElement || !world || !gpuHost || !computeHost || !frameExecutor || !rendering) throw new TypeError("Unified GPU world scene requires host, World, Host GPU, Compute, Render frame executor, and fallback rendering.");
  const contributionIds = contributions.map((entry) => String(entry.semanticId));
  if (contributionIds.length < 3) throw new Error("Unified GPU world scene requires portable terrain, ecology, and ground-cover contributions.");
  const canvas = document.createElement("canvas");
  canvas.dataset.prehistoricGpuNative = "unified-world";
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "1" });
  hostElement.prepend(canvas);

  const seed = hashText(recipe?.seed ?? recipe?.id ?? "prehistoric-rush");
  const quality = qualityProfile ?? Object.freeze({ id: "balanced", pixelRatio: 1.35 });
  const ids = Object.freeze({
    camera: `${PREFIX}:camera`, depth: `${PREFIX}:depth`, terrainHeights: `${PREFIX}:terrain-heights`, terrainParams: `${PREFIX}:terrain-params`,
    grassParams: `${PREFIX}:grass-params`, grassVisible: `${PREFIX}:grass-visible`, grassArgs: `${PREFIX}:grass-args`,
    treeParams: `${PREFIX}:tree-params`, treeInput: `${PREFIX}:tree-input`, treeVisible: `${PREFIX}:tree-visible`, treeArgs: `${PREFIX}:tree-args`, treeVertexCounts: `${PREFIX}:tree-vertex-counts`
  });
  let heightfield = null, heightfieldKey = null, treeRevision = -1, treeSpeciesCount = 0, treeCount = 0, framePending = false, disposed = false, lastError = null;
  let uploadedBytes = 0, computeDispatches = 0, renderSubmissions = 0, frameSequence = 0, skippedFrames = 0, passCount = 0;
  const geometryResources = [];

  function resize() {
    const ratio = Math.min(globalThis.devicePixelRatio || 1, Number(quality.pixelRatio ?? 1.35));
    const width = Math.max(1, Math.floor((hostElement.clientWidth || globalThis.innerWidth || 1) * ratio));
    const height = Math.max(1, Math.floor((hostElement.clientHeight || globalThis.innerHeight || 1) * ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    return { width, height };
  }
  resize();
  await frameExecutor.initialize({ canvas, format: "bgra8unorm", alphaMode: "opaque" });

  async function ensureDepth() {
    const { width, height } = resize();
    await gpuHost.ensureResource({ id: ids.depth, type: "texture", size: [width, height, 1], format: "depth24plus", usage: ["render-attachment"], metadata: { role: "unified-world-depth" } });
  }

  async function ensureHeightfield(state) {
    const next = buildHeightfield(world, state);
    if (heightfieldKey === next.bounds.key) return false;
    heightfield = next; heightfieldKey = next.bounds.key;
    const params = terrainParams(next);
    await gpuHost.ensureResource({ id: ids.terrainHeights, type: "buffer", byteLength: next.heights.byteLength, usage: ["storage", "copy-dst"] }, next.heights);
    await gpuHost.ensureResource({ id: ids.terrainParams, type: "buffer", byteLength: params.byteLength, usage: ["uniform", "copy-dst"] }, params);
    uploadedBytes += next.heights.byteLength + params.byteLength;
    return true;
  }

  async function ensureTreeGeometry(denseState) {
    if (geometryResources.length || !(denseState.treePackages?.length)) return;
    treeSpeciesCount = denseState.treePackages.length;
    const vertexCounts = new Uint32Array(treeSpeciesCount * TREE_LOD_COUNT);
    for (let typeIndex = 0; typeIndex < denseState.treePackages.length; typeIndex += 1) {
      const packageValue = denseState.treePackages[typeIndex];
      for (let lod = 0; lod < TREE_LOD_COUNT; lod += 1) {
        const formId = lod === 0 ? "near" : "medium";
        const geometry = expandedGeometry(packageValue?.forms?.[formId]?.geometry);
        const resourceId = `${PREFIX}:tree-geometry:${typeIndex}:${formId}`;
        await gpuHost.ensureResource({ id: resourceId, type: "buffer", byteLength: geometry.byteLength, usage: ["vertex", "copy-dst"], metadata: { archetypeId: packageValue.archetypeId, formId } }, geometry);
        geometryResources.push({ typeIndex, lod, formId, resourceId, vertexCount: geometry.length / 9 });
        vertexCounts[typeIndex * 2 + lod] = geometry.length / 9;
        uploadedBytes += geometry.byteLength;
      }
    }
    await gpuHost.ensureResource({ id: ids.treeVertexCounts, type: "buffer", byteLength: vertexCounts.byteLength, usage: ["storage", "copy-dst"] }, vertexCounts);
    await gpuHost.ensureResource({ id: ids.treeVisible, type: "buffer", byteLength: treeSpeciesCount * TREE_LOD_COUNT * TREE_SLOT_CAPACITY * 80, usage: ["storage"] });
    await gpuHost.ensureResource({ id: ids.treeArgs, type: "buffer", byteLength: treeSpeciesCount * TREE_LOD_COUNT * 16, usage: ["storage", "indirect"] });
    uploadedBytes += vertexCounts.byteLength;
  }

  async function syncTrees(state) {
    const denseState = rendering.getDenseWorldPresentation?.() ?? {};
    await ensureTreeGeometry(denseState);
    if (!treeSpeciesCount) return false;
    if (treeRevision === Number(denseState.revision ?? 0) && treeCount > 0) return false;
    const flattened = flattenTreeInput(denseState); treeCount = flattened.count; treeRevision = Number(denseState.revision ?? 0);
    const params = treeParams(treeCount, treeSpeciesCount, state);
    await gpuHost.ensureResource({ id: ids.treeInput, type: "buffer", byteLength: Math.max(96, flattened.data.byteLength), usage: ["storage", "copy-dst"] }, flattened.data.byteLength ? flattened.data : new Float32Array(24));
    await gpuHost.ensureResource({ id: ids.treeParams, type: "buffer", byteLength: params.byteLength, usage: ["uniform", "copy-dst"] }, params);
    uploadedBytes += flattened.data.byteLength + params.byteLength;
    return true;
  }

  async function computeDense(state) {
    const gp = grassParams(seed, heightfield, state);
    await gpuHost.ensureResource({ id: ids.grassParams, type: "buffer", byteLength: gp.byteLength, usage: ["uniform", "copy-dst"] }, gp);
    await gpuHost.ensureResource({ id: ids.grassVisible, type: "buffer", byteLength: GRASS_CAPACITY * 16, usage: ["storage"] });
    await gpuHost.ensureResource({ id: ids.grassArgs, type: "buffer", byteLength: 16, usage: ["storage", "indirect"] });
    uploadedBytes += gp.byteLength;
    const nodes = [
      { id: "grass-reset", kernelId: "grass-reset", bindings: [ids.grassArgs], writes: [ids.grassArgs], dispatch: { x: 1, y: 1, z: 1 } },
      { id: "grass-generate", kernelId: "grass-generate", bindings: [ids.grassParams, ids.terrainHeights, ids.grassVisible, ids.grassArgs], reads: [ids.grassParams, ids.terrainHeights], writes: [ids.grassVisible, ids.grassArgs], dispatch: { x: Math.ceil(GRASS_CAPACITY / 64), y: 1, z: 1 } }
    ];
    const buffers = {
      [ids.grassParams]: { byteLength: 48, usage: ["uniform"] }, [ids.terrainHeights]: { byteLength: heightfield.heights.byteLength, usage: ["storage"] },
      [ids.grassVisible]: { byteLength: GRASS_CAPACITY * 16, usage: ["storage"] }, [ids.grassArgs]: { byteLength: 16, usage: ["storage", "indirect"] }
    };
    const kernels = { "grass-reset": { id: "grass-reset", entryPoint: "main", source: GRASS_RESET_WGSL }, "grass-generate": { id: "grass-generate", entryPoint: "main", source: GRASS_GENERATE_WGSL } };
    if (treeSpeciesCount) {
      const tp = treeParams(treeCount, treeSpeciesCount, state);
      await gpuHost.ensureResource({ id: ids.treeParams, type: "buffer", byteLength: tp.byteLength, usage: ["uniform", "copy-dst"] }, tp);
      nodes.push(
        { id: "tree-reset", kernelId: "tree-reset", bindings: [ids.treeArgs, ids.treeVertexCounts], reads: [ids.treeVertexCounts], writes: [ids.treeArgs], dispatch: { x: Math.ceil((treeSpeciesCount * 2) / 64), y: 1, z: 1 } },
        { id: "tree-cull", kernelId: "tree-cull", bindings: [ids.treeParams, ids.treeInput, ids.treeVisible, ids.treeArgs], reads: [ids.treeParams, ids.treeInput], writes: [ids.treeVisible, ids.treeArgs], dispatch: { x: Math.max(1, Math.ceil(treeCount / 64)), y: 1, z: 1 } }
      );
      kernels["tree-reset"] = { id: "tree-reset", entryPoint: "main", source: TREE_RESET_WGSL };
      kernels["tree-cull"] = { id: "tree-cull", entryPoint: "main", source: TREE_CULL_WGSL };
      buffers[ids.treeParams] = { byteLength: 32, usage: ["uniform"] }; buffers[ids.treeInput] = { byteLength: Math.max(96, treeCount * 96), usage: ["storage"] };
      buffers[ids.treeVisible] = { byteLength: treeSpeciesCount * 2 * TREE_SLOT_CAPACITY * 80, usage: ["storage"] };
      buffers[ids.treeArgs] = { byteLength: treeSpeciesCount * 2 * 16, usage: ["storage", "indirect"] }; buffers[ids.treeVertexCounts] = { byteLength: treeSpeciesCount * 2 * 4, usage: ["storage"] };
    }
    await computeHost.executeGraph({ graph: { id: "prehistoric-rush-dense-world", nodes }, executionOrder: nodes.map((node) => node.id), kernels, buffers }, { requiredBackend: "webgpu", requiredFeatures: ["shared-gpu-host"], allowFallback: false });
    computeDispatches += nodes.length;
  }

  function treePasses() {
    return geometryResources.map((geometry) => ({
      id: `tree:${geometry.typeIndex}:${geometry.formId}`,
      pipeline: { id: "prehistoric-tree-fidelity-mesh", source: TREE_WGSL, vertex: { entryPoint: "vs_main", buffers: [{ arrayStride: 36, attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }, { shaderLocation: 1, offset: 12, format: "float32x3" }, { shaderLocation: 2, offset: 24, format: "float32x3" }] }] }, fragment: { entryPoint: "fs_main", targets: [{ format: "bgra8unorm" }] }, primitive: { topology: "triangle-list", cullMode: "none" }, depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" } },
      bindings: [{ group: 0, binding: 0, resourceId: ids.camera }, { group: 0, binding: 1, resourceId: ids.treeVisible }],
      vertexBuffers: [{ slot: 0, resourceId: geometry.resourceId }],
      depthStencilAttachment: { resourceId: ids.depth, depthClearValue: 1, depthLoadOp: "load", depthStoreOp: "store" },
      draw: { indirect: { resourceId: ids.treeArgs, offset: (geometry.typeIndex * 2 + geometry.lod) * 16 } }
    }));
  }

  async function renderFrame(camera, state = {}) {
    const cb = cameraBuffer(camera, state.time ?? state.elapsed ?? 0, quality.id === "performance" ? 0.94 : 1.04); await gpuHost.ensureResource({ id: ids.camera, type: "buffer", byteLength: cb.byteLength, usage: ["uniform", "copy-dst"] }, cb); uploadedBytes += cb.byteLength;
    const terrainVertices = (GRID_SIZE - 1) * (GRID_SIZE - 1) * 6;
    const passes = [
      { id: "terrain", pipeline: { id: "prehistoric-terrain", source: TERRAIN_WGSL, vertex: { entryPoint: "vs_main", buffers: [] }, fragment: { entryPoint: "fs_main", targets: [{ format: "bgra8unorm" }] }, primitive: { topology: "triangle-list", cullMode: "back" }, depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" } }, bindings: [{ group: 0, binding: 0, resourceId: ids.camera }, { group: 0, binding: 1, resourceId: ids.terrainParams }, { group: 0, binding: 2, resourceId: ids.terrainHeights }], clearValue: { r: 0.52, g: 0.68, b: 0.59, a: 1 }, loadOp: "clear", depthStencilAttachment: { resourceId: ids.depth, depthClearValue: 1, depthLoadOp: "clear", depthStoreOp: "store" }, draw: { vertexCount: terrainVertices } },
      ...treePasses(),
      { id: "ground-cover", pipeline: { id: "prehistoric-ground-cover", source: GRASS_WGSL, vertex: { entryPoint: "vs_main", buffers: [] }, fragment: { entryPoint: "fs_main", targets: [{ format: "bgra8unorm" }] }, primitive: { topology: "triangle-list", cullMode: "none" }, depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" } }, bindings: [{ group: 0, binding: 0, resourceId: ids.camera }, { group: 0, binding: 1, resourceId: ids.grassVisible }], depthStencilAttachment: { resourceId: ids.depth, depthClearValue: 1, depthLoadOp: "load", depthStoreOp: "store" }, draw: { indirect: { resourceId: ids.grassArgs, offset: 0 } } }
    ];
    const result = await frameExecutor.executeFrame({ id: "prehistoric-rush-unified-world", passes });
    passCount = result.passCount; renderSubmissions += result.submissionCount;
  }

  await ensureDepth(); await ensureHeightfield({ x: 0, z: 0 }); await syncTrees({ x: 0, z: 0 }); await computeDense({ x: 0, z: 0 }); await renderFrame(rendering.camera, { x: 0, z: 0, time: 0 });
  onProgress(1, "Unified Nexus GPU world ready");

  function scheduleFrame({ state, camera } = {}) {
    if (disposed || !state || !camera) return;
    if (framePending) { skippedFrames += 1; return; }
    framePending = true;
    Promise.resolve().then(async () => {
      await ensureDepth(); const terrainChanged = await ensureHeightfield(state); const treesChanged = await syncTrees(state);
      if (terrainChanged || treesChanged || frameSequence % 4 === 0) await computeDense(state);
      await renderFrame(camera, state); frameSequence += 1;
    }).catch((error) => { lastError = error instanceof Error ? error : new Error(String(error)); console.error("PrehistoricRush unified GPU world failed:", lastError); }).finally(() => { framePending = false; });
  }

  function snapshot() {
    return Object.freeze({ active: !disposed && !lastError, backend: "webgpu", mode: "unified-dense-world", quality: quality.id, sharedDeviceId: gpuHost.getDeviceDescriptor()?.id ?? null, contributionIds: Object.freeze([...contributionIds]), terrainAuthority: "n:world:foundation", terrainPatchCount: TERRAIN_PATCH_COUNT, treeCount, treeSpeciesCount, treeLOD: "gpu-near-medium", grassLogicalCount: GRASS_CAPACITY, sharedDepth: true, singleCanvas: true, singleFrameSubmission: true, gpuCulling: true, gpuLod: true, indirectDraw: true, zeroCopy: true, passCount, computeDispatches, renderSubmissions, frameSequence, skippedFrames, uploadedBytes, gpuReadbackBytes: 0, resourceCount: gpuHost.listResources().length, error: lastError?.message ?? null });
  }

  return Object.freeze({ active: true, canvas, scheduleFrame, resize, snapshot, dispose() { disposed = true; canvas.remove(); for (const resource of gpuHost.listResources()) if (String(resource.id).startsWith(PREFIX)) { try { gpuHost.evictResource(resource.id); } catch {} } } });
}
