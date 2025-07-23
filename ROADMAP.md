# 🛣 Foblex Flow Roadmap

Welcome to the official development roadmap for **Foblex Flow** — an Angular-native library for building powerful, customizable visual flow editors and diagram systems.

This roadmap outlines the core features planned, currently in progress, and already completed.  
Stay up to date and help shape the future by joining [GitHub Discussions](https://github.com/Foblex/f-flow/discussions).

---

## 🚧 Planned

| Feature                                      | Description                                                                                     |
|---------------------------------------------|-------------------------------------------------------------------------------------------------|
| 🔍 **Pinch-to-Zoom Support**                | Zoom in/out via pinch gestures for enhanced mobile and touch device usability. [↗](https://github.com/Foblex/f-flow/discussions/127) |
| 📐 **Grid-Aware Resize Handles**            | Resize handles will snap to gridlines to ensure precise alignment. [↗](https://github.com/Foblex/f-flow/discussions/130) |

---

## 🚧 In Progress

| Feature                                      | Description                                                                                     |
|---------------------------------------------|-------------------------------------------------------------------------------------------------|
| 🔄 **Freeform Connections**                 | Create connections without explicitly defined inputs/outputs. Connect from/to any node edge. [↗](https://github.com/Foblex/f-flow/discussions/88) |

---

## ✅ Recently Completed

### 🔧 Infrastructure & Tooling
- ⏱ **Debounced `fCanvasChange` Event** — reduce noise by configuring `debounceTime` (2025-07-23)
- 🛠 **Angular Schematics Support** — `ng add` / `ng update` commands for easier setup (2025-05-11)

### 🧱 UX & Interaction
- ✋ **`fDragBlocker` Directive** — block drag interaction in specific UI areas (2025-07-23)
- 🔄 **Fully Rotatable Nodes** — rotate any node freely (2025-04-12)
- ⌨️ **Custom Drag/Zoom Triggers** — define hotkeys and behaviors (2025-02-10)
- 📤 **DragStart / DragEnd Events** — now emit contextual data (2025-02-07)

### 🗂 Editor Features
- 🔁 **Connection Reassignment Refactor** — support reassigning both source and target points (2025-07-23)
- 📬 **`FReassignConnectionEvent` Redesign** — includes both source/target change tracking (2025-07-23)
- 🧭 **Minimap Refactor** — restructured for flexibility, signal support and better input handling (2025-07-23)
- 🧭 **Minimap Navigation** — overview and quick navigation (2024-08-12)
- 🧲 **Snap to Grid & Guides** — align elements during movement (2025-01-13)
- 🎯 **Auto-Attach on Drop** — nodes snap to open connections (2024-12-30)
- 📦 **Node Grouping** — drag-to-group and nested groups (2024-09-16)
- 🔄 **Rounded & Custom Connectors** — shape your own connector logic (2024-04-14)
- 🔍 **Highlight Call Initiators + Zoom Control** (2024-10-30)

---

## 📊 Feature Voting

Help us decide what to build next!  
Visit the [Discussions](https://github.com/Foblex/f-flow/discussions) or [Issues](https://github.com/Foblex/f-flow/issues) and react with 👍 to the features you'd love to see implemented.

We value your feedback and build Foblex Flow **with the community**.

---
