import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createPrehistoricRushPauseMenuDomainKit,
  PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR,
  PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR
} from "../src/domains/prehistoric-rush/pause-menu-domain-kit.js";

const resources = new Map();
const emitted = [];
const menus = new Map();
let presentationConfig = {};
const world = {
  setResource(resource, value) { resources.set(resource.name, structuredClone(value)); },
  getResource(resource) { return resources.get(resource.name); },
  emit(event, payload) { emitted.push({ event: event.name, payload: structuredClone(payload) }); }
};
const engine = {
  n: {
    coreUI: {
      setDescriptor(type, id, value) {
        menus.set(`${type}:${id}`, structuredClone(value));
      }
    },
    corePresentation: {
      getState: () => ({ config: structuredClone(presentationConfig) }),
      configure(patch) {
        presentationConfig = { ...presentationConfig, ...structuredClone(patch) };
      }
    }
  }
};
const NexusEngine = {
  defineResource: (name) => ({ kind: "resource", name }),
  defineEvent: (name) => ({ kind: "event", name }),
  defineDomainServiceKit: (config) => config
};

const kit = createPrehistoricRushPauseMenuDomainKit(NexusEngine);
assert.equal(kit.domainPath, "n:prehistoric-rush:pause-menu");
assert.equal(kit.metadata.blocksSimulation, false);
kit.initWorld({ world });
const pauseMenu = kit.createApi({ engine, world });
assert.deepEqual(pauseMenu.getState(), { open: false, view: "main", selectedAction: null, sequence: 0 });
assert.doesNotThrow(() => structuredClone(pauseMenu.snapshot()));

assert.deepEqual(
  menus.get("menus:prehistoric-rush-pause-menu"),
  PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR,
  "Core UI receives the non-blocking menu descriptor"
);
assert.deepEqual(
  presentationConfig.overlays["prehistoric-rush-pause-overlay"],
  PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR,
  "Core Presentation receives the overlay policy"
);
assert.equal(PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR.blocksSimulation, false);
assert.equal(PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR.blocksSimulation, false);

pauseMenu.open();
assert.equal(pauseMenu.getState().open, true);
pauseMenu.showSettings();
assert.equal(pauseMenu.getState().view, "settings");
assert.equal(pauseMenu.getState().selectedAction, "settings");
const exitEventsBefore = emitted.filter((entry) => entry.event.endsWith("exit-requested")).length;
pauseMenu.requestExit();
pauseMenu.requestExit();
const exitEventsAfter = emitted.filter((entry) => entry.event.endsWith("exit-requested")).length;
assert.equal(exitEventsAfter - exitEventsBefore, 1, "one exit request is emitted");
pauseMenu.close();
assert.equal(pauseMenu.getState().open, false);
pauseMenu.toggle();
assert.equal(pauseMenu.getState().open, true);
pauseMenu.reset();
assert.deepEqual(pauseMenu.getState(), { open: false, view: "main", selectedAction: null, sequence: 0 });

const gameEntry = await readFile(new URL("../src/game.js", import.meta.url), "utf8");
const gameRuntime = await readFile(new URL("../src/game-runtime.js", import.meta.url), "utf8");
const domainEntry = await readFile(new URL("../src/domains/prehistoric-rush/prehistoric-rush-domain-kit.js", import.meta.url), "utf8");
assert.doesNotMatch(
  gameEntry,
  /\bpatchStats\b|ui\.status|ui\.button|const panel = document\.createElement\("aside"\)|<b[^>]*>Prehistoric Rush<\/b>/,
  "the public game entry contains no always-visible gameplay HUD"
);
assert.match(gameEntry, /id="tree-load-fill"/, "startup may present required asset readiness progress");
assert.match(gameEntry, /data\.presentationId = "prehistoric-rush-pause-overlay"/, "the public entry may render the requested pause overlay");
assert.match(gameEntry, /event\.code !== "Escape"/, "Escape toggles the menu host");
assert.match(gameEntry, /pauseMenu\.toggle\(\)/, "Escape delegates to the pause-menu DSK");
assert.match(gameEntry, /pauseMenu\.showSettings\(\)/, "Settings delegates to the pause-menu DSK");
assert.match(gameEntry, /pauseMenu\.requestExit\(\);[\s\S]*?location\.href = "\.\/menu\.html"/, "the host navigates only after an exit request");
assert.doesNotMatch(gameEntry, /function syncFrame\(|requestAnimationFrame\(syncFrame\)/, "the pause menu has no permanent synchronization frame loop");
assert.match(gameRuntime, /engine\.tick\(dt\);/, "simulation ticking remains unconditional in the runtime loop");
assert.doesNotMatch(gameRuntime, /pauseMenu[^\n]*engine\.tick|if \([^)]*pause[^)]*\)[\s\S]{0,80}engine\.tick/, "pause-menu state does not gate simulation ticking");
assert.match(domainEntry, /createCorePresentationDomain/, "the game graph installs Core Presentation");
assert.match(domainEntry, /createPrehistoricRushPauseMenuDomainKit/, "the game graph installs the product pause-menu DSK");

console.log("pause menu authority test ok");
