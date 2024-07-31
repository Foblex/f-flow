
<p align="center">
  <img height="280px" style="margin: auto" src="https://github.com/user-attachments/assets/0fd21960-ac6c-4f9b-8e9f-214bb08b6236" alt="Foblex Flow Logo"/>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@foblex/flow">
    <img src="https://img.shields.io/npm/v/@foblex/flow.svg?logo=npm&logoColor=fff&label=Release&color=limegreen" alt="NPM Release"/>
  </a>
  <a href="https://github.com/foblex/f-flow/actions/workflows/tests-ci.yml">
    <img src="https://github.com/foblex/f-flow/actions/workflows/tests-ci.yml/badge.svg" alt="Build Status"/>
  </a>
</p>

## Welcome to Foblex Flow

Foblex Flow is an [Angular](https://angular.dev/) library designed to simplify the creation and manipulation of 
dynamic flows. It provides components for flows, nodes, and connections, automating node 
manipulation and inter-node connections.

### Examples

- [Call Center](https://github.com/Foblex/f-flow-example) - A simple example of a call center flow.

- [Scheme Editor](https://github.com/Foblex/f-scheme-editor) - A more complex example of a scheme editor.

### Features

1. Node and Connection creation and manipulation.
2. Connection and Node events.
3. Reassigning Nodes and Connections.
4. Customizable Node and Connection templates.
5. Drag-and-drop support.
6. Zoom and pan support.

### Getting Started and Documentation

Visit our [Documentation](https://flow.foblex.github.com) to learn how to install and use the library in your Angular project.

### Installation

To add Foblex Flow to your project, run the following command:

```bash
npm install @foblex/flow
```

### Usage

Example:
```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>
      <div fNode fDragHandle [fNodePosition]="{ x: 24, y: 24 }" fNodeOutput fOutputId="output1" fOutputConnectableSide="right"> Drag me </div>
      <div fNode fDragHandle [fNodePosition]="{ x: 244, y: 24 }" fNodeInput fInputId="input1" fInputConnectableSide="left"> Drag me </div>
  </f-canvas>
</f-flow>
```

### Support and Community

For questions, feedback, and support, visit the [Foblex Portal](https://www.foblex.com/flow/home) to connect with the community and the development team.
You can also report [issues](https://github.com/Foblex/flow/issues) and request [features](https://github.com/Foblex/flow/discussions) on the [GitHub repository](https://github.com/Foblex/flow).

### License

This library is available for use under the [MIT License](./LICENSE).

For more information please contact our [support](mailto:support@foblex.com).

