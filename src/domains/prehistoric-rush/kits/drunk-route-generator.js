function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createDrunkRouteGenerator(config = {}) {
  const seed = Number(config.seed ?? 238991);
  const segmentLength = Number(config.segmentLength ?? 18);
  const sampleSpacing = Number(config.sampleSpacing ?? 2.5);
  const pathHalfWidth = Number(config.pathHalfWidth ?? 3.1);
  const vergeWidth = Number(config.vergeWidth ?? 3.2);
  const controlPointCount = Number(config.controlPointCount ?? 260);
  const controlPoints = [];
  const samples = [];
  let heading = 0;

  function random(index, salt = 0) {
    let h = Math.imul((index + 1) | 0, 374761393) ^ Math.imul((seed + salt) | 0, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  function ensureControlPoints(count = controlPointCount) {
    if (!controlPoints.length) controlPoints.push({ x: 0, z: -18, heading: 0, width: pathHalfWidth });
    while (controlPoints.length < count) {
      const index = controlPoints.length;
      const previous = controlPoints[index - 1];
      const bend = (random(index, 17) * 2 - 1) * 0.075;
      const rareBend = random(index, 53) > 0.88 ? (random(index, 71) * 2 - 1) * 0.16 : 0;
      heading = clamp(heading + bend + rareBend, -0.82, 0.82);
      const clearing = random(index, 101) > 0.91;
      controlPoints.push({
        x: previous.x + Math.sin(heading) * segmentLength,
        z: previous.z + Math.cos(heading) * segmentLength,
        heading,
        width: pathHalfWidth + (clearing ? 2.2 : (random(index, 211) - 0.5) * 0.7)
      });
    }
  }

  function catmull(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
      z: 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
      width: p1.width + (p2.width - p1.width) * t
    };
  }

  function rebuild() {
    samples.length = 0;
    ensureControlPoints();
    for (let index = 0; index < controlPoints.length - 1; index += 1) {
      const p0 = controlPoints[Math.max(0, index - 1)];
      const p1 = controlPoints[index];
      const p2 = controlPoints[index + 1];
      const p3 = controlPoints[Math.min(controlPoints.length - 1, index + 2)];
      const steps = Math.max(2, Math.ceil(segmentLength / sampleSpacing));
      for (let step = 0; step < steps; step += 1) samples.push(catmull(p0, p1, p2, p3, step / steps));
    }
  }

  function nearest(x, z, hintIndex = 0, radius = 120) {
    const start = Math.max(0, hintIndex - radius);
    const end = Math.min(samples.length - 1, hintIndex + radius);
    let bestIndex = start;
    let bestDistanceSq = Infinity;
    for (let index = start; index <= end; index += 1) {
      const dx = x - samples[index].x;
      const dz = z - samples[index].z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq;
        bestIndex = index;
      }
    }
    const current = samples[bestIndex];
    const next = samples[Math.min(samples.length - 1, bestIndex + 2)];
    const length = Math.hypot(next.x - current.x, next.z - current.z) || 1;
    return {
      index: bestIndex,
      x: current.x,
      z: current.z,
      width: current.width,
      distance: Math.sqrt(bestDistanceSq),
      tangentX: (next.x - current.x) / length,
      tangentZ: (next.z - current.z) / length,
      progress: bestIndex / Math.max(1, samples.length - 1)
    };
  }

  function classify(distance, width = pathHalfWidth) {
    if (distance <= width) return "path";
    if (distance <= width + 1.8) return "edge";
    if (distance <= width + vergeWidth) return "verge";
    return "forest";
  }

  rebuild();
  return Object.freeze({
    id: "drunk-route-generator",
    controlPoints,
    samples,
    pathHalfWidth,
    vergeWidth,
    nearest,
    classify,
    snapshot: () => ({ id: "drunk-route-generator", seed, controlPointCount: controlPoints.length, sampleCount: samples.length, pathHalfWidth, vergeWidth })
  });
}
