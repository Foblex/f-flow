# f-flow Testing Kit

Unified Jasmine/Karma testing infrastructure for `libs/f-flow`.

## Folder layout

- `libs/f-flow/src/testing/`
  - public helpers for tests and external consumers
- `libs/f-flow/src/testing/internal/`
  - internal helpers only (`unsafeCast`, signal/ElementRef stubs)
  - contains the isolated abstract-class casting workaround
- `libs/f-flow/src/testing/jasmine/`
  - Jasmine runtime wrappers (`createSpy`, `createSpyObj`)

## Public API

Available for workspace and library tests via the local `src/testing/*` files:

- `createPureHarness()`
- `configureDiTest()`, `injectFromDi()`, `valueProvider()`
- `configureComponentTest()`
- `createMediatorHarness()`, `executeRequest()`
- `registryAdd()`, `registryAddMany()`, `registryGet()`, `registryRequire()`, `assertRegistryIds()`
- Factories:
  - `selectableFactory()`
  - `nodeFactory()`
  - `connectionFactory()`
  - `canvasFactory()`
  - `flowFactory()`
  - `connectorFactory()`
- Jasmine wrappers:
  - `createSpy()`
  - `createSpyObj()`

## Internal usage

Use `testing/internal/*` only when a test double for an abstract Angular class is impossible to instantiate directly.

Why this exists:

- `FNodeBase`, `FConnectionBase`, and `FCanvasBase` rely on Angular `inject(...)` internals.
- Pure and DI-only tests still need lightweight doubles.
- We isolate the unsafe cast in one place (`unsafeCast`) and keep specs clean.

Rule:

- No `as any` in specs.
- If a cast escape hatch is needed, keep it in `testing/internal/*` only.

## Packaging note

These helpers must not be exported from the published primary `@foblex/flow` entry point.

Why:

- some helpers intentionally depend on `@angular/core/testing`
- exporting them from the main package pulls `TestBed` into the published runtime bundle
- that breaks setups such as Native Federation microfrontends that do not allow runtime resolution of Angular testing APIs

Keep this kit local to tests unless it is moved into a dedicated separately packaged testing entry point.

## Examples

### PURE test (no TestBed)

```ts
import { createPureHarness } from './index';

const pure = createPureHarness();
const point = pure.point(10, 20);
expect(point).toEqual({ x: 10, y: 20 });
```

### DI-only test (no template compilation)

```ts
import {
  configureDiTest,
  createMediatorHarness,
  injectFromDi,
  nodeFactory,
  registryAdd,
  SelectExecution,
  SelectRequest,
  FComponentsStore,
} from './index';

configureDiTest({ providers: [SelectExecution] });
const mediator = createMediatorHarness();
const store = injectFromDi(FComponentsStore);
registryAdd(store.nodes, nodeFactory().id('n1').build());
mediator.execute<void>(new SelectRequest(['n1'], []));
```

### COMPONENT test (template/style compilation enabled intentionally)

```ts
import { configureComponentTest } from './index';
import { MyComponent } from './my.component';

const fixture = await configureComponentTest(MyComponent, {
  imports: [],
  providers: [],
});

expect(fixture.componentInstance).toBeDefined();
```
