# Canvas

**Selector:** f-canvas

The **FCanvasComponent** is an Angular component that serves as a container for nodes [fNode](f-node-directive) and connections [f-connection](f-connection-component). It provides a canvas where these elements can be positioned and manipulated, offering features like dynamic positioning, scaling, and rendering optimizations.

## Inputs

- `position: IPoint;` Sets the position of the canvas. Redraws the canvas when the position changes.

- `scale: number;` Sets the scaling factor of the canvas. Redraws the canvas when the scale changes.

## Outputs

- `fCanvasChange: EventEmitter<FCanvasChangeEvent>;` Emits an event when there are changes in the canvas state, like position or scale updates.

## Methods

- `fitToScreen(toCenter?: IPoint, animated?: boolean): void;` Adjusts the canvas to fit the screen, optionally centering around a specified point and using animation.

- `oneToOne(): void;` Sets the canvas scale to 1:1, ensuring elements are displayed at actual size with animation.

## Styles

- `.f-component` A general class applied to all F components for shared styling.

- `.f-canvas` Specific class for styling the FCanvasComponent component.


