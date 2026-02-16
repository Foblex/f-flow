# Create Connection

**Selector:** `f-connection-for-create`  
**Class:** `FConnectionForCreateComponent`

`FConnectionForCreateComponent` is the temporary preview link used while the user drags to create a connection.

## Why / Use cases

Use `f-connection-for-create` in interactive editors where users draw connections by dragging from outputs/outlets.

Typical use cases:

- Drag-to-connect interfaces.
- Visual node editors where connection creation should feel immediate.
- Editors that apply custom preview style before committing real connections.

Do not persist business state from this component directly; use `fCreateConnection` output from [`fDraggable`](f-draggable-directive) to create real `f-connection` entries.

## How it works

The component is registered as a special connection instance and controlled by drag logic. During a drag session, internal `fOutputId`/`fInputId` signals update from pointer context; after finalize, the preview is hidden again.

## API

### Inputs

- `fRadius: number;` Default: `8`. Connection corner radius.
- `fOffset: number;` Default: `12`. Distance from connector to first bend.
- `fBehavior: EFConnectionBehavior;` Default: `FIXED`. Defines how the connection handles connector positions.
- `fType: EFConnectionType;` Default: `STRAIGHT`. Type of the path (segment, straight, bezier).
- `fInputSide: EFConnectionConnectableSide;` Default: `DEFAULT`. Preferred side for target connection.
- `fOutputSide: EFConnectionConnectableSide;` Default: `DEFAULT`. Preferred side for source connection.
- `fStartColor: string;` Default: `black`. Color of the start of the gradient (if used).
- `fEndColor: string;` Default: `black`. Color of the end of the gradient (if used).

### Types

#### EFConnectionBehavior

```typescript
enum EFConnectionBehavior {
  FIXED = 'fixed',
  FLOATING = 'floating',
}
```

#### EFConnectionType

```typescript
enum EFConnectionType {
  SEGMENT = 'segment',
  STRAIGHT = 'straight',
  BEZIER = 'bezier',
}
```

#### EFConnectionConnectableSide

```typescript
enum EFConnectionConnectableSide {
  DEFAULT = 'default',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}
```

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
