# Getting Started with Foblex Flow

Foblex Flow is a flexible and powerful library for Angular, designed specifically for creating interactive graphs and diagrams. 
This guide will walk you through the integration of Foblex Flow into your project, enabling you to fully utilize its features.

## Installation

To install Foblex Flow, run the following command in your Angular project:

::: code-group

```sh [v12+]
npm install @foblex/flow@12
```

```sh [v16+]
npm install @foblex/flow
```

:::

This command will add Foblex Flow to your package.json.

## Using Components

Add the [f-flow](f-flow-component) component to your HTML template to get started:

::: ng-component <draggable-flow></draggable-flow>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

- [f-flow](f-flow-component) component acts as the primary container, managing the layout and interactions of all child visualization components within the flow.

- [f-canvas](f-canvas-component) component within [f-flow](f-flow-component) component provides the foundation for placing other components such as nodes and connections.

- [f-connection](f-connection-component) component creates a visual link between [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives. In this case, it connects a output with `fOutputId="1"` to an input with `fInputId="2"`.

- [fNode](f-node-directive) directive represents a node in the flow and can be configured using properties like fNodePosition to define its position.

- The [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives inside the nodes define connection points (outputs and inputs respectively) for establishing connections.

## Pro Examples

Explore practical use cases to see Foblex Flow in action:

- [Call Center](https://github.com/Foblex/f-flow-example) - A streamlined flow example simulating a call flow.

- [Scheme Editor](https://github.com/Foblex/f-scheme-editor) - A more advanced example of a fully interactive scheme editor.

- [Visual Programming](./examples/f-visual-programming-flow/) - An example of a visual programming flow.

- [DB Management](./examples/f-db-management-flow/) - An example of a database management flow.

<br>

::: tip Conclusion
Foblex Flow is a powerful tool for creating complex graphical interfaces in Angular. For more information on the capabilities and components of the library, refer to the Foblex Flow documentation.
:::
