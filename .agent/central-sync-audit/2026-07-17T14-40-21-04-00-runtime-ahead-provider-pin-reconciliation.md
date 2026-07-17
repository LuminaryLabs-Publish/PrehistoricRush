# Runtime-Ahead Provider Pin Reconciliation

**Timestamp:** `2026-07-17T14-40-21-04-00`

## Organization comparison

```txt
LuminaryLabs-Publish repositories: 11
eligible after excluding TheCavalryOfRome: 10
central ledgers present: 10
root .agent states present: 10
new repositories: 0
ledger-missing repositories: 0
root-agent-missing repositories: 0
undocumented repositories: 0
runtime-ahead repositories: 1
selected: LuminaryLabs-Publish/PrehistoricRush
```

## Runtime delta

```txt
previous documented head: 8cd649cb87fd98442116b2f3eff7496ea4c74e9c
reviewed runtime-ahead head: 47788818edec7d49753f942a69ef392a8b092037
changed file: src/shared/runtime-versions.js
old Nexus pin: c82782d00c135de0418bee777d30b463de6ff4ca
new Nexus pin: d41992636de2752f1ad9047b80701e6313f19b87
```

The new Nexus revision repairs the Foliage placement-recipe service binding. The product consumes the pin in both its main browser runtime and patch Worker.

## Repo-local reconciliation

Added the timestamped tracker, turn ledger and focused architecture, render, gameplay, interaction, vegetation-system and deploy audits. Refreshed the root `.agent` entry points and registry. Runtime and deployment code were not modified by this documentation pass.

## Central reconciliation required

Update `LuminaryLabs-Dev/LuminaryLabs`:

```txt
repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
internal-change-log/2026-07-17T14-40-21-04-00-prehistoric-rush-pinned-vegetation-provider-admission.md
```

## Boundary

This pass records the implemented pin repair and proposes executable provider-admission proof. It does not claim live CDN, browser, Worker, artifact or Pages validation.