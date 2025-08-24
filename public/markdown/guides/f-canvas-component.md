# Canvas

**Selector:** f-canvas

The **FCanvasComponent** is an Angular component that serves as a container for nodes [fNode](f-node-directive) and connections [f-connection](f-connection-component). It provides a canvas where these elements can be positioned and manipulated, offering features like dynamic positioning, scaling, and rendering optimizations.

## Inputs

- `position: InputSignal<IPoint>;` Sets the position of the canvas. Redraws the canvas when the position changes.

- `scale: InputSignal<number>;` Sets the scaling factor of the canvas. Redraws the canvas when the scale changes.

## Outputs

- `fCanvasChange: OutputEmitterRef<FCanvasChangeEvent>;` Emits an event when there are changes in the canvas state, like position or scale updates.

## Methods

- `fitToScreen(padding: IPoint = { x: 0, y: 0 }, animated: boolean = true): void;` The fitToScreen method automatically adjusts all nodes inside the canvas to fit perfectly within its boundaries, scaling and positioning them to be fully visible and centered. You can specify custom padding to add extra space around the nodes horizontally (x) and vertically (y). This ensures that the nodes are not directly touching the edges of the canvas after resizing. The adjustment can be animated or instant, based on the parameters provided.

- `resetScaleAndCenter(animated: boolean = true): void;` Sets the canvas scale to 1:1, ensuring elements are displayed at actual size and centers the canvas, optionally using animation.

- `centerGroupOrNode(groupOrNodeId: string, animated: boolean = true): void;` Centers the canvas around a group or node with the specified ID, optionally using animation.

- `setScale(value: number, toPoint: IPoint = { x: 0, y: 0 }): void;` Sets the scale level of the canvas, optionally centering around a specified point.

- `getScale(): void;` Returns the current scale level of the canvas.

- `resetScale(): void;` Resets the scale level of the canvas to 1:1.

## Styles

- `.f-component` A general class applied to all F components for shared styling.

- `.f-canvas` Specific class for styling the FCanvasComponent component.
