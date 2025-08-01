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


<h2 align="center">Powerful Flow Editor Framework — Native to Angular</h2>

---

**Foblex Flow** is a modern Angular library for building interactive flow-based UIs, including visual editors, diagrams, and automation tools.  
It provides a robust, fully Angular-native foundation to create, customize, and manage dynamic node-based structures — with full support for SSR, Standalone Components, and zoneless mode.

🔧 Ideal for internal tools, low-code platforms, process editors, call flows, and custom visual builders.

---

### 🚀 Features at a Glance

- 🧩 **Dynamic Node & Connection Creation** — Create, connect, and manage nodes in real-time
- 🔄 **Reassignable Connections** — Drag to reconnect inputs and outputs
- 🧠 **Event-driven architecture** — React to user interaction via clean APIs
- 🎨 **Customizable Templates** — Use your own components for nodes and connections
- 🖱 **Drag, Zoom, Pan** — Smooth canvas navigation for large graphs
- ⚙️ **SSR + Angular Compatibility** — Works with Angular 12+, SSR, Standalone Components, and Composition API

---

### Examples

Check out real-world use cases built with Foblex Flow:

- 🟢 [Call Center](https://github.com/Foblex/f-flow-example) - A streamlined flow example simulating a call flow.

- 🧱 [Scheme Editor](https://github.com/Foblex/f-scheme-editor) - A more advanced example of a fully interactive scheme editor.

- 💡 [Visual Programming](https://flow.foblex.com/examples/f-visual-programming-flow/) - An example of a visual programming flow.

- 🗄 [DB Management](https://flow.foblex.com/examples/f-db-management-flow/) - An example of a database management flow.

🔗 [Explore all examples](https://flow.foblex.com/examples/overview)
---

### ⚙️ Quick Start

Install via Angular CLI:

```bash
ng add @foblex/flow
```

Minimal usage example:

```html

<f-flow fDraggable>
  <f-canvas>
    <f-connection fOutputId="output1" fInputId="input1"></f-connection>
    <div fNode fDragHandle [fNodePosition]="{ x: 24, y: 24 }" fNodeOutput fOutputId="output1" fOutputConnectableSide="right"> Drag me</div>
    <div fNode fDragHandle [fNodePosition]="{ x: 244, y: 24 }" fNodeInput fInputId="input1" fInputConnectableSide="left"> Drag me</div>
  </f-canvas>
</f-flow>
```

📘 Full documentation: https://flow.foblex.com/docs/get-started

### 🛣 Roadmap

We have a detailed roadmap for the development of Foblex Flow. Check out the [Roadmap](./ROADMAP.md) to see the upcoming features and milestones.

### 💬 Community & Support
-	🌐 [Documentation Portal](https://flow.foblex.com)
-	🗣 [GitHub Discussions](https://github.com/Foblex/f-flow/discussions)
-	🐞 [Issue Tracker](https://github.com/Foblex/f-flow/issues)

Questions, suggestions or bugs? Contact support@foblex.com

### 📄 License

Foblex Flow is MIT licensed — free to use and open for contribution.

## 💬 Support the Project

If Foblex Flow has helped you build something awesome — consider giving it a ⭐️ on GitHub:  
[https://github.com/foblex/flow](https://github.com/foblex/flow)

It helps the project reach more people, keeps development going, and motivates future improvements.

