---
origin: "https://javascript.plainenglish.io/design-node-based-interfaces-in-angular-a-beginners-guide-with-foblex-flow-b3160ac3edbb"
originLabel: "Originally published on JavaScript in Plain English"
title: "Design Node-Based Interfaces in Angular — A Beginner’s Guide with Foblex Flow"
description: "Learn how to render a flow, create basic draggable nodes, and connect them. This is the foundation for your AI low-code platform."
ogType: "article"
twitterCard: "summary_large_image"
---

# Building AI Low-Code Platform in Angular — Part 2: Creating Your First Flow

Learn how to render a flow, create basic draggable nodes, and connect them. This is the foundation for your AI low-code platform.

In this article, we’ll build a minimal interactive flow with draggable nodes and dynamic connections using Foblex Flow.

[View the source code on GitHub](https://github.com/Foblex/Building-AI-Low-Code-Platform2)

## 🚀 Installation

To add Foblex Flow to your Angular project:

```bash
ng add @foblex/flow
```

## 🔧 Creating a Basic Flow

Let’s create the smallest useful example: two nodes and one connection.

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

## 🎨 Styling

Foblex Flow does not ship default styles, so you fully control the look.

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

- `<f-flow>`: root component that manages flow state.
- `<f-canvas>`: workspace where nodes and connections are rendered.
- `fNode`: directive that turns an element into a node.
- `fNodeOutput` / `fNodeInput`: source and target connectors.
- `<f-connection>`: renders a connection by `fOutputId` and `fInputId`.

Note: `fOutputId` and `fInputId` belong to different collections, so they may match technically, but it is better to keep them distinct.

## 🧪 Try This

- Change `[fNodePosition]` coordinates.
- Add extra `fNode` and `f-connection` elements.
- Experiment with connector sides: `fOutputConnectableSide`, `fInputConnectableSide`.
- Tune connection visuals with `fType` and behavior with `fBehavior`.

`fType` values: `straight`, `bezier`, `segment` (or custom string).  
`fBehavior` values: `fixed`, `fixed_center`, `floating` (default: `fixed`).

## ⚙️ Customize It

- Use any Angular components inside `fNode`.
- Keep full control over styles and UI structure.
- Works with SSR, Standalone Components, Signals, and zoneless Angular.

## 🐞 Common Mistakes

- Missing `[fNodePosition]`: node is not rendered.
- Wrong `fOutputId` / `fInputId`: connection is not rendered.
- Components outside `<f-canvas>`: `fNode` and `fConnection` won’t work.

## 🔍 Under the Hood

1. All `fNode` elements are registered with positions.
2. `fConnection` resolves related connectors by IDs.
3. Connection points are calculated and an SVG path is drawn.
4. On node movement, paths are recalculated automatically.

## ⏭ What’s Next?

In the next part, we’ll create custom Angular node components and add palette-based drag-and-drop.

Official docs: [flow.foblex.com](https://flow.foblex.com)

## 🙌 Thanks for Your Interest

If you like the project — leave a ⭐ on GitHub, join the discussions, and share your feedback!
