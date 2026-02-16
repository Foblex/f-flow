# Event System

Foblex Flow is built around **user intent**: users drag nodes, create/reassign connections, resize/rotate, select items, pan/zoom the canvas - and the library reports those actions through a consistent event layer.

**Important:** Foblex Flow events are designed to be **final-result events**.  
During an active drag session the library updates positions internally for smooth UX, and then emits **a single “result” event** when the action is completed (plus start/end lifecycle events).

This page summarizes **what events exist**, **where to subscribe**, and **how to use triggers** to control when interactions should start.
**What you get**

- Lifecycle events (e.g. `fLoaded`, drag start/end).
- Selection and transform events (canvas changes, node/group geometry changes).
- Connection workflow events (create, reassign, waypoints).
- External-drop events (create node from palette/toolbox, drop to group).
- Trigger-based configuration: you can decide which gestures start which behaviors.

## Why / Use cases

The event system is how you keep **your application state** and **your backend** in sync with what the user did in the editor.

Typical scenarios:

- **Save positions** when the user finishes moving nodes (`fMoveNodes`, `fDragEnded`).
- **Create edges** when the user connects ports (`fCreateConnection`).
- **Reassign edges** by dragging endpoints (`fReassignConnection`).
- **Persist geometry** changes after resize/rotate (`fNodeSizeChange`, `fNodeRotateChange`, etc.).
- **Update UI panels** when selection changes (`fSelectionChange`).
- **Track usage** (analytics/telemetry) without coupling it to rendering code.

## How it works

At a high level:

1. `fDraggable` orchestrates pointer interactions and runs the internal behavior pipeline.
2. When an interaction is completed (or its state changes), it emits **typed events**.
3. Your app handles those events and updates your model (nodes, connections, groups).
4. Angular re-renders based on _your_ state.  
   Foblex Flow does not “own” your persistence - it only helps users interact.

In practice this gives you a clean separation:

- Foblex Flow → UX + interaction signals
- Your app → domain logic + state + persistence

## Configuration (Inputs/Outputs/Methods)

### Core outputs to use

- `fLoaded` on `f-flow`
- `fCanvasChange` on `f-canvas`
- `fNodePositionChange`, `fNodeRotateChange`, `fNodeSizeChange` on `fNode`
- `fGroupPositionChange`, `fGroupRotateChange`, `fGroupSizeChange` on `fGroup`
- `fSelectionChange` on `f-flow[fDraggable]`
- `fMoveNodes`
- `fCreateConnection`
- `fReassignConnection`
- `fConnectionWaypointsChanged`
- `fCreateNode`
- `fDropToGroup`
- `fDragStarted`
- `fDragEnded`

> Tip: If you persist data, prefer “final” events (for example, `fDragEnded`) instead of reacting to every tiny move.

### Trigger API

Triggers let you control **when** a particular behavior should start.
For example: only allow moving nodes via a drag-handle, or block connection creation while holding a modifier key.

- `FEventTrigger = (event: FTriggerEvent) => boolean`
- `FTriggerEvent = MouseEvent | TouchEvent | WheelEvent`

Used in inputs such as:

- `fCreateConnectionTrigger`
- `fReassignConnectionTrigger`
- `fConnectionWaypointsTrigger`
- `fNodeResizeTrigger`
- `fNodeRotateTrigger`
- `fNodeMoveTrigger`
- `fCanvasMoveTrigger`
- `fExternalItemTrigger`

#### Example: allow moving nodes only with left mouse button

```ts
const leftButtonOnly: FEventTrigger = (event: any) => {
  return typeof event?.button === 'number' ? event.button === 0 : true;
};
```

> Keep trigger predicates deterministic and consistent across devices to avoid “random” UX.

### Methods

- Use `FFlowComponent` methods (`select`, `clearSelection`, `getState`, etc.) to react to events with controlled updates.

## Real-world patterns

### 1) Persist node positions (one write per action)

Because move events are finalized, persistence becomes simple and efficient:

- handle `fMoveNodes`,
- update your node list in memory,
- optionally persist to backend/local storage.

You avoid noisy updates and keep drag silky-smooth.

### 2) Validate connection creation

When the user creates a connection, you usually want to:

- check business rules (allowed pairs, max degree, connector types, etc.),
- either accept and add an edge,
- or reject and show feedback.

Keep validation in one place: the handler for `fCreateConnection`.

### 3) Keep an inspector panel in sync with selection

Selection drives inspectors and toolbars.

- Use `fSelectionChange` to update selected ids in your state.
- Render the inspector from that state (not from DOM queries).

## Styling

- `.f-dragging`, `.f-connections-dragging` reflect active interaction states.
- `.f-selected` reflects selected node/connection/group states.

## Notes / Pitfalls

- Don’t expect per-frame drag events: design your integration around finalized payloads.
- Heavy synchronous handlers can still hurt UX (they run on the main thread). Keep handlers small and do persistence/IO asynchronously.
- Triggers should be predictable and consistent across devices.

## Example

::: ng-component <drag-start-end-events></drag-start-end-events> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::
