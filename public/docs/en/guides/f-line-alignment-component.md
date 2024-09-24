# Line Alignment 

**Selector:** f-line-alignment

The **FLineAlignmentComponent** is an Angular component designed to assist with aligning nodes on a canvas. It provides visual guidelines to help align nodes by detecting their positions and drawing intersecting lines.

## Inputs

- `fAlignThreshold: number;` The threshold value for aligning nodes. When a node is dragged within this threshold, the component will draw alignment guidelines.

## Styles

- `.f-component` A general class applied to all F components for shared styling.

- `.f-line-alignment` Specific class for styling the FLineAlignmentComponent component.

## Usage

The following example demonstrates how to use the f-line-alignment component within your application. This component helps to align nodes on a canvas by drawing guidelines when nodes are dragged near alignment points.

```html
<f-flow>
  |:|<f-line-alignment [fAlignThreshold]="10"></f-line-alignment>|:|
</f-flow>
```

## Examples

::: ng-component <line-alignment-example></line-alignment-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/line-alignment-example/line-alignment-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/line-alignment-example/line-alignment-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/line-alignment-example/line-alignment-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
