# Minimap

**Selector:** f-minimap

The **FMinimapComponent** provides a miniature view of the larger flow, allowing users to navigate and interact with the flow efficiently. It supports features like zooming, panning, and visual representation of the flow layout. The minimap dynamically updates based on the changes in the main flow, ensuring an accurate representation. 

## Inputs

  - `fMinSize: number;` The minimum size of the bounding box that encloses all nodes in the minimap. It ensures that the minimap does not shrink below this size, even if the actual flow is smaller. This helps maintain the usability and visibility of the minimap. `Default: 1000`.

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-minimap` Specifically targets the **FMinimapComponent**, allowing for unique styling.

## Usage

```html
<f-flow>
  ...// Other components
  |:|<f-minimap [fMinSize]="customSize"></f-minimap>|:|
</f-flow>
```

## Examples

#### Basic Example

This example shows a basic implementation of the minimap component within a larger flow, providing users with an overview and easy navigation capabilities.

::: ng-component <simple-flow></simple-flow>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/simple-flow/simple-flow.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/simple-flow/simple-flow.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/simple-flow/simple-flow.component.scss
:::

