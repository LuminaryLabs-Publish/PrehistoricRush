# Implementation Graph

```text
.agent/target.md
        |
        v
PrehistoricRush art-direction preset
        |
        +-------------------------------+
        |                               |
        v                               v
foliage card recipes             vegetation descriptors
(core/shell/fringe)              (roots/trunk/canopy)
        |                               |
        +---------------+---------------+
                        v
              Nexus Object Vegetation
              + Tree + Foliage Domains
                        |
                        v
                  Core Compute
                        |
                        v
               deterministic growth plan
                        |
            +-----------+-----------+
            |                       |
            v                       v
 natural tree geometry       compute foliage shading
 organic wood realization    existing card authority
            |                       |
            +-----------+-----------+
                        v
                Object Shape/Fidelity
                        |
                        v
            near / medium / far / horizon
                        |
                        v
               Three production renderer
                        |
          +-------------+-------------+
          |                           |
          v                           v
 fixed validation labs          production game
          |                           |
          +-------------+-------------+
                        v
              browser evidence + metrics
                        |
                        v
                Headless change ledger
```

## No duplicate owners

- PrehistoricRush owns authored values and game rules.
- Nexus owns renderer-neutral tree/foliage/growth/Fidelity semantics.
- Three modules only realize the semantic outputs.
- Validation scenes import the production modules; they do not carry a second tree implementation.
