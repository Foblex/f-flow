# Connection Waypoints

## Description

`FConnectionWaypoints` adds editable intermediate points to a connection path.

- **Selector:** `f-connection-waypoints`
- **Class:** `FConnectionWaypoints`

**What you get**

- Manual control over connection shape via waypoint points.
- Two-way binding for waypoint arrays.
- Drag-time waypoint change notifications from `fDraggable`.

## Why / Use cases

Use waypoints when automatic routing is not enough and users must shape links manually.

Typical use cases:

- Diagram editors where readability depends on custom bends.
- Dense flows with overlapping links.
- Cases where connection paths should avoid specific visual areas.

## How it works

Place `f-connection-waypoints` inside a connection. It stores waypoint coordinates in `waypoints`, renders candidate/active waypoint circles, and updates the bound array during edits. Changes are also emitted through `fConnectionWaypointsChanged` on `fDraggable`.

## Configuration (Inputs/Outputs/Methods)

### Inputs

- `radius: InputSignal<number>;` Point radius. Default: `4`.
- `visibility: InputSignal<boolean>;` Shows/hides waypoint markers. Default: `true`.

### Outputs

- Two-way model binding: `[(waypoints)]="..."`.
- Global change event from draggable: `fConnectionWaypointsChanged: OutputEmitterRef<FConnectionWaypointsChangedEvent>;`.

### Methods

- `insert(candidate: IPoint): void;`
- `select(waypoint: IPoint): void;`
- `move(point: IPoint): void;`
- `update(): void;`

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
