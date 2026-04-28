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

## Projected Gradient

If you want the snap helper itself to use a gradient stroke, project `f-connection-gradient` into `f-snap-connection`:

```html
<f-snap-connection>
  <f-connection-gradient
    fStartColor="#4f46e5"
    fEndColor="#06b6d4"
  ></f-connection-gradient>
</f-snap-connection>
```

As with regular connections, the gradient colors belong to `f-connection-gradient`, not to `f-snap-connection`.

If you previously set `fStartColor` / `fEndColor` directly on `f-snap-connection`, move those colors into the projected `f-connection-gradient`.

## Notes / Pitfalls

- Requires `fDraggable` and is typically used together with `f-connection-for-create`.
- Very high threshold values can make snapping feel jumpy or surprising.
- This helper does not create connections by itself; persist links from `fCreateConnection`/`fReassignConnection` handlers.

## Example

::: ng-component <auto-snap></auto-snap> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/auto-snap/example.scss
:::
