---
# Fill in the fields below to create a basic custom agent for your repository.
# The Copilot CLI can be used for local testing: https://gh.io/customagents/cli
# To make this agent available, merge this file into the default repository branch.
# For format details, see: https://gh.io/customagents/config

name:
description:
---

# Foblex Flow — Coding Agent Instructions

## What This Library Is

**Foblex Flow** (`@foblex/flow`) is an Angular library (v15+) for building interactive, node-based flow UIs: visual editors, diagrams, low-code platforms, call flows, and automation builders.

The library lives in `projects/f-flow/src/` and is published from `dist/f-flow` as the npm package `@foblex/flow`.

---

## Repository Layout

```
projects/
  f-flow/              ← the library
    src/
      domain/          ← CQRS-style request/execution handlers grouped by feature
      drag-toolkit/    ← pointer-event abstraction shared across drag features
      f-backgroud/     ← FBackground component (note: folder name uses the original typo)
      f-canvas/        ← FCanvas component (pan/zoom canvas)
      f-connection/    ← FConnection component (legacy path + wrapper)
      f-connection-v2/ ← connection rendering: enums, models, line builders
      f-connectors/    ← fNodeInput, fNodeOutput, fNodeOutlet directives
      f-draggable/     ← FDraggable directive + all drag sub-features
      f-external-item/ ← drag-in of items from outside the canvas
      f-flow/          ← FFlowComponent (root host)
      f-line-alignment/
      f-magnetic-lines/
      f-magnetic-rects/
      f-minimap/
      f-node/          ← FNodeDirective + group/resize/rotate handles
      f-selection-area/
      f-storage/       ← FComponentsStore + typed registries
      f-zoom/
      mixins/          ← reusable class-mixin helpers (selection, visibility)
      reactivity/      ← lightweight reactive channels (FChannel, FChannelHub)
      testing/         ← shared test harnesses (factories, DI helpers, mediator harness)
      utils/
      public-api.ts    ← single barrel for the entire library
      f-flow.module.ts ← NgModule for non-standalone consumers
  f-examples/          ← demo app components
  f-guides-examples/
src/                   ← Angular app shell (routing, SSR)
```

---

## Key Architecture Patterns

### 1. Mediator (CQRS)

All cross-component communication goes through `FMediator` from `@foblex/mediator`.

- A **request** is a plain class with a static `fToken` symbol:

  ```ts
  export class SelectRequest {
    static readonly fToken = Symbol('SelectRequest');
    constructor(
      public nodes: string[],
      public connections: string[],
      public isSelectedChanged: boolean = true,
    ) {}
  }
  ```

- An **execution** is an `@Injectable()` service decorated with `@FExecutionRegister(Request)` and implementing `IExecution<TRequest, TResult>`:

  ```ts
  @Injectable()
  @FExecutionRegister(SelectRequest)
  export class SelectExecution implements IExecution<SelectRequest, void> {
    private readonly _store = inject(FComponentsStore);

    public handle(request: SelectRequest): void { ... }
  }
  ```

- File naming: `<feature>.request.ts` and `<feature>.execution.ts`, kept together in one folder, exported from a local `index.ts`.
- Executions are collected in a `providers.ts` array and registered in `COMMON_PROVIDERS` (see `domain/providers.ts`).

### 2. Component Store

`FComponentsStore` (see `f-storage/f-components-store.ts`) is the single source of truth injected into every execution. It holds:

| Property | Type | Purpose |
|---|---|---|
| `fFlow` | `FFlowBase \| undefined` | root flow reference |
| `fCanvas` | `FCanvasBase \| undefined` | canvas reference |
| `nodes` | `FNodeRegistry` | all registered nodes |
| `connections` | `FConnectionRegistry` | all registered connections |
| `outputs` | `FConnectorRegistry<FNodeOutputBase>` | output connectors |
| `inputs` | `FConnectorRegistry<FNodeInputBase>` | input connectors |
| `outlets` | `FConnectorRegistry<FNodeOutletBase>` | outlet connectors |
| `instances` | `FSingleRegistryBase` | singleton feature instances (zoom, minimap, …) |
| `dataChanges$` | `FChannel` | fire when data changes (triggers redraw) |
| `countChanges$` | `FChannel` | fire when component count changes (triggers layer sort) |
| `transformChanges$` | `FChannel` | fire when canvas transform changes |

### 3. Typed Registries

`FIdRegistryBase<T>` (see `f-storage/base/f-id-registry-base.ts`) provides `add`, `remove`, `get`, `require`, `getAll`, `has`, `size`, `clear`. Registries key items by the Signal `fId()`.

### 4. Reactivity (FChannel / FChannelHub)

`FChannel` is a lightweight, push-only event bus. `FChannelHub` is a composite of several channels. Use `.listen(destroyRef, callback)` to subscribe; use `.notify()` to fire.

```ts
this._store.dataChanges$.notify();        // trigger redraw
this._store.countChanges$.notify();       // trigger layer sort
```

### 5. Base Classes and Interfaces

Every rendered element has a corresponding abstract base class:

| Directive/Component | Base class |
|---|---|
| `FFlowComponent` | `FFlowBase` |
| `FCanvasComponent` | `FCanvasBase` |
| `FNodeDirective` | `FNodeBase` |
| `FConnectionComponent` | `FConnectionBase` |
| `FNodeOutputDirective` | `FNodeOutputBase` → `FConnectorBase` |
| `FNodeInputDirective` | `FNodeInputBase` → `FConnectorBase` |
| `FNodeOutletDirective` | `FNodeOutletBase` → `FConnectorBase` |

Each base class exposes `hostElement: HTMLElement | SVGElement` (implementing `IHasHostElement`) and Signal-based inputs (`fId`, `fSelectionDisabled`, etc.).

### 6. Angular Signals (Inputs/Outputs)

Use Angular 17+ `input()` / `model()` / `output()` Signal APIs, not `@Input()` / `@Output()` decorators, for new inputs and outputs on directives and components. Legacy `@Input()` decorators remain only where backward compatibility requires it (e.g., non-transformable numeric inputs on `FConnectionComponent`).

---

## CSS Class Conventions

- All library elements receive `f-component` plus their own class (`f-flow`, `f-node`, `f-connection`, …).
- State classes are toggled via host bindings: `f-node-dragging-disabled`, `f-connection-selection-disabled`, `f-node-output-connected`, etc.
- Selected elements receive `f-selected` (see `F_SELECTED_CLASS` in `mixins/`).
- Use `F_CSS_CLASS` constant (in `domain/css-cls.ts`) when toggling connector state classes from execution code.

---

## Adding a New Domain Feature (Step-by-Step)

1. **Create a folder** under `projects/f-flow/src/domain/<feature-area>/<your-feature>/`.
2. **Add a request** — `<your-feature>.request.ts` with a static `fToken` symbol.
3. **Add an execution** — `<your-feature>.execution.ts` with `@Injectable()`, `@FExecutionRegister(...)`, implementing `IExecution<TRequest, TResult>`.
4. **Create `index.ts`** exporting both files.
5. **Register the execution** in the nearest `providers.ts` array (e.g., `domain/f-selection/providers.ts`), then verify it is included transitively in `COMMON_PROVIDERS`.
6. **Write a spec** — `<your-feature>.execution.spec.ts` using `configureDiTest`, `createMediatorHarness`, and the factory helpers.
7. **Export from `public-api.ts`** only if the request or execution class needs to be accessible by consumers or tests outside the library.

---

## Testing Guide

All tests use Jasmine + Karma (`ng test f-flow`).

### Test infrastructure (`projects/f-flow/src/testing/`)

| Helper | Purpose |
|---|---|
| `configureDiTest({ providers })` | Sets up TestBed with `FComponentsStore`, `FDraggableDataContext`, and `FMediator` (no template) |
| `injectFromDi(Token)` | Returns injected instance from the current TestBed |
| `createMediatorHarness()` | Returns a mediator wired to the current DI context |
| `registryAdd(registry, item)` | Adds a test double to a registry |
| `registryAddMany(registry, items)` | Batch variant |
| `nodeFactory()` | Fluent builder for `FNodeBase` test doubles |
| `connectionFactory()` | Fluent builder for `FConnectionBase` test doubles |
| `connectorFactory()` | Fluent builder for `FConnectorBase` test doubles |
| `canvasFactory()` | Fluent builder for `FCanvasBase` test doubles |
| `flowFactory()` | Fluent builder for `FFlowBase` test doubles |
| `selectableFactory()` | Fluent builder for `ISelectable` test doubles |
| `createSpy(name)` | Jasmine `jasmine.createSpy` wrapper |
| `createSpyObj(name, methods)` | Jasmine `jasmine.createSpyObj` wrapper |
| `configureComponentTest(Component, overrides)` | Full TestBed with template compilation |
| `createPureHarness()` | No-DI helper for pure function tests |

### Typical unit test structure

```ts
import {
  configureDiTest, injectFromDi, registryAdd,
  nodeFactory, FComponentsStore,
  SelectExecution, SelectRequest,
} from '@foblex/flow';

describe('SelectExecution (unit)', () => {
  let execution: SelectExecution;
  let store: FComponentsStore;

  beforeEach(() => {
    configureDiTest({ providers: [SelectExecution] });
    execution = injectFromDi(SelectExecution);
    store = injectFromDi(FComponentsStore);
  });

  it('selects a node by id', () => {
    const node = nodeFactory().id('n1').build();
    registryAdd(store.nodes, node);

    execution.handle(new SelectRequest(['n1'], []));

    expect(node.isSelected()).toBeTrue();
  });
});
```

### Rules

- No `as any` in spec files. Use `unsafeCast` only inside `testing/internal/`.
- Test file must live next to the execution file: `<feature>.execution.spec.ts`.
- Prefer DI-only tests (`configureDiTest`) over component tests (`configureComponentTest`) for execution logic.
- Use `createSpy` / `createSpyObj` wrappers instead of raw Jasmine globals to keep imports explicit.

---

## Code Style and Conventions

- **Language**: TypeScript strict mode, Angular 18.
- **Module style**: Standalone components are preferred for new additions; `FFlowModule` is kept for backward compatibility.
- **File naming**: `kebab-case` for files. Component/directive files carry their type suffix (`.component.ts`, `.directive.ts`, `.execution.ts`, `.request.ts`, `.spec.ts`).
- **Class naming**: `PascalCase`. Prefix library classes with `F` (e.g., `FNodeDirective`, `SelectExecution`, `FComponentsStore`).
- **Injection**: Use `inject()` function (not constructor injection) everywhere except in abstract base classes that require `ElementRef` via the constructor parameter.
- **Change detection**: `ChangeDetectionStrategy.OnPush` on all components.
- **Unique IDs**: Use a module-level `let uniqueId = 0` counter for auto-generated `f-*-N` IDs.
- **Linting**: `ng lint` (ESLint + angular-eslint). Formatting: Prettier (`.prettierrc`).
- **Commits**: Conventional Commits format as described in `.github/git-commit-instructions.md`.

---

## Build and Test Commands

```bash
# Build the library
npm run build-flow

# Run unit tests (Karma/Jasmine)
npm test               # same as: ng test f-flow

# Lint
npm run lint           # same as: ng lint

# Start the demo app
npm start
```

---

## Peer Dependencies

The library depends on these `@foblex/*` packages (peer deps at runtime):

| Package | Role |
|---|---|
| `@foblex/2d` | 2-D geometry primitives (`IPoint`, `IRect`, `TransformModel`, …) |
| `@foblex/mediator` | `FMediator`, `IExecution`, `FExecutionRegister` |
| `@foblex/platform` | `BrowserService` (SSR guard) |
| `@foblex/utils` | `castToEnum`, `stringAttribute`, and other micro-utilities |

---

## What NOT to Do

- Do **not** communicate between components using `@Output` / EventEmitter chains or shared services other than `FComponentsStore`. Use the mediator.
- Do **not** put business logic directly in Angular component/directive classes. Delegate to an execution via `_mediator.execute(new SomeRequest(...))`.
- Do **not** access the DOM directly in execution classes. Use `hostElement` from the store or passed-in base-class references.
- Do **not** add `as any` casts in production code or in spec files outside `testing/internal/`.
- Do **not** remove or weaken existing unit tests when fixing bugs — add or update them.
- Do **not** bypass the registry (`FComponentsStore.nodes`, `.connections`, etc.) to iterate elements.
