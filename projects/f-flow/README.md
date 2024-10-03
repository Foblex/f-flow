<p align="center">
  <a href="https://flow.foblex.com/">
    <img style="margin: auto" src="https://github.com/user-attachments/assets/ee1d39f6-0a89-4cb9-8dee-1652aba82e69" alt="Foblex Flow Logo"/>
  </a>
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

Foblex Flow is an [Angular](https://angular.dev/) library built to simplify the creation and management of dynamic, interactive flows.
Whether you're developing complex systems or lightweight visualizations, Foblex Flow provides a robust set of tools to help automate node manipulation and inter-node connections with ease. It's fully compatible with Angular 12+, Server-Side Rendering (SSR), and the Composition API.

### Examples

Explore practical use cases to see Foblex Flow in action:

- [Call Center](https://github.com/Foblex/f-flow-example) - A streamlined flow example simulating a call flow.

- [Scheme Editor](https://github.com/Foblex/f-scheme-editor) - A more advanced example of a fully interactive scheme editor.

- [Visual Programming](https://flow.foblex.com/examples/f-visual-programming-flow/) - An example of a visual programming flow.

- [DB Management](https://flow.foblex.com/examples/f-db-management-flow/) - An example of a database management flow.

### Features

1. **Node and Connection Creation:** Dynamically generate and manipulate nodes and their connections.
2. **Event-Driven Architecture:** Built-in events for nodes and connections to allow seamless interaction handling.
3. **Reassign Connections:** Easily reassign connections between nodes, allowing for flexible flow adjustments.
4. **Custom Templates:** Fully customizable node and connection templates for tailored visual representation.
5. **Drag-and-Drop:** Simplified drag-and-drop functionality for intuitive flow manipulation.
6. **Zoom and Pan Support:** Explore large flows with smooth zooming and panning controls.

### Getting Started and Documentation

For a comprehensive guide on how to install, configure, and use Foblex Flow in your Angular project, visit our [Documentation](https://flow.foblex.com/docs/get-started).

### Installation

To add Foblex Flow to your project, use the following npm command:

```bash
npm install @foblex/flow
```

### Usage Example

Here’s a simple example of how you can use Foblex Flow to create draggable nodes and connections:

```html

<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>
    <div fNode fDragHandle [fNodePosition]="{ x: 24, y: 24 }" fNodeOutput fOutputId="output1" fOutputConnectableSide="right"> Drag me</div>
    <div fNode fDragHandle [fNodePosition]="{ x: 244, y: 24 }" fNodeInput fInputId="input1" fInputConnectableSide="left"> Drag me</div>
  </f-canvas>
</f-flow>
```

### Community and Support

For questions, feedback, and support, visit the [Foblex Portal](https://flow.foblex.com) to connect with the community and the development team.
You can also report [issues](https://github.com/Foblex/flow/issues) and request [features](https://github.com/Foblex/flow/discussions) on the [GitHub repository](https://github.com/Foblex/flow).

### License

This library is available for use under the [MIT License](./LICENSE).

For more information please contact our [support](mailto:support@foblex.com).

