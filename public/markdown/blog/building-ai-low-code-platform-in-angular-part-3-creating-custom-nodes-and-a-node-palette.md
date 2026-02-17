---
origin: "https://javascript.plainenglish.io/building-ai-low-code-platform-in-angular-part-3-creating-custom-nodes-and-a-node-palette-2377435effce"
originLabel: "Originally published on JavaScript in Plain English"
title: "Building AI Low-Code Platform in Angular — Part 3: Creating Custom Nodes and a Node Palette"
description: "In the previous article, we built a basic editor with two nodes and a single connection. Now, let’s take the next step — we’ll add custom Angular node components, interactive connectors, and a simple node palette."
ogType: "article"
twitterCard: "summary_large_image"
---

![](https://cdn-images-1.medium.com/max/1024/1*RYPpEhabtg8HXuDrbcrpKw.png)

### Building AI Low-Code Platform in Angular — Part 3: Creating Custom Nodes and a Node Palette

In the previous article, we built a basic editor with two nodes and a single connection. Now, let’s take the next step — we’ll add custom Angular node components, interactive connectors, and a simple node palette.

It’s not a full low-code platform just yet, but we’re steadily laying the groundwork — from visual customization to dynamic interaction between elements.

### In this part, we’ll implement:

- 🎨 **A [node palette](https://flow.foblex.com/examples/add-node-from-palette)** with icons and labels
- 🧩 **Custom Angular components** for each node
- 🧵 **Connectors** (input/output) with interactive hover effects
- 🔌 **Logic to create nodes and connections** using Foblex Flow events

> 🔧 [View the source code on GitHub](https://github.com/Foblex/Building-AI-Low-Code-Platform3)

### Component Architecture

Our visual flow will be based on three main components:

- Flow — the main Angular component containing [\<f-flow>](https://flow.foblex.com/docs/f-flow-component) and managing all nodes and connections
- Node — a custom Angular component that represents a single node, linked to [Foblex Flow](https://flow.foblex.com/) using the [fNode](https://flow.foblex.com/docs/f-node-directive) directive
- FlowPalette — a sidebar panel containing draggable elements for the canvas

### Continuing from the Previous Project

We’ll continue building on the project from the [previous article.](https://medium.com/@shuzarevich/design-node-based-interfaces-in-angular-a-beginners-guide-with-foblex-flow-b3160ac3edbb)

### Add Icons and Reset Styles

First, we need to load the required fonts and icons. Add the following to your index.html:

```
<link href="https://fonts.googleapis.com/css2?family=Inter&family=Material+Symbols+Outlined" rel="stylesheet"/>
```

Then, reset default styles and apply the base font by adding this to your styles.scss:

```
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
}
```

### Defining Node Models and Initial Data

Let’s begin by defining the models for nodes and connections. Below are the TypeScript interfaces and an example set of 8 node types, which you can expand or customize later as needed:

```
// i-connection.ts
export interface IConnection {
  id: string;
  from: string;
  to: string;
}
```

```
// i-storage-node.ts
export interface IStorageNode {
  name: string;
  icon: string;
  shortDescription: string;
  inputs: string[];
  outputs: string[];
}
```

```
// i-node.ts
import { IStorageNode } from './i-storage-node';

export interface INode extends IStorageNode {
  id: string;
  position: { x: number; y: number };
}
```

Now let’s define a list of available nodes:

```
// data.ts
export const DATA: IStorageNode[] = [
  {
    name: "Start",
    icon: "link",
    shortDescription: "Start: incoming request",
    inputs: [],
    outputs: ["any"]
  },
  {
    name: "AI Parser",
    icon: "code_blocks",
    shortDescription: "Extract JSON fields",
    inputs: ["any"],
    outputs: ["success", "failure"]
  },
  {
    name: "Retry Loop",
    icon: "repeat",
    shortDescription: "Repeat for each item",
    inputs: ["any"],
    outputs: ["any"]
  },
  {
    name: "AI Validator",
    icon: "check_circle",
    shortDescription: "AI data checker",
    inputs: ["parsed", "retry"],
    outputs: ["valid", "invalid"]
  },
  {
    name: "AI Executor",
    icon: "psychology",
    shortDescription: "AI-powered action",
    inputs: ["valid"],
    outputs: ["done"]
  },
  {
    name: "If-Else",
    icon: "fork_right",
    shortDescription: "Conditional branching",
    inputs: ["any"],
    outputs: ["true", "false"]
  },
  {
    name: "Error Handler",
    icon: "error",
    shortDescription: "Error management",
    inputs: ["any"],
    outputs: []
  },
  {
    name: "Logger",
    icon: "terminal",
    shortDescription: "Flow logging",
    inputs: ["any"],
    outputs: []
  }
];
```

### Creating the Node Palette

Next, we’ll create the flow-palette component — a vertical sidebar from which we can drag nodes into the canvas.

Each palette item is a div using the fExternalItem directive, which enables external drag-and-drop support with [**Foblex Flow**](https://flow.foblex.com/).

#### Template (flow-palette.html)

```
@for (node of nodes; track node.name) {
  <div class="palette-node" fExternalItem [fData]="node" [fPreviewMatchSize]="true">
    <span class="icon">{{ node.icon }}</span>
    <span>{{ node.name }}</span>
  </div>
}
```

#### Styles (flow-palette.scss)

```
:host {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: 8px;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

::ng-deep .palette-node {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding: 5px;
  background-color: white;

  .icon {
    font-family: 'Material Symbols Outlined';
    font-size: 20px;
    background: linear-gradient(to right, #4b91f1, #5c2ae8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

> _We use ::ng-deep here because drag preview elements are appended to the document.body. Without it, styles wouldn’t apply to them._

#### Component (flow-palette.ts)

```
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { DATA } from './data';

@Component({
  selector: 'flow-palette',
  imports: [FFlowModule],
  templateUrl: './flow-palette.html',
  styleUrl: './flow-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FlowPalette {
  protected nodes = DATA;
}
```

Now we can add nodes from the palette directly into the flow by handling the following event:

```
<f-flow (fCreateNode)="createNode($event)">
</f-flow>
```

### 📦 Custom Nodes

Each node in the editor will be represented by a dedicated Angular component:

```
@Component({
  selector: 'node',
  ...
})
export class Node {
  public data = input.required<INode>();
}
```

#### Node Template:

```
<div class="connectors inputs">
  @for (connector of data().inputs; track $index) {
    <connector fNodeInput [fInputId]="connector + ' ' + data().id" fInputConnectableSide="left" />
  }
</div>
<div class="connectors outputs">
  @for (connector of data().outputs; track $index) {
    <connector fNodeOutput [fOutputId]="connector + ' ' + data().id" fOutputConnectableSide="right" />
  }
</div>

<div class="header">
  <span class="icon">{{ data().icon }}</span>
  <span>{{ data().name }}</span>
</div>

<div class="description">{{ data().shortDescription }}</div>
```

#### Styles (node.scss):

```
:host {
  position: relative;
  background: #ffffff;
  border-radius: 6px;
  padding: 20px 24px;
  min-width: 180px;
  max-width: 180px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: default;

  &:hover {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  &.f-selected {
    outline: 2px solid #4b91f1;
    outline-offset: -2px;
    box-shadow: 0 0 0 4px rgba(75, 145, 241, 0.12);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 15px;
  }

  .icon {
    font-family: 'Material Symbols Outlined';
    font-size: 20px;
    background: linear-gradient(to right, #4b91f1, #5c2ae8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .description {
    font-size: 13px;
    opacity: 0.7;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: fit-content;
  }

  .connectors {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1;

    &.inputs {
      left: -6px;
      top: 8px;
      bottom: 8px;
      justify-content: start;
    }

    &.outputs {
      right: -6px;
      top: 8px;
      bottom: 8px;
      justify-content: end;
    }
  }
}
```

Each node has **inputs** ([fNodeInput](https://flow.foblex.com/docs/f-node-input-directive)) and **outputs** ([fNodeOutput](https://flow.foblex.com/docs/f-node-output-directive)) — these are small circular components with hover animation and styles for the connected state.

### 🔘 Connector Component

While we could have kept the connector inline inside the node, we’re moving it to a standalone component for better style encapsulation and code separation.

#### Component (connector.ts):

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connector',
  imports: [FFlowModule],
  template: '',
  styleUrl: './connector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Connector {}
```

#### Styles (connector.scss):

```
:host {
  position: relative;
  width: 12px;
  height: 12px;
  min-height: 12px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;

  &.connected {
    background-color: #4b91f1;
    box-shadow: 0 0 0 2px rgba(75, 145, 241, 0.2);
  }

  &:hover {
    transform: scale(1.4);
    box-shadow: 0 0 6px rgba(75, 145, 241, 0.4);
  }
}
```

### 🚀 Dynamically Adding Nodes from the Palette

Up to this point, we’ve been rendering nodes manually — statically defined in the template. Now it’s time to take the next step: we’ll enable users to **dynamically add nodes** by dragging them from the side palette into the canvas.

Here’s how the flow works:

1. The user drags a node from the palette.
2. The fCreateNode event is triggered, giving us information about **what type of node** was added and **where** it should appear.
3. We push the new node into a reactive array — and thanks to @for, it **immediately appears** on the canvas.

#### 1. Storing nodes in a signal

We start by creating a signal to hold the list of all current nodes:

```
protected nodes = signal<INode[]>([]);
```

Signals make the UI reactive — whenever the list updates, the DOM reflects the changes.

#### 2. Handling the fCreateNode event

Now let’s define the method that will run when a new node is added:

```
protected createNode(event: FCreateNodeEvent<IStorageNode>): void {
  this.nodes.update((nodes) => {
    const newNode: INode = {
      ...event.data,
      id: generateGuid(),
      position: event.rect || { x: 0, y: 0 }
    };
    return [...nodes, newNode];
  });
}
```

Here’s what’s happening:

- We extract the node’s metadata from event.data.
- We generate a unique id using generateGuid().
- We use the position passed from the event — this is usually the cursor position on drop.
- We return a new list of nodes with the new one added.

#### 3. Updating the template

Let’s replace the static nodes with a dynamic list rendered using @for:

```
<f-flow fDraggable
        (fCreateNode)="createNode($event)">
  <f-canvas>
    @for (node of nodes(); track node.id) {
      <node
        fNode
        fDragHandle
        [fNodePosition]="node.position"
        [fNodeId]="node.id"
        [data]="node">
      </node>
    }
  </f-canvas>
</f-flow>

<flow-palette />
```

Key notes:

- fDraggable enables node movement inside the canvas.
- fNode links the element to Foblex Flow.
- fDragHandle defines the draggable area inside the node.
- [fNodePosition], [fNodeId], and [data] pass in the necessary parameters for rendering.

#### 🔁 How the flow comes together

When a user drags a node from flow-palette, the fExternalItem directive fires an fCreateNode event. We handle that event in the createNode method, construct a new node object, and append it to the list. Thanks to @for, the UI instantly reflects the change.

#### 🛠 Generating Unique IDs

To ensure each node has a unique identifier, we use a small utility function:

```
export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

### ⚙️ Logic for Creating and Rendering Connections

Now that we can add nodes from the palette, it’s time to implement the next key step: **connecting nodes together** — and rendering those connections inside the canvas.

#### 🧩 What [\<f-connection-for-create>](https://flow.foblex.com/docs/f-connection-for-create-component) Does

This component goes inside \<f-canvas> and renders a **temporary line** when the user starts dragging a connection from an output. It also triggers the fCreateConnection event once the drag ends — either over a valid input or in empty space.

#### 📌 Listening to fCreateConnection and Displaying Connections

Let’s update our Flow component template to handle the connection event and also render all created connections:

```
<f-flow fDraggable
        (fCreateNode)="createNode($event)"
        (fCreateConnection)="createConnection($event)">
  <f-canvas>
    <!-- Visual feedback during dragging -->
    <f-connection-for-create></f-connection-for-create>

    <!-- Render all established connections -->
    @for (connection of connections(); track connection.id) {
      <f-connection [fConnectionId]="connection.id"
                    [fOutputId]="connection.from"
                    [fInputId]="connection.to" />
    }

    <!-- Render all nodes -->
    @for (node of nodes(); track node.id) {
      <node
        fNode
        fDragHandle
        [fNodePosition]="node.position"
        [fNodeId]="node.id"
        [data]="node">
      </node>
    }
  </f-canvas>
</f-flow>

<flow-palette />
```

#### 🔁 Handling the Connection Event

Here’s the method that handles fCreateConnection and stores the connection in a reactive signal:

```
protected connections = signal<IConnection[]>([]);

protected createConnection(event: FCreateConnectionEvent): void {
  if (!event.fInputId) return;

  this.connections.update((connections) => [
    ...connections,
    {
      id: generateGuid(),
      from: event.fOutputId,
      to: event.fInputId
    }
  ]);
}
```

Here’s what’s happening:

- event.fOutputId is the ID of the output connector the user dragged from.
- event.fInputId is the ID of the input the user dropped onto.
- If fInputId is missing (the user released the mouse in empty space), we ignore the event.

### 🖇 Putting It All Together

Now we have a complete cycle in place:

1. Nodes are added from the palette.
2. The user connects outputs to inputs.
3. All valid connections are stored in connections() and **automatically rendered** in the flow via \<f-connection>.

### 🧩 Conclusion

At this stage, our visual editor is starting to look much more like a real low-code platform. We’ve learned how to:

- create custom Angular-based nodes;
- render them inside the canvas;
- drag items from a palette;
- connect nodes visually using interactive connectors;
- store and display the list of all connections.

The key idea in this part is the **separation of logic from visual behavior**. The Foblex Flow library doesn’t manage your state directly — it simply tells you what happened: a node was added, a connection started, or a drag event completed. Everything else remains under your control.

In the next part, we’ll focus on styling and connection behavior. We’ll add curved lines, color schemes, arrows, custom states, and interactions like hover, click, and delete. These enhancements will give your flow editor a polished and professional feel.

## 🙌 Thanks for Your Interest

If you like the project — leave a ⭐ on GitHub, join the discussions, and share your feedback!
