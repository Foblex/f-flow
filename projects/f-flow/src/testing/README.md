# f-flow Testing Kit

Unified Jasmine/Karma testing infrastructure for `projects/f-flow`.

## Folder layout

- `projects/f-flow/src/testing/`
  - public helpers for tests and external consumers
- `projects/f-flow/src/testing/internal/`
  - internal helpers only (`unsafeCast`, signal/ElementRef stubs)
  - contains the isolated abstract-class casting workaround
- `projects/f-flow/src/testing/jasmine/`
  - Jasmine runtime wrappers (`createSpy`, `createSpyObj`)

## Public API

Exported from `@foblex/flow` via `public-api.ts`:

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

## External usage

Consumers can import the same kit from `@foblex/flow`:

```ts
import { configureDiTest, createMediatorHarness, nodeFactory } from '@foblex/flow';
```

## Examples

### PURE test (no TestBed)

```ts
import { createPureHarness } from '@foblex/flow';

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
} from '@foblex/flow';

configureDiTest({ providers: [SelectExecution] });
const mediator = createMediatorHarness();
const store = injectFromDi(FComponentsStore);
registryAdd(store.nodes, nodeFactory().id('n1').build());
mediator.execute<void>(new SelectRequest(['n1'], []));
```

### COMPONENT test (template/style compilation enabled intentionally)

```ts
import { configureComponentTest } from '@foblex/flow';
import { MyComponent } from './my.component';

const fixture = await configureComponentTest(MyComponent, {
  imports: [],
  providers: [],
});

expect(fixture.componentInstance).toBeDefined();
```
