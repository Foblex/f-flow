# Connection Waypoints

## Description

This example demonstrates the new Connection Waypoints feature in Foblex Flow.

Waypoints are user-defined points placed on a connection that let you manually shape the route between two nodes.
They work with any built-in connection type - Straight, Segment, Bezier, and Adaptive Curve - and always stay fully interactive.

What you can do in this example:
-	**See waypoint candidates** (green markers) generated along each connection segment.
-	**Add a waypoint** by clicking a candidate — it becomes part of the connection route.
-	**Move existing waypoints** (blue markers) to reshape the connection in real time.
-	**Bind waypoints to your app state** via **[(waypoints)]**, keeping full control over the data model.
-	Listen to (fConnectionWaypointsChanged) to react when the user changes the route.

Usage is simple - just place **<f-connection-waypoints>** inside **<f-connection>**:
-	**[(waypoints)]** - two-way binding for the waypoint list (your state).
-	**radius** - visual size of candidates and waypoints.

How to use
-	Add a waypoint: drag a green candidate point onto the connection.
-	Move a waypoint: drag an existing waypoint (blue point).
-	Remove a waypoint: right-click on a waypoint.

You can also control the feature in the toolbar:
-	Show Waypoints - toggles waypoint rendering.
-	Enable Waypoints - enables/disables waypoint interaction.

This feature is designed to be **data-driven**: the library provides interaction and intent, while the waypoint array belongs to your application.

## Example

::: ng-component <connection-waypoints></connection-waypoints> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/connection-waypoints/connection-waypoints.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
