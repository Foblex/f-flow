---
toc: false
wideContent: true
---

# Custom Event Triggers

## Description

Override the default triggers for zooming, dragging, and connection creation when your editor shares gestures with the rest of the page or needs power-user shortcuts. Custom triggers let the app decide exactly when an interaction should start.

## Example

::: ng-component <custom-event-triggers></custom-event-triggers> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

## Trigger examples

Each trigger is a function that receives `FTriggerEvent` and returns `boolean`.

```typescript
protected zoomTrigger = (event: FTriggerEvent) => {
  return event.ctrlKey;
};
```

```html
<f-canvas fZoom [fWheelTrigger]="zoomTrigger"></f-canvas>
```

This page demonstrates three common patterns:

- `fWheelTrigger`: zoom only while `Ctrl` is pressed.
- `fNodeMoveTrigger`: drag nodes only while `Shift` is pressed.
- `fCreateConnectionTrigger`: allow connection creation only while `F` is pressed.

## Supported trigger points

- `fZoom`: `fWheelTrigger`, `fDblClickTrigger`
- `fDraggable`: `fReassignConnectionTrigger`, `fCreateConnectionTrigger`, `fNodeResizeTrigger`, `fNodeMoveTrigger`, `fCanvasMoveTrigger`, `fExternalItemTrigger`, `fMultiSelectTrigger`
- `f-selection-area`: `fTrigger`
