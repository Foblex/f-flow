---
toc: false
wideContent: true
publishedAt: "2026-07-07"
updatedAt: "2026-07-07"
---

# Managed Flow State

## Description

`provideFFlow(withFlowState())` turns on the graph state built into Foblex Flow. The application loads plain data once, renders two signals with `@for`, and reads the data back whenever it needs to persist — there is not a single gesture handler in the component below.

```ts
@Component({
  providers: [provideFFlow(withFlowState())],
})
export class Editor {
  protected readonly state = injectFlowState<MyNodeData>();

  constructor() {
    this.state.load({ nodes: [...], connections: [...] });
  }
}
```

```html
@for (node of state.nodes(); track node.id) {
  <div fNode [fNodeId]="node.id" [fNodePosition]="node.position">{{ node.data?.text }}</div>
}
@for (connection of state.connections(); track connection.id) {
  <f-connection [fConnectionId]="connection.id" [fSourceId]="connection.sourceId" [fTargetId]="connection.targetId" />
}
```

## Example

::: ng-component <flow-state></flow-state> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/flow-state/example.scss
:::

## Gestures apply themselves

Every finished gesture is forwarded into the store automatically, each as ONE undoable history step:

- **Create connection** — dragging from a connector to a target adds a connection record with a generated id; dropping into empty space adds nothing.
- **Reassign connection** — dragging an endpoint to another connector updates `sourceId`/`targetId`.
- **Move nodes** — a drag (including a multi-selection drag) writes all new positions as a single step, so one `undo()` returns the whole group.
- **Delete selection** — the removal request (e.g. the `Delete` key from the [accessibility layer](./docs/accessibility)) removes the nodes together with every connection attached to them.
- **Drop into a group** — dropped nodes get the group's id as `parentId`.
- **External item drop** — an item dragged from a palette becomes a node at the drop position, with the item's payload stored in `data`.

## Undo/Redo built in

- `state.undo()` / `state.redo()` walk the history; `canUndo` / `canRedo` are signals, ready for `[disabled]` bindings.
- Records are updated immutably, so a history entry is just an object reference — history is cheap regardless of graph size.
- `withFlowState({ historyLimit: 100 })` caps the stack (default 50); the oldest steps fall off.
- `load()` replaces the whole graph and resets the history — ideal for opening a document; `clearHistory()` keeps the data and drops only the steps.

## Data in, data out

- `load({ nodes, connections })` — plain arrays in. Each node record maps 1:1 onto `fNode` inputs (`id`, `position`, optional `size`, `rotate`, `parentId`) plus your own payload in `data` and a free-form `type` for `@switch`-based templates.
- `snapshot()` — plain arrays out, with copied geometry; persist the result as-is.
- `injectFlowState<TNodeData, TConnectionData>()` types both payloads end to end.

## Programmatic editing shares the same history

Everything the gestures do is also available as methods — and every call is one undoable step:

```ts
state.addNodes({ id: 'n3', position: { x: 400, y: 80 }, data: { text: 'New' } });
state.updateNode('n3', { position: { x: 420, y: 90 } });
state.moveNodes([{ id: 'a', position }, { id: 'b', position }]); // one step
state.addConnections({ id: 'c1', sourceId: 'n3-out', targetId: 'a-in' });
state.updateConnection('c1', { targetId: 'b-in' });
state.removeNodes(['n3']); // attached connections cascade automatically
state.removeItems(nodeIds, connectionIds); // combined removal, one step
```

## Shaping and vetoing gesture results

For light-touch control, pass factories to the config — return `null` to reject:

```ts
withFlowState({
  connectionFactory: (event) =>
    isAllowed(event) ? { id: uuid(), sourceId: event.sourceId, targetId: event.targetId! } : null,
  nodeFactory: (event) => ({ id: uuid(), position: event.dropPosition!, data: event.data }),
});
```

## Every behavior is overridable

If a default does not fit, subclass the store — any CRUD method, any `apply*` gesture handler, any protected building block — and install your class. The auto-wiring dispatches through it:

```ts
@Injectable()
export class MyFlowState extends FFlowState<MyNodeData> {
  // Change what a gesture means for your data
  override applyDeleteSelected(event: FDeleteSelectedEvent): void {
    // e.g. soft-delete: mark records instead of removing them
  }

  // Change a mutation itself
  override moveNodes(positions: { id: string; position: IPoint }[]): void {
    super.moveNodes(positions.map(snapToGrid));
  }

  // Custom mutations become undoable through the protected commit()
  archiveNode(id: string): void {
    const shape = this.currentShape();
    // ...build the next shape...
    this.commit(nextShape);
  }
}
```

```ts
providers: [provideFFlow(withFlowState({ stateClass: MyFlowState }))];
```

## When to use it

- Use the state plugin when you want the library to do the data bookkeeping: forms-over-flows, quick editors, AI-generated integrations that expect a `nodes[]`/`edges[]`-style API.
- Keep the classic event-driven approach when the graph lives inside a larger application store you already maintain — every event keeps working exactly as before; the plugin is optional and additive. See [Undo/Redo V2](./examples/undo-redo-v2) for the manual pattern.

## Related examples

- [Undo/Redo](./examples/undo-redo)
- [Undo/Redo V2](./examples/undo-redo-v2)
- [Add Node From Palette](./examples/add-node-from-palette)
