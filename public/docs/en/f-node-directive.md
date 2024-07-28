**Selector:** [fNode] 

The **FNodeDirective** is a directive that represents a node within a flow of elements. It is capable of interacting with other nodes and connectors, and can be dynamically positioned and styled.

## Inputs

  - `fNodeId: string;` The unique identifier for the directive instance. Automatically generated. Default: `f-node-${uniqueId++}`

  - `fNodePosition: IPoint;` Sets the position of the node. Redraws the node when the position changes.

  - `fNodeDraggingDisabled: boolean;` Indicates whether the node cannot be dragged. Default: `false`

  - `fNodeSelectionDisabled: boolean;`  Indicates whether the node cannot be selected. Default: `false`

## Outputs

 - `fNodePositionChange: EventEmitter<IPoint>;` Emits an event when the position of the node changes.  

## Methods

 - `refresh(): void;` Refreshes the state of the node, typically triggering a re-render or update.

## Styles
  - `.f-component` A general class applied to all F components for shared styling.

  - `.f-node` Class specific to the node directive, providing styles for node representation.

  - `.f-node-dragging-disabled` Class applied to the node when `fNodeDraggingDisabled=true`.

  - `.f-node-selection-disabled` Class applied to the node when `fNodeSelectionDisabled=true`.

  - `.f-selected` Class applied to the node when it is selected.

## Usage

```html
<f-flow>
  <f-canvas>
    |:|<div fNode [fNodePosition]="{ x: 100, y: 200 }" [fNodeId]="customNodeId"></div>|:|
  </f-canvas>
</f-flow>
```
