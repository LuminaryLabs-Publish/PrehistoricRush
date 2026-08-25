const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));

export function normalizeRacerIntent(input = {}) {
  return Object.freeze({
    steer: clamp(input.steer, -1, 1),
    boost: Boolean(input.boost),
    jump: Boolean(input.jump),
    ability: Boolean(input.ability)
  });
}
