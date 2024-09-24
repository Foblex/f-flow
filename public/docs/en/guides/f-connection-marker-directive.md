# Connection Marker

**Selector:** [fMarker]

The **FMarkerDirective** is a directive that represents a start or end marker for a connection.

## Inputs

  - `type: EFMarkerType;` The type of the marker, either start or end. Accepts a value from [EFMarkerType](e-f-marker-type) enum.

  - `height: number;` The height of the marker.

  - `width: number;` The width of the marker.

  - `refX: number;` The x-coordinate of the marker relative to the connection.

  - `refY: number;` The y-coordinate of the marker relative to the connection.

## Usage

```html
<f-connection [fOutputId]="id1" [fInputId]="id2">
  <svg fMarker type="f-connection-marker-start" 
       [height]="height" [width]="width" [refX]="positionX" [refY]="positionY">
    //svg content
  </svg> 
</f-connection>
```

## Examples

Example of how to create a custom connection marker. The marker is created using an SVG element and **fMarker** directive. FMarkerDirective requires the following attributes: `type`, `height`, `width`, `refX`, `refY`. [type] attribute accepted values are from the [EFMarkerType](e-f-marker-type) enum.
::: ng-component <connection-markers></connection-markers>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-markers/connection-markers.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-markers/connection-markers.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/connection-markers/connection-markers.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

