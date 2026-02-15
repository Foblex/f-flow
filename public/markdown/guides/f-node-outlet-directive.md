# Outlet

**Selector:** `[fNodeOutlet]`  
**Class:** `FNodeOutletDirective`

`FNodeOutletDirective` adds a **single shared “start connection” point** for a node.  
It is a **UX helper for creating connections** — it lets users begin a drag from one place even if the node has multiple outputs.

> Important: **Outlet is not the final source of a persisted connection.**  
> After creation, the connection still must be assigned to a конкретному **`fNodeOutput`** (i.e. a real output id is used in `fOutputId`).

## Why it exists

Some nodes can have many outputs (or outputs that appear dynamically). Showing a separate draggable “port” for each output can make the UI noisy.

`fNodeOutlet` solves this by providing:

- one clean place to start drag-to-connect,
- optional preview behavior (draw from the outlet),
- optional target filtering (allow-list of inputs/categories).

## How it works

- The outlet provides a **single interaction surface** to start creating a connection.
- During the drag, the library treats it as a **create handle**, not as a real output connector.
- When the user drops the connection on a target input:
  - the system must resolve **which output** this connection belongs to,
  - and the resulting connection is created with **`fOutputId` = output id**, not outlet id.

In other words: **Outlet starts the action; Output owns the connection.**

## Quick start

### A node with outlet + outputs

```html
<f-flow fDraggable>
  <f-canvas>
    <div fNode [fNodePosition]="{ x: 120, y: 80 }">
      <!-- One shared start point -->
      <div fNodeOutlet>Connect</div>

      <!-- Real outputs (final fOutputId always points to one of these) -->
      <div fNodeOutput fOutputId="out-a">A</div>
      <div fNodeOutput fOutputId="out-b">B</div>
    </div>
  </f-canvas>
</f-flow>
```

## API

### Inputs

- `fOutletId: InputSignal<string>;`  
  Outlet identifier. Default: `f-node-outlet-${uniqueId++}`.  
  This id is for the outlet itself (UX element) and is not the same thing as fOutputId.

- `fOutletDisabled: InputSignal<boolean>;`  
  Default: `false`. Disables starting connection creation from this outlet.

- `isConnectionFromOutlet: boolean;`  
  Default: `false`. Controls the **visual origin** of the preview/connection while dragging.  
  It does not make the outlet a real output, and does not mean fOutputId will become fOutletId.

- `fCanBeConnectedInputs: string[];`  
  Optional allow-list of inputs/categories that can be targeted during creation.

## Styling

- `.f-component` Base class for flow primitives.
- `.f-node-outlet` Outlet host class.
- `.f-node-outlet-disabled` Applied when `fOutletDisabled = true`.

## Notes and pitfalls

- Outlet does not replace outputs. You still need at least one fNodeOutput if you want a created connection to be attached to something real.
- fCanBeConnectedInputs affects which targets can be chosen during creation. It does not change your domain rules automatically - you still own validation/persistence.
- If isConnectionFromOutlet is enabled, users will see the line starting from the outlet visually - but the final connection still uses an output id.

## Example

::: ng-component <connector-outlet></connector-outlet> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connectors/connector-outlet/connector-outlet.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## 🙌 Get Involved

If you find **Foblex Flow** useful - drop a ⭐ on [GitHub](https://github.com/Foblex/f-flow), join the conversation, and help shape the roadmap!
