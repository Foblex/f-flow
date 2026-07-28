---
origin: "https://javascript.plainenglish.io/design-node-based-interfaces-in-angular-a-beginners-guide-with-foblex-flow-b3160ac3edbb"
originLabel: "Originally published on JavaScript in Plain English"
publishedAt: "2025-06-23"
updatedAt: "2026-07-28"
---

# Building AI Low-Code Platform in Angular — Part 2: Creating Your First Flow

Learn how to render a flow, create basic draggable nodes, and connect them. This tutorial gives you the first working editor surface that later evolves into a richer Angular workflow builder.

In this article, we’ll build a minimal interactive flow with draggable nodes and dynamic connections using Foblex Flow.

[View the source code on GitHub](https://github.com/Foblex/Building-AI-Low-Code-Platform2)

> **Version note:** The linked repository preserves the original v18 implementation. The examples below use the unified connector API introduced in v19.

## 🚀 Installation

To add Foblex Flow to your Angular project:

```bash
ng add @foblex/flow
```

For Nx workspaces:

```bash
nx g @foblex/flow:add
```

If you prefer manual installation, install the required companion packages explicitly:

```bash
npm install @foblex/flow @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

## 🔧 Creating a Basic Flow

Let’s create the smallest useful example: two nodes and one connection.

```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fSourceId="source1" fTargetId="target1"></f-connection>

    <div
      fNode
      fDragHandle
      [fNodePosition]="{ x: 32, y: 32 }"
    >
      Node 1
      <div
        fConnector
        fConnectorId="source1"
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
        fConnectorId="target1"
        fConnectorType="target"
        fConnectorConnectableSide="left"
      ></div>
    </div>
  </f-canvas>
</f-flow>
```

## 🎨 Styling

`ng add @foblex/flow` connects the shipped default theme automatically. You can keep it, override it with application styles like these, or configure the theme manually when installing the package without the schematic.

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
  }
}

.f-drag-handle {
  cursor: move;
}

::ng-deep {
  .f-connection {
    .f-connection-drag-handle {
      fill: transparent;
    }

    .f-connection-selection {
      stroke-width: 10;
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

## 🔍 Explanation

- `<f-flow>`: root component that hosts editor interaction and runtime UI state.
- `<f-canvas>`: workspace where nodes and connections are rendered.
- `fNode`: directive that turns an element into a node.
- `fConnector`: unified connector directive; `fConnectorType` selects the `source` or `target` role.
- `<f-connection>`: renders a connection whose `fSourceId` and `fTargetId` match connector IDs.

Unified `fConnectorId` values share one registry, so each connector needs a unique ID.

## 🧪 Try This

- Change `[fNodePosition]` coordinates.
- Add extra `fNode` and `f-connection` elements.
- Experiment with connector sides using `fConnectorConnectableSide`.
- Tune connection visuals with `fType` and behavior with `fBehavior`.

`fType` values: `straight`, `bezier`, `segment` (or custom string).  
`fBehavior` values: `fixed`, `fixed_center`, `floating` (default: `fixed`).

## ⚙️ Customize It

- Use any Angular components inside `fNode`.
- Keep full control over styles and UI structure.
- Works with SSR, Standalone Components, Signals, and zoneless Angular.

## 🐞 Common Mistakes

- Missing `[fNodePosition]`: nodes start at the default origin and can overlap.
- A mismatched `fSourceId` / `fTargetId` and `fConnectorId`: connection is not rendered.
- Components outside `<f-canvas>`: `fNode` and `fConnection` won’t work.

## 🔍 Under the Hood

1. All `fNode` elements are registered with positions.
2. `fConnection` resolves source and target connectors by their unified IDs.
3. Connection points are calculated and an SVG path is drawn.
4. On node movement, paths are recalculated automatically.

## ⏭ What’s Next?

In the next part, we’ll create custom Angular node components and add palette-based drag-and-drop.

Official docs: [flow.foblex.com](https://flow.foblex.com)

## 🙌 Thanks for Your Interest

If you like the project — leave a ⭐ on GitHub, join the discussions, and share your feedback!
