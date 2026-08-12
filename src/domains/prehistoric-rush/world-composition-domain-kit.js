import {
  DEFAULT_PREHISTORIC_WORLD_ID,
  PREHISTORIC_WORLD_RECIPES,
  getPrehistoricRushWorldRecipe
} from "./world-recipes.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);

function selectionFor(recipe, sequence = 0) {
  return {
    selectedWorldId: recipe.id,
    seed: recipe.seed,
    recipeRevision: recipe.revision,
    sequence: Number(sequence)
  };
}

function publicRecipe(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    revision: recipe.revision,
    seed: recipe.seed,
    terrain: clone(recipe.terrain),
    hydrology: clone(recipe.hydrology),
    ecology: clone(recipe.ecology),
    route: clone(recipe.route),
    runtime: clone(recipe.runtime),
    presentation: clone(recipe.presentation)
  };
}

export function createPrehistoricRushWorldCompositionDomainKit(NexusEngine, config = {}) {
  const {
    defineDomainServiceKit,
    defineResource,
    defineEvent,
    createUniformGridPartition,
    createFlatWorldSurface
  } = NexusEngine;
  for (const [name, value] of Object.entries({
    defineDomainServiceKit,
    defineResource,
    defineEvent,
    createUniformGridPartition,
    createFlatWorldSurface
  })) {
    if (typeof value !== "function") throw new TypeError(`Pinned NexusEngine module is missing ${name}().`);
  }

  const recipes = Object.freeze([...(config.recipes ?? PREHISTORIC_WORLD_RECIPES)]);
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const fallbackRecipe = recipeById.get(DEFAULT_PREHISTORIC_WORLD_ID) ?? recipes[0];
  if (!fallbackRecipe) throw new TypeError("PrehistoricRush world composition requires at least one world recipe.");
  const selectedRecipe = recipeById.get(String(config.selectedWorldId ?? "")) ?? fallbackRecipe;
  const cellSize = Number(config.cellSize ?? 56);
  const cellRadius = Number(config.cellRadius ?? 2);

  const SelectionState = defineResource("prehistoric-rush.world-selection");
  const WorldSelected = defineEvent("prehistoric-rush.world-selected");
  const WorldFocusSynchronized = defineEvent("prehistoric-rush.world-focus-synchronized");

  return defineDomainServiceKit({
    id: config.id ?? "prehistoric-rush-world-composition-domain-kit",
    domain: "prehistoric-rush-world-composition",
    domainPath: "n:prehistoric-rush:world-composition",
    parentDomainPath: "n:prehistoric-rush",
    apiName: config.apiName ?? "prehistoricRushWorldComposition",
    version: "1.0.0",
    stability: "game",
    services: ["recipe-binding", "world-selection", "core-world-registration", "world-focus", "snapshot"],
    requires: ["n:prehistoric-rush", "n:world", "n:core-scene"],
    resources: { SelectionState },
    events: { WorldSelected, WorldFocusSynchronized },
    initWorld({ world }) {
      world.setResource(SelectionState, selectionFor(selectedRecipe));
    },
    createApi({ engine, world }) {
      const coreWorld = engine.coreWorld ?? engine.n?.coreWorld;
      if (!coreWorld) throw new Error("PrehistoricRush world composition requires Core World.");

      for (const recipe of recipes) {
        if (coreWorld.getWorldDefinition(recipe.id)) continue;
        coreWorld.registerWorld({
          id: recipe.id,
          seed: String(recipe.seed),
          focus: { position: { x: 0, y: 0, z: 0 } },
          partition: createUniformGridPartition({
            id: `${recipe.id}:stream-grid`,
            cellSize,
            radius: cellRadius
          }),
          surface: createFlatWorldSurface({ id: `${recipe.id}:surface` }),
          providers: [],
          settings: {
            recipeId: recipe.id,
            recipeRevision: recipe.revision,
            recipe: publicRecipe(recipe)
          }
        });
      }

      const getSelection = () => world.getResource(SelectionState);
      const getRecipe = (id) => recipeById.get(String(id ?? "")) ?? fallbackRecipe;

      function selectWorld(id, options = {}) {
        const recipe = getRecipe(id);
        const current = getSelection();
        const next = selectionFor(recipe, Number(current?.sequence ?? 0) + 1);
        world.setResource(SelectionState, next);
        world.emit(WorldSelected, { selection: clone(next), recipe: publicRecipe(recipe) });
        if (options.scenePayload === true) {
          engine.coreScene?.enterScene?.({
            sceneId: options.sceneId ?? "game",
            source: "prehistoric-rush-world-composition",
            payload: {
              ...(options.payload ?? {}),
              worldId: recipe.id,
              worldSeed: recipe.seed,
              worldRecipeRevision: recipe.revision
            }
          });
        }
        return clone(next);
      }

      function syncFocus(focus = {}) {
        const selection = getSelection();
        const recipe = getRecipe(selection?.selectedWorldId);
        coreWorld.setFocus(recipe.id, clone(focus));
        const snapshot = coreWorld.updateWorld(recipe.id);
        world.emit(WorldFocusSynchronized, {
          worldId: recipe.id,
          focus: clone(focus),
          activeCellCount: snapshot?.activeCells ? Object.keys(snapshot.activeCells).length : 0
        });
        return snapshot;
      }

      return {
        listWorlds: () => recipes.map(publicRecipe),
        getRecipe: (id = getSelection()?.selectedWorldId) => publicRecipe(getRecipe(id)),
        getSelection: () => clone(getSelection()),
        selectWorld,
        syncFocus,
        getCoreWorld: (id = getSelection()?.selectedWorldId) => coreWorld.getWorld(id),
        snapshot: () => ({
          selection: clone(getSelection()),
          worlds: coreWorld.snapshotWorlds({ includeProviders: false })
        })
      };
    },
    metadata: {
      purpose: "Bind PrehistoricRush-authored world recipes and selection state to Core World without introducing a parallel world manager.",
      owns: ["PrehistoricRush world recipes", "selected world identity", "PrehistoricRush-to-Core-World binding"],
      doesNotOwn: ["Core World lifecycle", "terrain generation", "world geometry", "rendering", "physics", "worker execution", "browser navigation"],
      coreWorldAuthority: true,
      productRecipeAuthority: true,
      asyncExecutionAdapter: "seeded-world-patch-controller",
      deterministic: true,
      rendererAgnostic: true,
      snapshot: true
    }
  });
}

export default createPrehistoricRushWorldCompositionDomainKit;
