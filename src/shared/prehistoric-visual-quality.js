const freeze = (value) => Object.freeze(value);

export const PREHISTORIC_VISUAL_QUALITY_PROFILES = freeze({
  performance: freeze({
    id: "performance",
    pixelRatio: 1,
    minimumPixelRatio: 0.72,
    shadowMapSize: 1024,
    shadowRadius: 48,
    treeDensity: 0.58,
    treeLodThresholdScale: 3,
    groundDensity: 0.48,
    cloudLayers: 1,
    preferUnifiedWebGPU: true,
    targetFrameMs: 19.5
  }),
  balanced: freeze({
    id: "balanced",
    pixelRatio: 1.35,
    minimumPixelRatio: 0.82,
    shadowMapSize: 2048,
    shadowRadius: 60,
    treeDensity: 0.78,
    treeLodThresholdScale: 1.6,
    groundDensity: 0.72,
    cloudLayers: 2,
    preferUnifiedWebGPU: true,
    targetFrameMs: 18
  }),
  high: freeze({
    id: "high",
    pixelRatio: 1.75,
    minimumPixelRatio: 0.92,
    shadowMapSize: 3072,
    shadowRadius: 74,
    treeDensity: 1,
    treeLodThresholdScale: 1,
    groundDensity: 1,
    cloudLayers: 3,
    preferUnifiedWebGPU: false,
    targetFrameMs: 17.2
  }),
  cinematic: freeze({
    id: "cinematic",
    pixelRatio: 2,
    minimumPixelRatio: 1,
    shadowMapSize: 4096,
    shadowRadius: 86,
    treeDensity: 1.18,
    treeLodThresholdScale: 0.85,
    groundDensity: 1.24,
    cloudLayers: 4,
    preferUnifiedWebGPU: false,
    targetFrameMs: 16.9
  })
});

function requestedProfile(locationLike) {
  try {
    const url = new URL(locationLike?.href ?? String(locationLike ?? ""), "https://prehistoric-rush.local/");
    const requested = String(url.searchParams.get("quality") ?? "").toLowerCase();
    if (PREHISTORIC_VISUAL_QUALITY_PROFILES[requested]) return requested;
  } catch {}
  return null;
}

const SOFTWARE_RENDERER_PATTERN = /swiftshader|llvmpipe|softpipe|software rasterizer|mesa offscreen|lavapipe/i;

export function isSoftwareRenderer(rendererIdentity = "") {
  return SOFTWARE_RENDERER_PATTERN.test(String(rendererIdentity));
}

export function readWebGLRendererIdentity(renderer) {
  try {
    const context = renderer?.getContext?.();
    if (!context) return "unknown";
    const extension = context.getExtension?.("WEBGL_debug_renderer_info");
    return String(extension
      ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL)
      : context.getParameter(context.RENDERER) ?? "unknown");
  } catch {
    return "unknown";
  }
}

function automaticProfile(environment = globalThis, rendererIdentity = "") {
  const memory = Number(environment.navigator?.deviceMemory ?? 8);
  const cores = Number(environment.navigator?.hardwareConcurrency ?? 8);
  const narrow = Number(environment.innerWidth ?? 1280) < 760;
  const reducedMotion = Boolean(environment.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  if (isSoftwareRenderer(rendererIdentity)) return "performance";
  if (reducedMotion || memory <= 2 || cores <= 2) return "performance";
  if (narrow || memory <= 4 || cores <= 4) return "balanced";
  return "high";
}

export function resolvePrehistoricVisualQuality(locationLike = globalThis.location, environment = globalThis, capabilities = {}) {
  const rendererIdentity = String(capabilities.rendererIdentity ?? "unknown");
  const explicitProfile = requestedProfile(locationLike);
  const id = explicitProfile ?? automaticProfile(environment, rendererIdentity);
  const profile = PREHISTORIC_VISUAL_QUALITY_PROFILES[id];
  let rendererPreference = profile.preferUnifiedWebGPU ? "webgpu" : "webgl2";
  try {
    const url = new URL(locationLike?.href ?? String(locationLike ?? ""), "https://prehistoric-rush.local/");
    const explicitRenderer = String(url.searchParams.get("renderer") ?? "").toLowerCase();
    if (explicitRenderer === "webgpu" || explicitRenderer === "webgl2") rendererPreference = explicitRenderer;
  } catch {}
  return freeze({
    ...profile,
    rendererPreference,
    rendererIdentity,
    softwareRenderer: isSoftwareRenderer(rendererIdentity),
    selection: explicitProfile ? "explicit" : "automatic"
  });
}

export function createAdaptivePixelRatioController(renderer, profile, environment = globalThis) {
  if (!renderer || !profile) throw new TypeError("Adaptive pixel ratio requires renderer and quality profile.");
  const deviceRatio = Math.max(0.5, Number(environment.devicePixelRatio ?? 1));
  const maximum = Math.min(deviceRatio, profile.pixelRatio);
  const minimum = Math.min(maximum, profile.minimumPixelRatio);
  let ratio = maximum;
  let accumulatedMs = 0;
  let samples = 0;
  let cooldown = 0;

  renderer.setPixelRatio(ratio);

  function update(deltaTime) {
    const milliseconds = Math.max(0, Number(deltaTime) || 0) * 1000;
    if (!milliseconds || milliseconds > 100) return ratio;
    accumulatedMs += milliseconds;
    samples += 1;
    cooldown = Math.max(0, cooldown - milliseconds);
    if (samples < 45 || cooldown > 0) return ratio;

    const average = accumulatedMs / samples;
    accumulatedMs = 0;
    samples = 0;
    const prior = ratio;
    if (average > profile.targetFrameMs * 1.14) ratio = Math.max(minimum, ratio - 0.12);
    else if (average < profile.targetFrameMs * 0.82) ratio = Math.min(maximum, ratio + 0.08);
    ratio = Math.round(ratio * 100) / 100;
    if (ratio !== prior) {
      renderer.setPixelRatio(ratio);
      renderer.setSize(environment.innerWidth ?? 1, environment.innerHeight ?? 1, false);
      cooldown = 1200;
    }
    return ratio;
  }

  return freeze({
    update,
    getSnapshot: () => freeze({ ratio, minimum, maximum, targetFrameMs: profile.targetFrameMs })
  });
}

export default resolvePrehistoricVisualQuality;
