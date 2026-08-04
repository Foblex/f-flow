---
publishedAt: "2026-08-04"
updatedAt: "2026-08-04"
---

# ngx-vflow vs Foblex Flow

Verified on: **2026-08-04**.

ngx-vflow and Foblex Flow are the two most widely used Angular-native node editor libraries. Both are MIT licensed, both render custom nodes as real Angular components, and both are actively maintained. Neither is a React wrapper. For an Angular team the meaningful comparison is the graph data model, the editor toolkit each ships, and the platform constraints — not the framework boundary.

## Short answer

- Choose **ngx-vflow** when your team wants a React Flow-shaped `nodes[]`/`edges[]` array API as the primary model — for example when porting an existing React Flow design or when a data-first mental model fits the team best.
- Choose **Foblex Flow** when nodes are substantial Angular UI rendered from your own templates, when you want the state boundary to be a choice (app-owned records by default, optional [Managed Flow State](managed-flow-state) with snapshots and undo/redo), or when you need the deeper editor toolkit: connection rules and reassign, waypoints, magnetic alignment, control-scheme presets, keyboard-driven editing, and packaged Dagre/ELK layouts.

## Technical comparison

| Decision area              | Foblex Flow                                                                                                                | ngx-vflow                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Graph data model           | Angular template over your records; optional Managed Flow State typed records                                              | `nodes[]` and `edges[]` arrays rendered by `<vflow>`                         |
| Custom node UI             | Any Angular component carrying `fNode` directly in your template                                                           | Angular components/templates registered as node types                        |
| Connections                | Drag/click/keyboard creation, reassign, rules, snap helper, waypoints, markers, gradients                                  | Create, validate, and reconnect edges; custom edges, curves, labels, markers |
| Grouping                   | `fGroup` hierarchy with auto-size and drop-to-group                                                                        | Subflows with parent-child relationships                                     |
| Editor helpers             | Minimap, backgrounds, selection area, magnetic lines/rects, auto-pan, external palette items, control-scheme presets       | Minimap, custom backgrounds, snap-to-grid, alignment helpers                 |
| Keyboard and accessibility | ARIA semantics always on; `withA11y()` adds spatial keyboard navigation, movement, and connection creation without a mouse | Keyboard shortcuts; see its current documentation for details                |
| History                    | Snapshots, undo, and redo through Managed Flow State                                                                       | See its current documentation                                                |
| Layout                     | Packaged `@foblex/flow-dagre-layout` and `@foblex/flow-elk-layout` companions                                              | Flexible integration with the layout engine of your choice                   |
| Large flows                | Node virtualization, render caching, background connection workers                                                         | Virtualization and lazy loading                                              |
| Angular support            | The 19.x releases target Angular 17.3+, with pinned older lines back to Angular 12                                         | v2.x requires Angular 19.2.17+; v1.x requires 17.3.12+                       |
| License                    | MIT                                                                                                                        | MIT                                                                          |

API names on the ngx-vflow side above are concept-level; check the [ngx-vflow API reference](https://www.ngx-vflow.org/api) for exact signatures before relying on them.

## The largest difference: where graph records live

ngx-vflow starts from graph records, the way React Flow does:

```html
<vflow [nodes]="nodes" [edges]="edges" />
```

Foblex Flow starts from an Angular template over your records:

```html
<f-flow fDraggable (fCreateConnection)="onConnect($event)">
  <f-canvas>
    @for (connection of connections(); track connection.id) {
      <f-connection
        [fConnectionId]="connection.id"
        [fSourceId]="connection.sourceId"
        [fTargetId]="connection.targetId" />
    }

    @for (node of nodes(); track node.id) {
      <app-workflow-node
        fNode
        [fNodeId]="node.id"
        [fNodePosition]="node.position"
        [node]="node" />
    }
  </f-canvas>
</f-flow>
```

Neither model is "more Angular" than the other — both render real Angular components. The array model keeps the graph as one data structure the library owns and renders; the template model keeps rendering in your hands, which matters when node content is a substantial product UI with forms, DI, and validation. Teams that want explicit editor records on top of the template model can opt into [Managed Flow State](managed-flow-state) instead of building that layer themselves.

## Where ngx-vflow is genuinely strong

ngx-vflow is a well-designed, actively maintained library, and an honest comparison names its real strengths:

- The `nodes[]`/`edges[]` model maps one-to-one onto React Flow's mental model. If your team is porting a React Flow design or already thinks in graph arrays, there is nothing to re-learn.
- The API surface is compact and focused, which shortens the first day.
- Subflows, edge reconnection, connection validation, and signals-based reactivity cover the common editor core well.

If those points describe your project and none of the Foblex-specific rows above matter to it, ngx-vflow is a good choice — this page exists to make that call easy, not to hide it.

## Migration mapping

Concept-level mapping for teams moving between the two libraries:

| ngx-vflow concept     | Foblex Flow equivalent                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| `nodes[]` input       | Your records rendered with Angular `@for` + `fNode`, or Managed Flow State records |
| `edges[]` input       | Your connection records rendered as `f-connection`, or managed connection records  |
| Custom node component | Any Angular component carrying `fNode`                                             |
| Handle                | `fConnector` with `fConnectorType="source"` / `"target"`                           |
| Edge reconnection     | `fReassignConnection` with connection and previous/next endpoint IDs               |
| Connection created    | `fCreateConnection` with `sourceId`, `targetId`, and `dropPosition`                |
| Subflow               | `fGroup` with parent-child hierarchy                                               |
| Minimap               | `f-minimap`                                                                        |

As with any migration, do not translate names mechanically — use the events and directives documented on each side.

## When ngx-vflow is the better fit

- The team explicitly wants graph arrays as the single source of truth.
- You are porting a React Flow editor and want to preserve its data model.
- The editor's needs stay within nodes, edges, subflows, minimap, and snapping — and you prefer a smaller API surface.

## When Foblex Flow is the better fit

- Nodes contain Angular forms, Material components, services, or complex product UI that you want rendered from your own template.
- You need connection rules, drag-to-reassign, waypoints, magnetic alignment, auto-pan, palette drag-in, or configurable control schemes without building them.
- Keyboard-driven editing and screen-reader announcements are a product requirement, not a nice-to-have.
- You want packaged Dagre/ELK layout integrations, render caching, or background connection workers for large flows.
- Your application is on Angular 17.3-19.1 (or an older pinned line), below ngx-vflow v2's minimum.

## Verify with a prototype

Do not decide from this table alone. Build one representative node with your real form controls in both libraries, connect and reconnect it, test keyboard access, and measure your largest expected flow. The differences become visible within a day.

Related reading: [React Flow vs Foblex Flow for Angular teams](react-flow-vs-foblex-flow-for-angular-teams) and [React Flow Alternative for Angular](react-flow-alternative-for-angular). Then run the [Managed Flow State example](./examples/state), [Connection Rules](./examples/connection-rules), and [Accessibility](./examples/accessibility) examples.

## Primary sources

ngx-vflow claims above were checked against its official materials:

- [ngx-vflow README](https://github.com/artem-mangilev/ngx-vflow) — feature list, Angular version support, license
- [ngx-vflow documentation](https://www.ngx-vflow.org/) and [API reference](https://www.ngx-vflow.org/api)

Foblex Flow APIs on this page refer to the `@foblex/flow` package and the linked documentation examples.
