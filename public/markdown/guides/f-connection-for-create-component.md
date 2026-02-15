# Create Connection

## Description

`FConnectionForCreateComponent` is the temporary preview link used while the user drags to create a connection.

- **Selector:** `f-connection-for-create`
- **Class:** `FConnectionForCreateComponent`

**What you get**

- Visual preview of an in-progress connection.
- Same line type/behavior options as regular connections.
- Clean separation between preview UI and persisted edges.

## Why / Use cases

Use `f-connection-for-create` in interactive editors where users draw connections by dragging from outputs/outlets.

Typical use cases:

- Drag-to-connect interfaces.
- Visual node editors where connection creation should feel immediate.
- Editors that apply custom preview style before committing real connections.

Do not persist business state from this component directly; use `fCreateConnection` output from [`fDraggable`](f-draggable-directive) to create real `f-connection` entries.

## How it works

The component is registered as a special connection instance and controlled by drag logic. During a drag session, internal `fOutputId`/`fInputId` signals update from pointer context; after finalize, the preview is hidden again.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fRadius: number;` Default: `8`.
- `fOffset: number;` Default: `12`.
- `fBehavior: EFConnectionBehavior;` `fixed | fixed_center | floating`. Default: `fixed`.
- `fType: EFConnectionType | string;` Default: `straight`.
- `fInputSide: InputSignal<EFConnectionConnectableSide>;` Default: `default`.
- `fOutputSide: InputSignal<EFConnectionConnectableSide>;` Default: `default`.
- `fStartColor: InputSignal<string>;` Default: `black`.
- `fEndColor: InputSignal<string>;` Default: `black`.

`fOutputId` and `fInputId` are internal runtime signals on this component and are not configured through template inputs.

### Outputs

- No outputs.

### Methods

- No public template API methods.

## Styling

- `.f-connection` Base connection class.
- `.f-connection-for-create` Preview host class.
- `.f-connection-path` Preview path element.
- `.f-connection-drag-handle` Preview endpoint handle element.

## Notes / Pitfalls

- Requires `fDraggable` on the parent `f-flow` to become active.
- Usually paired with `fCreateConnection` handling; without state update logic, user actions will not create persisted edges.
- Pair with [`f-snap-connection`](f-snap-connection-component) for stronger UX when targets are close.

## Example

::: ng-component <drag-to-connect></drag-to-connect> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
