# Connection Waypoints

**Selector:** `f-connection-waypoints`  
**Class:** `FConnectionWaypoints`

`FConnectionWaypoints` adds editable intermediate points to a connection path.

## Why / Use cases

Use waypoints when automatic routing is not enough and users must shape links manually.

Typical use cases:

- Diagram editors where readability depends on custom bends.
- Dense flows with overlapping links.
- Cases where connection paths should avoid specific visual areas.

## How it works

Place `f-connection-waypoints` inside a connection. It stores waypoint coordinates in `waypoints`, renders candidate/active waypoint circles, and updates the bound array during edits. Changes are also emitted through `fConnectionWaypointsChanged` on `fDraggable`.

## API

### Inputs

- `radius: number;` Default: `4`. Radius of the waypoint circle.
- `waypoints: IPoint[];` Two-way binding for waypoint coordinates (x, y).
- `visibility: boolean;` Default: `true`. Toggles visibility of waypoints.

### Outputs

- `waypointsChange: EventEmitter<IPoint[]>;` Emitted when waypoints change (two-way binding).

## Styling

- `.f-component` Base class for flow primitives.
- `.f-connection-waypoints` Host class.
- `.f-candidate` Candidate waypoint class.
- `.f-waypoint` Active waypoint class.

## Notes / Pitfalls

- Waypoints are meaningful only for connection types that render path segments through intermediate points.
- Keep waypoint arrays in app state if you need persistence.
- Right-click removes a waypoint (context menu action inside the component template).

## Example

::: ng-component <connection-waypoints></connection-waypoints> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
