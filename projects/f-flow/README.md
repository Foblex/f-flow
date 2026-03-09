<p align="center">
  <a href="https://flow.foblex.com/">
    <img style="margin: auto" src="https://github.com/user-attachments/assets/ee1d39f6-0a89-4cb9-8dee-1652aba82e69" alt="Foblex Flow Logo"/>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@foblex/flow">
    <img src="https://img.shields.io/npm/v/@foblex/flow.svg?logo=npm&logoColor=fff&label=Release&color=limegreen" alt="NPM Release"/>
  </a>
  <a href="https://github.com/Foblex/f-flow/actions/workflows/tests-ci.yml">
    <img src="https://github.com/Foblex/f-flow/actions/workflows/tests-ci.yml/badge.svg" alt="Build Status"/>
  </a>
</p>

<h1 align="center">Foblex Flow</h1>

<p align="center">
  <strong>Angular-native node-based UI library for building node editors, workflow builders, and interactive graph interfaces.</strong>
</p>

Foblex Flow gives Angular teams the primitives for building graph-based products without adopting a React-first mental model. Use it to create workflow builders, AI low-code tools, call-flow editors, UML diagrams, internal back-office tools, and other node-based interfaces while keeping your own state, validation, persistence, and domain logic.

It works with Angular 15+, SSR, standalone components, and zoneless-friendly application setups.

## Why Foblex Flow

- Angular-first API that fits Angular apps instead of wrapping a React-style state model.
- Built for real editor interactions: drag to connect, drag to reassign, selection, zoom, minimap, snapping, alignment helpers, and waypoints.
- Custom nodes, connectors, and connections for domain-specific graph UIs.
- Your app stays in control of graph state, validation rules, permissions, and persistence.
- Suitable for both lightweight diagrams and full workflow-builder products.

## What You Can Build

- Angular node editors
- Angular workflow builders
- AI low-code and internal tools
- Call flows, automation editors, and pipeline UIs
- UML, architecture, and other interactive diagram interfaces

## Examples

- [AI Low-Code Platform](https://flow.foblex.com/examples/ai-low-code-platform) - A flagship front-end-only AI low-code IDE demo with custom nodes, JSON import/export, multiple themes, config panels with validation, validation feedback on nodes, undo/redo, persistence, multi-select, and animated connections.
- [DB Management](https://flow.foblex.com/examples/f-db-management-flow) - A database-oriented workflow builder with richer interactions and UI patterns.
- [UML Diagram](https://flow.foblex.com/examples/uml-diagram-example) - An Angular example for architecture and UML-style graph interfaces.
- [Tournament Bracket](https://flow.foblex.com/examples/tournament-bracket) - A specialized bracket UI built on the same node-based primitives.
- [All Examples](https://flow.foblex.com/examples/overview) - Focused examples for connections, selection, minimap, layout, alignment, and other editor features.

## Install

```bash
ng add @foblex/flow
```

If you prefer manual installation:

```bash
npm install @foblex/flow
```

## Minimal Example

```html
<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>

    <div
      fNode
      fDragHandle
      [fNodePosition]="{ x: 24, y: 24 }"
      fNodeOutput
      fOutputId="output1"
      fOutputConnectableSide="right"
    >
      Drag me
    </div>

    <div
      fNode
      fDragHandle
      [fNodePosition]="{ x: 244, y: 24 }"
      fNodeInput
      fInputId="input1"
      fInputConnectableSide="left"
    >
      Drag me
    </div>
  </f-canvas>
</f-flow>
```

## Resources

- [Get Started](https://flow.foblex.com/docs/get-started)
- [Documentation](https://flow.foblex.com/docs/intro)
- [Examples](https://flow.foblex.com/examples/overview)
- [Articles](https://flow.foblex.com/blog/overview)
- [Showcase](https://flow.foblex.com/showcase/overview)
- [Roadmap](https://github.com/Foblex/f-flow/blob/main/ROADMAP.md)
- [Changelog](https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md)

## Community and Support

- [GitHub Repository](https://github.com/Foblex/f-flow)
- [GitHub Discussions](https://github.com/Foblex/f-flow/discussions)
- [Issue Tracker](https://github.com/Foblex/f-flow/issues)
- [Documentation Portal](https://flow.foblex.com)

For questions or partnership inquiries: support@foblex.com

## License

Foblex Flow is available under the [MIT License](https://github.com/Foblex/f-flow/blob/main/LICENSE).
