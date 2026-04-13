# AGENT.md

## Purpose

Use this file when adding, rewriting, or reviewing examples inside `projects/f-examples`.
This guide is based on the examples that already follow the newer repository style and on the way examples are wired into the docs portal.

## Source of truth

Treat these examples as the primary reference for new work:

- `projects/f-examples/advanced/copy-paste/copy-paste.ts`
- `projects/f-examples/advanced/undo-redo-v2/undo-redo-v2.ts`
- `projects/f-examples/connections/connection-content/connection-content.ts`
- `projects/f-examples/connectors/connection-rules/connection-rules.ts`
- `projects/f-examples/extensions/auto-pan/auto-pan.ts`
- `projects/f-examples/nodes/custom-nodes/custom-nodes.ts`
- `projects/f-examples/nodes/grouping/grouping.ts`

Treat these as legacy-style references that still work but should not define new example style:

- `projects/f-examples/connectors/node-as-connector/node-as-connector.component.ts`
- `projects/f-examples/extensions/selection-area/selection-area.component.ts`
- `projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.ts`

## Canonical example shape

- Place each example in `projects/f-examples/<category>/<slug>/`.
- Use the existing top-level categories:
  - `nodes`
  - `connectors`
  - `connections`
  - `extensions`
  - `plugins`
  - `advanced`
  - `pro-examples`
- Keep the normal example folder self-contained and flat.
- The common folder shape is exactly three root files:
  - `<slug>.ts`
  - `<slug>.html`
  - `<slug>.scss`
- Do not add `index.ts` to example folders. Current examples do not use local barrels.
- Add extra local files only when the example is too complex for a single component file. Keep those helpers colocated under the same example folder.

## New-style naming

- Use the folder slug as the source of truth for naming.
- Prefer plain file names:
  - `auto-pan.ts`
  - `copy-paste.ts`
  - `connection-content.ts`
- Do not create new examples as `*.component.ts`, `*.directive.ts`, or `*.service.ts`.
- Keep the selector equal to the folder slug:
  - `selector: 'auto-pan'`
  - `selector: 'copy-paste'`
- Name the class in PascalCase from the same slug, without `Component`:
  - `AutoPan`
  - `CopyPaste`
  - `ConnectionContent`
- Keep the template and style names aligned with the same slug:
  - `auto-pan.html`
  - `auto-pan.scss`

## Component structure

- Make every example a standalone Angular component.
- Use `ChangeDetectionStrategy.OnPush`.
- Import `FFlowModule` in the example component. Every current example does this.
- Add extra imports only for the specific demo need:
  - Angular Material controls
  - `@portal-ui` helpers such as `ExampleToolbar`, `ExampleSelect`, `ExampleInput`, `ExampleExternalPalette`
  - extra Foblex declarables when the example explicitly demonstrates them
- Keep example-only interfaces and lightweight helper types in the same `.ts` file unless the example becomes genuinely multi-part.

## State and DI

- Prefer function-based Angular APIs in new examples:
  - `viewChild(...)`
  - `signal(...)`
  - `model(...)`
  - `computed(...)`
  - `inject(...)`
- Prefer `private readonly _canvas = viewChild(...)` or `viewChild.required(...)` for canvas/flow access.
- Prefer `protected readonly` state for values that are read in the template.
- Prefer `private readonly _...` fields for internal references and helpers.
- Avoid public mutable template-facing fields in new examples.
- Use simple local state that explains the feature directly. Do not introduce app-like store layers unless the example is explicitly about state/history patterns, as in `undo-redo-v2`.

## Methods

- In new examples, prefer action names without the `on` prefix:
  - `loaded`
  - `createConnection`
  - `reassignConnection`
  - `selectionChanged`
  - `canvasChanged`
  - `deleteConnections`
- Keep private helpers underscore-prefixed and verb-based:
  - `_hasConnection`
  - `_copyInternal`
  - `_applyChanges`
  - `_removeConnection`
- Keep event handlers short and feature-oriented. Push complex steps into small private helpers.
- Use public methods only for Angular lifecycle hooks such as `ngOnInit` or `ngOnDestroy`.

## Template structure

- Start the example with `<f-flow>` and keep `<f-canvas>` inside it.
- Bind example outputs at the flow/canvas level and forward them to local action methods.
- Use Angular built-in control flow. Current examples use `@for`, `@if`, and tracking expressions.
- Do not introduce `*ngIf`, `*ngFor`, or `*ngSwitch` in new example templates.
- When rendering node or connection collections, use `@for (...; track ...)`.
- If the example has controls, place them outside the flow in `<example-toolbar>`.
- If the example has an external drag source or other surrounding UI, keep that UI outside the flow and colocated in the same template.

## Event API usage

- Prefer current event payload names in new examples when the event already exposes them:
  - `sourceId`
  - `targetId`
  - `dropPosition`
  - `previousSourceId`
  - `nextSourceId`
  - `previousTargetId`
  - `nextTargetId`
  - `nodeIds`
  - `connectionIds`
- Do not introduce new examples that depend on deprecated aliases like:
  - `fOutputId`
  - `fInputId`
  - `fDropPosition`
  - `oldSourceId`
  - `newTargetId`
  - `fNodeIds`
  - `fConnectionIds`
- Legacy examples still use those aliases. Treat that as migration debt, not as the target style for new examples.

## Example behavior and UX

- Most examples center or fit the canvas in `loaded()`. Keep that behavior in new examples unless the demo explicitly requires a different initial state.
- Keep example data small and readable unless the example is specifically a stress/performance demo.
- When the example demonstrates configuration toggles, back them with local signals or models and expose them through `ExampleToolbar`.
- Keep the example focused on one feature or one clear scenario. Do not combine unrelated features in one demo.

## Docs and registration

- After creating a new example, register it in `src/app/examples.config.ts`.
- Prefer the plain import path in the component registry:
  - `../../projects/f-examples/<category>/<slug>/<slug>`
- Do not introduce a new `.component` import path for a new-style example.
- Add the matching markdown file as a flat file:
  - `public/markdown/examples/<slug>.md`
- Keep the markdown example slug aligned with the folder slug and selector.
- Follow the existing markdown structure:
  - frontmatter
  - `# Title`
  - `## Description`
  - `## Example`
  - optional usage sections such as `## What to try`, `## What this solves`, `## When to use it`, `## Related docs`
- In the `::: ng-component` block, point to the actual example files under `projects/f-examples/.../<slug>.ts|html|scss`.

## What to copy from the new style

- Plain slug-based file naming.
- Class names without `Component`.
- `standalone: true` plus `ChangeDetectionStrategy.OnPush`.
- `FFlowModule` in `imports`.
- `viewChild`, `signal`, `model`, `computed`, `inject`.
- `protected` template API and `private readonly _...` internals.
- Action-based method names.
- `@for` / `@if` templates.
- Current event payload names when available.
- Self-contained three-file example folders.

## What not to copy into new examples

- `*.component.ts` for new example entry files.
- `ClassNameComponent` for new example classes.
- `@ViewChild` plus public mutable component fields when a function-based query is enough.
- `onLoaded`, `onCreateConnection`, `onConnectionCreated` as the default naming style for new examples.
- Deprecated event fields when current fields already exist.
- Overgrown examples that mix multiple unrelated demo goals.

## Mixed patterns that still need manual caution

- `projects/f-examples` is not fully migrated. About half of the example entry files still use `.component.ts`.
- Some plain-file examples still use old event aliases. Plain file naming alone does not guarantee fully migrated event API usage.
- A small number of plain-file examples still keep `onLoaded()` naming. Prefer the dominant action-style naming in new work, but preserve local consistency when editing an existing example in place.
