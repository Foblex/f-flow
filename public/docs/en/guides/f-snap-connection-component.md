# Snap Connection

**Selector:**  f-snap-connection

It is used to help users create or reassign connections to the nearest input.

## Inputs

  - Similar to the [f-connection](f-connection-component) component

  - `fSnapThreshold: number;` The distance in pixels at which the connection snaps to the input. Default: `20`.

## Styles

- `.f-connection` Class specific to the connection component, providing styles for connection representation.

- `.f-snap-connection` Class specific to the snap connection component, providing styles for snap connection representation.

## Usage

Add the `f-snap-connection` component to the [f-canvas](f-canvas-component). Works with [f-connection-for-create](f-connection-for-create-component) or [f-connection](f-connection-component) components.

```html
<f-flow |:|fDraggable|:|>
  <f-canvas>
    |:|<f-snap-connection></f-snap-connection>|:|
  </f-canvas>
</f-flow>
```

## Examples

The following example shows how to create a connection between two nodes with snap connection.

::: ng-component <drag-snap-connection></drag-snap-connection>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/drag-snap-connection/drag-snap-connection.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/drag-snap-connection/drag-snap-connection.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/drag-snap-connection/drag-snap-connection.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
