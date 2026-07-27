---
publishedAt: "2026-07-27"
updatedAt: "2026-07-27"
---

# Large-Flow Performance

Start with the regular `@for` rendering path and measure the real editor before enabling scaling features. Foblex Flow already batches registry notifications, scopes connection redraw to changed geometry, caches connector-side work, and draws minimap nodes from model-space geometry. `fCache` and `fVirtualFor` are additional tools for scenes that still exceed your startup or interaction budget.

## Establish a repeatable baseline

Measure the same graph and interactions in a production build:

1. time until `fNodesRendered` and `fFullRendered`;
2. scripting and layout time while dragging a highly connected node;
3. wheel/pinch frame consistency;
4. memory after repeatedly opening and closing the editor;
5. selection, minimap, and fit-to-screen behavior at your expected maximum;
6. the same checks with realistic node templates, labels, markers, and forms.

Keep stable ids and use `track item.id`. Recreating ids or entire record collections unnecessarily makes Angular and the flow runtime perform avoidable registration work.

## Geometry cache

Enable `fCache` when repeated DOM geometry reads are a measurable cost:

```html
<f-flow fDraggable [fCache]="true">
  <f-canvas>
    <!-- nodes and connections -->
  </f-canvas>
</f-flow>
```

Caching is not a substitute for stable application data or lightweight node templates. Compare the same workload with the option on and off.

## Progressive rendering

`fVirtualFor` renders projected items progressively within a frame budget. It is useful when creating every node in one Angular render causes unacceptable startup work:

```html
<f-flow fDraggable>
  <f-canvas>
    <ng-container ngProjectAs="[fNodes]" *fVirtualFor="let node of nodes">
      <div
        fNode
        [fNodeId]="node.id"
        [fNodePosition]="node.position"
      >
        {{ node.label }}
      </div>
    </ng-container>
  </f-canvas>
</f-flow>
```

This is progressive creation, not viewport culling. During the initial pass, wait for `fFullRendered` before calling helpers that require the complete scene bounds.

## Connection calculation

When the browser supports the required worker runtime, connection redraw can move supported geometry calculation into an automatically managed Blob worker. Unsupported paths fall back to the main-thread sliced redraw pipeline. There is no worker URL to deploy and no application worker configuration to maintain.

The v19.1 runtime also redraws only connections affected by changed node or descendant-group geometry. A graph with one moved node should not pay for every unrelated connection.

Test connection-heavy cases separately from raw node count. Routing type, floating endpoints, markers, labels, and one high-fan-out node can dominate a scene with relatively few nodes.

## Minimap and viewport work

The minimap consumes cached model-space rectangles and exposes `fNodeRenderLimit` as a safety boundary. Set the limit deliberately when a preview containing every node is not useful:

```html
<f-minimap [fNodeRenderLimit]="2000" />
```

Do not call `fitToScreen()`, `resetScaleAndCenter()`, or item-centering helpers before nodes render. Use `fNodesRendered` for node geometry or `fFullRendered` when progressive connections and the whole scene must be settled.

## Avoid accidental extra work

- Do not stack canvas-level debounce with Managed Flow State viewport debounce unless you intentionally need both delays.
- Keep native form controls and heavy panels outside repeated node templates when the design permits it.
- Prefer CSS transforms and the shipped interaction pipeline over application pointer listeners that measure the DOM on every move.
- Avoid forcing a full `redraw()` after every application change; let targeted node/connection updates settle first.
- Profile production code. Angular development diagnostics and browser extensions can materially distort large-scene timings.

## Test the shipped scenarios

- [Large Scene Performance](./examples/stress-test) compares 200–5000 nodes, regular rendering, `fCache`, `fVirtualFor`, and optional connections.
- [Connection Redraw Performance](./examples/stress-test-with-connections) isolates routing, marker, behavior, and fan-out costs.
- [Managed Flow State](managed-flow-state) explains history and viewport batching for state-driven editors.
