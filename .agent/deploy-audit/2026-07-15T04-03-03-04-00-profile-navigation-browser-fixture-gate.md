# Deploy Audit: Profile Navigation Browser Fixture Gate

**Timestamp:** `2026-07-15T04-03-03-04-00`

## Summary

The current Node test checks creator source composition and placement behavior. It does not run a browser, timers, anchor navigation, page lifecycle, localStorage, BroadcastChannel, or the destination game route. Source/build/Pages parity for the final creator edit is therefore unproven.

## Plan ledger

**Goal:** block a production-readiness claim until pending creator edits survive route changes and produce the matching game character on source, built, and deployed origins.

- [x] Identify missing browser and deployment evidence.
- [x] Define deterministic fixture rows.
- [x] Preserve documentation-only scope.
- [ ] Add fixtures to the repository test workflow.
- [ ] Run them against source, built artifact, and GitHub Pages.

## Required fixture matrix

```txt
A. input then wait >160 ms then Play
B. input then immediate Play
C. input then immediate Menu
D. keyboard activation of Play while dirty
E. repeated Play activation while commit is pending
F. pagehide while dirty
G. beforeunload while dirty
H. localStorage unavailable
I. localStorage setItem throws quota error
J. invalid candidate normalization
K. remote BroadcastChannel update during pending local mutation
L. storage event during pending local mutation
M. game receives expected revision and payload hash
N. game detects a mismatched destination receipt
O. first visible character frame matches profile and body hash
```

## Assertions

```txt
no accepted route navigation while dirty without an accepted commit
exactly one accepted stored revision for one navigation intent
failed storage leaves creator visible with recoverable status
stale or conflicting work never overwrites silently
source and build behavior match
GitHub Pages behavior matches the build artifact
public readback exposes expected and accepted profile identities
first frame receipt matches the composed creature body
```

## Current validation status

```txt
npm test: not run in this audit
browser timer/navigation fixture: unavailable
page lifecycle fixture: unavailable
storage failure fixture: unavailable
cross-document concurrency fixture: unavailable
destination receipt fixture: unavailable
visible character frame fixture: unavailable
built-output smoke: not run
GitHub Pages smoke: not run
```

No durable creator-navigation, profile/body convergence, deployment parity, or production-readiness claim is made.