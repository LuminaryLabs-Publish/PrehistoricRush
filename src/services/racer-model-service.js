const MODEL_ROOT = new URL("../../assets/models/", import.meta.url);

const PRODUCTION_MODEL = Object.freeze({
  variant: "production",
  status: "production",
  default: true,
  rigged: true,
  runtimeTransform: Object.freeze({
    position: Object.freeze([0, 0, 0]),
    rotation: Object.freeze([0, 0, 0]),
    scale: Object.freeze([1, 1, 1])
  })
});

const REVIEWED_CANDIDATES = Object.freeze({
  triceratops: Object.freeze({
    id: "triceratops-guided-v1",
    racerId: "triceratops",
    variant: "reviewed-candidate",
    status: "reviewed-candidate",
    default: false,
    userApprovalRequired: true,
    path: "candidates/triceratops-guided-v1.glb",
    sha256: "c20fe58886cf05d5482616dbdf341a08aba44f861acb819ed6a728f0ffe146a9",
    bytes: 579656,
    rigged: false,
    animations: Object.freeze([]),
    runtimeTransform: Object.freeze({
      position: Object.freeze([0, 0, 0]),
      rotation: Object.freeze([0, Math.PI / 2, 0]),
      scale: Object.freeze([0.5, 0.5, 0.5])
    })
  })
});

function productionRecord(racerId) {
  return Object.freeze({
    ...PRODUCTION_MODEL,
    id: `${racerId}-production`,
    racerId,
    path: `racers/${racerId}.glb`
  });
}

export function resolveRacerModelRecord(racerId, options = {}) {
  const id = String(racerId ?? "").trim();
  if (!id) throw new TypeError("A racer ID is required to resolve a model.");
  const variant = String(options.variant ?? "production");
  if (variant === "production") return productionRecord(id);
  if (variant !== "reviewed-candidate") throw new RangeError(`Unknown racer model variant: ${variant}`);
  const candidate = REVIEWED_CANDIDATES[id];
  if (!candidate) throw new RangeError(`No reviewed model candidate is registered for ${id}.`);
  return candidate;
}

export function listRacerModelRecords(racerId) {
  const id = String(racerId ?? "").trim();
  const records = [productionRecord(id)];
  if (REVIEWED_CANDIDATES[id]) records.push(REVIEWED_CANDIDATES[id]);
  return Object.freeze(records);
}

export async function fetchRacerModelAsset(racerId, options = {}) {
  const record = resolveRacerModelRecord(racerId, options);
  const response = await fetch(new URL(record.path, MODEL_ROOT), {
    cache: "force-cache",
    signal: options.signal ?? undefined
  });
  if (!response.ok) throw new Error(`Prebuilt model ${record.path} failed: ${response.status}`);
  const modelBuffer = await response.arrayBuffer();
  return Object.freeze({ modelBuffer, record });
}

export default resolveRacerModelRecord;
