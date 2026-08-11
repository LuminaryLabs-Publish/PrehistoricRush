import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const outputRoot = path.resolve(process.env.PREHISTORIC_TREE_ASSET_DIR ?? "assets/tree-fidelity");
const metricsFile = path.resolve(`.agent/evidence/${RUN_ID}/metrics/tree-fidelity-compile.json`);
const sourceCommit = process.env.PREHISTORIC_SOURCE_SHA ?? process.env.GITHUB_SHA ?? null;

const chromiumArgs = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-webgl",
  "--ignore-gpu-blocklist",
  "--enable-unsafe-swiftshader",
  "--disable-dev-shm-usage"
];

function decodeDataUrl(source) {
  const match = /^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.+)$/s.exec(String(source ?? ""));
  if (!match) throw new Error("Compiled tree atlas is not a base64 data URL.");
  return {
    mime: match[1] || "application/octet-stream",
    bytes: Buffer.from(match[2], "base64")
  };
}

function extensionForMime(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg") return "jpg";
  throw new Error(`Unsupported compiled tree atlas MIME type: ${mime}`);
}

await mkdir(outputRoot, { recursive: true });
await mkdir(path.dirname(metricsFile), { recursive: true });

const browser = await chromium.launch({ headless: true, args: chromiumArgs });
const page = await browser.newPage({ viewport: { width: 960, height: 640 }, deviceScaleFactor: 1 });
const browserErrors = [];
const expectedPrebuiltMisses = [];
page.on("pageerror", (error) => browserErrors.push(error.stack || error.message));
page.on("console", (message) => {
  if (message.type() !== "error") return;
  const text = message.text();
  if (/Failed to load resource:.*404/i.test(text)) {
    expectedPrebuiltMisses.push(text);
    return;
  }
  browserErrors.push(text);
});

let result;
try {
  await page.goto(`${baseUrl}/validation/tree-fidelity-compiler.html`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000
  });
  await page.waitForFunction(
    () => globalThis.__PREHISTORIC_TREE_COMPILER_READY__ === true || Boolean(globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__),
    null,
    { timeout: 900_000 }
  );
  const state = await page.evaluate(() => ({
    ready: globalThis.__PREHISTORIC_TREE_COMPILER_READY__ === true,
    error: globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__ ?? null,
    result: globalThis.__PREHISTORIC_TREE_COMPILER_RESULT__ ?? null
  }));
  if (!state.ready) throw new Error(`Tree Fidelity compiler failed: ${state.error ?? browserErrors.join(" | ")}`);
  result = state.result;
} finally {
  await browser.close();
}

assert.equal(browserErrors.length, 0, "tree Fidelity compiler has no unexpected browser errors");
assert.equal(result?.speciesCount, 12, "tree Fidelity compiler covers all 12 species");
assert.equal(result?.packages?.length, 12, "tree Fidelity compiler emits 12 packages");

const manifestPackages = [];
let atlasBytes = 0;
let packageBytes = 0;
for (const entry of result.packages) {
  const packageValue = structuredClone(entry.value);
  const archetypeId = packageValue.archetypeId;
  assert.ok(archetypeId, "compiled tree package has an archetype id");
  assert.ok(packageValue.growth?.digest, `${archetypeId} compiled package has a growth digest`);
  const source = packageValue.forms?.far?.atlas?.assetId ?? packageValue.forms?.horizon?.atlas?.assetId;
  const atlas = decodeDataUrl(source);
  const extension = extensionForMime(atlas.mime);
  const atlasFile = `${archetypeId}.${extension}`;
  await writeFile(path.join(outputRoot, atlasFile), atlas.bytes);
  atlasBytes += atlas.bytes.length;
  if (packageValue.forms?.far?.atlas) packageValue.forms.far.atlas.assetId = atlasFile;
  if (packageValue.forms?.horizon?.atlas) packageValue.forms.horizon.atlas.assetId = atlasFile;

  const packageFile = `${archetypeId}.json`;
  const packageText = `${JSON.stringify(packageValue)}\n`;
  await writeFile(path.join(outputRoot, packageFile), packageText);
  packageBytes += Buffer.byteLength(packageText);
  manifestPackages.push({
    archetypeId,
    label: archetypeId,
    assetId: entry.assetId,
    growthDigest: packageValue.growth.digest,
    file: packageFile,
    atlas: atlasFile
  });
}

const manifest = {
  schema: result.schema,
  packageVersion: result.packageVersion,
  providerRevision: result.providerRevision,
  growthRevision: result.growthRevision,
  growthDigest: result.growthDigest,
  foliageAtlasRevision: result.foliageAtlasRevision,
  speciesCount: 12,
  sourceCommit,
  compiledFrameSize: result.compiledFrameSize ?? null,
  packages: manifestPackages
};
await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const metrics = {
  status: "PASS",
  sourceCommit,
  compilerElapsedMs: result.elapsedMs,
  packageCount: manifestPackages.length,
  packageBytes,
  atlasBytes,
  totalBytes: packageBytes + atlasBytes,
  compiledFrameSize: result.compiledFrameSize ?? null,
  growthRevision: result.growthRevision,
  growthDigest: result.growthDigest,
  providerRevision: result.providerRevision,
  prebuiltUsageDuringCompile: result.prebuiltUsage,
  expectedPrebuiltMissCount: expectedPrebuiltMisses.length,
  browserErrors
};
await writeFile(metricsFile, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));
