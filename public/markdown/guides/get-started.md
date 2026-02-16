# Installing and Rendering Your First Flow

Build your first interactive diagram in Angular: **install Foblex Flow**, render **two draggable nodes**, and connect them with a **live connection**.

## Description

This guide is the shortest path from installation to a working flow. You will:

- add or update the library in your Angular app,
- render a minimal flow (`f-flow` + `f-canvas`),
- place nodes with explicit positions,
- connect them with `f-connection`,
- apply small baseline styles you can reuse.

## Install

::: code-group

```bash [install]
ng add @foblex/flow
```

```bash [update]
ng update @foblex/flow
```

:::

## Why / when to use this

Start here if you are:

- evaluating Foblex Flow in an existing Angular application,
- bootstrapping a workflow / node editor screen,
- building internal tools with draggable, connected nodes,
- creating the base layout before adding selection, minimap, alignment, and spacing helpers.

## Minimal flow template

A minimal interactive flow consists of:

1. **`f-flow`** — the root container.
2. **`fDraggable`** — enables interaction (drag, pointer handling, editor UX pipeline).
3. **`f-canvas`** — the layer where nodes and connections are rendered.
4. **Nodes** with `fNode` and explicit positions via `fNodePosition`.
5. **Connectors** (`fNodeOutput` / `fNodeInput`) + **`f-connection`** that joins matching `fOutputId` and `fInputId`.

```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>

    <div
      fNode
      fDragHandle
      fNodeOutput
      [fNodePosition]="{ x: 32, y: 32 }"
      fOutputId="output1"
      fOutputConnectableSide="right"
    >
      Node 1
    </div>

    <div
      fNode
      fDragHandle
      fNodeInput
      [fNodePosition]="{ x: 240, y: 32 }"
      fInputId="input1"
      fInputConnectableSide="left"
    >
      Node 2
    </div>
  </f-canvas>
</f-flow>
```

## Styling baseline

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
- [`fNodeOutput`](f-node-output-directive) / [`fNodeInput`](f-node-input-directive) — connectors that represent connection endpoints.
- [`f-connection`](f-connection-component) — renders a connection between matching `fOutputId` and `fInputId`.

## Try it yourself

After you get the minimal template working, try:

- moving nodes by changing `[fNodePosition]`,
- adding more nodes and connections,
- experimenting with connector sides (`fOutputConnectableSide`, `fInputConnectableSide`),
- changing the connection look/behavior via `fType` and `fBehavior`,
- enabling additional UX helpers (selection area, minimap, alignment and spacing).

## Notes / pitfalls

- Nodes and connections must be inside `f-canvas`. Elements outside it will not participate in transform and interaction.
- `fOutputId` and `fInputId` must match connector ids exactly — otherwise the connection will not render.
- Always define initial node positions for predictable layout.
- Keep ids stable across re-renders if your app persists or recalculates the graph.

For custom connection types, see the Examples section: `/examples/custom-connection-type`.

## Next steps

Continue with the API references:

- [`f-flow`](f-flow-component)
- [`f-canvas`](f-canvas-component)
- [`fNode`](f-node-directive)
- [`fNodeOutput`](f-node-output-directive)
- [`fNodeInput`](f-node-input-directive)
- [`f-connection`](f-connection-component)

## Example

---

::: ng-component <draggable-flow></draggable-flow> [height]="600"
:::

## Support Foblex Flow

If this page helped you build something (or saved you from writing drag+drop and SVG connection logic from scratch), please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow) — it directly helps the project grow.
