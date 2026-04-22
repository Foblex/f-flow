# AGENT.md

## Purpose

Use this file as the primary instruction set for AI agents working in this repository.
Derive new code from existing repository patterns first, especially from `libs/f-flow/src`.
Treat examples, docs, and the portal app as confirmation of public usage patterns, not as a reason to invent new framework layers.

## Core principles

- Keep the library boundary intact: `@foblex/flow` owns interaction, rendering, and internal runtime UI state; application code owns graph data, validation, persistence, and business meaning.
- Never invent selectors, inputs, outputs, methods, or React Flow style APIs such as `[nodes]`, `[edges]`, `setNodes()`, or `addEdge()`.
- Preserve established public `f*` API names and aliases. When an event exposes both current and deprecated names, prefer the current non-deprecated fields in new consumer code.
- Extend existing feature slices before introducing new cross-cutting abstractions.
- Keep public API compatibility in mind. If a change affects exported behavior, update docs/examples/changelog/migration notes together with the code.

## Repository conventions

### Project structure

- `libs/f-flow/src/` is the primary source of truth for library architecture and naming.
- Top-level library slices are feature-oriented and colocated: `f-flow`, `f-canvas`, `f-node`, `f-connectors`, `f-connection`, `f-connection-v2`, `f-draggable`, `f-storage`, `f-cache`, `f-minimap`, `f-zoom`, `f-selection-area`, `f-external-item`, `f-magnetic-lines`, `f-magnetic-rects`, `f-virtual`, `f-auto-pan`, `f-backgroud`, `domain`, `drag-toolkit`, `reactivity`, `mixins`, `testing`, `utils`.
- `domain/` contains internal mediator-driven operations and feature execution classes.
- `f-storage/`, `f-cache/`, and `reactivity/` are internal runtime support layers, not app-facing graph state layers.
- `libs/f-examples` and `libs/f-pro-examples` are consumer-style examples of the library.
- `apps/f-flow-portal/src/app` and `apps/f-flow-portal/public/markdown` power the documentation portal and are the source of truth for docs/example registration.
- Tests are colocated with source as `*.spec.ts`. Test-only helpers live under `libs/f-flow/src/testing`.

### File and folder naming

- Use lowercase kebab-case for folders and file names.
- In `libs/f-flow/src`, feature folders usually expose a local `index.ts`; keep exports flowing through that barrel.
- Many feature folders also expose `providers.ts`; use that file for feature provider arrays instead of scattering provider registration across unrelated files.
- Requests are named explicitly with a `-request.ts` suffix.
- Events and event payload helpers use `*-event.ts` and `*-event-data.ts`.
- Base abstractions use `*-base.ts`.
- Angular declarable file naming is mixed:
  - older slices still use `*.component.ts`, `*.directive.ts`, and `*.service.ts`
  - newer slices often use plain feature names such as `f-auto-pan.ts`, `f-selection-area.ts`, `f-connection-path.ts`, `f-virtual-for.ts`
- Do not append `.component`, `.directive`, or `.service` to new file names by default. Match the local slice, and prefer plain feature names in newer-style folders.
- Preserve existing path names exactly. Do not opportunistically rename legacy paths such as `f-backgroud`.

### Public API conventions

- Public exports go through feature-level `index.ts` files and then `libs/f-flow/src/public-api.ts`.
- If a public declarable is also exposed through module compatibility, wire it through the relevant `F_*_PROVIDERS` array and `FFlowModule`.
- Public selectors and aliases keep the repository’s `f*` naming scheme:
  - element selectors such as `f-flow`, `f-canvas`, `f-connection`
  - attribute selectors such as `[fNode]`, `[fGroup]`, `[fNodeInput]`, `[fNodeOutput]`, `[fNodeOutlet]`, `[fDraggable]`
- In library source, use local imports and feature barrels. Do not self-import `@foblex/flow` from production library code. Self-imports are used in specs to validate the public surface.
- Do not treat `[fNodes]` or `[fConnections]` as graph-state inputs. In this repository they are content-projection markers in specific examples.

### Internal code organization

- Prefer colocating interfaces, types, requests, handlers, events, and helper utilities inside the same feature slice they belong to.
- Keep mediator requests and their execution classes close together in the same feature subtree.
- Prefer feature folders built from granular operations, not from one large facade class.
- The common small-feature shape in `domain/*` is:
  - `some-feature/`
  - `some-feature/index.ts`
  - `some-feature/some-feature.ts`
  - `some-feature/some-feature-request.ts`
- Complex interaction features are split one level further into distinct phases such as `*-preparation`, `*-handler`, and `*-finalize` instead of collapsing the whole flow into one file.
- Register execution classes through feature provider arrays such as `F_NODE_FEATURES`, `F_FLOW_FEATURES`, and `COMMON_PROVIDERS`.
- Keep runtime registries in `f-storage`-style support layers instead of building a separate app-like store abstraction inside the library.
- Keep specs next to the code they verify. Keep unsafe testing escape hatches inside `libs/f-flow/src/testing/internal`, not inside specs.

## Naming conventions

### Files

- Match file names to the exported symbol in kebab-case.
- Name request files after the action plus `-request`: `add-node-to-store-request.ts`.
- Name execution/feature files after the action itself, not `*-execution.ts`: `add-node-to-store.ts`, `fit-to-flow.ts`, `reset-scale.ts`.
- Name base abstractions with a `-base.ts` suffix.
- Build new domain features as granular folders. Prefer `fit-to-flow/fit-to-flow.ts` over adding another unrelated operation into an existing large file.
- Do not add `-handler` just to distinguish a feature implementation from its request. In active domain/features code, the distinction is usually:
  - `fit-to-flow.ts` for the execution/feature
  - `fit-to-flow-request.ts` for the request
- Reserve `*-handler.ts` for subtrees that already use handler terminology, especially inside drag interaction internals.
- In library source, newer Angular declarables often use plain feature names without `.component` or `.directive`. In examples and portal code, match the local folder pattern before choosing between `foo.ts` and `foo.component.ts`.

### Classes

- Public library classes use the `F` prefix: `FFlowComponent`, `FNodeDirective`, `FExternalItemService`, `FCreateConnectionEvent`.
- Base abstractions use the `*Base` suffix, not a `Base*` prefix.
- Request classes use the `*Request` suffix.
- Keep execution classes named after the operation they perform, for example `AddNodeToStore`, `GetNormalizedPoint`, `SortItemLayers`.
- In newer Angular declarables, prefer plain feature names such as `FAutoPan`, `FSelectionArea`, `FConnectionPath`, `FVirtualFor`.
- Keep `Component`, `Directive`, and `Service` suffixes only when continuing an older local slice that already uses them.
- Keep `*Handler` names only in areas that already model behavior as handlers, mostly drag/interactions internals.

### Interfaces and types

- In library source, interfaces are usually prefixed with `I`: `IRect`, `ICurrentSelection`, `IHasHostElement`.
- Prefer `interface` for reusable object contracts and implemented public contracts.
- Use `type` for unions, event helper shapes, function-like aliases, or compact local structures.
- Enums are usually prefixed with `EF`. Preserve existing exceptions rather than normalizing unrelated code.
- Enum members must stay `UPPER_CASE` to satisfy lint rules.

### Angular entities

- Public Angular entities use the `F` prefix and `f*` selectors/aliases.
- Keep `exportAs` names aligned with the public API, for example `fComponent`, `fDraggable`, `fNodeOutput`.
- Host metadata usually adds `f-component` plus a feature-specific class such as `f-flow`, `f-node`, `f-node-output`.
- Keep disabled and state modifier classes in the `f-*` namespace.

### Events / requests / handlers / services / directives

- Event classes use `F*Event` or `*EventData`.
- Preserve compatibility aliases in public event classes when the surrounding event already carries both current and deprecated names.
- Request classes usually declare `static readonly fToken = Symbol('...')`. Follow that pattern for mediator requests.
- Execution classes are usually distinguished from requests by file/class naming:
  - `some-feature.ts` / `SomeFeature`
  - `some-feature-request.ts` / `SomeFeatureRequest`
- Do not introduce `*Handler` names where a plain feature/execution name already fits the surrounding folder.
- Service names use `F*Service` when the class is a real service and the local slice already uses service terminology.
- Directive/class suffixes are not a repository-wide rule for new code. Preserve them only where the local slice already uses them.

### Variables and properties

- Private members must use a leading underscore. This is lint-enforced.
- Prefer `private readonly _dependency = inject(...)` for injected dependencies in library code.
- Use `readonly` for event payload fields, injected dependencies, tokens, provider arrays, and other immutable references.
- Module-level constants use `UPPER_SNAKE_CASE`. Feature/provider constants often use an `F_*` prefix.
- Preserve established public `f*` property names and aliases on Angular APIs such as `fNodeId`, `fNodePosition`, `fSelectionChange`, `fCreateConnection`.
- Keep helper methods private/protected and underscore-prefixed when they are internal implementation details.

### Methods

- In mediator execution classes, the public entry point is `handle(...)`.
- Name execution classes and request classes from the same domain verb:
  - `FitToFlow` + `FitToFlowRequest`
  - `ResetScale` + `ResetScaleRequest`
  - `SelectionAreaPreparation` + `SelectionAreaPreparationRequest`
- Prefer domain verbs in method names over generic names.
- Public component/directive methods are short and purpose-specific, for example:
  - `redraw`
  - `reset`
  - `selectAll`
  - `clearSelection`
  - `getState`
  - `getSelection`
  - `getPositionInFlow`
- Private helper methods are usually underscore-prefixed and verb-based:
  - `_listen*`
  - `_emit*`
  - `_create*`
  - `_setup*`
  - `_resolve*`
  - `_calculate*`
  - `_store*`
  - `_find*`
  - `_build*`
  - `_update*`
  - `_remove*`
- Predicate helpers typically use `_is*`, `_can*`, or `_should*`.
- Private computed accessors may use underscore-prefixed getters such as `_transform` or `_instance`.

## Architecture rules

### Allowed patterns

- Mediator-driven request/execution flow via `FMediator.execute(new SomeRequest(...))`.
- Small feature-local execution classes registered with `@FExecutionRegister(...)`.
- Base-class layering for Angular host primitives such as flow, canvas, node, connector, connection, and drag infrastructure.
- Composition through registries, plugin instances, handlers, and feature provider arrays.
- Event-driven integration where the app handles final events and updates its own state.
- Internal reactivity built on Angular signals plus `FChannel` / `FChannelHub` in library code.

### Preferred patterns

- From Angular components/directives, trigger behavior through mediator requests instead of mutating shared runtime state directly.
- Keep each request/execution pair focused on one operation.
- Keep features granular. If a behavior has distinct stages, split them into separate operations such as preparation, handler, finalize, calculation, registration, or notification.
- Extend an existing feature slice when the new behavior naturally belongs there.
- Use guard clauses and early returns. This is common in the codebase and keeps interaction code readable.
- Keep comments for public API contracts or non-obvious behavior. Do not narrate obvious implementation steps.
- Extract meaningful constants when a number or string has feature-level semantics, for example debounce values, thresholds, registry keys, and CSS class maps.

### Discouraged patterns

- Do not introduce an application-owned graph store into `libs/f-flow/src`.
- Do not add React Flow style data APIs or node/edge store helpers to the library.
- Do not introduce Angular CDK drag-drop into the core interaction pipeline.
- Do not introduce RxJS-based internal state flow into library features that currently use signals and `libs/f-flow/src/reactivity`.
- Do not add DTO-style indirection or extra architectural layers when a feature already uses colocated requests, events, handlers, and types.
- Do not introduce `*-handler` naming just to mirror a request pair when the surrounding feature uses plain operation names.
- Do not remove deprecated compatibility aliases from public events unless the task explicitly includes a breaking API migration.

### Dependency direction

- UI declarables depend on base classes, mediator requests, and internal support services.
- Execution/handler classes depend on stores, registries, cache, platform abstractions, and utilities, not on application business state.
- Library internals use local imports and feature barrels. Examples and portal code consume the package through `@foblex/flow`.
- Browser access in library code goes through injected abstractions such as `BrowserService`, `DOCUMENT`, or platform flags.

### Extension points

- Feature-level provider arrays such as `F_*_FEATURES` and `F_*_PROVIDERS`.
- Local feature barrels (`index.ts`) and the root `public-api.ts`.
- Module compatibility via `FFlowModule`.
- Mediator request registration via `@FExecutionRegister`.
- Plugin/instance registration in `FComponentsStore.instances` and related request flows.
- Testing helpers exported from `libs/f-flow/src/testing`.

## Angular guidelines

### Components

- Use `ChangeDetectionStrategy.OnPush`. This is the consistent change-detection mode across inspected components.
- Keep external templates and styles unless the surrounding file already uses inline metadata.
- Use `host: { ... }` metadata for host attrs/classes instead of `@HostBinding` and `@HostListener`.
- In library code, prefer `inject()`-based field injection when extending existing library patterns.
- If a public component/directive is part of module compatibility, keep `FFlowModule` in sync.

### Directives

- Treat nodes, groups, connectors, zoom, and draggable behavior as attribute directives when extending similar features.
- Directives commonly extend a base abstraction, register themselves in `ngOnInit`, and unregister in `ngOnDestroy`.
- Preserve the existing `f*` alias pattern on directive inputs and host attributes.
- Keep host classes and `data-f-*` attributes aligned with the existing runtime styling and lookup conventions.

### Services

- Keep services small and feature-specific.
- Use `@Injectable()` services for runtime registries, helpers, or support objects, not as a replacement for the app-owned domain model.
- Prefer existing stores/registries/channels before inventing a new singleton service.

### Inputs / Outputs / Signals

- Preserve aliased public names exactly, for example `alias: 'fNodeId'`, `alias: 'fNodePosition'`, `alias: 'fNodeSizeChange'`.
- In library source, `input()`, `model()`, and `output()` are active patterns. `@Input()` / `@Output()` / `EventEmitter` are also still in use. Match the local feature instead of forcing one style.
- Prefer current non-deprecated event payload fields in new consumer code:
  - `sourceId` / `targetId` / `dropPosition`
  - `connectionId` / `endpoint`
  - `nodes`, `nodeIds`, `groupIds`, `connectionIds`
- Design consumer integrations around final-result outputs such as `fMoveNodes`, `fCreateConnection`, `fReassignConnection`, `fDropToGroup`, `fConnectionWaypointsChanged`, and `fDragEnded`.

### Templates / Styles

- Prefer `templateUrl` plus `styleUrls` when creating new files unless the surrounding area already uses a different metadata style.
- Use Angular built-in control flow syntax. The repository uses `@if`, `@for`, and `@switch`; it does not use `*ngIf`, `*ngFor`, or `*ngSwitch`.
- Prefer styling your own semantic classes first, then combine them with verified high-level Foblex classes such as `.f-node`, `.f-group`, `.f-connection`, `.f-selected`, `.f-dragging`, and connector state classes.
- Do not depend on deep internal DOM structure for styling unless you inspect the actual rendered DOM in the target version.

### Forms / RxJS / SSR

- No stable forms/CVA convention is established in the inspected flow library code. Do not invent one unless the local feature already uses it.
- In `libs/f-flow/src`, prefer signals and the local `reactivity` helpers over RxJS.
- Guard browser-only behavior through `BrowserService`, injected `DOCUMENT`, or explicit browser/platform checks.
- Preserve hydration and SSR guards in portal code such as `ngSkipHydration` and `IS_BROWSER_PLATFORM` checks when touching SSR-sensitive areas.

## TypeScript guidelines

### Types vs interfaces

- Prefer `interface` for reusable object shapes and public contracts.
- Prefer `type` for unions, literal combinations, compact helper records, and function signatures.
- Follow the naming convention already used in the local slice instead of normalizing all types to one prefix.

### Classes and inheritance

- Use inheritance when extending an existing `*Base` abstraction or mixin that already defines the feature contract.
- Prefer composition for new behavior orchestration: mediator requests, handlers, registries, plugin instances, and utilities.
- Keep execution classes small and single-purpose.
- Use `override` whenever you override a base member. The compiler enforces this.
- Keep at most two classes per file. This is lint-enforced.

### Generics

- Use generics where the repository already does: registries, channels, builders, typed keys, and helper abstractions.
- Avoid generic-heavy meta-abstractions that have no close precedent in the local slice.

### Access modifiers

- Use explicit `public`, `protected`, and `private`.
- Keep internal helper methods `private` or `protected` instead of leaving them implicit.
- Keep private members underscore-prefixed.

### Readonly and immutability

- Mark injected dependencies and immutable references as `readonly`.
- Keep request payloads and public event payloads immutable where possible.
- Use mutable fields or signals only for real runtime state such as counters, pending flags, geometry, selection, or drag state.

## Do and Don’t

### Do

- Do continue the local feature pattern before applying a broader repository pattern.
- Do route new library-side operations through mediator requests when the surrounding feature already uses mediator executions.
- Do colocate new requests, handlers, events, and helper types inside the feature they serve.
- Do split a large behavior into multiple granular feature folders when the local area already models the workflow in steps.
- Do name methods after the domain action they perform, not after generic control flow.
- Do update feature barrels, `public-api.ts`, and `FFlowModule` when a public surface actually changes.
- Do add colocated `*.spec.ts` tests for new logic when the surrounding feature already has tests.
- Do use the testing kit from `libs/f-flow/src/testing` instead of ad hoc test infrastructure.
- Do keep public docs/examples in sync when changing public behavior.
- Do let Prettier and ESLint conventions stand: 2-space indentation, single quotes, semicolons, multiline trailing commas, blank line before `return` when required by lint.

### Don’t

- Don’t rename established public API to match generic Angular or React naming preferences.
- Don’t move interfaces or helper types into a separate global folder when the surrounding feature colocates them.
- Don’t invent new state-management layers inside the library.
- Don’t accumulate multiple unrelated operations in one large feature file when the surrounding slice breaks them into separate folders.
- Don’t use `*Handler` naming just to mark “the class that does the work” if the local slice already uses plain feature names plus `*Request`.
- Don’t introduce generic method names such as `process`, `executeFeature`, or `runLogic` when the surrounding code already has a clearer domain verb.
- Don’t bypass browser/platform abstractions with direct `window` or `document` access in library code.
- Don’t add `console.log`; lint only allows `console.warn` and `console.error`.
- Don’t use `as any` in specs. Keep unsafe casts in `libs/f-flow/src/testing/internal`.
- Don’t “fix” legacy naming or file-path oddities unless the task explicitly requires a migration.

## Safe generation rules for AI agents

- Start from the nearest local precedent:
  - same feature folder first
  - same top-level slice second
  - another library slice third
  - examples/portal last
- When creating a new library file inside an existing feature:
  - keep it in the same feature subtree
  - use kebab-case naming
  - export it through the local `index.ts`
  - if it is a mediator operation, add a `*Request` class and register the execution in the feature `providers.ts`
- When adding a new operation to `domain/*` or another granular feature area:
  - create a dedicated folder for that operation
  - add `operation-name.ts`
  - add `operation-name-request.ts`
  - add `index.ts` that re-exports both
  - register the execution in the parent `providers.ts`
- When adding a new public library surface:
  - update the feature barrel
  - update `libs/f-flow/src/public-api.ts`
  - update `FFlowModule` and the relevant `F_*_PROVIDERS` array if the symbol is part of Angular module compatibility
  - update examples/docs/changelog/migration notes when the change is user-visible
- When continuing an existing Angular feature, preserve the local choice for:
  - `inject()` vs constructor injection
  - `input()` / `model()` / `output()` vs `@Input()` / `@Output()`
  - plain feature file naming vs `.component.ts` / `.directive.ts` / `.service.ts`
  - `styleUrls` vs `styleUrl`
- When creating a new library-side execution, prefer:
  - `some-feature.ts` for the implementation
  - `some-feature-request.ts` for the request
  - `SomeFeature` and `SomeFeatureRequest` for class names
- When the behavior has multiple stages, prefer multiple small operations such as `some-feature-preparation`, `some-feature-finalize`, `calculate-something`, `register-something`, or `emit-something` instead of one monolithic class.
- Only use `*-handler` naming if the exact subtree already uses handler terminology as part of a larger drag/interaction pipeline.
- When adding examples:
  - keep them standalone if the surrounding example area is standalone
  - import `FFlowModule` when that is the local example pattern
  - update the relevant lazy registration config such as `apps/f-flow-portal/src/app/examples.config.ts`
  - add the matching markdown entry under `apps/f-flow-portal/public/markdown` when the example should appear in docs navigation
- If more than one repository pattern exists, prefer the one already used in the exact folder you are editing.
- If the exact folder is mixed, prefer the dominant pattern inside `libs/f-flow/src` for library code and the dominant pattern inside the surrounding example/app area for consumer code.
- If ambiguity remains after that, preserve existing public API compatibility and choose the option that requires the smallest new abstraction footprint.

## AI documentation maintenance (llms.txt)

The file `llms.txt` at the repository root is the AI-consumable documentation that Context7 and other AI tools index. The file `context7.json` configures how Context7 crawls this repository.

### When to update llms.txt

- When a public API surface changes: new or removed inputs, outputs, methods, selectors, or types.
- When a new component, directive, or service is added to the public API.
- When a component/directive is deprecated or removed.
- When default values change for existing inputs.
- When new enums, interfaces, or type aliases are added to the public API.
- When breaking changes are introduced in a new major/minor version.

### How to update llms.txt

- Keep the existing document structure: sections, tables, code examples.
- Update the version number at the top when bumping the package version.
- Add new components/directives in the API Reference section following the existing table format.
- Update the Angular Version Compatibility table when compatibility changes.
- Keep code examples accurate and using current API names (prefer non-deprecated property names).
- Do not remove documentation for features that still exist.
- Do not add internal/private APIs. Only document what is exported through `public-api.ts`.

### When to update context7.json

- When new documentation folders are added that Context7 should crawl.
- When folders should be excluded from crawling.
- When usage rules change for AI consumers.

## Possible conventions that need manual confirmation

- The repository is mixed between standalone declarables and `FFlowModule` compatibility. New library code often uses standalone APIs, but module support remains active and heavily used by examples.
- Newer library files often favor `inject()`, `input()`, `model()`, and `output()`, but active code still uses constructor injection and decorator-based inputs/outputs in some features.
- `templateUrl` + `styleUrls` is dominant, but some portal files use `styleUrl`.
- Example entry files use both plain names such as `custom-nodes.ts` and suffix-based names such as `node-as-connector.component.ts`.
- Older library slices still contain `.component.ts`, `.directive.ts`, `.service.ts`, and many `*-handler.ts` files, but newer slices often avoid those suffixes. Keep following the exact local slice when editing mixed areas.
- Interfaces strongly favor the `I` prefix, but testing helpers and a few utility contracts include exceptions. Keep following the local slice rather than enforcing the prefix mechanically in unrelated code.
- Enums strongly favor the `EF` prefix, but a small number of utility enums use descriptive names without it.
