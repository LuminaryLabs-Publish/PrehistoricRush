import assert from "node:assert/strict";
import fs from "node:fs";
import { createPrehistoricRushCourseDomainKit } from "../src/domains/prehistoric-rush/course-domain-kit.js";
import { createDrunkRouteGenerator } from "../src/domains/prehistoric-rush/kits/drunk-route-generator.js";

const NexusEngine = {
  defineDomainServiceKit: (descriptor) => descriptor
};

const courseKit = createPrehistoricRushCourseDomainKit(NexusEngine);
assert.equal(courseKit.domainPath, "n:prehistoric-rush:course");
assert.equal(courseKit.parentDomainPath, "n:prehistoric-rush");
assert.equal(courseKit.apiName, "prehistoricRushCourse");
assert.ok(courseKit.services.includes("route"));
assert.deepEqual(courseKit.requires, ["n:prehistoric-rush"]);
assert.deepEqual(courseKit.metadata.owns, ["playable route", "route proximity", "route surface classification"]);
assert.ok(courseKit.metadata.doesNotOwn.includes("terrain generation"));

const course = courseKit.createApi({});
const baseline = createDrunkRouteGenerator();
assert.deepEqual(course.route.snapshot(), baseline.snapshot());
assert.deepEqual(course.snapshot(), baseline.snapshot());
assert.deepEqual(course.nearest(0, -18, 0, 120), baseline.nearest(0, -18, 0, 120));
for (const distance of [0, 4, 6, 7]) {
  assert.equal(course.classify(distance, 3.1), baseline.classify(distance, 3.1));
}

const runtimeSource = fs.readFileSync(new URL("../src/domains/prehistoric-rush/prehistoric-rush-domain-runtime.js", import.meta.url), "utf8");
assert.doesNotMatch(runtimeSource, /createDrunkRouteGenerator/);
assert.match(runtimeSource, /prehistoricRushCourse\?\.route/);
assert.match(runtimeSource, /routeCompatibilityFacade: true/);
assert.doesNotMatch(runtimeSource, /services: \["run", "route"/);

const wrapperSource = fs.readFileSync(new URL("../src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js", import.meta.url), "utf8");
const courseIndex = wrapperSource.indexOf("createPrehistoricRushCourseDomainKit(NexusEngine, config)");
const worldIndex = wrapperSource.indexOf("createPrehistoricRushWorldCompositionDomainKit(NexusEngine");
assert.ok(courseIndex >= 0, "course domain must be composed");
assert.ok(worldIndex > courseIndex, "course domain must be composed before world composition consumers");

console.log("P1 course domain boundary: ok");
