# Render lifecycle: removing the 120ms debounce safely

The nodes pipeline (`f-flow.component.ts`, `_listenNodesChanges`) coalesces node/connector
changes with `notifyOnStart() → debounceTime(120) → afterNextPaint()`. The 120ms wall clock
looks redundant — the store already coalesces bursts per microtask, `afterNextPaint` restarts
its double rAF on every notification, and correctness is held by revision bookkeeping — but a
2026-10-24 adversarial audit of a bare removal found it silently acts as a grace window for
four things. These are the requirements for removing it properly; a bare removal was tried,
audited and reverted.

## What the naive removal broke (audited, each confirmed against the code)

1. **Async-loaded flows latch the lifecycle on an empty canvas.** The `notifyOnStart`
   bootstrap pass runs ~2 frames after init; with data arriving between ~2 frames and 120ms
   (ordinary HTTP), `NotifyNodesRendered`/`NotifyFullRendered` latch on zero nodes, the
   documented `(fFullRendered)="fitToScreen()"` pattern silently no-ops forever, and FF1009
   is masked because `isNodesRendered` is already true. The restartable 120ms debounce used
   to merge the bootstrap with the data arrival.
2. **Store changes landing mid-drag are dropped.** The `IsDragStarted` guard swallows the
   pass and nothing re-arms it; pre-removal the 120ms window often survived past pointer-up.
3. **Dev diagnostics fire on transient states** (FF1008/FF1010/FF1011) that the settle
   window used to hide.
4. **`SortNodeLayers` re-appends every group child to the DOM on every pass** — with more
   frequent passes this restarts CSS transitions and burns layout on graphs with groups.

Also noted: the initial `fitToScreen` measures pre-webfont/pre-image geometry and nothing
re-fits. That is true with and without the debounce (fonts regularly take >120ms) — it is
not a lifecycle problem; the planned initial-view feature (hide until ready, fit before
reveal) is the right place to handle it.

## The rework

- Keep the pipeline wall-clock-free: `notifyOnStart() → afterNextPaint()`; coalescing =
  store microtask + double-rAF restart.
- **Empty-bootstrap grace** (fixes 1): while the store has zero nodes and a one-shot 120ms
  grace since the first empty pass has not elapsed, the pass defers itself instead of
  latching the lifecycle. Nodes arriving within the grace run a normal pass immediately;
  a legitimately empty flow completes its lifecycle after the grace, exactly as before.
- **Drag re-arm** (fixes 2): a pass swallowed by the drag guard sets a store flag;
  `EmitEndDragSequenceEvent` re-emits node changes when the flag is set, so the skipped
  pass runs right after pointer-up instead of being lost.
- **Diagnostics settle** (fixes 3): `RunDevDiagnostics` is scheduled behind its own 120ms
  settle timer (dev mode only) instead of running inside every pass.
- **Sort dirty-check** (fixes 4): `SortNodeLayers` simulates the final order first and
  skips all DOM moves when the container already matches; `SortItemsByParent` already
  early-exits when nothing precedes its parent.

Net effect: `fNodesRendered`/`fFullRendered`/`fLoaded` fire ~120ms earlier for
synchronously-populated flows (the common case), with no behavior change for empty flows,
slow-data flows, drags, diagnostics noise, or group sorting.
