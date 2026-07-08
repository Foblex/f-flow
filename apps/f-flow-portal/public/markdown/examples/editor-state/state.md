---
toc: false
wideContent: true
publishedAt: "2026-07-07"
updatedAt: "2026-07-07"
---

# Managed Flow State

## Description

`provideFFlow(withFlowState())` turns on the graph state built into Foblex Flow. The application loads plain data once, renders the `nodes`, `groups` and `connections` signals with `@for`, and reads the data back whenever it needs to persist — there is not a single gesture handler in the component below.

Your records are your own shape: extend the framework interface with any fields — no `data` wrapper.

```ts
interface MyNode extends IFStateNode {
  text: string; // your fields live right on the record
}

@Component({
  providers: [provideFFlow(withFlowState())],
})
export class Editor {
  protected readonly state = injectFlowState<MyNode>();

  constructor() {
    this.state.load({ nodes: [...], groups: [...], connections: [...] });
  }
}
```

```html
@for (group of state.groups(); track group.id) {
  <div fGroup [fGroupId]="group.id" [fGroupPosition]="group.position" [fGroupSize]="group.size"></div>
}
@for (node of state.nodes(); track node.id) {
  <div fNode [fNodeId]="node.id" [fNodePosition]="node.position" [fNodeParentId]="node.parentId">
    {{ node.text }}
  </div>
}
@for (connection of state.connections(); track connection.id) {
  <f-connection [fConnectionId]="connection.id" [fSourceId]="connection.sourceId" [fTargetId]="connection.targetId" />
}
```

Drag an item from the palette to add a node, drop a node into the group to nest it, drag between connectors to wire them, select and press `Delete` to remove — every one of those lands in the state as a single undoable step, and the component never handles the event.

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
- **Drop into a group** — dropped nodes and groups get the group's id as `parentId`. `withFlowState({ dropToGroup: false })` turns grouping off — the drop becomes a no-op and external items land at the top level.
- **External item drop** — an item dragged from a palette becomes a node at the drop position, with the item's `fData` spread onto the node as its own fields; dropped over a group, it's nested there.

## Undo/Redo built in

- `state.undo()` / `state.redo()` walk the history; `canUndo` / `canRedo` are signals, ready for `[disabled]` bindings.
- Records are updated immutably, so a history entry is just an object reference — history is cheap regardless of graph size.
- `withFlowState({ historyLimit: 100 })` caps the stack (default 50); the oldest steps fall off.
- `load()` replaces the whole graph and resets the history — ideal for opening a document; `clearHistory()` keeps the data and drops only the steps.
- One drag session is one step. When a single gesture ends with several events — a move plus a drop into a group, or (with `selectionInHistory`) a selection plus a move — they are folded into a single undoable action, so one `undo` reverts the whole thing.

## Reacting to changes

`state.changes()` is a signal that ticks once for every history step — a mutation, an `undo`, a `redo` or a `load`. Depend on it from a single `effect` to react to anything that touches the graph, without wiring one listener per gesture:

```ts
effect(() => {
  this.state.changes();                          // depend on "something changed"
  this.persist(untracked(() => this.state.snapshot()));
});
```

Because effects coalesce, a burst of edits settles into one reaction — exactly what you want before an autosave or a network write. The per-collection signals (`nodes()`, `groups()`, `connections()`, `selection()`) stay available when you only care about one slice.

## Data in, data out

- `load({ nodes, groups, connections })` — plain arrays in. The store only reads the framework keys (`id`, `position`, optional `size`, `rotate`, `parentId`) and carries the rest of your record through untouched — put your fields right on it, no `data` wrapper.
- Groups are their own collection with the same shape, rendered with `fGroup` — a first-class kind because the library treats them separately (a group id in a selection, its own drop target). Nesting is just `parentId`.
- `snapshot()` — plain arrays out (`nodes`, `groups`, `connections`) with copied geometry; persist the result as-is.
- `injectFlowState<MyNode, MyConnection, MyGroup>()` types all three end to end; each argument defaults to the framework shape, so `injectFlowState<MyNode>()` is enough when only nodes carry extra fields.

## Selection, and whether it belongs in the history

`state.selection()` always reflects the current selection (`nodeIds`, `groupIds`, `connectionIds`) as a signal — handy for a properties panel or a context menu. Whether selecting is _undoable_ is a config switch, because editors disagree:

```ts
withFlowState({ selectionInHistory: false });
```

- On by default — every selection change is its own step and `undo`/`redo` restore the previous highlight (Figma, Photoshop); a drag's leading selection folds into the same step as the move.
- Set `false` to keep selection out of the history, so `undo` walks only graph edits (xyflow, tldraw).

## Programmatic editing shares the same history

Everything the gestures do is also available as methods — and every call is one undoable step:

```ts
state.addNodes({ id: 'n3', position: { x: 400, y: 80 }, text: 'New' });
state.updateNode('n3', { position: { x: 420, y: 90 } });
state.moveNodes([{ id: 'a', position }, { id: 'b', position }]); // one step (nodes and groups)
state.addConnections({ id: 'c1', sourceId: 'n3-out', targetId: 'a-in' });
state.updateConnection('c1', { targetId: 'b-in' });

state.addGroups({ id: 'g1', position: { x: 0, y: 0 }, size: { width: 300, height: 200 } });
state.updateGroup('g1', { size: { width: 360, height: 240 } });
state.removeGroups(['g1']); // children are un-parented, attached connections cascade

state.removeNodes(['n3']); // attached connections cascade automatically
state.removeItems(nodeIds, connectionIds); // combined removal, one step

state.batch(() => {
  state.addNodes(node);
  state.addConnections(edge); // several mutations, one undo step
});
```

## Shaping and vetoing gesture results

For light-touch control, pass factories to the config — return `null` to reject:

```ts
withFlowState({
  connectionFactory: (event) =>
    isAllowed(event) ? { id: uuid(), sourceId: event.sourceId, targetId: event.targetId! } : null,
  nodeFactory: (event) => ({ ...event.data, id: uuid(), position: event.dropPosition! }),
});
```

## Every behavior is overridable

If a default does not fit, subclass the store — any CRUD method, any `apply*` gesture handler, any protected building block — and install your class. The auto-wiring dispatches through it:

```ts
@Injectable()
export class MyFlowState extends FFlowState<MyNode> {
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
