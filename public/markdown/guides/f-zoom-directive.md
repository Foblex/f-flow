﻿# Zoom

**Selector:** [fZoom]

The **FZoomDirective** directive is used to control the zoom of the canvas. It is used in conjunction with the [f-canvas](f-canvas-component) component to provide zoom functionality. Zooming can be done by using the mouse wheel or by double-clicking on the canvas. The zoom level can be reset to the default

## Inputs

- `fZoom: boolean;` Enables or disables the zoom functionality.

- `fZoomMinimum: number;` The minimum zoom level allowed. Default is 0.1.

- `fZoomMaximum: number;` The maximum zoom level allowed. Default is 4.

- `fZoomStep: number;` The zoom step value. Default is 0.1.

- `fZoomDblClickStep: number;` The zoom step value when double-clicking. Default is 0.5.

## Methods

- `setZoom(point: IPoint, step: number, direction: number, animated: boolean): void;` Sets the zoom level of the [f-canvas](f-canvas-component). Point is the center of the zoom, step is the zoom step, direction is the zoom direction, and animated is whether the zoom should be animated.

- `getZoomValue(): number;` Returns the current [f-canvas](f-canvas-component) scale.

- `zoomIn(point?: IPoint): void;` Zooms in the [f-canvas](f-canvas-component). If a point is provided, the zoom will be centered on that point.

- `zoomOut(point?: IPoint): void;` Zooms out the [f-canvas](f-canvas-component). If a point is provided, the zoom will be centered on that point.

- `reset(): void;` Resets the zoom level to 1.

## Styles

- `.f-component` A general class applied to all F components for shared styling.

- `.f-zoom` Specific class for styling the FZoomDirective component.

## Usage

#### Basic Usage

To enable zoom and pan functionality, set `fZoom` directive to [f-canvas](f-canvas-component) component.

```html
<f-flow>
  <f-canvas |:|fZoom|:|>
    <div fNode></div>
  </f-canvas>
</f-flow>
```

#### Tracking Zoom Changes

To track zoom changes, use the `fCanvasChange` output from fCanvas.

```html
<f-flow>
  <f-canvas |:|fZoom|:| |:|(fCanvasChange)|:|="canvasChange($event)">
    <div fNode></div>
  </f-canvas>
</f-flow>
```

#### Programmatically Controlling Zoom

You can also control the zoom level programmatically by using the methods provided by the directive.

::: code-group
```html 
<f-flow>
  <f-canvas fZoom>
    /// content
  </f-canvas>
</f-flow>
```

```ts  
@Component()
class Component {

  @ViewChild(FZoomDirective, { static: true })
  public fZoomDirective!: FZoomDirective;

  public zoomIn(): void {
    this.fZoomDirective.zoomIn();
  }

  public zoomOut(): void {
    this.fZoomDirective.zoomOut();
  }

  public reset(): void {
    this.fZoomDirective.reset();
  }
}
```
:::

## Example

The following example shows how to enable **zoom** and **pan** functionality in the canvas. Use the **mouse wheel** to **zoom in** and **out**, and **double click** to **zoom in**.

::: ng-component <zoom-example></zoom-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/zoom-example/zoom-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/zoom-example/zoom-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/zoom-example/zoom-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
