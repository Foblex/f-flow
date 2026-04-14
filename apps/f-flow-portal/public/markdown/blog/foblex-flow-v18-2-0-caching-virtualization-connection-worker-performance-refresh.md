---
title: "Foblex Flow v18.2.0: Caching, Virtualization, Connection Worker, and a Major Performance Refresh"
description: "Foblex Flow v18.2 adds optional caching, progressive virtualization, worker-assisted connection calculation, zoom during drag, and broader redraw optimizations for large Angular editors."
ogType: "article"
twitterCard: "summary_large_image"
summary: "Release notes for fCache, *fVirtualFor, the connection worker, zoom during drag, and large-scene performance improvements."
primaryKeyword: "angular node editor release"
schemaType: "Article"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-09"
updatedAt: "2026-03-09"
---

# Foblex Flow v18.2.0: Caching, Virtualization, Connection Worker, and a Major Performance Refresh

Foblex Flow v18.2 focuses on large-scene performance and heavier redraw scenarios in Angular node editors and workflow builders.

Today I’m shipping **v18.2.0**. This release adds **optional caching**, **progressive virtualization**, a new **Connection Worker**, **zoom during drag**, and a broader redraw pipeline refresh for larger editors.

## Highlights

- ⚡ **`fCache`**: optional flow caching to reduce repeated geometry work.
- 🧱 **`*fVirtualFor`**: progressive rendering for large projected node lists.
- 🧵 **Connection Worker**: worker-assisted connection calculation for heavier diagrams.
- 🔍 **Zoom during drag**: wheel zoom is no longer blocked for the whole drag session.
- 🔄 **Redraw pipeline refresh**: chunked updates and internal rendering improvements for larger scenes.
- 📚 **Examples and docs refresh**: stronger performance demos plus refreshed reference-app positioning.

## New: Optional Cache and Progressive Virtualization

The goal here was not to make the default editor path more complicated.

You can still start with the normal primitives:

- `f-flow`
- `f-canvas`
- nodes
- connectors
- connections

Then, when the scene grows, you can enable extra scaling tools.

### `fCache`

`fCache` lets `f-flow` keep and reuse geometry information instead of recalculating everything again and again during redraw-heavy interactions.

### `*fVirtualFor`

`*fVirtualFor` progressively renders larger projected node lists, which is especially useful in scenes where node count grows quickly.

Minimal shape:

```html
<f-flow fDraggable [fCache]="true">
  <f-canvas fZoom>
    <ng-container ngProjectAs="[fNodes]" *fVirtualFor="let item of items">
      <div fNode [fNodePosition]="item.position">Node</div>
    </ng-container>
  </f-canvas>
</f-flow>
```

I also added a dedicated large-scene example that lets you compare:

- 200 to 5000 nodes
- cache on/off
- virtualization on/off
- node-only vs node+connection workloads

::: ng-component <stress-test></stress-test> [height]="600"
:::

✅ Example: <https://flow.foblex.com/examples/stress-test>

## New: Connection Worker and Redraw Pipeline Refresh

Large editors often do not fail on the node layer first. They fail when connection redraws become too heavy.

In v18.2 I added a **Connection Worker** and reworked the redraw pipeline so larger connection scenes are handled more efficiently overall:

- worker-assisted connection calculation
- separated node / connection change streams
- chunked connection redraws
- better reuse of connection context across redraws
- improved repositioning during node drag and resize flows

To make this easier to evaluate, there is now a dedicated performance example for dense connection redraws:

::: ng-component <stress-test-with-connections></stress-test-with-connections> [height]="600"
:::

✅ Example: <https://flow.foblex.com/examples/stress-test-with-connections>

This one is useful when you want to test:

- many simultaneous connection updates
- routing mode differences
- path type differences
- marker-heavy connection scenes

## Better UX: Zoom During Drag

One smaller feature in the changelog, but a very noticeable one in real usage:

**wheel zoom now stays available during active drag sessions**.

That means you can keep navigating the canvas while interacting with the editor instead of feeling “locked” until the drag finishes.

This improvement applies across supported drag flows such as:

- node dragging
- external item drag
- resize
- rotate
- connection create / reassign
- waypoint drag

## Interaction Internals Also Got Reworked

This release also includes a broader interaction refactor:

- external item handling was reworked
- minimap drag flow was refreshed
- resize and rotate flows were reorganized
- dependent connections stay in sync more consistently while resizing
- minimap rendering now has `fNodeRenderLimit` for very large scenes

So even outside the new APIs, the internal editor behavior is more consistent in heavy scenarios.

## Reference Apps, Examples, and Docs

v18.2 is not only about library internals.

I also used this release window to improve how examples and docs explain the product:

- stronger performance-oriented demos
- cleaner example grouping
- refreshed descriptions around large-scene rendering
- the **AI Low-Code Platform** demo now positioned as the flagship reference app

If you want to see how Foblex Flow looks in a more product-like Angular setup, start here:

✅ AI Low-Code Platform: <https://flow.foblex.com/examples/ai-low-code-platform>

## Important Migration Note

There is one breaking rename around External Item directive classes.

Update imports from:

```ts
import {
  FExternalItemDirective,
  FExternalItemPlaceholderDirective,
  FExternalItemPreviewDirective,
} from '@foblex/flow';
```

to:

```ts
import {
  FExternalItem,
  FExternalItemPlaceholder,
  FExternalItemPreview,
} from '@foblex/flow';
```

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.2.0>
- Large Scene Performance example: <https://flow.foblex.com/examples/stress-test>
- Connection Redraw Performance example: <https://flow.foblex.com/examples/stress-test-with-connections>
- AI Low-Code Platform reference app: <https://flow.foblex.com/examples/ai-low-code-platform>

## Closing

v18.2 is about making Foblex Flow scale better without changing the simple Angular-first starting path.

You should still be able to start small.

But when the editor grows, you now have better tools for:

- larger node scenes
- heavier connection redraws
- smoother interaction during drag
- more consistent rendering behavior

If you’re building a serious node editor in Angular, this release should be worth a look.

And if you like what I’m building, please consider starring the repo ⭐️

Repo: <https://github.com/Foblex/f-flow>
