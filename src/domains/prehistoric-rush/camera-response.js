const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));

/**
 * Convert the authoritative racer speed into a presentation-only 0–1 signal.
 * Profile speed values remain the source of truth; this helper never changes them.
 */
export function normalizeRacerSpeed(state = {}, movement = {}) {
  const baseSpeed = Math.max(0, Number(movement.baseSpeed) || 0);
  const boostSpeed = Math.max(baseSpeed, Number(movement.boostSpeed) || baseSpeed);
  const span = boostSpeed - baseSpeed;
  if (span <= 0) return 0;
  return clamp(((Number(state.speed) || 0) - baseSpeed) / span, 0, 1);
}

/**
 * Resolve the camera's target response from borrowed racer state.
 * This is deliberately stateless: Camera owns smoothing, while Racer owns gameplay state.
 */
export function resolveRacerCameraResponse({ state = {}, movement = {}, camera = {}, reducedMotion = false } = {}) {
  const speed01 = normalizeRacerSpeed(state, movement);
  const sprint01 = state.paceMode === "sprint" ? 1 : 0;
  const jumpNormalization = Math.max(0.01, Number(state.jumpNormalization ?? camera.jumpNormalization ?? 2) || 2);
  const jump01 = clamp((Number(state.jumpHeight) || 0) / jumpNormalization, 0, 1);
  const steer = clamp(state.steer, -1, 1);
  const motionScale = reducedMotion ? 0 : 1;
  const baseFov = Math.max(1, Number(camera.verticalFov) || 62);
  const fovExpansion = Math.max(0, Number(camera.fovExpansion ?? 8) || 0);
  const sprintFovBonus = Math.max(0, Number(camera.sprintFovBonus ?? 1.5) || 0);
  const maximumFov = Math.min(179, baseFov + fovExpansion + sprintFovBonus);
  const targetFov = clamp(baseFov + motionScale * (speed01 * fovExpansion + sprint01 * sprintFovBonus), Math.max(1, baseFov - 8), maximumFov);
  const baseLookAhead = Math.max(0, Number(camera.lookAheadSeconds) || 0);
  const speedLookAhead = Math.max(0, Number(camera.speedLookAheadSeconds ?? 0.16) || 0);
  const lookAheadSeconds = baseLookAhead + motionScale * speed01 * speedLookAhead;
  const targetLift = Math.max(0, Number(camera.targetLift ?? 0.28) || 0)
    + motionScale * speed01 * Math.max(0, Number(camera.speedTargetLift ?? 0.22) || 0)
    + motionScale * jump01 * Math.max(0, Number(camera.jumpTargetLift ?? 0.36) || 0);
  const turnLead = Math.max(0, Number(camera.turnLead ?? 0.42) || 0) * steer * (0.65 + speed01 * 0.35) * motionScale;
  const closePaddingScale = clamp(Number(camera.closePaddingScale ?? 0.7) || 0.7, 0.6, 1);
  const speedPaddingScale = Math.max(0, Number(camera.speedPaddingScale ?? 0.04) || 0);
  const paddingScale = clamp(closePaddingScale + motionScale * speed01 * speedPaddingScale, 0.6, 1.2);

  return {
    speed01,
    sprint01,
    jump01,
    steer,
    targetFov,
    lookAheadSeconds,
    targetLift,
    turnLead,
    paddingScale,
    maximumFov
  };
}

export function smoothCameraValue(current, target, deltaTime, response = 7) {
  const dt = Math.max(0, Number(deltaTime) || 0);
  const sharpness = Math.max(0, Number(response) || 0);
  if (dt <= 0) return Number(current) || 0;
  if (sharpness <= 0) return Number(target) || 0;
  return (Number(current) || 0) + ((Number(target) || 0) - (Number(current) || 0)) * (1 - Math.exp(-sharpness * dt));
}

/**
 * Keep the borrowed Camera transform above authoritative World terrain.
 * A new position is returned so framing state is never mutated in place.
 */
export function resolveCameraTerrainClearance(position, sampleElevation, clearance = 2.2) {
  const resolved = Array.from(position ?? [0, 0, 0], (value) => Number(value) || 0);
  if (resolved.length < 3 || typeof sampleElevation !== "function") return resolved;
  const terrainY = Number(sampleElevation(resolved[0], resolved[2]));
  if (!Number.isFinite(terrainY)) return resolved;
  resolved[1] = Math.max(resolved[1], terrainY + Math.max(0, Number(clearance) || 0));
  return resolved;
}

/**
 * Move a framing-kit result onto the racer profile's close chase radius while
 * retaining the framing kit's authored direction.
 */
export function resolveCloseChasePosition(position, subject, distance) {
  const resolved = Array.from(position ?? [0, 0, 0], (value) => Number(value) || 0);
  const center = Array.from(subject ?? [0, 0, 0], (value) => Number(value) || 0);
  const dx = resolved[0] - center[0];
  const dy = resolved[1] - center[1];
  const dz = resolved[2] - center[2];
  const length = Math.hypot(dx, dy, dz) || 1;
  const chaseDistance = Math.max(0.01, Number(distance) || 0.01);
  return [
    center[0] + dx / length * chaseDistance,
    center[1] + dy / length * chaseDistance,
    center[2] + dz / length * chaseDistance
  ];
}
