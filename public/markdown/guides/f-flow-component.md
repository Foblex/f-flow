# Flow

**Selector:** f-flow

The **FFlowComponent** manages the flow of draggable and connectable elements within a visual canvas.  It allows for dynamic creation, positioning, and interaction of elements, supporting features such as element connections, layout calculation, and event handling.  

## Inputs

  - `fFlowId: InputSignal<string>;` The unique identifier for the component instance. Automatically generated. Default: `f-flow-${uniqueId++}`  

## Outputs

 - `fLoaded: OutputEmitterRef<void>;` Emits an event when the flow has fully loaded and initialized. 

## Methods

 - `getNodesBoundingBox(): IRect | null;` Returns the bounding rectangle (`IRect`) that covers **all nodes and groups** on the current canvas.
 
 - `getSelection(): FSelectionChangeEvent;` Returns the current selection state of the flow.
 
 - `selectAll(): void;` Selects all items in the flow.

 - `select(node: string[], connections:[]): void;` Selects the specified nodes and connections in the flow.
 
 - `clearSelection(): void;` Clears the selection state of all nodes and connections in the flow.
 
 - `redraw(): void;` Calls the redraw method on all nodes and connections in the flow.
 
 - `getPositionInFlow(position: IPoint): void;` Returns the position of the point relative to the flow.

 - `getFlowState(): IFFlowState;` Returns all nodes, groups and connections in the flow, including their positions and properties.

## Styles

  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-flow` Specifically targets the **FFlowComponent**, allowing for unique styling.

## Usage

```html
<f-flow [id]="customId" (fLoaded)="loaded()"></f-flow>
```

## Examples

#### Basic Example
  
Example of two connected nodes without dragging functionality. The nodes are connected by a connection line from the output of the first node to the input of the second node.

::: ng-component <simple-flow></simple-flow>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/simple-flow/simple-flow.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/simple-flow/simple-flow.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/simple-flow/simple-flow.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::

#### Adding Dragging Functionality

Let's add the [fDraggable](f-draggable-directive) directive to the f-flow to enable dragging functionality. Also, we need to add the [fDragHandle](f-drag-handle-directive) directive inside [fNode](f-node-directive) to specify the handle for dragging.
::: ng-component <draggable-flow></draggable-flow>
[component.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.html
[component.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.ts
[component.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/draggable-flow/draggable-flow.component.scss
[common.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/projects/f-guides-examples/_flow-common.scss
:::
