---
origin: "https://medium.com/@shuzarevich/designing-a-stateless-library-how-foblex-flow-avoids-owning-your-data-e0a01bfb4419"
originLabel: "Originally published on Medium"
publishedAt: "2026-04-24"
updatedAt: "2026-04-24"
---

# Designing a Stateless Library: How Foblex Flow Avoids Owning Your Data

## The problem with libraries that own your data

Most node-based libraries ship with an opinion about your data model. You hand them a `nodes[]` array and an `edges[]` array, and in return you get a rendered graph. That works fine in a demo.

It starts to break the moment your app grows up.

Your real domain model is not `{ id, x, y }`. It is a workflow step, a call routing rule, an AI agent with a schema, a piece of business logic with validations attached.

Persistence is not "serialize the library's internal state to JSON". It is writing to your backend, your database, your existing document format.

Undo/redo is not the library's job. It is a feature of your editor, tied to your command history.

Optimistic updates, collaboration, offline sync — all of that lives in your app, not in a graph library.

When a library owns the data, every one of those concerns has to go through an adapter. You spend more time translating between the library's model and yours than you spend building the actual editor.

## What Foblex Flow does instead

**Foblex Flow is stateless.**

The library does not hold the definition of your graph. It renders what you pass in as Angular template children, listens for user interaction on those children, and emits events when something happens. Your application decides whether to apply the change.

That is the whole model.

- The library renders the UI layer.
- The application owns the business logic.
- The two communicate through events and inputs, never through a hidden internal store of your data.

This is not just a design preference. It is the decision that shaped every API that came after.

## 🎯 The key idea — what the library stores vs what the app stores

Most graph libraries keep a copy of your nodes and edges inside themselves. The library becomes the source of truth. Your app mirrors it.

Foblex Flow takes a different approach.

**What the library stores:**

- References to the `<f-node>` and `<f-connection>` instances currently in the template
- Transform state of the canvas — zoom, pan, viewport size
- Interaction state during a gesture — what is being dragged, resized, rotated, or reassigned
- Selection state — which node and connection IDs are currently highlighted
- Internal caches needed to draw connections and run hit-testing

**What the app stores:**

- The actual list of nodes and their properties
- The actual list of connections
- Anything domain-specific — labels, step types, validation rules, metadata
- Positions, if you want them persisted (the library tracks them during a drag, but the canonical value lives in your state)
- History, for undo/redo

> 📌 In short: the library handles the **UI layer**, while your application owns the business logic.

## ⚡ The event-driven model

The golden rule of Foblex Flow: the library **never mutates your data silently**.

Every user interaction that would change the graph is surfaced as an event. The library does not write back into your signals or services. It waits.

Concrete events on the **fDraggable** directive:

- **fCreateConnection** — the user finished dragging a line from one connector to another.
- **fReassignConnection** — the user detached an existing connection and attached it somewhere else.
- **fCreateNode** — an external item was dropped onto the canvas.
- **fMoveNodes** — a drag that moved one or more nodes finished, with the final positions.
- **fConnectionWaypointsChanged** — the user edited the waypoints of a connection.
- **fSelectionChange** — the set of selected nodes and connections changed.
- **fDropToGroup** — a node was dropped into a group.

Node position, size, and rotation follow the same pattern. **fNodePosition** is a two-way binding, but the source of truth is still your signal. The library reports the new value at the end of a gesture. Writing it back is your call.

Rendering lifecycle is also surfaced as events on the **<f-flow>** component:

- **fNodesRendered** — all nodes have been measured and laid out.
- **fFullRendered** — nodes and connections have both finished rendering. This is the signal to run "fit to content" after loading a flow.

> This happened. You decide what to do.

That one sentence is the whole interaction contract.

## 🧩 How this plays out in practice

This is where the shape of the API diverges from what people expect the first time they try the library.

People usually reach for something like `setState(…)` or `loadFromJSON(…)`. A method on the component that takes the full graph and renders it. That is the reducer-for-graphs mental model.

Foblex Flow does not work that way.

❌ **How people expect the API to work:**

```javascript
// This is NOT the Foblex Flow API.
this.fFlow.setState({
  nodes: [{ id: '1', x: 100, y: 200 }, { id: '2', x: 300, y: 200 }],
  edges: [{ from: '1', to: '2' }],
});
```

✅ **How the library actually works:**

```typescript
// Your data lives in your component - here as signals.
protected readonly nodes = signal([
  { id: '1', position: { x: 100, y: 200 } },
  { id: '2', position: { x: 300, y: 200 } },
]);

protected readonly connections = signal([
  { id: 'c1', from: '1', to: '2' },
]);

protected onMoveNodes(event: FMoveNodesEvent): void {
  // The library reported a gesture. You decide what to do.
  this.nodes.update((list) =>
    list.map((n) => {
      const moved = event.nodes.find((m) => m.id === n.id);
      return moved ? { ...n, position: moved.position } : n;
    }),
  );
}
```

```html
<f-flow fDraggable (fMoveNodes)="onMoveNodes($event)">
  <f-canvas>
    @for (node of nodes(); track node.id) {
      <div fNode [fNodeId]="node.id" [fNodePosition]="node.position">
        {{ node.id }}
      </div>
    }

    @for (c of connections(); track c.id) {
      <f-connection [fOutputId]="c.from" [fInputId]="c.to"></f-connection>
    }
  </f-canvas>
</f-flow>
```

There is no `setState`. There is no hidden graph store. The template **_is_** the graph — driven by your signals, rendered by Angular, with the library wiring up interactivity on top.

Initialization works the same way. You do not load a flow into the library. You hydrate your own signals from your backend or file, Angular renders the template, the library picks up the `<f-node>` and `<f-connection>` children and makes them interactive. When rendering settles, `fFullRendered` fires — that is the place to call `getState()` for measured bounds and run "fit to content".

It is more accurate to say Foblex Flow is an **_interaction layer_** than a **_graph library_**. The graph is yours.

## 🛠 Why this decision was made

Every consequence of "stateless core" looks, on the surface, like a missing feature. None of them are.

**Persistence is your job.** The library does not ship a `toJSON()` that serializes your graph, because it does not have your graph. You already know how to persist your own data model. Any format the library invented would be a second one to maintain, and it would never fit your domain as well as the shape you already use.

**Undo/redo is your job.** The library does not ship a history stack. Your app's command history is already the thing that knows what a meaningful "action" is — adding a node, editing a label, changing a validation rule. A library-level undo would either duplicate that or fight with it. The library **_supports_** undo/redo by keeping the rendered state a pure function of your data: roll back the data, the view rolls back.

**Optimistic updates are your job.** Because the library never mutates silently, optimistic UI is straightforward — write to your signal, the view updates, reconcile later if the server disagrees. There is no internal library state to keep in sync with the server truth.

**Collaboration is your job.** Two users dragging the same node is a merge problem in your domain, not a rendering problem. The library hands you the gesture; your **CRDT** or your **OT** layer decides what it means, then writes to your state, and the view follows.

That sounds restrictive in a feature matrix, but it matters in real editors. The apps I have seen built on Foblex Flow all have non-trivial domain models — call routing, AI agent graphs, workflow automation, ETL pipelines. In every one of them, the data model existed before the editor did. A library that insisted on owning it would have been a wall, not a tool.

## 🧠 Philosophy

A node editor library can do one of two things. It can be a platform that owns the graph and hands you hooks into it. Or it can be an interaction layer that renders what you already have.

Foblex Flow chose the second one on purpose. The library is not a small application you embed. It is a set of Angular primitives — `<f-flow>`, `<f-canvas>`, `fNode`, `<f-connection>` — that turn your existing data into something a user can drag, connect, and edit.

Every event the library emits is an offer. **_This happened. You decide what to do with the change._** Accept it by writing to your state and the view updates. Ignore it and nothing changes. Veto it by not writing, and the user's gesture was advisory.

For me, this is the point. An editor is a conversation between a user's intent and an application's rules. A library that silently applies every gesture cuts the application out of that conversation. A library that reports gestures and waits keeps the application in charge.

Small, but it shapes everything downstream. The stateless choice is why persistence, undo/redo, collaboration, and optimistic updates all live where they already lived — in your app — instead of fighting a hidden store inside the library.

## 🚀 What's next

This is Part 3 of the **_Inside Foblex Flow_** series.

Part 4 will look at the rendering pipeline: how `<f-node>` and `<f-connection>` elements are picked up from the template, how measurement and layout are coordinated, and how `fNodesRendered` and `fFullRendered` actually get decided under the hood.

If you're building a visual editor in Angular and want a native Angular solution (not a React wrapper) — take a look.

And if you like what I'm building, please consider starring the repo ⭐

It helps the project a lot.

## Links

- Repository: [github.com/Foblex/f-flow](https://github.com/Foblex/f-flow)
- Docs: [flow.foblex.com/docs/get-started](https://flow.foblex.com/docs/get-started)
- `<f-flow>` component: [flow.foblex.com/docs/f-flow-component](https://flow.foblex.com/docs/f-flow-component)
- `fNode` directive: [flow.foblex.com/docs/f-node-directive](https://flow.foblex.com/docs/f-node-directive)
- `<f-connection>` component: [flow.foblex.com/docs/f-connection-component](https://flow.foblex.com/docs/f-connection-component)
