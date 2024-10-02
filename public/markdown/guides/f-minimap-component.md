# Minimap

**Selector:** f-minimap

The **FMinimapComponent** provides a miniature view of the larger flow, allowing users to navigate and interact with the flow efficiently. It supports features like zooming, panning, and visual representation of the flow layout. The minimap dynamically updates based on the changes in the main flow, ensuring an accurate representation. 

## Inputs

  - `fMinSize: number;` The minimum size of the bounding box that encloses all nodes in the minimap. It ensures that the minimap does not shrink below this size, even if the actual flow is smaller. This helps maintain the usability and visibility of the minimap. `Default: 1000`.

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-minimap` Specifically targets the **FMinimapComponent**, allowing for unique styling.

## Usage

#### Basic Usage

To add a minimap to your flow, simply include the `FMinimapComponent` within the [f-flow](f-flow-component) component. This provides users with an overview of the flow layout and enhances navigation capabilities.

```html
<f-flow>
  ...// Other components
  |:|<f-minimap></f-minimap>|:|
</f-flow>
```

#### Navigation and Interaction

For navigation and interaction you need to add [f-draggable](f-draggable-directive) directive to the [f-flow](f-flow-component) component.

```html
<f-flow |:|fDraggable|:|>
  ...// Other components
  <f-minimap></f-minimap>
</f-flow>
```


#### Custom Scale

You can set a custom scale for the minimap by using the `fMinSize` input. This allows you to control the size of the minimap based on your requirements.

```html
<f-flow fDraggable>
  ...// Other components
  <f-minimap |:|[fMinSize]="3000"|:|></f-minimap>
</f-flow>
```

## Examples

#### Basic Example

This example shows a basic implementation of the minimap component within a larger flow, providing users with an overview and easy navigation capabilities.

::: ng-component <minimap-basic-example></minimap-basic-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-basic-example/minimap-basic-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-basic-example/minimap-basic-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-basic-example/minimap-basic-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Custom Scale Example

This example demonstrates the use of a custom scale for the minimap, allowing you to control the size of the minimap based on your requirements.

::: ng-component <minimap-scaled-example></minimap-scaled-example>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-scaled-example/minimap-scaled-example.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-scaled-example/minimap-scaled-example.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/minimap-scaled-example/minimap-scaled-example.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

