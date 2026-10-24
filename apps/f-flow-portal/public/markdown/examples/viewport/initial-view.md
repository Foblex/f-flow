---
toc: false
wideContent: true
---

# Initial View

## Description

By default a flow paints as soon as Angular renders it — at the default position and scale — and only then your `(fFullRendered)` handler fits or centers it. The viewport visibly jumps from the top-left corner to the fitted view.

The **initial view** feature removes that jump: the flow renders invisibly (layout and measurements still happen), your handler sets the viewport up, and the flow is revealed only after the transform has been applied. The first visible frame already shows the fitted view.

Two ways to enable it:

- the `fInitialView` input on [f-flow](./docs/f-flow-component):

```html
<f-flow fInitialView (fFullRendered)="loaded()">
  <f-canvas> ... </f-canvas>
</f-flow>
```

- or the `withInitialView()` feature, when you already configure the flow through providers:

```typescript
providers: [provideFFlow(withInitialView())],
```

When the input is bound it takes priority over the provider feature in both directions — `[fInitialView]="false"` turns the feature off even when `withInitialView()` is registered.

The hook stays the same `(fFullRendered)` output you already use:

```typescript
protected loaded(): void {
  this._canvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
}
```

### Notes

- Call the viewport methods with `animated: false` — the reveal then shows the final state. With an animated call the flow is revealed at the start of the animation.
- Without a handler the flow is simply revealed right after the first full render.
- The reveal happens once; later data changes render as usual.
- Large graphs rendered progressively stay invisible until the full render completes — that is the trade-off this feature opts into.

## Example

Press **Replay** to re-create the flow and see it appear already fitted — no jump from the default viewport.

::: ng-component <initial-view></initial-view> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/initial-view/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/initial-view/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/extensions/initial-view/example.scss
:::

## Related docs

- [f-flow Docs](./docs/f-flow-component)
- [f-canvas Docs](./docs/f-canvas-component)
- [Zoom Example](./examples/zoom)
- [Minimap Example](./examples/minimap)
