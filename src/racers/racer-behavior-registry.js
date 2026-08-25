function behaviorId(value, kind) {
  const id = String(value ?? "").trim();
  if (!id) throw new TypeError(`${kind} id must be a non-empty string.`);
  return id;
}

function definition(value, kind) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${kind} definition must be an object.`);
  return Object.freeze({ ...value, id: behaviorId(value.id, kind) });
}

export function createRacerBehaviorRegistry() {
  const abilities = new Map();
  const passives = new Map();

  function registerAbility(value) {
    const next = definition(value, "Racer ability");
    if (abilities.has(next.id)) throw new Error(`Racer ability is already registered: ${next.id}.`);
    abilities.set(next.id, next);
    return next;
  }

  function registerPassive(value) {
    const next = definition(value, "Racer passive");
    if (passives.has(next.id)) throw new Error(`Racer passive is already registered: ${next.id}.`);
    passives.set(next.id, next);
    return next;
  }

  return Object.freeze({
    registerAbility,
    registerPassive,
    getAbility: (id) => id == null ? null : abilities.get(String(id)) ?? null,
    getPassive: (id) => id == null ? null : passives.get(String(id)) ?? null,
    listAbilities: () => [...abilities.values()],
    listPassives: () => [...passives.values()]
  });
}

export const DEFAULT_RACER_BEHAVIOR_REGISTRY = createRacerBehaviorRegistry();

export function registerRacerAbility(definition, registry = DEFAULT_RACER_BEHAVIOR_REGISTRY) {
  return registry.registerAbility(definition);
}

export function registerRacerPassive(definition, registry = DEFAULT_RACER_BEHAVIOR_REGISTRY) {
  return registry.registerPassive(definition);
}

registerRacerAbility({
  id: "vine-swing",
  canActivate: ({ environment }) => Boolean(environment?.swingAnchor),
  activate: () => ({ duration: 0.85, cooldown: 2.25, staminaCost: 24 }),
  getModifiers: () => ({ speedMultiplier: 1.12, turnMultiplier: 1.35, gravityMultiplier: 0.35 })
});

registerRacerPassive({
  id: "agile-landing",
  onLand: () => ({ recoveryMultiplier: 0.45 })
});

registerRacerAbility({
  id: "charge-ram",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.9, cooldown: 2.2, staminaCost: 28 }),
  getModifiers: () => ({ speedMultiplier: 1.32, turnMultiplier: 0.55, jumpImpulseMultiplier: 0 })
});

registerRacerPassive({
  id: "line-holder",
  modifySurfaceMultiplier: ({ targetMultiplier }) => 1 - (1 - targetMultiplier) * 0.65,
  onLand: () => ({ recoveryMultiplier: 0.8 })
});
