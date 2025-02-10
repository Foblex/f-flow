# Custom Event Triggers

## Description

This example demonstrates how to set up custom event triggers to handle drag operations.

To add a custom trigger, you need to create a function that accepts a parameter of type `FTriggerEvent` and returns a `boolean`. 
Below is an example of a trigger for zooming that requires holding the `Ctrl` key:

```typescript
protected zoomTrigger = (event: FTriggerEvent) => {
  return event.ctrlKey;
};
```

Next, you need to set this function to the appropriate attribute, as shown in the example below:

```html
 <f-canvas fZoom [fWheelTrigger]="zoomTrigger"></f-canvas>
```

In this example, three custom triggers are defined:

1. `fWheelTrigger`: Zooming is activated by the mouse wheel, but only when the `Ctrl` key is held.

2. `fNodeMoveTrigger`: Dragging is activated by the mouse, but only when the `Shift` key is held.

3. `fCreateConnectionTrigger`: Creating a connection between nodes is only possible when the `F` key is held.

But you can define custom triggers for any event that the flow supports:

**fZoom:** `fWheelTrigger`, `fDblClickTrigger`;

**fDraggable:** `fReassignConnectionTrigger`, `fCreateConnectionTrigger`, `fNodeResizeTrigger`, `fNodeMoveTrigger`, `fCanvasMoveTrigger`, `fExternalItemTrigger`, `fMultiSelectTrigger`;

**f-selection-area:** `fTrigger`;

## Example

::: ng-component <custom-event-triggers></custom-event-triggers> [height]="600"
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::


