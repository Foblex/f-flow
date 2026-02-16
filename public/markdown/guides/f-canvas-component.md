# Canvas

**Selector:** `f-canvas`  
**Class:** `FCanvasComponent`

`f-canvas` is the **viewport layer** inside `f-flow`. It is responsible for the **transform of the whole diagram** - pan (position) and zoom (scale).  
Everything that should move/scale together (nodes, groups, connections) must be placed inside `f-canvas`.

## Role in the flow structure

A typical diagram structure is always:

```html
<f-flow>
  <f-canvas>
    <!-- nodes / groups / connections -->
  </f-canvas>
</f-flow>
```

- `f-flow` is the root container and the integration point for plugins (drag, selection, zoom, helpers, minimap).
- `f-canvas` is the viewport that applies **position + scale** to its content.
- Nodes / groups / connections outside of `f-canvas` **won’t participate** in transforms and interaction logic.

**What you get**

- Pan/zoom transform state for the whole diagram.
- Imperative viewport methods (`fitToScreen`, `centerGroupOrNode`, scale control).
- Debounced `fCanvasChange` notifications for sync with external UI.

## API

### Inputs

- `position: InputSignal<IPoint>;` Canvas position (pan). When it changes, the canvas is redrawn.

- `scale: InputSignal<number>;` Canvas scale (zoom). When it changes, the canvas is redrawn.

- `debounceTime: InputSignal<number>;` Debounce time (ms) for `fCanvasChange`. Values below `0` are normalized to `0`.

### Outputs

- `fCanvasChange: OutputEmitterRef<FCanvasChangeEvent>;` Emits when the canvas transform changes (position/scale). Useful for syncing external UI (toolbar, status).

### Methods

- `redraw(): void;` Triggers an immediate redraw.

- `getPosition(): IPoint;` Returns current canvas position.

- `setPosition(position: IPoint): void;` Sets canvas position.

- `getScale(): number;` Returns current scale.

- `setScale(scale: number, toPosition: IPoint = { x: 0, y: 0 }): void;` Sets scale. Optionally zooms around a point (useful for “zoom to cursor” UX).

- `resetScale(): void;` Resets scale to `1`.

- `resetScaleAndCenter(animated: boolean = true): void;` Resets scale to `1` and centers the viewport.

- `fitToScreen(padding: IPoint = { x: 0, y: 0 }, animated: boolean = true): void;` Fits all nodes/groups into the viewport. Padding adds extra space around content.

- `centerGroupOrNode(groupOrNodeId: string, animated: boolean = true): void;` Centers the viewport on a group or node by id.

### Types

#### IPoint

```typescript
interface IPoint {
  x: number;
  y: number;
}
```

#### FCanvasChangeEvent

```typescript
class FCanvasChangeEvent {
  transform: ITransformModel;
  position: IPoint;
  scale: number;
}
```

#### ITransformModel

```typescript
interface ITransformModel {
  position: IPoint;
  scale: number;
}
```

## Styling

- `.f-component` Base class for flow primitives.
- `.f-canvas` Host class for the canvas layer.
- `.f-connections-container` Connection layer container.
- `.canvas-dragging` Temporary host class used during drag transitions.

## Notes / Pitfalls

- `f-canvas` depends on a parent `f-flow`; using it alone is not supported.
- High-frequency transform updates can flood consumers if `debounceTime` is `0`; use debouncing when syncing external UI.
- Prefer `fitToScreen` or `resetScaleAndCenter` after `fLoaded` so all nodes are already measured.

## Common tasks

### Fit content after the first render

Call viewport helpers after `fLoaded`, when nodes are already measured.

```html
<f-flow (fLoaded)="onLoaded()" fDraggable>
  <f-canvas></f-canvas>
</f-flow>
```

```ts
protected onLoaded(): void {
  this.canvas().fitToScreen({ x: 40, y: 40 }, true);
  // or:
  // this.canvas().resetScaleAndCenter(true);
}
```

### Center a node from a side panel

When a user clicks an item in a list, center the canvas:

```ts
protected focusNode(id: string): void {
  this.canvas().centerGroupOrNode(id, true);
}
```

### Sync external UI

Listen to `fCanvasChange` to reflect current pan/zoom outside the canvas.

```html
<f-canvas (fCanvasChange)="canvasChanged($event)"></f-canvas>
```
