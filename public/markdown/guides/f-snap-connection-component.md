# Snap Connection

## Description

`FSnapConnectionComponent` renders a temporary snapping helper while a connection is being created or reassigned.

- **Selector:** `f-snap-connection`
- **Class:** `FSnapConnectionComponent`

**What you get**

- Visual guidance toward nearby valid targets.
- Configurable snap distance threshold.
- Same path styling controls as other connection components.

## Why / Use cases

Use `f-snap-connection` when your editor has many potential targets and users need faster, more forgiving connection interactions.

Typical use cases:

- Dense node graphs where precise pointer placement is difficult.
- Touch-heavy interactions.
- Reassign workflows where endpoints frequently change.

Skip it for strict/manual connection placement UX.

## How it works

During drag/create/reassign interactions, the helper tracks candidate targets and renders a temporary line that snaps when within `fSnapThreshold`. It is not a persisted graph edge.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `fSnapThreshold: number;` Snap distance in px. Default: `20`.
- `fRadius: number;` Default: `8`.
- `fOffset: number;` Default: `12`.
- `fBehavior: EFConnectionBehavior;` `fixed | fixed_center | floating`. Default: `fixed`.
- `fType: EFConnectionType | string;` Default: `straight`.
- `fInputSide: InputSignal<EFConnectionConnectableSide>;` Default: `default`.
- `fOutputSide: InputSignal<EFConnectionConnectableSide>;` Default: `default`.
- `fStartColor: InputSignal<string>;` Default: `black`.
- `fEndColor: InputSignal<string>;` Default: `black`.

### Outputs

- No outputs.

### Methods

- No public template API methods.

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
