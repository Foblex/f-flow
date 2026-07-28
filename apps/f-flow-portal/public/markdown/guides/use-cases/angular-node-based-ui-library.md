---
publishedAt: "2026-03-08"
updatedAt: "2026-07-28"
---

# Angular Node-Based UI Architecture

A node-based UI represents entities as spatial nodes and relationships as connections. That category includes read-only topology views, editable flowcharts, workflow builders, AI pipeline editors, schema designers, and many domain-specific tools.

The important architectural decision is not how to draw a line. It is where the editor surface ends and the application begins.

## Node-based UI versus node editor

A **node-based UI** is the broad visual form. It may only render a graph or let users inspect it.

A **node editor** adds authoring behavior: moving and selecting nodes, creating and reassigning connections, validating gestures, navigating a large canvas, and translating user intent back into application state.

Foblex Flow targets the second problem. It provides Angular-native editor interactions without defining what a node means to your business.

## Four layers to keep separate

### 1. Domain model

This is the business graph: workflow steps, database tables, agent tools, permissions, validation rules, and execution state. It should not depend on canvas coordinates unless coordinates are part of your product.

### 2. Application state

This layer loads and saves records, checks permissions, applies domain rules, calls the backend, and decides whether an editor event becomes a real model change.

### 3. Editor surface

Foblex Flow owns the canvas interaction mechanics: nodes, connectors, connection geometry, selection, dragging, navigation, hit testing, resizing, grouping, and optional editor history.

### 4. Layout and presentation

Your node components own labels, forms, buttons, validation messages, and product styling. Optional Dagre or ELK packages can calculate positions, but the application still decides when a layout is appropriate and whether to persist it.

## The event-to-state loop

In the default integration, the template renders your current model and Foblex emits user intent:

```html
<f-flow fDraggable (fCreateConnection)="createConnection($event)">
  <f-canvas>
    @for (connection of connections(); track connection.id) {
      <f-connection
        [fConnectionId]="connection.id"
        [fSourceId]="connection.sourceId"
        [fTargetId]="connection.targetId" />
    }

    @for (node of nodes(); track node.id) {
      <div
        fNode
        fDragHandle
        [fNodeId]="node.id"
        [fNodePosition]="node.position">
        <div
          fConnector
          fConnectorType="target"
          [fConnectorId]="node.id + ':in'">
        </div>

        {{ node.label }}

        <div
          fConnector
          fConnectorType="source"
          [fConnectorId]="node.id + ':out'">
        </div>
      </div>
    }
  </f-canvas>
</f-flow>
```

The application handles `fCreateConnection`, validates the proposed `sourceId` and `targetId`, updates its records, and Angular renders the result. That separation prevents pointer logic from becoming business logic.

If you do not already have a graph store, [Managed Flow State](./examples/state) can own typed editor records, supported gesture writeback, snapshots, batching, and undo/redo. It still does not own workflow execution, permissions, backend persistence, or domain validation.

## What the library owns

- Canvas transforms, hit testing, and connection geometry.
- Pointer, click, and optional keyboard interaction.
- Selection, movement, connection creation, and reassignment events.
- Optional layout, minimap, snapping, caching, virtualization, and editor history.
- Stable Angular directives and components for composing the editor.

## What your application owns

- The meaning and schema of nodes and connections.
- Whether a proposed connection is valid for the domain.
- Permissions, collaboration policy, and audit rules.
- Persistence, workflow execution, agent runtime, and backend orchestration.
- Product UI inside each Angular node component.

## When this architecture fits

Use it when users must author or manipulate a connected model and the editor is part of a larger Angular product. It is especially useful when nodes contain real Angular forms, services, dialogs, or design-system components.

Do not use a full node editor for a static chart, a fixed process illustration, or a graph that users never manipulate. SVG, a charting library, or a generated diagram will be smaller and simpler for those cases.

## Continue evaluating

- [Angular Node Editor Library](angular-node-editor-library) — product evaluation and editor capabilities.
- [Get Started](get-started) — install and build a minimal flow.
- [Managed Flow State](./examples/state) — optional editor records and history.
- [AI Low-Code Platform Example](./examples/ai-low-code-platform) — a larger production-style editor.
- [UML Diagram Example](./examples/uml-diagram-example) — a domain-specific node editor.

The package remains `@foblex/flow`; this page describes the architecture around it, not a separate library.
