# Output

**Selector:** `[fNodeOutput]`  
**Class:** `FNodeOutputDirective`

`FNodeOutputDirective` marks an element inside a node as an **output connector** - a place where users can start creating outgoing connections.

Outputs must live inside a node (`[fNode]`) which is rendered inside [`f-canvas`](f-canvas-component) and [`f-flow`](f-flow-component).  
In most editors, outputs represent **ports**: “this node can send data/control flow to something else”.

## Quick start

### A node with an output connector

You can place fNodeOutput on a dedicated element inside the node (classic “port”), or directly on the node host element (simple “whole-node output”).

**Output as a port element (recommended for multi-port nodes)**

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">
      <div class="title" fDragHandle>Node</div>

      <div class="port" fNodeOutput fOutputId="out-1">
        Output
      </div>
    </div>
  </f-canvas>
</f-flow>
```

**Output on the node host (recommended for simple nodes)**

```html
<f-flow fDraggable>
  <f-canvas>
    <div
      fNode
      fNodeOutput
      fOutputId="out-1"
      [fNodePosition]="{ x: 120, y: 80 }"
    >
      Node (output on host)
    </div>
  </f-canvas>
</f-flow>
```

### Notes

- Putting fNodeOutput on the node host is great when you want one output for the whole node.
- For nodes with multiple outputs, prefer separate port elements - it’s clearer for UX and keeps ids/rules per port.
- Don’t confuse this with dropping a connection onto a node (fConnectOnNode) - that one affects where you can drop a connection, not where you start it.

### Connect it using `f-connection`

A persisted connection references the output and input by their ids:

```html
<f-connection fOutputId="out-1" fInputId="in-1"></f-connection>
```

> Tip: use **stable ids** (from your data model) if you want selection/state to survive rerenders and persistence.

## How it works

- The output connector **registers** itself in the internal store (together with its parent node).
- During interaction (create/reassign connection), the library uses output metadata (disabled/multiple/self-connect rules) to decide whether a target is valid.
- The connector also updates **CSS state classes** so you can style “connected / disabled / not connectable” states.

## API

### Inputs

- `fOutputId: InputSignal<string>;`  
  Output identifier. Default: `f-node-output-${uniqueId++}`.  
  This id is what you reference from connections via `fOutputId`.

- `fOutputMultiple: InputSignal<boolean>;` Default: `false`.  
  If `false`, the output behaves like a “single port”: once it has an active connection, creating another one from the same output is blocked.

- `fOutputDisabled: InputSignal<boolean>;` Default: `false`.  
  Disables connection creation/reassignment from this output.

- `fOutputConnectableSide: EFConnectableSide;` Default: `auto`.  
  Controls **where** the connection should attach relative to the node geometry (left/right/top/bottom/auto).  
  This is mostly a visual + routing hint: it helps keep diagrams readable when nodes have clear “flow direction”.

- `isSelfConnectable: boolean;` Default: `true`.  
  Controls whether this output can connect back into an input on the **same node**.  
  Useful for editors where self-loops are either valid (state machines) or should be forbidden (pure pipelines).

- `fCanBeConnectedInputs: string[];` _(optional)_  
  Allow-list of targets. Depending on your setup this can be treated as ids or categories (see your “Connection Rules” guide).  
  Use it to express rules like “this output can connect only to specific inputs / specific categories”.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-node-output` Output host class.
- `.f-node-output-multiple` Applied when `fOutputMultiple = true`.
- `.f-node-output-disabled` Applied when `fOutputDisabled = true`.
- `.f-node-output-self-connectable` Applied when `isSelfConnectable = true`.
- `.f-node-output-connected` Applied when the output currently has one or more connections.
- `.f-node-output-not-connectable` Applied when creating a connection from this output is currently blocked.

## Notes and pitfalls

- `fOutputId` must match connection `fOutputId` values **exactly**. A typo silently results in “no connection rendered”.
- If `fOutputMultiple = false`, the output may become unavailable after the first active connection — that’s expected for “single port” UX.
- Restrictions like `fCanBeConnectedInputs` are easy to misconfigure. If you rely on rules heavily, validate ids/categories in your own data model so you can show user-friendly errors.

## Example

### Connectors inside node

::: ng-component <connector-inside-node></connector-inside-node> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

### Connectable side (using `fOutputConnectableSide`)

::: ng-component <connectable-side></connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
