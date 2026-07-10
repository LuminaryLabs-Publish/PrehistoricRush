export function createRouteFieldDomainKit(config = {}) {
  const seed = Number(config.seed ?? 238991);
  const segmentLength = Number(config.segmentLength ?? 18);
  const sampleSpacing = Number(config.sampleSpacing ?? 2.5);
  const pathHalfWidth = Number(config.pathHalfWidth ?? 3.1);
  const vergeWidth = Number(config.vergeWidth ?? 3.2);
  const lookAheadPoints = Number(config.lookAheadPoints ?? 260);
  const controlPoints = [];
  const samples = [];
  let heading = 0;

  const rand = (index, salt = 0) => {
    let h = Math.imul((index + 1) | 0, 374761393) ^ Math.imul((seed + salt) | 0, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };

  function ensureControlPoints(count) {
    if (!controlPoints.length) controlPoints.push({ x: 0, z: -18, heading: 0, width: pathHalfWidth });
    while (controlPoints.length < count) {
      const i = controlPoints.length;
      const previous = controlPoints[i - 1];
      const bendNoise = rand(i, 17) * 2 - 1;
      const rareBend = rand(i, 53) > 0.88 ? (rand(i, 71) * 2 - 1) * 0.16 : 0;
      heading += bendNoise * 0.075 + rareBend;
      heading = Math.max(-0.82, Math.min(0.82, heading));
      const clearing = rand(i, 101) > 0.91;
      controlPoints.push({
        x: previous.x + Math.sin(heading) * segmentLength,
        z: previous.z + Math.cos(heading) * segmentLength,
        heading,
        width: pathHalfWidth + (clearing ? 2.2 : (rand(i, 211) - 0.5) * 0.7)
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

  function rebuildSamples() {
    samples.length = 0;
    ensureControlPoints(lookAheadPoints);
    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = controlPoints[Math.max(0, i - 1)];
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      const p3 = controlPoints[Math.min(controlPoints.length - 1, i + 2)];
      const steps = Math.max(2, Math.ceil(segmentLength / sampleSpacing));
      for (let step = 0; step < steps; step++) samples.push(catmull(p0, p1, p2, p3, step / steps));
    }
  }

  function nearest(x, z, hintIndex = 0, radius = 90) {
    if (!samples.length) rebuildSamples();
    const start = Math.max(0, hintIndex - radius);
    const end = Math.min(samples.length - 1, hintIndex + radius);
    let bestIndex = start;
    let bestDistanceSq = Infinity;
    for (let i = start; i <= end; i++) {
      const dx = x - samples[i].x;
      const dz = z - samples[i].z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq;
        bestIndex = i;
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
      tangentZ: (next.z - current.z) / length
    };
  }

  function classify(distance, width = pathHalfWidth) {
    if (distance <= width) return "path";
    if (distance <= width + 1.8) return "edge";
    if (distance <= width + vergeWidth) return "verge";
    return "forest";
  }

  rebuildSamples();
  return {
    id: "route-field-domain-kit",
    samples,
    controlPoints,
    pathHalfWidth,
    vergeWidth,
    nearest,
    classify,
    ensureControlPoints,
    snapshot() {
      return { id: this.id, seed, controlPointCount: controlPoints.length, sampleCount: samples.length, pathHalfWidth, vergeWidth };
    }
  };
}
