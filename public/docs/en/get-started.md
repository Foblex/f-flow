# Getting Started with Foblex Flow

Foblex Flow is a flexible library for Angular, designed for creating interactive graphs and diagrams. This guide will assist you in integrating Foblex Flow into your project and leveraging its unique features.

## Installation

To install Foblex Flow, run the following command in your Angular project:

::: code-group

```sh [npm]
npm install @foblex/flow
```

```sh [pnpm]
pnpm install @foblex/flow
```

```sh [yarn]
yarn install @foblex/flow
```

:::

This command will add Foblex Flow to your package.json and offer to create a default theme.

## Using Components

Add the [f-flow](f-flow-component) component to your HTML template:

```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>
    <div fNode fDragHandle [fNodePosition]="{ x: 24, y: 24 }"
         fNodeOutput fOutputId="output1"
         fOutputConnectableSide="right"> Drag me
    </div>
    <div fNode fDragHandle [fNodePosition]="{ x: 244, y: 24 }"
         fNodeInput fInputId="input1"
         fInputConnectableSide="left"> Drag me
    </div>
  </f-canvas>
</f-flow>
```
<br>

- [f-flow](f-flow-component) component acts as the primary container, managing the layout and interactions of all child visualization components within the flow.

- [f-canvas](f-canvas-component) component within [f-flow](f-flow-component) component provides the foundation for placing other components such as nodes and connections.

- [f-connection](f-connection-component) component creates a visual link between [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives. In this case, it connects a output with `fOutputId="1"` to an input with `fInputId="2"`.

- [fNode](f-node-directive) directive represents a node in the flow and can be configured using properties like fNodePosition to define its position.

- The [fNodeOutput](f-node-output-directive) and [fNodeInput](f-node-input-directive) directives inside the nodes define connection points (outputs and inputs respectively) for establishing connections.

<br>

::: info Conclusion
Foblex Flow is a powerful tool for creating complex graphical interfaces in Angular. For more information on the capabilities and components of the library, refer to the Foblex Flow documentation.
:::
