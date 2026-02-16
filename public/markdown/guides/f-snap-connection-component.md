# Snap Connection

**Selector:** `f-snap-connection`  
**Class:** `FSnapConnectionComponent`

`FSnapConnectionComponent` renders a temporary snapping helper while a connection is being created or reassigned.

## Why / Use cases

Use `f-snap-connection` when your editor has many potential targets and users need faster, more forgiving connection interactions.

Typical use cases:

- Dense node graphs where precise pointer placement is difficult.
- Touch-heavy interactions.
- Reassign workflows where endpoints frequently change.

Skip it for strict/manual connection placement UX.

## How it works

During drag/create/reassign interactions, the helper tracks candidate targets and renders a temporary line that snaps when within `fSnapThreshold`. It is not a persisted graph edge.

## API

### Inputs

- `fSnapThreshold: number;` Default: `20`. Distance in pixels to snap to a connector.
- `fRadius: number;` Default: `8`. Connection corner radius.
- `fOffset: number;` Default: `12`. Distance from connector to first bend.
- `fBehavior: EFConnectionBehavior;` Default: `FIXED`. Defines how the connection handles connector positions.
- `fType: EFConnectionType;` Default: `STRAIGHT`. Type of the path (segment, straight, bezier).
- `fInputSide: EFConnectionConnectableSide;` Default: `DEFAULT`. Preferred side for target connection.
- `fOutputSide: EFConnectionConnectableSide;` Default: `DEFAULT`. Preferred side for source connection.

### Outputs

- No direct outputs.

### Methods

- No public template API methods.

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
- `.f-snap-connection` Snap-helper host class.
- `.f-connection-path` Helper path element.

## Notes / Pitfalls

- Requires `fDraggable` and is typically used together with `f-connection-for-create`.
- Very high threshold values can make snapping feel jumpy or surprising.
- This helper does not create connections by itself; persist links from `fCreateConnection`/`fReassignConnection` handlers.

## Example

::: ng-component <auto-snap></auto-snap> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/auto-snap/auto-snap.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/auto-snap/auto-snap.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/auto-snap/auto-snap.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
