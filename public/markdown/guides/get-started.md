# Installing the Library and Rendering Your First Flow

In this guide, you’ll learn how to set up **Foblex Flow** in your Angular project and render your first interactive flow — complete with draggable nodes and dynamic connections. **Foblex Flow** is a lightweight, flexible library for building flow-based UIs natively in Angular.

## 🚀 Installation

**Foblex Flow** provides a schematic for quick setup. Just run the following command in your Angular project to install and configure everything automatically:

::: code-group

```bash [install]
ng add @foblex/flow
```

```bash [update]
ng update @foblex/flow
```

:::

## 🔧 Basic Flow Example

Here’s the most minimal working example — a canvas with two nodes and one connection between them:

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

## 🎨 Styling Basics

**Foblex Flow** doesn’t enforce any styling, giving you full design control. Here’s a sample style sheet to help you get started:

```scss
.f-flow {
  height: 400px;
}

.f-node {
  padding: 24px;
  color: rgba(60, 60, 67);
  text-align: center;
  background: #ffffff;
  border-radius: 2px;
  border: 0.2px solid rgba(60, 60, 67);

  &.f-selected {
    border-color: #3451b2;
    // Highlights the border when the node is selected
    // The f-selected class is automatically added by the library when a node or connection is selected.
  }
}

.f-drag-handle {
  cursor: move;
}

::ng-deep {
  .f-connection {
    .f-connection-drag-handle {
      fill: transparent;
      // By default, this element has a black fill and is used to detect the start of dragging (e.g., onmousedown).
      // We make it transparent to avoid visual clutter, while keeping it functional.
    }

    .f-connection-selection {
      stroke-width: 10;
      // This is a pseudo-connection (a copy of the main path) used to make it easier to select the connection.
      // It's slightly thicker than the actual path (which is often only 1px), making it easier to interact with.
      // It remains invisible to avoid affecting visual clarity but stays active for user interaction.
    }

    .f-connection-path {
      stroke: rgba(60, 60, 67);
      stroke-width: 2;
    }

    &.f-selected {
      .f-connection-path {
        stroke: #3451b2;
      }
    }
  }
}
```
---
::: ng-component <draggable-flow></draggable-flow> [height]="300"
:::
## 🔍 Explanation

- [`<f-flow>`](f-flow-component) — the root component that manages the flow state.
- [`<f-canvas>`](f-canvas-component) — the layer where nodes and connections are placed.
- [`fNode`](f-node-directive) — directive representing a node.
- [`fNodeOutput`](f-node-output-directive) / [`fNodeInput`](f-node-input-directive) — connectors for connections. fNodeOutput is the source, and fNodeInput is the target.
- [`<f-connection>`](f-connection-component) — the component that renders a connection between two connectors by their fOutputId and fInputId.

⚠️ **Note**: `fOutputId` and `fInputId` may technically match, since they belong to different connector collections. However, this is not recommended, as future versions may unify these into a single fConnector directive where matching IDs would cause conflicts.

## 🧪 Try It Yourself

Enhance your flow with the following:

- Change the `[fNodePosition]` coordinates
- Add more `fNode` and `f-connection` elements
- Experiment with connection sides: `fOutputConnectableSide`, `fInputConnectableSide`
- Modify the connection type or behavior using the `fType` and `fBehaviour` inputs.
- `fType`: defines the visual style of the connection. Acceptable values from the `EFConnectionType` enum include: `straight`, `bezier`, `segment`. You can also pass a string for a custom connection type.

To create a custom connection type, see [documentation here](./examples/custom-connection-type).

- `fBehavior`: defines the connection behavior, including positioning and flexibility. Acceptable values from `EFConnectionBehavior` include: `fixed`, `fixed_center`, `floating`. Default: `EFConnectionBehavior.FIXED`.

## ⚙️ Customization Notes

- Total freedom in node visuals — use any Angular component, not just `<div>`.
- Fully SSR-compatible, and works with Angular Signals and standalone components.
- You define the UI, the flow engine handles interactions.

## 🐞 Common Mistakes

- ❌ Forgot `[fNodePosition] → nodes will not render.
- ❌ `fOutputId` or `fInputId don’t match the ones set in connectors — connections won’t render.
- ❌ Placing elements outside [`<f-canvas>`](f-canvas-component) — [`fNode`](f-node-directive) and [`<f-connection>`](f-connection-component) must be within it.

## 🔍 Internals: How It Works

1. Each node is registered with its coordinates and metadata.
2. Connections reference nodes by their fOutputId and fInputId.
3. SVG lines are calculated between node anchors and rendered live.
4. On drag/move, connections automatically reflow and update visually.

## 🙌 Get Involved

If you find **Foblex Flow** useful — drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!

