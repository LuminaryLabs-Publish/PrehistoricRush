import {
  FOLIAGE_ATLAS_COLUMNS,
  FOLIAGE_ATLAS_REVISION,
  FOLIAGE_ATLAS_ROWS,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  createTreeFoliageCardPlacements,
  getPrehistoricFoliageCardFamily
} from "../shared/prehistoric-foliage-card-recipes.js";

const CAPTURE_ATLAS_CACHE = new WeakMap();

function canvasFor(size, options = {}) {
  if (options.canvas) return options.canvas;
  if (typeof OffscreenCanvas === "function") return new OffscreenCanvas(size, size / 2);
  if (globalThis.document?.createElement) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size / 2;
    return canvas;
  }
  throw new Error("Prehistoric foliage atlas requires OffscreenCanvas or document.createElement().");
}

function withTile(context, family, tileSize, draw) {
  const [column, row] = family.atlasCell;
  context.save();
  context.translate(column * tileSize, row * tileSize);
  context.beginPath();
  context.rect(0, 0, tileSize, tileSize);
  context.clip();
  context.clearRect(0, 0, tileSize, tileSize);
  draw(context, tileSize, family);
  context.restore();
}

function leafPath(context, x, y, length, width, rotation = 0, taper = 0.18) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.beginPath();
  context.moveTo(-length * 0.5, 0);
  context.bezierCurveTo(-length * taper, -width * 0.58, length * 0.2, -width * 0.54, length * 0.5, 0);
  context.bezierCurveTo(length * 0.2, width * 0.54, -length * taper, width * 0.58, -length * 0.5, 0);
  context.closePath();
  context.fill();
  context.restore();
}

function vein(context, x1, y1, x2, y2, width = 2) {
  context.save();
  context.strokeStyle = "rgba(62,83,48,.48)";
  context.lineWidth = width;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.restore();
}

function leafFill(context, size, warm = false) {
  const gradient = context.createLinearGradient(size * 0.16, size * 0.86, size * 0.84, size * 0.14);
  gradient.addColorStop(0, warm ? "rgba(184,196,111,.92)" : "rgba(136,177,112,.92)");
  gradient.addColorStop(0.48, "rgba(238,248,218,.98)");
  gradient.addColorStop(1, "rgba(98,143,83,.92)");
  return gradient;
}

function drawBroadleaf(context, size) {
  context.fillStyle = leafFill(context, size);
  const stemX = size * 0.48;
  vein(context, stemX, size * 0.86, size * 0.54, size * 0.13, size * 0.018);
  for (let index = 0; index < 9; index += 1) {
    const t = index / 8;
    const side = index % 2 === 0 ? -1 : 1;
    const x = stemX + side * size * (0.13 + t * 0.08);
    const y = size * (0.77 - t * 0.58);
    leafPath(context, x, y, size * (0.25 - t * 0.045), size * (0.14 - t * 0.025), side * (0.46 - t * 0.16));
    vein(context, stemX, y + size * 0.02, x, y, size * 0.009);
  }
  leafPath(context, size * 0.53, size * 0.14, size * 0.24, size * 0.13, -0.1);
}

function drawPalm(context, size) {
  context.fillStyle = leafFill(context, size, true);
  const start = [size * 0.12, size * 0.76];
  const end = [size * 0.9, size * 0.26];
  vein(context, ...start, ...end, size * 0.024);
  for (let index = 0; index < 18; index += 1) {
    const t = (index + 1) / 19;
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const angle = -0.56 + t * 0.15;
    const length = size * (0.22 - Math.abs(t - 0.48) * 0.11);
    const width = size * 0.034;
    leafPath(context, x, y, length, width, angle - 0.8, 0.08);
    leafPath(context, x, y, length * 0.94, width, angle + 0.72, 0.08);
  }
}

function drawFern(context, size) {
  context.fillStyle = leafFill(context, size);
  const start = [size * 0.1, size * 0.82];
  const end = [size * 0.9, size * 0.18];
  vein(context, ...start, ...end, size * 0.018);
  for (let index = 0; index < 16; index += 1) {
    const t = (index + 1) / 17;
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const length = size * (0.18 - t * 0.055);
    leafPath(context, x, y, length, size * 0.025, -1.0 + t * 0.12, 0.06);
    leafPath(context, x, y, length, size * 0.025, 0.47 + t * 0.12, 0.06);
  }
}

function drawNeedles(context, size) {
  context.fillStyle = leafFill(context, size);
  vein(context, size * 0.12, size * 0.76, size * 0.88, size * 0.3, size * 0.022);
  for (let index = 0; index < 24; index += 1) {
    const t = index / 23;
    const x = size * (0.16 + t * 0.68);
    const y = size * (0.74 - t * 0.4);
    const length = size * (0.12 - t * 0.045);
    leafPath(context, x, y, length, size * 0.012, -0.9, 0.03);
    leafPath(context, x, y, length, size * 0.012, 0.42, 0.03);
  }
}

function drawGinkgo(context, size) {
  context.fillStyle = leafFill(context, size, true);
  for (let index = 0; index < 7; index += 1) {
    const angle = (index - 3) * 0.26;
    const x = size * 0.5 + Math.sin(angle) * size * 0.17;
    const y = size * 0.53 - Math.cos(angle) * size * 0.15;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(0, size * 0.16);
    context.arc(0, 0, size * 0.16, Math.PI * 0.94, Math.PI * 2.06, false);
    context.lineTo(0, size * 0.16);
    context.closePath();
    context.fill();
    context.restore();
    vein(context, size * 0.5, size * 0.82, x, y + size * 0.1, size * 0.008);
  }
}

function drawVine(context, size) {
  context.fillStyle = leafFill(context, size);
  context.save();
  context.strokeStyle = "rgba(115,145,81,.8)";
  context.lineWidth = size * 0.018;
  context.beginPath();
  context.moveTo(size * 0.5, size * 0.04);
  context.bezierCurveTo(size * 0.34, size * 0.28, size * 0.65, size * 0.52, size * 0.47, size * 0.96);
  context.stroke();
  context.restore();
  for (let index = 0; index < 10; index += 1) {
    const t = (index + 1) / 11;
    const side = index % 2 === 0 ? -1 : 1;
    const x = size * (0.5 + Math.sin(t * Math.PI * 3) * 0.08 + side * 0.09);
    const y = size * (0.08 + t * 0.82);
    leafPath(context, x, y, size * 0.2, size * 0.11, side * 0.65);
  }
}

function drawBush(context, size) {
  context.fillStyle = leafFill(context, size);
  const points = [
    [0.29, 0.66, -0.5], [0.44, 0.52, 0.2], [0.61, 0.65, 0.65], [0.72, 0.43, -0.25],
    [0.36, 0.35, 0.85], [0.54, 0.28, -0.8], [0.22, 0.46, 0.1], [0.78, 0.68, -0.6],
    [0.5, 0.75, 0.35], [0.65, 0.82, -0.2], [0.35, 0.84, 0.7]
  ];
  for (const [x, y, rotation] of points) leafPath(context, size * x, size * y, size * 0.28, size * 0.16, rotation);
}

function drawWhorl(context, size) {
  context.fillStyle = leafFill(context, size);
  for (let index = 0; index < 14; index += 1) {
    const angle = index / 14 * Math.PI * 2;
    const radius = size * 0.22;
    leafPath(
      context,
      size * 0.5 + Math.sin(angle) * radius,
      size * 0.5 + Math.cos(angle) * radius,
      size * 0.24,
      size * 0.035,
      angle - Math.PI * 0.5,
      0.04
    );
  }
  context.fillStyle = "rgba(210,230,185,.94)";
  context.beginPath();
  context.arc(size * 0.5, size * 0.5, size * 0.055, 0, Math.PI * 2);
  context.fill();
}

const DRAWERS = new Map([
  ["broadleaf-spray", drawBroadleaf],
  ["palm-frond", drawPalm],
  ["fern-frond", drawFern],
  ["needle-spray", drawNeedles],
  ["ginkgo-fan", drawGinkgo],
  ["hanging-vine", drawVine],
  ["bush-cluster", drawBush],
  ["horsetail-whorl", drawWhorl]
]);

export function foliageFrameRect(familyId) {
  const family = getPrehistoricFoliageCardFamily(familyId);
  if (!family) throw new RangeError(`Unknown foliage card family: ${familyId}`);
  const [column, row] = family.atlasCell;
  return [
    column / FOLIAGE_ATLAS_COLUMNS,
    (FOLIAGE_ATLAS_ROWS - 1 - row) / FOLIAGE_ATLAS_ROWS,
    1 / FOLIAGE_ATLAS_COLUMNS,
    1 / FOLIAGE_ATLAS_ROWS
  ];
}

export function createPrehistoricFoliageAtlas(THREE, options = {}) {
  if (!THREE?.CanvasTexture) throw new TypeError("createPrehistoricFoliageAtlas requires THREE.CanvasTexture.");
  const tileSize = Math.max(64, Math.floor(Number(options.tileSize) || 256));
  const width = tileSize * FOLIAGE_ATLAS_COLUMNS;
  const height = tileSize * FOLIAGE_ATLAS_ROWS;
  const canvas = canvasFor(width, options);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create foliage atlas 2D context.");
  context.clearRect(0, 0, width, height);
  for (const family of PREHISTORIC_FOLIAGE_CARD_FAMILIES) {
    const draw = DRAWERS.get(family.id);
    if (!draw) continue;
    withTile(context, family, tileSize, draw);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.name = `prehistoric-foliage-atlas:${FOLIAGE_ATLAS_REVISION}`;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  function createFamilyTexture(familyId) {
    const rect = foliageFrameRect(familyId);
    const familyTexture = texture.clone();
    familyTexture.name = `${texture.name}:${familyId}`;
    familyTexture.repeat.set(rect[2], rect[3]);
    familyTexture.offset.set(rect[0], rect[1]);
    familyTexture.needsUpdate = true;
    return familyTexture;
  }

  return Object.freeze({
    revision: FOLIAGE_ATLAS_REVISION,
    canvas,
    texture,
    width,
    height,
    tileSize,
    familyRect: foliageFrameRect,
    createFamilyTexture,
    dispose() { texture.dispose(); }
  });
}

function captureAtlas(THREE) {
  let atlas = CAPTURE_ATLAS_CACHE.get(THREE);
  if (!atlas) {
    atlas = createPrehistoricFoliageAtlas(THREE, { tileSize: 256 });
    CAPTURE_ATLAS_CACHE.set(THREE, atlas);
  }
  return atlas;
}

export function attachPrehistoricTreeFoliageSprites(THREE, group, archetype, options = {}) {
  const atlas = options.atlas ?? captureAtlas(THREE);
  const placements = options.placements ?? createTreeFoliageCardPlacements(archetype, "near");
  const materialCache = new Map();
  const cards = [];

  function materialFor(familyId) {
    if (materialCache.has(familyId)) return materialCache.get(familyId);
    const family = getPrehistoricFoliageCardFamily(familyId);
    const material = new THREE.SpriteMaterial({
      map: atlas.createFamilyTexture(familyId),
      color: archetype.foliageColor,
      alphaTest: family?.alphaCutoff ?? 0.38,
      transparent: false,
      depthWrite: true,
      depthTest: true,
      fog: true,
      toneMapped: true
    });
    materialCache.set(familyId, material);
    return material;
  }

  for (const placement of placements) {
    const spriteMaterial = materialFor(placement.familyId).clone();
    spriteMaterial.map = materialFor(placement.familyId).map;
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = `${archetype.id}:foliage-card:${placement.id}`;
    sprite.position.set(...placement.position);
    sprite.scale.set(placement.scale[0], placement.scale[1], 1);
    spriteMaterial.rotation = placement.rotation[2];
    sprite.center.set(0.5, 0.5);
    sprite.userData.foliageCard = true;
    sprite.userData.familyId = placement.familyId;
    sprite.userData.placementId = placement.id;
    sprite.userData.wind = placement.wind;
    group.add(sprite);
    cards.push(sprite);
  }
  return cards;
}
