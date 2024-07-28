**Selector:**  f-connection-for-create

It is used to create a connection between two nodes. The connection can be dragged to a different node input.

## Inputs

  - Similar to the [f-connection](f-connection-component) component

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

::: ng-component <create-connection></create-connection>
[component.html] <<< src/demo/app/simple-flow/simple-flow.component.html
[component.ts] <<< src/demo/app/simple-flow/simple-flow.component.ts
[component.scss] <<< src/demo/app/simple-flow/simple-flow.component.scss
:::
