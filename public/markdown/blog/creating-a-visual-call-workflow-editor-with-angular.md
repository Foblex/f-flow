---
origin: "https://javascript.plainenglish.io/creating-a-visual-call-workflow-editor-with-angular-eb89d08815ff"
originLabel: "Originally published on JavaScript in Plain English"
title: "Creating a visual call workflow editor with Angular"
description: "In this tutorial, we create a visual call workflow editor in Angular using @foblex/flow."
ogType: "article"
twitterCard: "summary_large_image"
---

## Creating a visual call workflow editor with Angular

In this tutorial, we build a visual call-flow editor in Angular using `@foblex/flow`.

### Create project and install dependencies

```bash
ng new call-workflow-editor
npm install @foblex/flow
```

### Defining models

To manage workflow elements, define base models:

```ts
export interface IFlowModel {
  nodes: INodeModel[];
  connections: IConnectionModel[];
}

export interface INodeModel {
  key: string;
  name: string;
  outputs: string[];
  input?: string;
  position: { x: number; y: number };
  type: ENodeType;
}

export interface IConnectionModel {
  key: string;
  from: string;
  to: string;
}
```

### Workflow elements configuration

We define node types and a node metadata map (name, icon, color, outputs):

```ts
export enum ENodeType {
  IncomingCall = 'incoming-call',
  PlayText = 'play-text',
  UserInput = 'user-input',
  ToOperator = 'to-operator',
  Disconnect = 'disconnect',
}

export const NODE_MAP = {
  [ENodeType.IncomingCall]: {
    name: 'Incoming call',
    icon: 'add_call',
    color: '#39b372',
    outputs: 1,
  },
  [ENodeType.UserInput]: {
    name: 'User Input',
    icon: 'call_log',
    color: '#2676ff',
    outputs: 3,
  },
  [ENodeType.PlayText]: {
    name: 'Play text',
    icon: 'wifi_calling_3',
    color: '#AF94FF',
    outputs: 1,
  },
  [ENodeType.ToOperator]: {
    name: 'To operator',
    icon: 'wifi_calling_3',
    color: '#ffb62a',
    outputs: 1,
  },
  [ENodeType.Disconnect]: {
    name: 'Disconnect',
    icon: 'phone_disabled',
    color: '#ff859b',
    outputs: 0,
  },
};
```

### Editor component

Generate the editor component:

```bash
ng generate component workflow-editor
```

Then initialize basic editor state:

```ts
@Component({
  selector: 'workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.scss'],
})
export class WorkflowEditorComponent {
  public flow: IFlowModel = { nodes: [], connections: [] };
  public eConnectableSide = EFConnectableSide;
  public cBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;
  public cType: EFConnectionType = EFConnectionType.SEGMENT;
}
```

### Flow visualization

Render connections and nodes inside `f-flow` / `f-canvas`:

```html
@if (flow) {
  <f-flow fDraggable>
    <f-canvas fZoom>
      @for (connection of flow.connections; track connection.key) {
        <f-connection
          [fBehavior]="cBehavior"
          [fType]="cType"
          [fOutputId]="connection.from"
          [fInputId]="connection.to"
        ></f-connection>
      }

      @for (node of flow.nodes; track node.key) {
        <div
          fNode
          fNodeInput
          [fInputId]="node.input"
          [fInputDisabled]="!node.input"
          [fInputConnectableSide]="eConnectableSide.TOP"
          [fNodePosition]="node.position"
        >
          <div>{{ node.name }}</div>

          @for (output of node.outputs; track output) {
            <div
              fNodeOutput
              [fOutputId]="output"
              [fOutputConnectableSide]="eConnectableSide.BOTTOM"
            ></div>
          }
        </div>
      }
    </f-canvas>
  </f-flow>
}
```

### Adding new nodes

Prepare draggable node templates and handle node creation:

```ts
public possibleNodes = Object.keys(NODE_MAP).map((key: string) => ({
  ...NODE_MAP[key],
  type: key,
}));

public onCreateNode(event: FCreateNodeEvent): void {
  const outputsCount = NODE_MAP[event.data].outputs;
  const outputs = Array.from({ length: outputsCount }).map(() => this.generateId());

  this.flow.nodes.push({
    key: this.generateId(),
    name: NODE_MAP[event.data].name,
    outputs,
    position: event.rect,
    type: event.data,
  });
}

private generateId(): string {
  return `${Math.random().toString(36).substr(2, 9)}`;
}
```

```html
@for (item of possibleNodes; track item) {
  <button fExternalItem [style.color]="item.color" [fData]="item.type">
    {{ item.icon }}
  </button>
}

@if (flow) {
  <f-flow (fCreateNode)="onCreateNode($event)">
    ...flow content
  </f-flow>
}
```

### Editing connections

Enable connection creation/reassignment and process events:

```html
<f-flow
  (fCreateConnection)="onCreateConnection($event)"
  (fReassignConnection)="onReassignConnection($event)"
>
  <f-canvas fZoom>
    <f-connection-for-create></f-connection-for-create>
    ...flow content
  </f-canvas>
</f-flow>
```

```ts
public onCreateConnection(event: FCreateConnectionEvent): void {
  const connection: IConnectionViewModel = {
    from: event.fOutputId,
    to: event.fInputId,
  };

  this.flow.connections.push(connection);
}

public onReassignConnection(event: FReassignConnectionEvent): void {
  const connection = this.flow.connections.find(
    (c) => c.from === event.fOutputId && c.to === event.oldFInputId,
  );

  if (connection) {
    connection.to = event.newFInputId;
  }
}
```

This gives users a flexible way to build and modify call routing logic visually.
