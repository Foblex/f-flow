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

Foblex Flow gives Angular teams a simple way to start building graph-based products without adopting a React-first mental model. Begin with `f-flow`, `f-canvas`, nodes, and connections, then add richer editor features only when your product needs them.

Use it to create workflow builders, AI low-code tools, call-flow editors, UML diagrams, internal back-office tools, and other node-based interfaces while keeping your own state, validation, persistence, and domain logic.

Current `18.x` releases target Angular `17.3+`. If your app is on Angular 12-17.2, check the [Angular Version Compatibility](https://flow.foblex.com/docs/angular-version-compatibility) guide first and pin the matching Foblex Flow line before installing.

## Why Foblex Flow

- Easy starting path: most editors begin with `f-flow`, `f-canvas`, nodes, connectors, and connections.
- Angular-first API that fits Angular apps instead of wrapping a React-style state model.
- Built for real editor interactions: drag to connect, drag to reassign, selection, zoom, minimap, snapping, alignment helpers, and waypoints.
- Advanced modules are optional: caching and virtualization are scaling tools, not day-one requirements.
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
- [Schema Designer](https://flow.foblex.com/examples/schema-designer) - A richer schema editor demo with nodes, relations, and CRUD-style interactions.
- [UML Diagram](https://flow.foblex.com/examples/uml-diagram-example) - An Angular example for architecture and UML-style graph interfaces.
- [Tournament Bracket](https://flow.foblex.com/examples/tournament-bracket) - A specialized bracket UI built on the same node-based primitives.
- [All Examples](https://flow.foblex.com/examples/overview) - Focused examples for connections, selection, minimap, layout, alignment, and other editor features.

## Install

These install commands are for the current `18.x` line. For Angular 12-17.2 apps, use the [Angular Version Compatibility](https://flow.foblex.com/docs/angular-version-compatibility) guide first so you do not accidentally install a newer incompatible line.

```bash
ng add @foblex/flow
```

For Nx workspaces:

```bash
nx g @foblex/flow:add
```

`ng add` installs the required companion packages automatically. If you prefer manual installation, install them explicitly:

```bash
npm install @foblex/flow @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

`ng add` also wires the shipped default theme into application styles by adding `node_modules/@foblex/flow/styles/default.scss` when the entry is missing.

## Default Theme

Use the default theme when you want styled nodes, connectors, connections, minimap, selection area, and helper plugins immediately.

```json
"styles": [
  "src/styles.scss",
  "node_modules/@foblex/flow/styles/default.scss"
]
```

If you prefer selective SCSS mixins instead of one full entrypoint:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.flow-canvas();
@include flow-theme.node-group();
@include flow-theme.connector();
@include flow-theme.connection-all();
@include flow-theme.plugins();
```

Full guide: [Default Theme and Styling](https://flow.foblex.com/docs/default-theme-and-styling)

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

## Quick FAQ

- **Is Foblex Flow hard to use?** No. The core setup is small and Angular-native.
- **Do I need caching or virtualization?** No. Most editors do not need them on day one. They are optional scaling tools for larger scenes.
- **Who is it for?** Angular teams building node editors, workflow builders, interactive diagrams, and other graph-based product UIs.

## Resources

- [Get Started](https://flow.foblex.com/docs/get-started)
- [Angular Version Compatibility](https://flow.foblex.com/docs/angular-version-compatibility)
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

## Support the Project

If Foblex Flow is useful in your product, give the repository a star:

[https://github.com/Foblex/f-flow](https://github.com/Foblex/f-flow)
