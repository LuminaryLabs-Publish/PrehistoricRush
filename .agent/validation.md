# PrehistoricRush Validation

**Audit timestamp:** `2026-07-15T16-00-32-04-00`  
**Scope:** semantic gameplay status, distance progress, terminal announcements, pause dialog and focus lifecycle

## Summary

Source review confirms that the game creates a plain status `div`, replaces its HTML every RAF callback, represents distance with styled nested `div` elements, and changes the primary action label for game, retry and win states. The pause host creates a labeled section but defines no dialog role, modal adoption, initial focus, containment, background inertness or focus restoration.

## Plan ledger

**Goal:** distinguish verified source behavior from browser accessibility, assistive-technology, artifact and deployment evidence that was not executed.

- [x] Compare all 11 Publish repositories and select the oldest synchronized eligible repository.
- [x] Inspect the active game shell, RAF status updates and action-label changes.
- [x] Inspect pause overlay creation, keyboard toggling and removal.
- [x] Preserve the complete 66-surface inventory.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Execute accessibility fixtures later.

## Verified source findings

```txt
reviewed current repository head: 1e947c398512806e2236d07d9d64fae1cccd6677
reviewed runtime source revision: 4808f05cff438ff5a9d013cd7ddec5127bbcf213
game root accessible label: present
semantic menu links: present
primary gameplay button: present
status role/live policy: absent
semantic progress range/value: absent
terminal announcement result: absent
pause accessible label: present
pause dialog role: absent
accepted modal state: absent
initial focus/containment/restoration: absent
AccessibleGameplayProjectionResult: absent
FirstAccessibleGameplayFrameAck: absent
```

## Source-derived interaction paths

```txt
RAF -> accepted state -> visible frame -> status HTML replacement -> no semantic frame receipt
Escape -> pause toggle -> labeled section mount -> no focus admission result
close -> overlay removal -> no explicit focus restoration result
```

These paths prove missing source-backed authorities. They do not prove a specific screen-reader or keyboard symptom because no browser accessibility fixture was executed.

## Change boundary

```txt
documentation changed: yes
runtime JavaScript changed: no
HTML or CSS changed: no
simulation or gameplay changed: no
rendering changed: no
accessibility runtime behavior changed: no
dependencies or package scripts changed: no
tests or workflows changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Checks not completed

```txt
npm test
keyboard-only browser fixture
accessibility-tree capture
screen-reader announcement fixture
pause focus entry/containment/restoration fixture
pagehide and route-retirement focus fixture
built-output smoke
GitHub Pages smoke
```

## Non-claims

No semantic runtime projection, live-announcement correctness, progressbar correctness, keyboard-focus correctness, assistive-technology compatibility, passing test, artifact parity, deployment parity or production readiness is claimed.