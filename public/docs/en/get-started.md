# Getting Started with Foblex Flow

Foblex Flow is a flexible library for Angular, designed for creating interactive graphs and diagrams. This guide will assist you in integrating Foblex Flow into your project and leveraging its unique features.

## Installation

To install Foblex Flow, run the following command in your Angular project:

::: code-group

```sh [v12]
npm install @foblex/flow@12
```

```sh [v16]
npm install @foblex/flow
```

:::

This command will add Foblex Flow to your package.json and offer to create a default theme.

## Using Components

Add the [f-flow](f-flow-component) component to your HTML template:

::: ng-component <draggable-flow></draggable-flow>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/draggable-flow/draggable-flow.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/draggable-flow/draggable-flow.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/draggable-flow/draggable-flow.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-examples/_flow-common.scss
:::

- [f-flow](f-flow-component) component acts as the primary container, managing the layout and interactions of all child visualization components within the flow.

- [f-canvas](f-canvas-component) component within [f-flow](f-flow-component) component provides the foundation for placing other components such as nodes and connections.

- [f-connection](f-connection-component) component creates a visual link between [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives. In this case, it connects a output with `fOutputId="1"` to an input with `fInputId="2"`.

- [fNode](f-node-directive) directive represents a node in the flow and can be configured using properties like fNodePosition to define its position.

- The [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives inside the nodes define connection points (outputs and inputs respectively) for establishing connections.

<br>

::: info Conclusion
Foblex Flow is a powerful tool for creating complex graphical interfaces in Angular. For more information on the capabilities and components of the library, refer to the Foblex Flow documentation.
:::
