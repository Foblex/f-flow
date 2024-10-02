# Create Connection

**Selector:**  f-connection-for-create

It is used to create a connection between two nodes. The connection can be dragged to a different node input.

## Inputs

  - Similar to the [f-connection](f-connection-component) component

## Styles

- `.f-connection` Class specific to the connection component, providing styles for connection representation.

- `.f-connection-for-create` Class specific to the connection component, providing styles for connection creation.

## Usage

Add the `f-connection-for-create` component to the [f-canvas](f-canvas-component). Works only if [fDraggableDirective](f-draggable-directive) is added.

```html
<f-flow |:|fDraggable|:|>
  <f-canvas>
    |:|<f-connection-for-create></f-connection-for-create>|:|
  </f-canvas>
</f-flow>
```

## Examples

The following example shows how to create a connection between two nodes.

::: ng-component <drag-to-connect></drag-to-connect>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/connections/drag-to-connect/drag-to-connect.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

