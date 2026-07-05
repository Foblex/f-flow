---
publishedAt: "2026-07-05"
updatedAt: "2026-07-05"
---

# Angular AI Agent Builder

Visual AI builders — agent pipelines, RAG flows, prompt chains, low-code LLM tools — are node editors underneath: steps with configuration, wires with meaning, validation on what may connect to what. Foblex Flow gives Angular teams that editor layer, while your application keeps the semantics: which node is a model call, what flows through an edge, and what happens on run.

## What an AI builder needs from the canvas

- Nodes that are real forms: model pickers, prompt textareas, parameter sliders — any Angular component becomes a node with `fNode`, with your validation and your state management inside.
- Typed wiring: `fCanBeConnectedTo` and connector categories express "an LLM output feeds a parser, not a trigger" — the library enforces connectability, your app owns the schema.
- Live feedback: connection markers, gradients and labels for streaming state; node classes for running/failed states; auto-pan and minimap for large pipelines.
- Editing at production quality: drag/click/keyboard connection creation, reassign, undo-friendly events, multi-select, copy-paste patterns — all emitted as events (`fCreateConnection`, `fMoveNodes`, `fDeleteSelected`) so persistence and history stay in your store.
- Scale and a11y: virtualization for hundred-node pipelines and an opt-in keyboard layer, so the builder passes enterprise accessibility review.

## Proof it works: the AI Low-Code Platform demo

The flagship [AI Low-Code Platform example](./examples/ai-low-code-platform) is a front-end-only AI IDE built on these primitives: custom node types with config panels and validation, JSON import/export, themes, undo/redo, persistence, animated connections. It is open source — read it as a reference architecture for your own builder.

There is also a step-by-step article series: [Building an AI Low-Code Platform in Angular](./blog/building-ai-low-code-platform-in-angular-part-1-introduction-to-foblex-flow).

## Why Angular-native matters here

AI builders live inside products — admin panels, internal tools, SaaS dashboards — that in the Angular world already have DI, forms, guards and design systems. A React-based canvas forces a framework island exactly where the deepest product integration happens. Foblex Flow keeps the canvas inside your Angular architecture: signals, SSR, zoneless, `ng add` and done.

## Start

```bash
ng add @foblex/flow
```

[Get Started](./docs/get-started) covers the first editor in minutes; the [examples gallery](./examples/overview) covers the rest.
