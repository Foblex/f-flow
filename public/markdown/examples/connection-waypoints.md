---
toc: false
wideContent: true
---

# Connection Waypoints

## Description

Manually shape connection routes by adding interactive waypoints between nodes. Use this when users need cleaner edge routing without giving up control of the underlying waypoint data in your application state.

## Example

::: ng-component <connection-waypoints></connection-waypoints> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## What you can do

- See waypoint candidates generated along each connection segment.
- Add a waypoint to make the route explicit.
- Move existing waypoints to reshape the connection in real time.
- Bind `[(waypoints)]` to your own state and react through `(fConnectionWaypointsChanged)`.

## Key API

Place `<f-connection-waypoints>` inside `<f-connection>` and configure:

- `[(waypoints)]` for two-way binding with your waypoint array.
- `radius` for the visual size of candidates and active waypoints.

## Interaction model

- Drag a green candidate point onto the connection to add a waypoint.
- Drag a blue waypoint to move it.
- Right-click a waypoint to remove it.
- Use the toolbar toggles to show/hide waypoints or disable interaction.

The feature stays data-driven: Foblex Flow handles interaction, but the waypoint array still belongs to your app.
