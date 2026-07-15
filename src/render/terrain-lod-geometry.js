const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function assertResolution(value, label) {
  const resolution = Math.floor(finite(value, 0));
  if (resolution < 1 || (resolution & (resolution - 1)) !== 0) {
    throw new RangeError(`${label} must be a positive power of two.`);
  }
  return resolution;
}

function gridIndex(sourceResolution, x, z) {
  return z * (sourceResolution + 1) + x;
}

function createEdgeTopIndices(sourceResolution) {
  const side = sourceResolution + 1;
  const edges = [[], [], [], []];
  for (let index = 0; index <= sourceResolution; index += 1) {
    edges[0].push(gridIndex(sourceResolution, index, 0));
    edges[1].push(gridIndex(sourceResolution, sourceResolution, index));
    edges[2].push(gridIndex(sourceResolution, sourceResolution - index, sourceResolution));
    edges[3].push(gridIndex(sourceResolution, 0, sourceResolution - index));
  }
  const gridVertexCount = side * side;
  const skirtIndices = edges.map((edge, edgeIndex) => edge.map((_, index) => gridVertexCount + edgeIndex * side + index));
  return { edges, skirtIndices };
}

function createLevelIndices(sourceResolution, targetResolution, edges, skirtIndices) {
  const step = sourceResolution / targetResolution;
  if (!Number.isInteger(step) || (step & (step - 1)) !== 0) {
    throw new RangeError(`Terrain target resolution ${targetResolution} must divide source resolution ${sourceResolution} by a power of two.`);
  }
  const indices = [];
  for (let z = 0; z < sourceResolution; z += step) {
    for (let x = 0; x < sourceResolution; x += step) {
      const a = gridIndex(sourceResolution, x, z);
      const b = gridIndex(sourceResolution, x + step, z);
      const c = gridIndex(sourceResolution, x, z + step);
      const d = gridIndex(sourceResolution, x + step, z + step);
      indices.push(a, c, b, b, c, d);
    }
  }
  for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
    const top = edges[edgeIndex];
    const bottom = skirtIndices[edgeIndex];
    for (let index = 0; index < sourceResolution; index += step) {
      const t0 = top[index];
      const t1 = top[index + step];
      const b0 = bottom[index];
      const b1 = bottom[index + step];
      indices.push(t0, b0, t1, t1, b0, b1);
    }
  }
  return new Uint16Array(indices);
}

export function createTerrainLodTopology(policy) {
  const sourceResolution = assertResolution(policy?.sourceResolution, "Terrain source resolution");
  const levels = policy?.levels ?? [];
  if (!levels.length) throw new TypeError("Terrain LOD topology requires levels.");
  const { edges, skirtIndices } = createEdgeTopIndices(sourceResolution);
  const gridVertexCount = (sourceResolution + 1) ** 2;
  const skirtVertexCount = (sourceResolution + 1) * 4;
  const indicesByLevel = {};
  const levelOrder = {};
  levels.forEach((level, index) => {
    const resolution = assertResolution(level.resolution, `Terrain LOD ${level.id} resolution`);
    indicesByLevel[level.id] = createLevelIndices(sourceResolution, resolution, edges, skirtIndices);
    levelOrder[level.id] = index;
  });
  return Object.freeze({
    sourceResolution,
    levels: Object.freeze(levels.map((level) => Object.freeze({ ...level }))),
    gridVertexCount,
    skirtVertexCount,
    vertexCount: gridVertexCount + skirtVertexCount,
    edges: Object.freeze(edges.map((edge) => Object.freeze([...edge]))),
    skirtIndices: Object.freeze(skirtIndices.map((edge) => Object.freeze([...edge]))),
    indicesByLevel: Object.freeze(indicesByLevel),
    levelOrder: Object.freeze(levelOrder)
  });
}

function coarseHeightAt(heights, sourceResolution, targetResolution, x, z) {
  if (targetResolution === sourceResolution) return heights[gridIndex(sourceResolution, x, z)];
  const step = sourceResolution / targetResolution;
  const cellX = Math.floor(x / step) * step;
  const cellZ = Math.floor(z / step) * step;
  const nextX = Math.min(sourceResolution, cellX + step);
  const nextZ = Math.min(sourceResolution, cellZ + step);
  const tx = step > 0 ? (x - cellX) / step : 0;
  const tz = step > 0 ? (z - cellZ) / step : 0;
  const h00 = heights[gridIndex(sourceResolution, cellX, cellZ)];
  const h10 = heights[gridIndex(sourceResolution, nextX, cellZ)];
  const h01 = heights[gridIndex(sourceResolution, cellX, nextZ)];
  const h11 = heights[gridIndex(sourceResolution, nextX, nextZ)];
  const top = h00 + (h10 - h00) * tx;
  const bottom = h01 + (h11 - h01) * tx;
  return top + (bottom - top) * tz;
}

function copyColor(target, targetOffset, source, sourceOffset, multiplier = 1) {
  target[targetOffset] = source[sourceOffset] * multiplier;
  target[targetOffset + 1] = source[sourceOffset + 1] * multiplier;
  target[targetOffset + 2] = source[sourceOffset + 2] * multiplier;
}

function copyNormal(target, targetOffset, source, sourceOffset) {
  target[targetOffset] = source[sourceOffset];
  target[targetOffset + 1] = source[sourceOffset + 1];
  target[targetOffset + 2] = source[sourceOffset + 2];
}

export function createTerrainPatchVertexData({ patch, policy, topology = createTerrainLodTopology(policy) }) {
  const sourceResolution = topology.sourceResolution;
  const terrain = patch?.terrain;
  if (!terrain) throw new TypeError("Terrain patch data is required.");
  if (Number(terrain.segments) !== sourceResolution) {
    throw new RangeError(`Terrain patch ${patch?.id ?? "unknown"} has ${terrain.segments} segments; expected ${sourceResolution}.`);
  }
  const expectedGridVertices = topology.gridVertexCount;
  if (terrain.heights?.length !== expectedGridVertices) throw new RangeError("Terrain height field size does not match source resolution.");
  if (terrain.colors?.length !== expectedGridVertices * 3) throw new RangeError("Terrain color field size does not match source resolution.");
  if (terrain.normals?.length !== expectedGridVertices * 3) throw new RangeError("Terrain normal field size does not match source resolution.");

  const patchSize = finite(policy.patchSize, 56);
  const skirtDepth = Math.max(0, finite(policy.crackPolicy?.skirtDepth, 3.5));
  const tileSize = Math.max(0.0001, finite(policy.materialPolicy?.tileSize, 11));
  const positions = new Float32Array(topology.vertexCount * 3);
  const colors = new Float32Array(topology.vertexCount * 3);
  const normals = new Float32Array(topology.vertexCount * 3);
  const uvs = new Float32Array(topology.vertexCount * 2);
  const centerX = finite(patch.x, 0) * patchSize;
  const centerZ = finite(patch.z, 0) * patchSize;
  const minimumX = centerX - patchSize * 0.5;
  const minimumZ = centerZ - patchSize * 0.5;

  for (let z = 0; z <= sourceResolution; z += 1) {
    for (let x = 0; x <= sourceResolution; x += 1) {
      const vertex = gridIndex(sourceResolution, x, z);
      const positionOffset = vertex * 3;
      const uvOffset = vertex * 2;
      const localX = (x / sourceResolution - 0.5) * patchSize;
      const localZ = (z / sourceResolution - 0.5) * patchSize;
      positions[positionOffset] = localX;
      positions[positionOffset + 1] = terrain.heights[vertex];
      positions[positionOffset + 2] = localZ;
      copyColor(colors, positionOffset, terrain.colors, positionOffset);
      copyNormal(normals, positionOffset, terrain.normals, positionOffset);
      uvs[uvOffset] = (minimumX + x / sourceResolution * patchSize) / tileSize;
      uvs[uvOffset + 1] = (minimumZ + z / sourceResolution * patchSize) / tileSize;
    }
  }

  const skirtNormals = [
    [0, 0, -1],
    [1, 0, 0],
    [0, 0, 1],
    [-1, 0, 0]
  ];
  topology.edges.forEach((edge, edgeIndex) => {
    edge.forEach((topVertex, index) => {
      const skirtVertex = topology.skirtIndices[edgeIndex][index];
      const topPositionOffset = topVertex * 3;
      const skirtPositionOffset = skirtVertex * 3;
      const topUvOffset = topVertex * 2;
      const skirtUvOffset = skirtVertex * 2;
      positions[skirtPositionOffset] = positions[topPositionOffset];
      positions[skirtPositionOffset + 1] = positions[topPositionOffset + 1] - skirtDepth;
      positions[skirtPositionOffset + 2] = positions[topPositionOffset + 2];
      copyColor(colors, skirtPositionOffset, colors, topPositionOffset, 0.72);
      normals.set(skirtNormals[edgeIndex], skirtPositionOffset);
      uvs[skirtUvOffset] = uvs[topUvOffset];
      uvs[skirtUvOffset + 1] = uvs[topUvOffset + 1];
    });
  });

  const morphOffsetsByLevel = {};
  for (const level of topology.levels) {
    if (level.resolution === sourceResolution) continue;
    const offsets = new Float32Array(topology.vertexCount * 3);
    for (let z = 0; z <= sourceResolution; z += 1) {
      for (let x = 0; x <= sourceResolution; x += 1) {
        const vertex = gridIndex(sourceResolution, x, z);
        const offset = vertex * 3;
        offsets[offset + 1] = coarseHeightAt(terrain.heights, sourceResolution, level.resolution, x, z) - terrain.heights[vertex];
      }
    }
    topology.edges.forEach((edge, edgeIndex) => {
      edge.forEach((topVertex, index) => {
        const skirtVertex = topology.skirtIndices[edgeIndex][index];
        offsets[skirtVertex * 3 + 1] = offsets[topVertex * 3 + 1];
      });
    });
    morphOffsetsByLevel[level.id] = offsets;
  }

  return {
    positions,
    colors,
    normals,
    uvs,
    morphOffsetsByLevel,
    bounds: {
      minX: minimumX,
      minZ: minimumZ,
      maxX: minimumX + patchSize,
      maxZ: minimumZ + patchSize
    }
  };
}
