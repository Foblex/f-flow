# Installing and Rendering Your First Flow

Build your first interactive diagram in Angular: **install Foblex Flow**, render **two draggable nodes**, and connect them with a **live connection**.

This is the default starting path for most Angular teams. You do not need caching or virtualization on day one.

Prefer trying without a local setup? Open the [minimal starter on StackBlitz](https://stackblitz.com/github/Foblex/f-flow/tree/main/starters/minimal-flow) — a running editor with two nodes and connection creation.

## Description

This guide is the shortest path from installation to a working flow. You will:

- add or update the library in your Angular app,
- render a minimal flow (`f-flow` + `f-canvas`),
- place nodes with explicit positions,
- connect them with `f-connection`,
- apply small baseline styles you can reuse.

## Install

This guide assumes the current `19.x` line. If your application is on Angular 12-17.2, start with [Angular Version Compatibility](angular-version-compatibility) and pin the matching Foblex Flow line before you run `ng add` or `npm install`.

::: code-group

```bash [install]
ng add @foblex/flow
```

```bash [nx]
nx g @foblex/flow:add
```

```bash [manual]
npm install @foblex/flow @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

```bash [update]
ng update @foblex/flow
```

:::

`ng add` also connects the shipped default theme automatically by adding `node_modules/@foblex/flow/styles/default.scss` to application styles when the entry is missing.

If you want manual or selective theme setup, continue with [Default Theme and Styling](default-theme-and-styling).

## Why / when to use this

Start here if you are:

- evaluating Foblex Flow in an existing Angular application,
- bootstrapping a workflow / node editor screen,
- building internal tools with draggable, connected nodes,
- creating the base layout before adding selection, minimap, alignment, and spacing helpers.
- validating whether Foblex Flow fits your Angular stack before adding optional advanced modules.

## Minimal flow template

A minimal interactive flow consists of:

1. **`f-flow`** — the root container.
2. **`fDraggable`** — enables interaction (drag, pointer handling, editor UX pipeline).
3. **`f-canvas`** — the layer where nodes and connections are rendered.
4. **Nodes** with `fNode` and explicit positions via `fNodePosition`.
5. **Unified connectors** (`fConnector`) + **`f-connection`** whose `fSourceId` and `fTargetId` reference matching `fConnectorId` values.

```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fSourceId="source-1" fTargetId="target-1"></f-connection>

    <div
      fNode
      fDragHandle
      [fNodePosition]="{ x: 32, y: 32 }"
    >
      Node 1
      <div
        fConnector
        fConnectorId="source-1"
        fConnectorType="source"
        fConnectorConnectableSide="right"
      ></div>
    </div>

    <div
      fNode
      fDragHandle
      [fNodePosition]="{ x: 240, y: 32 }"
    >
      Node 2
      <div
        fConnector
        fConnectorId="target-1"
        fConnectorType="target"
        fConnectorConnectableSide="left"
      ></div>
    </div>
  </f-canvas>
</f-flow>
```

Import `FFlowModule` for the complete template above. `f-flow` and `f-canvas` are standalone components, but the sample also uses non-standalone directives and components that the module registers:

```typescript
import { Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [FFlowModule],
  templateUrl: './flow.html',
  styleUrl: './flow.scss',
})
export class Flow {}
```

## Choose a state mode

The template above works with either state integration:

- **Classic mode (default):** your component owns node, group, and connection records. Handle final interaction events such as `fCreateConnection` and `fMoveNodes`, validate them, and update your Angular state.
- **Managed mode (opt-in):** install `provideFFlow(withFlowState())`, load typed records into `FFlowState`, and render its signals. Supported gestures update those records and history automatically, with snapshots and undo/redo included.

In both modes your application defines domain fields, validation rules, permissions, and persistence. See the [Managed Flow State guide](managed-flow-state) when you want the opt-in store.

## Default theme

The quickest styling path is to keep the shipped theme connected.

If you installed the package manually, add one of these:

::: code-group

```json [angular.json]
"styles": [
  "src/styles.scss",
  "node_modules/@foblex/flow/styles/default.scss"
]
```

```scss [styles.scss]
@use '@foblex/flow/styles/default';
```

:::

Then only add layout styles that belong to your screen:

```scss
.f-flow {
  height: 400px;
}
```

For selective mixins and token overrides, see [Default Theme and Styling](default-theme-and-styling).

## Manual styling baseline

Foblex Flow is intentionally UI-agnostic: it does not enforce a design system.  
Use this as a practical baseline, then adapt it to your app styles.

```scss
.f-flow {
  height: 400px;
}

.f-node {
  padding: 24px;
  color: rgba(60, 60, 67);
  text-align: center;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid rgba(60, 60, 67, 0.28);

  &.f-selected {
    border-color: var(--connection-color, #3451b2);
  }
}

.f-drag-handle {
  cursor: move;
}

/**
 * Connection SVG lives inside the component template,
 * so styling usually goes through ::ng-deep (or global styles).
 */
::ng-deep .f-connection {
  .f-connection-path {
    stroke: rgba(60, 60, 67, 0.78);
    stroke-width: 2;
    fill: none;
  }

  /**
   * Selection overlay makes thin lines easier to click.
   * Keep it invisible but interactive.
   */
  .f-connection-selection {
    stroke-width: 10;
  }

  /**
   * Drag handle is used for pointer detection.
   * It can be made transparent to avoid visual clutter.
   */
  .f-connection-drag-handle {
    fill: transparent;
  }

  &.f-selected .f-connection-path {
    stroke: var(--connection-color, #3451b2);
  }
}
```

## Explanation

- [`f-flow`](f-flow-component) — root container that provides flow context.
- [`f-canvas`](f-canvas-component) — viewport/rendering layer for nodes and connections.
- [`fNode`](f-node-directive) — directive that turns an element into a node.
- [`fConnector`](f-connector-directive) — unified source, target, source-target, or outlet endpoint. Use it for new code.
- [`f-connection`](f-connection-component) — renders a connection whose `fSourceId` and `fTargetId` match rendered `fConnectorId` values.

## Try it yourself

After you get the minimal template working, try:

- moving nodes by changing `[fNodePosition]`,
- adding more nodes and connections,
- experimenting with connector sides (`fConnectorConnectableSide`),
- changing the connection look/behavior via `fType` and `fBehavior`,
- enabling additional UX helpers (selection area, minimap, alignment and spacing).

Only add scaling features such as cache or virtualization once you actually need them for larger scenes.

## Notes / pitfalls

- Nodes and connections must be inside `f-canvas`. Elements outside it will not participate in transform and interaction.
- Nested control flow (`@for` inside `@if`, `@for` inside `@for`) is not projected into the canvas — content renders detached and invisible without errors. Wrap the block with `<ng-container ngProjectAs="[fNodes]">` (groups: `"[fGroups]"`, connections: `"[fConnections]"`). See [Errors and Warnings](errors) (FF1004).
- `fSourceId` and `fTargetId` must match rendered `fConnectorId` values exactly — otherwise the connection will not render.
- Always define initial node positions for predictable layout.
- Keep ids stable across re-renders if your app persists or recalculates the graph.
- Older `fNodeOutput` / `fNodeInput` and `fOutputId` / `fInputId` APIs remain as deprecated compatibility aliases. Do not use them in new code; follow [Migrating to Unified Connectors](migrating-to-unified-connectors) when updating an existing editor.

For custom connection types, see the Examples section: `/examples/custom-connection-type`.

## Next steps

Continue with the API references:

- [`f-flow`](f-flow-component)
- [`f-canvas`](f-canvas-component)
- [`fNode`](f-node-directive)
- [`fConnector`](f-connector-directive)
- [`f-connection`](f-connection-component)
- [Managed Flow State](managed-flow-state)

## Example

---

::: ng-component <draggable-flow></draggable-flow> [height]="600"
:::

## Support Foblex Flow

If this page helped you build something (or saved you from writing drag+drop and SVG connection logic from scratch), please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow) — it directly helps the project grow.
