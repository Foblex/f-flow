---
title: "Foblex Flow v18.5.0: Layout Engines, Explicit Render Lifecycle, and Standalone Reference Apps"
description: "Foblex Flow v18.5 introduces Dagre and ELK layout packages, explicit render lifecycle outputs, standalone reference apps, and a stronger portal/docs toolchain."
ogType: "article"
twitterCard: "summary_large_image"
summary: "Release notes for layout-engine adapters, explicit render lifecycle outputs, standalone reference apps, and the portal/docs refresh."
primaryKeyword: "angular node editor release"
schemaType: "Article"
author: "Siarhei Huzarevich"
publishedAt: "2026-04-14"
updatedAt: "2026-04-14"
---

# Foblex Flow v18.5.0: Layout Engines, Explicit Render Lifecycle, and Standalone Reference Apps

Foblex Flow v18.5.0 is a platform release. It turns several pieces of internal infrastructure into clearer public building blocks that are easier to adopt, reason about, and reuse in real Angular products.

Today I'm shipping **v18.5.0**. This release makes **layout engines** a first-class package story with Dagre and ELK adapters, adds explicit **`fNodesRendered`** and **`fFullRendered`** lifecycle outputs, promotes major demos into **standalone reference apps**, and tightens the portal/docs toolchain around that broader surface.

## Highlights

- 🧭 **Layout engines are now a real integration story** with `@foblex/flow-dagre-layout`, `@foblex/flow-elk-layout`, and dedicated manual plus auto-layout examples.
- ⏱️ **Render lifecycle is now explicit** with separate `fNodesRendered` and `fFullRendered` outputs instead of one implicit post-render moment.
- 🧱 **Reference apps were fully rebuilt as standalone Angular apps** with richer CRUD flows, filtering, custom layouts, embedded forms, and stronger product-style UX.
- 🧪 **Portal and regression coverage were hardened** around prerendering, embedded-page verification, and interaction-heavy Cypress scenarios.
- 🧵 **The connection-worker path was improved and decomposed** into smaller redraw/runtime pieces instead of staying as one larger internal block.

## Layout Engines Are Now a First-Class Story

The biggest structural addition in v18.5.0 is layout.

Instead of treating auto-layout as a one-off example pattern, the release formalizes it as a proper Flow capability:

- `@foblex/flow` provides the shared layout integration surface
- `@foblex/flow-dagre-layout` ships a Dagre adapter
- `@foblex/flow-elk-layout` ships an ELK adapter
- examples now show both **manual** and **auto** layout modes for both engines

That makes the layout story much easier to explain and much easier to copy into a real application.

```ts
import { Component } from '@angular/core';
import { EFLayoutMode, provideFLayout } from '@foblex/flow';
import { DagreLayoutEngine } from '@foblex/flow-dagre-layout';

@Component({
  standalone: true,
  providers: [
    provideFLayout(DagreLayoutEngine, {
      mode: EFLayoutMode.AUTO,
    }),
  ],
  template: '',
})
export class DiagramComponent {}
```

That small provider-level API is the real point of the release. Layout is no longer just "something you can wire up if you know the internals." It is now part of the supported integration model.

::: ng-component <dagre-layout-auto></dagre-layout-auto> [height]="700"
:::

## Render Lifecycle Is Now Explicit

v18.5.0 also makes Flow render timing easier to reason about.

Before this release, post-render orchestration often depended on one broader "the flow is probably ready now" moment. That was workable, but it was not very expressive when an application needed to distinguish between:

- nodes being rendered and measurable
- connections being redrawn and the scene being fully ready

This release introduces two explicit outputs:

- `fNodesRendered`
- `fFullRendered`

That gives application code a cleaner place to hook tasks like:

- fit-to-flow or centering after the node tree exists
- screenshots or external synchronization after connections are also ready
- onboarding or guided interactions that should wait for the full scene

This is the kind of API change that removes timing guesswork rather than adding another workaround for it.

## Reference Apps Were Rebuilt, Not Just Moved

The reference-app work in v18.5.0 is much bigger than a workspace reorganization.

These demos were not just copied into `apps/example-apps/*`. They were rebuilt into fuller product-style examples that can be built, served, embedded, documented, and explored as real Angular applications.

That includes:

- Schema Designer
- UML Diagram
- Tournament Bracket
- Call Center Flow

Each one now demonstrates a different kind of editor problem:

- **Schema Designer** shows table and column CRUD, inline editing, relation creation and reassignment, relation-cardinality editing, and target-aware context menus.
- **UML Diagram** shows grouped architecture maps with layer filters, relation-kind filters, search, selection-driven detail panels, and UML-style markers.
- **Tournament Bracket** shows a domain-specific custom layout engine, multiple bracket modes, selective branch visibility, path highlighting, and stats-driven match detail panels.
- **Call Center Flow** shows palette-based node creation, embedded configuration forms inside nodes, dynamic IVR branching, connection reassignment, and persisted editor plus viewport state.

That matters for two reasons.

First, these examples now behave much more like starter products than demo snippets. Second, they show a wider range of what Foblex Flow can support in practice:

- CRUD-heavy editors
- architecture and system diagrams
- domain-specific custom layout engines
- workflow builders with embedded forms and palette-driven authoring

For users evaluating the library, that is a much stronger proof point than a collection of isolated feature demos.

## Portal, Docs, and Package Boundaries Are Cleaner

This release also includes a broader cleanup around how the repository is organized and shipped.

The workspace is now structured around **Nx `apps/*` and `libs/*` projects**, which fits the growing split between the core package, layout adapters, portal, and standalone reference apps much better than the previous flatter layout.

Around that, v18.5.0 also:

- automates more portal prerender and sitemap work
- verifies embedded reference-app pages more aggressively
- extends Cypress coverage for interaction-heavy editor flows
- fixes group bounds and flow-surface sizing so grouped layouts behave more predictably
- keeps connection markers and redraw behavior inside the main `f-flow` package
- refines the connection-worker path into smaller worker, runtime, and redraw pipeline pieces

That last point matters because this release does not remove the worker-backed redraw strategy. It keeps that path, but restructures it into clearer internal units that are easier to maintain and evolve.

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.5.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Dagre Auto Layout example: <https://flow.foblex.com/examples/dagre-layout-auto>
- ELK.js Auto Layout example: <https://flow.foblex.com/examples/elk-layout-auto>
- Schema Designer reference app: <https://flow.foblex.com/examples/schema-designer>
- UML Diagram reference app: <https://flow.foblex.com/examples/uml-diagram-example>
- Tournament Bracket reference app: <https://flow.foblex.com/examples/tournament-bracket>
- Call Center Flow reference app: <https://flow.foblex.com/examples/call-center>

## Closing

v18.5.0 is the release that makes several recent ideas feel official.

Layout engines now have a supported package story, render timing is more explicit, and the reference apps are structured like real projects. If v18.4.0 improved the feel of the editor, v18.5.0 improves the shape of the platform around it.
