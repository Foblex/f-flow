# Input

**Selector:** `[fNodeInput]`  
**Class:** `FNodeInputDirective`

`FNodeInputDirective` marks an element as an **incoming connector** for a node. Inputs are the **targets** that connections can attach to during “drag to connect” and when rendering persisted connections.

Inputs must live inside a node (`[fNode]`) which is rendered inside [`f-canvas`](f-canvas-component) and [`f-flow`](f-flow-component).

## Quick start

### Input as a port element (recommended for multi-port nodes)

Use a dedicated element when your node has **multiple inputs** or when each port matters visually.

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 320, y: 80 }">
      <div fDragHandle class="title">Node</div>

      <div class="port" fNodeInput fInputId="in-1">
        Input
      </div>
    </div>
  </f-canvas>
</f-flow>
```

### Input on the node itself (simple nodes)

If your node has **one input** and you want “connect to the node body”, you can apply `fNodeInput` on the host element.

```html
<f-flow fDraggable>
  <f-canvas>
    <div
      fNode
      fNodeInput
      fInputId="in-1"
      [fNodePosition]="{ x: 320, y: 80 }"
    >
      Node (input on host)
    </div>
  </f-canvas>
</f-flow>
```

## How it works

- The input connector registers under its parent node and becomes a valid **drop target** during connection creation and reassignment.
- During connection drag, the library evaluates connectability rules such as `disabled`, `multiple`, `category`, and `connectableSide`.
- The directive toggles state classes (for example `connected` / `not-connectable`) so you can provide clear UX feedback with CSS.

## API

### Inputs

- `fInputId: InputSignal<string>;`  
  Input identifier. Default: `f-node-input-${uniqueId++}`.  
  Use a **stable** id if you store graph state and want connections to survive rerenders.

- `fInputCategory: InputSignal<string | undefined>;`  
  Optional category used for connection validation rules (for example, “data”, “error”, “trigger”).  
  Categories are just strings — keep them consistent across your app.

- `fInputMultiple: InputSignal<boolean>;`  
  Default: `true`. When `false`, only one active connection can be attached to this input.

- `fInputDisabled: InputSignal<boolean>;`  
  Default: `false`. When `true`, the input is not connectable.

- `fInputConnectableSide: EFConnectableSide;`  
  Default: `auto`. Controls preferred docking side for routing/hit-testing (left/right/top/bottom/auto).  
  Use a fixed side when you have explicit port placement.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-node-input` Host class.
- `.f-node-input-multiple` Applied when multiple incoming links are allowed.
- `.f-node-input-disabled` Applied when disabled.
- `.f-node-input-connected` Applied when connected.
- `.f-node-input-not-connectable` Applied when blocked from connection.

## Notes and pitfalls

- `fInputId` must match connection `fInputId` values **exactly** (case-sensitive).
- With `fInputMultiple="false"`, the input becomes unavailable after one active connection is attached.
- If you use `fInputCategory`, make sure your connection rules reference the **same** category strings. Mismatched strings are the most common reason an input becomes “not connectable”.
- Side settings (`fInputConnectableSide`) affect docking and routing behavior; test with your chosen connection behavior and node template.

## Example

### Connectors inside node

::: ng-component <connector-inside-node></connector-inside-node> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-inside-node/connector-inside-node.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

### Connectable side (using `fInputConnectableSide`)

::: ng-component <connectable-side></connectable-side> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connectable-side/connectable-side.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
