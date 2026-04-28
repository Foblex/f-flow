# Smart Auto-Layout on Resize — Implementation Plan

**Status:** Phases 1–2 shipped. Phase 3 (animator) was implemented and then removed by product decision — shifts apply synchronously through `position.set`. Remaining phases pending.
**Target:** Full feature delivered across the remaining phases. No MVP release — the feature is considered "done" only when all remaining phases are merged. Phases are dependency-ordered building blocks, not shippable subsets.
**Total estimate:** ~29–37 focused engineering days (original plan; Phase 3 dropped).
**Public surface:** `provideFFlow(withReflowOnResize({ ... }))` — first plugin on the new provide-based configuration surface (roadmap item #5).

---

## 1. Overview

When a node (or group) changes size — via resize handles, `fAutoSizeToFitChildren`, or programmatic size binding — nearby nodes shift automatically to preserve a clean layout. No manual cleanup after a resize.

The feature is **stateless by design**: every plan is computed from the current graph state plus the current delta. No history, no bookkeeping, no new fields in `getState()` / `toJSON()`. Expand + Collapse is **not** guaranteed to return the original layout — this is an explicit, documented consequence.

Integration is exactly **one hook**: the existing `UpdateNodeWhenStateOrSizeChanged` execution. This single path catches every resize source (drag-handle, content-driven, programmatic) and naturally honors the existing drag-freeze guard (`_isDragging()`).

Configuration is provider-based, through a new public entrypoint:

```typescript
import { provideFFlow, withReflowOnResize, EFReflowMode } from '@foblex/flow';

bootstrapApplication(AppComponent, {
  providers: [
    provideFFlow(
      { id: 'main-flow' },                        // optional base config
      withReflowOnResize({
        mode: EFReflowMode.CENTER_OF_MASS,
        animation: { duration: 200 },
      }),
      // later: withMinimap(), withMagneticLines(), ...
    ),
  ],
});
```

This ships the composer infrastructure required by roadmap item #5. Other plugins migrate into `with*()` coexistently — existing `<f-minimap>`, `<f-magnetic-lines>`, etc. keep working unchanged.

---

## 2. Public API

### 2.1 `provideFFlow(baseConfig?, ...features)`

```typescript
// Overloads
function provideFFlow(...features: FFlowFeature[]): Provider[];
function provideFFlow(config: IFFlowConfig, ...features: FFlowFeature[]): Provider[];

interface IFFlowConfig {
  id?: string;                 // default flow id; overridden by [fFlowId] input
}

interface FFlowFeature {
  readonly kind: EFFlowFeatureKind;
  readonly providers: Provider[];
}

enum EFFlowFeatureKind {
  ReflowOnResize = 'reflow-on-resize',
  // future: Minimap, MagneticLines, MagneticRects, AutoPan, PathHighlighting, Animation
}
```

Composer is a flat aggregator. First-arg overload is detected by absence of `.kind`. Emits:

- `F_FLOW_CONFIG` token (provides merged `IFFlowConfig`) — read by `<f-flow>` for `id` fallback.
- Flattened provider arrays from each feature.

**Priority for `id`:** `[fFlowId]` input > `provideFFlow({ id })` > auto-generated.

### 2.2 `withReflowOnResize(config?)`

```typescript
function withReflowOnResize(config?: IFReflowOnResizeConfig): FFlowFeature;

interface IFReflowOnResizeConfig {
  enabled?: boolean;                             // default true
  mode?: EFReflowMode;                           // default CENTER_OF_MASS
  collision?: EFReflowCollision;                 // default STOP
  scope?: EFReflowScope;                         // default GLOBAL
  axis?: EFReflowAxis;                           // default BOTH
  deltaSource?: EFReflowDeltaSource;             // default EDGE_BASED
  spacing?: {
    vertical?: number;                           // canvas units, default 16
    horizontal?: number;                         // canvas units, default 16
  };
  animation?: {
    enabled?: boolean;                           // default true
    duration?: number;                           // ms, default 200
    easing?: EFReflowEasing | ((t: number) => number);  // default 'ease-out'
    respectReducedMotion?: boolean;              // default true
  };
  maxCascadeDepth?: number;                      // default 8
  maxAbsoluteShiftPerPlan?: number;              // canvas units, default 10000 (safety clamp)
}
```

All fields optional. Feature applies defaults at the token level.

### 2.3 Enums

```typescript
enum EFReflowMode {
  CENTER_OF_MASS = 'center-of-mass',
  X_RANGE = 'x-range',
  DOWNSTREAM_CONNECTIONS = 'downstream-connections',
}

enum EFReflowCollision {
  STOP = 'stop',
  CHAIN_PUSH = 'chain-push',
}

enum EFReflowScope {
  GLOBAL = 'global',
  GROUP = 'group',
  CONNECTED_SUBGRAPH = 'connected-subgraph',
}

enum EFReflowAxis {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  BOTH = 'both',
}

enum EFReflowDeltaSource {
  EDGE_BASED = 'edge-based',       // correct under asymmetric resize
  CENTER_BASED = 'center-based',   // simpler, per roadmap §3 formula
}

enum EFReflowEasing {
  LINEAR = 'linear',
  EASE_IN = 'ease-in',
  EASE_OUT = 'ease-out',
  EASE_IN_OUT = 'ease-in-out',
}
```

### 2.4 Per-node directives

```html
<f-node fReflowIgnore>...</f-node>      <!-- this node is never shifted -->
```

- `fReflowIgnore` — node excluded from the candidate pool. Useful for sticky annotations, pinned UI, legends.
- `fReflowAnchor` — deferred to v2. (Node does not _initiate_ a plan when it resizes, but can still be shifted.)

Both live on `<f-node>` and `<f-group>`. They read `input<boolean>` signals; the planner filters candidates against them.

### 2.5 Runtime controller

```typescript
const reflow = inject(FReflowController);

reflow.setConfig({ animation: { enabled: false } });  // merges into current config
reflow.getConfig();                                    // readonly signal
reflow.skipActiveAnimation();                          // jump to final positions
reflow.isEnabled;                                      // signal<boolean>
```

Controller is provided by `withReflowOnResize` — absent when the feature isn't activated. Consumers can `inject(FReflowController, { optional: true })`.

### 2.6 Outputs on `<f-flow>`

**None.** Position changes from reflow flow through the existing `fMoveNodes` / `fNodeMoved` channel — reflow writes via `nodeOrGroup.updatePosition()`, indistinguishable from a user drag from the consumer's perspective. No reflow-specific event is added.

If a future use case requires distinguishing auto-shifted vs user-driven (telemetry, audit), it can be surfaced through `FReflowController` as a debug-only signal, without a public output.

---

## 3. Architecture

```
                   ┌──────────────────────────────────────────┐
                   │  UpdateNodeWhenStateOrSizeChanged        │
                   │  (existing — the single integration hook) │
                   └───────────────┬──────────────────────────┘
                                   │ after invalidate + connector-side calc + FitToChildNodesAndGroups
                                   │ (guarded by !_isDragging)
                                   ▼
                   ┌──────────────────────────────────────────┐
                   │  RunReflowOnResizeRequest                 │
                   │  { nodeOrGroup, baselineRect }            │
                   └───────────────┬──────────────────────────┘
                                   ▼
                   ┌──────────────────────────────────────────┐
                   │  FReflowOrchestrator                      │
                   │  - resolves config from F_REFLOW_CONFIG   │
                   │  - guards: enabled, reduced-motion,       │
                   │    viewport-anim, re-entrancy             │
                   └───────────────┬──────────────────────────┘
                                   ▼
                   ┌──────────────────────────────────────────┐
                   │  FReflowPlanner  (pure, stateless)        │
                   │                                           │
                   │  1. FReflowDeltaCalculator                │
                   │     (EDGE_BASED | CENTER_BASED)           │
                   │  2. Selection strategy                    │
                   │     (CENTER_OF_MASS | X_RANGE             │
                   │      | DOWNSTREAM_CONNECTIONS)            │
                   │  3. Scope filter                          │
                   │     (GLOBAL | GROUP | CONNECTED_SUBGRAPH) │
                   │  4. Collision resolver                    │
                   │     (STOP | CHAIN_PUSH)                   │
                   │                                           │
                   │  Output: IReflowPlan { shifts[] }         │
                   └───────────────┬──────────────────────────┘
                                   ▼
                   ┌──────────────────────────────────────────┐
                   │  FReflowAnimator                          │
                   │  - requestAnimationFrame tween            │
                   │  - prefers-reduced-motion honored         │
                   │  - cancel-on-new-plan                     │
                   │  - writes via nodeOrGroup.updatePosition  │
                   │    + redraw                               │
                   └───────────────┬──────────────────────────┘
                                   ▼
                   ┌──────────────────────────────────────────┐
                   │  - EmitConnectionsChangesRequest          │
                   │  - fMoveNodes emits per shifted node       │
                   │    (existing channel — no new output)     │
                   └──────────────────────────────────────────┘
```

### Named pieces

| Name                                        | Kind                   | Responsibility                                                         |
| ------------------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `provideFFlow`                              | function               | Composer; emits `F_FLOW_CONFIG` + feature providers                    |
| `withReflowOnResize`                        | function               | Returns `FFlowFeature` with `F_REFLOW_CONFIG` + controller + execution |
| `IFFlowConfig`, `F_FLOW_CONFIG`             | interface + token      | Flow-level base config                                                 |
| `IFReflowOnResizeConfig`, `F_REFLOW_CONFIG` | interface + token      | Feature config                                                         |
| `FReflowController`                         | `@Injectable()`        | Public runtime API (`setConfig`, `skipActiveAnimation`)                |
| `FReflowOrchestrator`                       | `@Injectable()`        | Reacts to mediator request, drives planner + animator                  |
| `FReflowPlanner`                            | `@Injectable()` (pure) | Computes `IReflowPlan` from geometry + delta                           |
| `FReflowDeltaCalculator`                    | Interface + 2 impls    | Edge-based / center-based delta                                        |
| `IReflowSelectionStrategy`                  | Interface + 3 impls    | Picks candidate nodes                                                  |
| `IReflowCollisionResolver`                  | Interface + 2 impls    | `STOP`, `CHAIN_PUSH`                                                   |
| `IReflowScopeFilter`                        | Interface + 3 impls    | `GLOBAL`, `GROUP`, `CONNECTED_SUBGRAPH`                                |
| `FReflowAnimator`                           | `@Injectable()`        | rAF tween, reduced-motion, cancel logic                                |
| `FReflowCycleGuard`                         | helper                 | `Set<fId>` visited tracker                                             |
| `RunReflowOnResizeRequest`                  | mediator request       | Entry point from `UpdateNodeWhenStateOrSizeChanged`                    |
| `RunReflowOnResize`                         | mediator execution     | Thin wrapper → orchestrator                                            |
| `FReflowIgnore` (directive)                 | Angular directive      | `fReflowIgnore` flag on `<f-node>` / `<f-group>`                       |

### Data flow invariants

1. **Delta is computed once** per hook invocation, from `FCache` baseline (read before `InvalidateFCacheNodeRequest`) versus `GetNormalizedElementRectRequest` output.
2. **All geometry is in canvas units** — rects are already normalized by `_transform.scale` in `GetNormalizedElementRectRequest`. Spacing values flow through unchanged.
3. **Planner is pure** — inputs: current rects of all candidates + delta + config. Outputs: `IReflowPlan`. No side effects.
4. **Only the animator mutates** — via `nodeOrGroup.updatePosition()` + `redraw()`. No direct DOM writes.
5. **Emissions are synchronous** — `fMoveNodes` (existing channel) fires immediately after shifts apply via `position.set`.

---

## 4. File layout

### New files (under `libs/f-flow/src/`)

```
libs/f-flow/src/
  provide-f-flow/                                 ← NEW, composer infrastructure
    provide-f-flow.ts
    f-flow-feature.ts                             (FFlowFeature, EFFlowFeatureKind)
    i-f-flow-config.ts                            (IFFlowConfig, F_FLOW_CONFIG token)
    index.ts

  plugins/
    layout/
      f-reflow-on-resize/                         ← NEW feature slice
        index.ts
        with-reflow-on-resize.ts                  (public entrypoint)
        i-f-reflow-on-resize-config.ts            (config + F_REFLOW_CONFIG token + defaults)
        f-reflow-controller.ts                    (public runtime API)
        i-reflow-plan.ts                          (internal plan shape)

        enums/
          e-f-reflow-mode.ts
          e-f-reflow-collision.ts
          e-f-reflow-scope.ts
          e-f-reflow-axis.ts
          e-f-reflow-delta-source.ts
          e-f-reflow-easing.ts
          index.ts

        orchestrator/
          f-reflow-orchestrator.ts
          index.ts

        run-reflow-on-resize/
          run-reflow-on-resize.ts                 (mediator execution)
          run-reflow-on-resize-request.ts
          index.ts

        planner/
          f-reflow-planner.ts
          f-reflow-planner.spec.ts
          index.ts

        delta/
          i-f-reflow-delta-calculator.ts
          edge-based-delta-calculator.ts
          center-based-delta-calculator.ts
          delta-calculator.spec.ts
          index.ts

        selection/
          i-f-reflow-selection-strategy.ts
          center-of-mass-selection-strategy.ts
          x-range-selection-strategy.ts
          downstream-connections-selection-strategy.ts
          f-reflow-cycle-guard.ts
          selection.spec.ts
          index.ts

        collision/
          i-f-reflow-collision-resolver.ts
          stop-collision-resolver.ts
          chain-push-collision-resolver.ts
          collision.spec.ts
          index.ts

        scope/
          i-f-reflow-scope-filter.ts
          global-scope-filter.ts
          group-scope-filter.ts
          connected-subgraph-scope-filter.ts
          index.ts

        animation/
          f-reflow-animator.ts
          easings.ts
          prefers-reduced-motion.ts
          f-reflow-animator.spec.ts
          index.ts

        directives/
          f-reflow-ignore.ts                      (fReflowIgnore directive)
          index.ts

```

### Modified files

| File                                                                                                             | Change                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/f-flow/src/domain/f-node/update-node-when-state-or-size-changed/update-node-when-state-or-size-changed.ts` | Read `baselineRect` from `FCache` before invalidation; after existing work, fire `RunReflowOnResizeRequest` (guarded by controller presence via optional injection) |
| `libs/f-flow/src/f-flow.module.ts`                                                                               | Register reflow providers when feature is active (resolved via DI, not module-level)                                                                                |
| `libs/f-flow/src/f-flow/providers.ts`                                                                            | Add reflow executions to mediator feature set                                                                                                                       |
| `libs/f-flow/src/f-flow/f-flow.ts`                                                                               | Read `F_FLOW_CONFIG` for `id` fallback                                                                                                                              |
| `libs/f-flow/src/public-api.ts`                                                                                  | Export `provideFFlow`, `withReflowOnResize`, enums, `FReflowController`, directive                                                                                  |
| `apps/f-flow-portal/public/llms.txt`                                                                             | Document new provider surface                                                                                                                                       |
| `apps/f-flow-portal/public/llms-full.txt`                                                                        | Same + detailed API reference                                                                                                                                       |
| `apps/f-flow-portal/src/app/config/documentation-config.ts`                                                      | Add docs page entry                                                                                                                                                 |
| `apps/f-flow-portal/src/app/config/examples-config.ts`                                                           | Add showcase example (Phase 8)                                                                                                                                      |

### Untouched (verified)

- `libs/f-flow/src/f-draggable/resize-node/resize-node-handler/resize-node-handler.ts` — **not modified**. Single integration via `UpdateNodeWhenStateOrSizeChanged` handles it.
- `libs/f-flow/src/f-storage/f-components-store.ts` — no new fields.
- `FNodeBase`, `FCanvasBase`, `IFFlowState` — no new fields. Serialization stays clean.

---

## 5. Phased plan

All phases preserve the architectural constraints (stateless, serialization-clean, idempotent, forward-only).

The feature is **not released until all 8 phases ship.** Phases exist for sequencing, review ergonomics, and to isolate concerns — they are not partial releases. Public API grows monotonically within the pre-release period; no breaking changes across phases.

---

### Phase 1 — Provider infrastructure + base algorithm

**Goal:** Foundation layer — `provideFFlow` + `withReflowOnResize` + vertical `CENTER_OF_MASS` + `STOP` + edge-based delta + no animation (instant writes). Subsequent phases layer on top; this phase is not shipped to users in isolation.

**Scope:**

- Scaffold `provide-f-flow/` (composer, `F_FLOW_CONFIG`, `IFFlowConfig`).
- Scaffold `plugins/layout/f-reflow-on-resize/` (all folders with index.ts barrels, minimal impls).
- Implement:
  - `withReflowOnResize` feature factory with defaults applied.
  - `F_REFLOW_CONFIG` token (useValue).
  - `FReflowController` with `setConfig`, `getConfig`, `isEnabled` (subset; `skipActiveAnimation` no-op in Phase 1).
  - `EdgeBasedDeltaCalculator`.
  - `CenterOfMassSelectionStrategy` (vertical-only path in Phase 1).
  - `GlobalScopeFilter`.
  - `StopCollisionResolver`.
  - `FReflowPlanner` (composes the above).
  - `FReflowOrchestrator` (no animator yet — applies positions synchronously).
  - `RunReflowOnResize` execution.
  - `FReflowIgnore` directive on `<f-node>` / `<f-group>`.
- Integrate into `UpdateNodeWhenStateOrSizeChanged`:
  - Read `baselineRect` from `FCache` via new helper request `GetCachedNodeRectRequest` _or_ direct cache read (TBD during implementation — check cache access pattern).
  - After existing work, invoke `new RunReflowOnResizeRequest(...)`.
  - Controller absence is tolerated — execution is registered only when feature active; if no registration, request is a no-op.
- Wire `<f-flow>` to read `F_FLOW_CONFIG.id` as fallback for `fId`.
- Verify that reflow-driven position writes correctly fire the existing `fMoveNodes` output (they should — `updatePosition()` is the standard path).

**Tests:**

- `planner.spec.ts` — single resize, multiple nodes below, stop-at-collision, isolated node untouched, idempotency (plan run twice = no-op on second).
- `delta-calculator.spec.ts` — edge-based delta on all 8 handle directions (top, bottom, left, right, 4 corners).
- `provide-f-flow.spec.ts` — composer flattens correctly, overloads type-check, id priority (input > provide > auto).
- Integration spec: serialize `getState()` before and after reflow cycle; assert no new keys.
- Regression: full existing resize-node spec suite remains green.

**Exit criteria:**

- Dragging bottom-handle of a node shifts exactly the nodes whose bottom-edge criterion matches, stops at spacing.
- `getState()` identical shape before and after reflow (only `position` values change on shifted nodes).
- `fReflowIgnore` nodes never shift.
- `provideFFlow({ id: 'x' }, withReflowOnResize())` compiles; `[fFlowId]` on `<f-flow>` overrides.

**Estimate:** 5–6 days.

---

### Phase 2 — Collapse semantics, spacing invariants, reverse direction

**Goal:** Algorithmic correctness for negative delta + zoom invariance proof.

**Scope:**

- Negative-delta (collapse) path in `StopCollisionResolver`: candidates return toward resized node, stopping at `spacing` gap with any node above them in the candidate pool.
- Top-handle (grow-up) path — symmetric to bottom-handle.
- Canvas-unit spacing verification — add explicit spec at `scale = 0.5` and `scale = 2` asserting identical post-layout positions.
- Multi-node column: resizing a node in the middle of a vertical stack collapses cleanly.

**Files:** none new. Modify `planner/`, `collision/stop-collision-resolver.ts`, `delta/edge-based-delta-calculator.ts`.

**Tests:**

- Collapse scenarios (6-8 cases).
- Zoom-invariance spec.
- Grow-up scenarios (4-6 cases).

**Exit criteria:** plan results pixel-identical across zoom levels; expand and collapse symmetric.

**Estimate:** 2–3 days.

---

### Phase 3 — Animation driver — **REMOVED**

**Status:** Implemented in commit `94593248` and immediately reverted by
product decision. The animator delegated `position.set` writes to a rAF
loop with easing, reduced-motion handling, and cancel-on-reentry. After
testing in call-center, the team decided shifts should apply
synchronously — the visual snap is preferable to managing the additional
state space (mid-animation cancellations, signal-effect re-entrancy,
viewport-anim coordination, race conditions during consumer-side reset).

**Decision recorded:** the feature ships _without_ animations. Shifts
land instantly through `position.set`. If a future need arises, the
animator can be reintroduced as an optional `withReflowAnimation()`
plugin layered on top of the orchestrator — but it is not part of the
core feature.

**Files removed (compared to the original Phase 3 implementation):**

- `animation/easings.ts`, `animation/easings.spec.ts`
- `animation/prefers-reduced-motion.ts`
- `animation/f-reflow-animator.ts`, `animation/f-reflow-animator.spec.ts`
- `animation/index.ts`
- `enums/e-f-reflow-easing.ts`
- `IFReflowOnResizeConfig.animation` field and `EFReflowEasing` enum
- `FReflowController.skipActiveAnimation()` method

**Estimate:** 0 days (decision is final).

---

### Phase 4 — All selection modes + horizontal + combined axis

**Goal:** Complete the `mode × axis` matrix.

**Scope:**

- `XRangeSelectionStrategy` — candidates must have `[M.left, M.right] ∩ [N.left, N.right] ≠ ∅` (for vertical axis; symmetric for horizontal).
- `DownstreamConnectionsSelectionStrategy` — BFS using `FComponentsStore.connections`, `FReflowCycleGuard`. Traversal walks output connectors → connection → input connector → owning node.
- Horizontal axis path — mirror Y logic by axis-parameterizing the planner (private `_project(axis)` method: projects rects to a scalar for the active axis).
- Combined axis (`BOTH`): planner runs Y plan, then X plan, on the _same baseline_, merges shifts additively. Independent axes → commutativity invariant holds.
- Explicit commutativity spec (fuzzed graphs, Y-then-X vs X-then-Y plans diffed).

**Tests:**

- `selection.spec.ts` — all three modes, including cyclic graph termination for downstream.
- `commutativity.spec.ts` — fuzzed graphs (small, 3-10 nodes each), axis-order invariance.
- Horizontal-axis spec mirroring Phase 1/2 vertical cases.

**Exit criteria:** All `mode × axis` combinations produce documented behavior; commutativity green.

**Estimate:** 5–6 days.

---

### Phase 5 — Collision strategies + scopes

**Goal:** Ship `CHAIN_PUSH` and `GROUP` / `CONNECTED_SUBGRAPH` scopes.

**Scope:**

- `ChainPushCollisionResolver`: when candidate `M` collides with non-candidate `C`, recursively include `C` and re-run selection from `C`. Bounded by `FReflowCycleGuard` + `maxCascadeDepth` fuse. Single planner invocation — no runtime iteration.
- `GroupScopeFilter` — candidates restricted to same `fParentId`.
- `ConnectedSubgraphScopeFilter` — BFS over all connections in both directions; compute connected component.
- Cross-interaction spec — `mode × collision × scope × axis` matrix (table-driven, 3 × 2 × 3 × 3 = 54 scenarios sampled).

**Tests:**

- `chain-push.spec.ts` — cascading shifts, depth-fuse triggers, cyclic chain-push termination.
- `scope.spec.ts` — group boundaries respected, subgraph isolation.
- `matrix.spec.ts` — sampled table-driven test.

**Exit criteria:** every sampled combination produces documented behavior; no regressions in Phase 1-4 tests.

**Estimate:** 5–6 days.

---

### Phase 6 — Group cascade + content-driven + drag-freeze verification

**Goal:** Verify and harden the "child resize → group resize → cascade" path and `fAutoSizeToFitChildren` interaction.

**Scope:**

- **Existing natural cascade** — because `UpdateNodeWhenStateOrSizeChanged` is the single hook, when `FitToChildNodesAndGroupsRequest` resizes a parent group, the group's own `FResizeChannel` fires, re-entering the hook for the group. Reflow runs for the group on its own turn. No new cascader service required.
- Re-entrancy guard: `Set<fId>` scoped to the orchestrator, populated on plan start, cleared on plan completion. Prevents pathological re-entry within the same synchronous pass.
- Extreme delta clamp: if `|delta| > maxAbsoluteShiftPerPlan` → plan aborted, warning logged (debug only).
- Cycle-guard verification for `DOWNSTREAM_CONNECTIONS` mode on cyclic graphs.
- Resize-during-drag freeze: covered by existing `!_isDragging()` guard. Add explicit regression spec.
- `fAutoSizeToFitChildren` + reflow — no special case, but add spec covering the feedback-loop scenario to ensure stability.

**Tests:**

- `group-cascade.spec.ts` — resize child inside group with free space (no cascade); reduce free space to 0 and assert cascade.
- `content-resize.spec.ts` — programmatic `[fNodeSize]` toggle triggers reflow exactly once.
- `drag-freeze.spec.ts` — concurrent drag + resize → reflow suppressed.
- `feedback-loop.spec.ts` — `fAutoSizeToFitChildren` + reflow on the same node, stable termination.

**Files:** none new. Modify `orchestrator/`, add specs.

**Exit criteria:** all feedback-loop scenarios stable; group cascade observable; drag-freeze correct.

**Estimate:** 3–4 days.

---

### Phase 7 — API surface freeze + docs + llms.txt

**Goal:** Lock public names, finalize SSR compatibility, refresh documentation.

**Scope:**

- Public-API review: all exports from `public-api.ts`, enum values, directive selectors, event names. Compare against existing library conventions.
- SSR check — `provideFFlow` + `withReflowOnResize` must not break SSR (mediator/DI path is SSR-safe; `matchMedia` guarded by `BrowserService`).
- Dedicated docs page: `apps/f-flow-portal/public/markdown/extensions/reflow-on-resize.md`:
  - Concept and constraints (stateless, forward-only).
  - API reference with all config fields.
  - Examples for each mode / collision / scope.
  - Reduced-motion behavior.
  - Non-goals (see §7 of this plan).
- Update `apps/f-flow-portal/public/llms.txt` + `llms-full.txt`.
- Update `documentation-config.ts` navigation entry.
- `public-api.spec.ts` — assert all intended symbols exported, no unintended leakage.

**Exit criteria:** docs live; llms.txt synced; `public-api.spec.ts` green.

**Estimate:** 2–3 days.

---

### Phase 8 — Showcase example: "AI Pipeline Playground"

**Goal:** Flagship marketing demo on the portal.

**Scope:** See §8 of this plan for concrete demo spec.

**Files:**

- `libs/f-examples/plugins/reflow-on-resize/` (example.ts, example.html, example.scss, project.json).
- `apps/f-flow-portal/src/app/config/examples-config.ts` — register lazy route + tile metadata.
- `apps/f-flow-portal/public/previews/examples/reflow-on-resize.{light,dark}.png` — preview screenshots.

**Tests:**

- Playwright-style e2e smoke: load page, click expand button, assert neighbor node moves.

**Exit criteria:** demo live at `flow.foblex.com/examples/reflow-on-resize`; screenshots rendered; smoke test green.

**Estimate:** 3–4 days.

---

### Total estimate

| Phase                                           | Days           |
| ----------------------------------------------- | -------------- |
| 1. Provider infrastructure + base algorithm     | 5–6            |
| 2. Collapse + invariants                        | 2–3            |
| 3. Animation                                    | 4–5            |
| 4. All modes + horizontal + combined            | 5–6            |
| 5. Collisions + scopes                          | 5–6            |
| 6. Cascade + content + drag-freeze verification | 3–4            |
| 7. API surface + docs + llms                    | 2–3            |
| 8. Showcase example                             | 3–4            |
| **Total**                                       | **29–37 days** |

Matches the roadmap's 6–8 week estimate for the full feature.

---

## 6. Decisions (locked)

| #   | Decision                            | Choice                                                               | Why                                                                              |
| --- | ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| D1  | Config surface                      | Provider-based (`provideFFlow` + `withReflowOnResize`)               | Follows `provideFLayout` prior art; foundation for roadmap item #5               |
| D2  | Composer shape                      | `(a) flat flattener`                                                 | No cross-feature coordination needed yet; YAGNI on ring-core                     |
| D3  | Integration point                   | **Single** hook in `UpdateNodeWhenStateOrSizeChanged`                | Catches every resize source; drag-freeze free via `!_isDragging()`               |
| D4  | Delta source                        | `EDGE_BASED` default, `CENTER_BASED` parameterized                   | Edge-based correct under asymmetric resize; center-based matches roadmap formula |
| D5  | Feature config form                 | Static token (`useValue`) + controller for runtime                   | No user-supplied engine subclass (unlike `FLayoutEngine`)                        |
| D6  | `provideFFlow` base config          | `{ id?: string }` only in v1                                         | Cache and other config deferred to their own `with*()` features                  |
| D7  | Base config optionality             | Optional (TS overloads)                                              | Reduces noise for typical usage                                                  |
| D8  | Per-node directives                 | `fReflowIgnore` in v1; `fReflowAnchor` deferred                      | Use-case for anchor unclear; add on feedback                                     |
| D9  | Drag-live reflow                    | Instant writes if enabled; deferred to pointer-up via existing guard | `_isDragging()` already suppresses — natural commit-only behavior                |
| D10 | Coexistence with `<f-minimap>` etc. | Unchanged                                                            | No migration; they stay as-is. `with*()` versions come later                     |
| D11 | Re-entrancy guard                   | Orchestrator-local `Set<fId>` per plan                               | Per-invocation state — not bookkeeping                                           |
| D12 | Spacing units                       | Canvas units                                                         | All geometry already normalized via `GetNormalizedElementRectRequest`            |

---

## 7. Non-goals

- **No persistence of layout history.** Expand + collapse does not guarantee return to the original layout. Documented in the extensions page.
- **No smart label or connection-label relayout.** Labels ride with their parents.
- **No collision-aware connection routing during animation.** Connections refresh via `EmitConnectionsChangesRequest` at plan commit, not mid-tween. Polish item for later.
- **No multi-node simultaneous resize orchestration.** `FDraggableDataContext` enforces one `ResizeNodeHandler` at a time.
- **No DSL or plug-in points beyond the three modes.** Users needing bespoke graph layout use `provideFLayout` (Dagre/ELK/custom) — different feature.
- **No auto-scroll.** `<f-auto-pan>` composes independently.
- **No animation state in `getState()` / `toJSON()`.**
- **No per-edge spacing** (top/bottom/left/right individually). `{ vertical, horizontal }` only.
- **No auto-arrange on node delete.** Reflow reacts to _resize_, not creation/deletion. Empty space after delete remains.
- **No `cache` in `provideFFlow` base config in v1.** Deferred to a future `withCache()` feature.

---

## 8. Showcase example — "AI Pipeline Playground"

**Location:** `libs/f-examples/plugins/reflow-on-resize/`.

**Portal route:** `flow.foblex.com/examples/reflow-on-resize`.

**Demo content:** five-node LLM pipeline arranged vertically.

1. **Prompt Input** (fixed size) → output `prompt`
2. **Retriever** (expandable: collapsed = title only; expanded reveals `top-k` slider, `index source` select) — input `prompt`, output `context`
3. **LLM Call** (expandable, the heaviest: collapsed = title; expanded reveals `model`, `temperature`, `max tokens`, a multi-line `system prompt` textarea) — inputs `prompt` + `context`, output `response`
4. **Output Parser** (expandable: collapsed = title; expanded reveals regex field + preview pane) — input `response`, output `parsed`
5. **Sink** (fixed size) — input `parsed`

**Interactive toolbar:**

- Chevron on each expandable node toggles size.
- Live selectors for `mode` (3 options), `collision` (2), `scope` (3), `axis` (3), `deltaSource` (2), `animation enabled` (checkbox), `animation duration` (slider 0-800ms).
- "Simulate execution" button plays a scripted sequence: expand Retriever → 800ms delay → expand LLM → 1200ms delay → collapse Retriever → 600ms delay → collapse LLM. Narrates the marketing story.

**Why this shape:**

- Mirrors the LangFlow / Anthropic Console visual reference from the roadmap.
- Chained topology exercises `DOWNSTREAM_CONNECTIONS` mode naturally.
- Size-asymmetric expansion (LLM is much taller expanded than Retriever) is exactly where competing libraries fail.
- Every config combination has an immediate visual consequence — reviewers can poke live.

**Tests:** e2e smoke — load page, click "expand LLM" chevron, assert `node[data-id="sink"]` `transform` changes on Y axis.

---

## 9. Risks

| #   | Risk                                                                                  | Mitigation                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Feedback loop with `fAutoSizeToFitChildren`                                           | `_isDragging()` guard + orchestrator re-entrancy set + explicit spec in Phase 6                                                                                                                          |
| R2  | Perf on large graphs with `CHAIN_PUSH` + `GLOBAL` + `BOTH` axes                       | Bounded `maxCascadeDepth`; candidate pool iterated once per plan (not per chain step); benchmark with 500 nodes in Phase 5                                                                               |
| R3  | Accidental bookkeeping creep (violating statelessness)                                | Code-review checklist per phase; greppable sentinel test for identifiers like `previousPosition`, `originalRect`, `history` under `plugins/layout/f-reflow-on-resize/`                                   |
| R4  | API lock-in before `provideFFlow` has other features                                  | Composer surface is thin (feature kind + providers); addition of `withMinimap`/etc. is purely additive. Breaking changes isolated to `IFReflowOnResizeConfig` (still in minor-release adjustable window) |
| R5  | Resize during drag producing inconsistent visuals                                     | Existing guard + explicit regression spec                                                                                                                                                                |
| R6  | `F_REFLOW_CONFIG` registered twice if `withReflowOnResize` appears twice in providers | Feature factory should warn + use last-wins semantics (like `HttpClient` interceptors ordering). Or throw — TBD in Phase 1.                                                                              |
| R7  | SSR failure due to `matchMedia`                                                       | Guarded via `BrowserService`; no direct `window` access; SSR spec in Phase 7                                                                                                                             |

---

## 10. Open items flagged for implementation

These are minor — resolve during Phase 1, not decisions requiring re-planning.

- **OI1.** Cache access pattern — read `baselineRect` directly via `FCache` injection, or through a new `GetCachedNodeRectRequest`? Prefer direct access if `FCache` is injectable; otherwise add the request.
- **OI2.** `withReflowOnResize` registration guard — if called twice in the same providers array, last-wins or throw? Recommend last-wins with `console.warn` in dev mode.
- **OI3.** Default easing curve — `ease-out` (sharp start, smooth end) vs `ease-in-out` (symmetric). `ease-out` feels more responsive on resize. Decide during Phase 3 via quick a/b.

---

## 11. Tracking

Progress is tracked via commit messages (`feat(reflow): <scope>`) and per-phase PRs. Each phase ships as one PR. Tests accompany code in the same PR.

No separate issue tracker entries — this document is the canonical reference.
