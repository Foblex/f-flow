---
publishedAt: "2026-07-05"
updatedAt: "2026-07-13"
---

# React Flow Alternative for Angular

If you searched for this page, you probably know React Flow, like React Flow, and need the same class of node-based editor inside an Angular application. The direct options are wrapping React inside Angular or picking an Angular-native library. Foblex Flow is the Angular-native answer: the same product category — node editors, workflow builders, interactive diagrams — built on Angular's own primitives.

## Why not just wrap React Flow?

Wrapping works, but you pay for it permanently:

- two frameworks in one bundle — React, ReactDOM and React Flow ship alongside Angular;
- two change-detection worlds — React state and Angular signals/zones must be bridged by hand;
- custom nodes become React components, so your Angular components, pipes, directives and DI don't work inside the canvas;
- SSR/hydration and testing get two sets of rules.

An Angular-native library removes the seam: nodes are your Angular components with your bindings, and the editor participates in change detection like any other part of the app.

## How the React Flow mental model maps

The paradigm differs by design. React Flow describes the graph as data (`nodes[]`, `edges[]`) rendered by the library; Foblex Flow describes the graph as an Angular template rendered by you. What you know transfers directly:

- `<ReactFlow nodes={nodes} edges={edges}>` → `<f-flow fDraggable><f-canvas>` with `@for` over your own model;
- a node object with `position` and `data` → any element with `fNode` and `[fNodePosition]`, containing real Angular UI;
- `<Handle type="source" />` → `<div fConnector fConnectorType="source" fConnectorId="...">`;
- an edge object → `<f-connection fSourceId fTargetId>` with behaviors, types, markers and labels;
- `onConnect` → `(fCreateConnection)` — the library emits intent, your app updates the model;
- `<MiniMap />`, `<Controls />`, `<Background />` → `<f-minimap>`, `fZoom` + public zoom API, `<f-background>`;
- `dagre`/`elkjs` layout recipes → the `@foblex/f-dagre-layout` and `@foblex/f-elkjs-layout` packages;
- `fitView`, viewport helpers → `fitToScreen()`, `resetScaleAndCenter()`, `centerGroupOrNode()`.

The golden rule in the default stateless mode is the same one React Flow users already respect: the library never mutates your application-owned data — it emits events, you decide. If you prefer library-managed graph records, the optional [Managed Flow State](./examples/state) plugin applies supported gestures to an explicit typed store and includes snapshots and undo/redo.

## What you get that React Flow doesn't ship

- Keyboard-driven connection creation and a full accessibility layer (opt-in `withA11y()`): spatial arrow navigation, selection, movement, deletion and connecting without a mouse, with screen-reader announcements.
- Configurable control schemes with Miro-like and draw.io-like presets, switchable at runtime.
- Click-to-connect alongside drag, on a gesture-independent connection engine you can extend with custom gestures.
- An Angular-grade integration story: signals-friendly, SSR-safe, zoneless-ready, `ng add` setup.

## What React Flow has that we don't pretend to match

- A much larger ecosystem: more third-party examples, templates, tutorials and StackOverflow answers.
- A React-shaped API that LLMs know from training data.
- A commercial Pro example library.

If those outweigh framework fit for your team, React Flow with a wrapper is a legitimate choice. For a deeper side-by-side — bundle size, SSR, migration notes — read [React Flow vs Foblex Flow for Angular teams](./docs/react-flow-vs-foblex-flow-for-angular-teams).

## Start in five minutes

```bash
ng add @foblex/flow
```

```html
<f-flow fDraggable (fCreateConnection)="onConnect($event)">
  <f-canvas>
    <f-connection fSourceId="a" fTargetId="b" />
    <div fNode fDragHandle [fNodePosition]="{ x: 24, y: 24 }">
      Node A
      <div fConnector fConnectorType="source" fConnectorId="a"></div>
    </div>
    <div fNode fDragHandle [fNodePosition]="{ x: 260, y: 24 }">
      Node B
      <div fConnector fConnectorType="target" fConnectorId="b"></div>
    </div>
  </f-canvas>
</f-flow>
```

Continue with [Get Started](./docs/get-started), browse the [examples](./examples/overview), or open the flagship [AI Low-Code Platform demo](./examples/ai-low-code-platform) to see how far the same primitives scale.
