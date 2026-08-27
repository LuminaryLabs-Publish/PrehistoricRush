# Racer model candidates

These assets are reviewable runtime variants, not production defaults.

`triceratops-guided-v1.glb` is linked to the `triceratops` roster ID through `src/services/racer-model-service.js`. It can be loaded with `game.html?racer=triceratops&model=reviewed-candidate`. The existing rigged Triceratops remains the default because this candidate has no rig or animation clips and still requires user art approval.

The procedural generator is intentionally absent from this repository. Its AST, transactions, validation, and review runner live in `LuminaryLabs-Dev/NexusFactory-Kits/tools/triceratops-mesh-editor`.
