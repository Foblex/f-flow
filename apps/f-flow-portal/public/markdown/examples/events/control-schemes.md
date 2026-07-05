---
toc: false
wideContent: true
publishedAt: "2026-07-03"
updatedAt: "2026-07-03"
---

# Control Schemes

## Description

A control scheme is the mapping between input gestures and canvas actions — which button pans, what the wheel does, how selection starts. Provide one through `provideFFlow(withControlScheme(...))` and it drives dragging, panning, zooming and the selection area together; switch it at runtime through `FControlSchemeController`.

Pick a preset from the toolbar and try it on the canvas.

## Example

::: ng-component <control-schemes></control-schemes> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/control-schemes/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/control-schemes/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/advanced/control-schemes/example.scss
:::

## Presets

- **`F_DEFAULT_CONTROL_SCHEME`** _(default)_ — a drag pans the canvas, the wheel zooms, `Shift`+drag draws a selection rectangle. Matches the library's behavior without the feature.
- **`F_SCROLL_PAN_CONTROL_SCHEME`** _(Miro-like)_ — the wheel and two-finger trackpad scroll pan, `Ctrl`/`Cmd`+wheel or pinch zooms, a drag on the empty canvas selects, a middle-mouse drag pans.
- **`F_DRAG_SELECT_CONTROL_SCHEME`** _(draw.io-like)_ — the wheel zooms, a drag on the empty canvas selects, a middle-mouse drag pans.

## Usage

```typescript
import { provideFFlow, withControlScheme, F_SCROLL_PAN_CONTROL_SCHEME } from '@foblex/flow';

@Component({
  providers: [provideFFlow(withControlScheme(F_SCROLL_PAN_CONTROL_SCHEME))],
})
export class MyFlow {}
```

Switch or tweak the scheme at runtime through the controller:

```typescript
private readonly _controlScheme = inject(FControlSchemeController);

this._controlScheme.setScheme(F_DRAG_SELECT_CONTROL_SCHEME);
this._controlScheme.setScheme({ scrollPan: false }); // override a single gesture
```

A scheme is a plain `IFControlScheme` object — every gesture is an `FEventTrigger` predicate, so you can start from a preset and override individual gestures, or build your own from scratch. See the [Control Scheme guide](./docs/control-scheme) for the full field reference and custom-scheme recipes.

## Supported gestures

- `nodeMove`, `canvasMove`, `selection`, `createConnection`, `reassignConnection`, `nodeResize`, `nodeRotate`: `FEventTrigger` predicates deciding when each interaction starts.
- `scrollPan`: routes the wheel — `true` pans on plain scroll and zooms on `Ctrl`/`Cmd`+wheel or pinch.
- `zoom`: gates wheel zoom.
- The per-instance inputs (`fNodeMoveTrigger`, `fCanvasMoveTrigger`, `fWheelTrigger`, `f-selection-area` `fTrigger`, …) override the active scheme when set.
