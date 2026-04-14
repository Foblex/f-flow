---
title: "Foblex Flow v18.3.0: Projected Connection Gradients, Smarter Redraws, and Production Worker Hardening"
description: "Foblex Flow v18.3 introduces projected connection gradients, reduces redundant redraw work, fixes connection worker production loading, and refreshes roadmap/docs guidance."
ogType: "article"
twitterCard: "summary_large_image"
summary: "Release notes for projected f-connection-gradient, smarter connection redraw caching, and production-safe connection worker startup."
primaryKeyword: "angular node editor release"
schemaType: "Article"
author: "Siarhei Huzarevich"
publishedAt: "2026-03-17"
updatedAt: "2026-03-17"
---

# Foblex Flow v18.3.0: Projected Connection Gradients, Smarter Redraws, and Production Worker Hardening

Foblex Flow v18.3.0 finishes the connection-model work that started around projected rendering and large-scene performance.

Today I’m shipping **v18.3.0**. This release makes **connection gradients explicitly projected**, removes more **redundant redraw work** for unchanged connections, fixes **connection worker startup in production builds**, and refreshes the roadmap and docs around the new model.

## Highlights

- 🎨 **Projected `f-connection-gradient`** is now the supported way to configure connection gradients.
- ⚡ **Smarter redraw caching** skips repeated marker regeneration and repeated line initialization for unchanged routes.
- 🧵 **Production worker hardening** starts the connection worker from a blob URL instead of requesting a `.ts` worker file.
- 📚 **Docs and roadmap refresh** now explain the new connection model more clearly.

## Projected Connection Gradients Are Now the Model

Before this release, gradient colors could live directly on the connection components.

In v18.3.0, gradient configuration is now projected through `f-connection-gradient`, which makes the connection template more explicit and keeps visual configuration alongside other projected connection content.

Old shape:

```html
<f-connection
  fOutputId="out-1"
  fInputId="in-1"
  fStartColor="#4f46e5"
  fEndColor="#06b6d4"
></f-connection>
```

New shape:

```html
<f-connection fOutputId="out-1" fInputId="in-1">
  <f-connection-gradient
    fStartColor="#4f46e5"
    fEndColor="#06b6d4"
  ></f-connection-gradient>
</f-connection>
```

This is the main migration point in the release.

::: ng-component <connection-gradients></connection-gradients> [height]="700"
:::

## Smarter Redraws for Unchanged Connections

This release also trims more internal redraw work when the effective connection output did not actually change.

That includes:

- skipping marker regeneration when the marker signature is unchanged
- skipping repeated `setLine()` and `initialize()` work when the route signature is unchanged
- keeping gradient DOM ids stable per connection instance
- reducing extra DOM writes when gradient coordinates and colors did not change

This is not a new API headline like `fCache`, but it matters in editors that already redraw many connections during drag, resize, reassignment, or viewport movement.

## Production Worker Hardening

v18.2 introduced the connection worker for heavier redraw scenarios.

In real production deployments, that exposed a packaging problem: some builds could end up requesting `worker/f-connection.worker.ts` directly, which then failed with a MIME-type error after deployment.

In v18.3.0, the worker runtime is started from a self-contained **blob URL** instead. That removes the external `.ts` worker request and makes the production startup path much safer.

This release also keeps the worker opt-in behavior intact. The change is about **how the runtime is loaded**, not about forcing the worker on by default.

## Docs and Roadmap Refresh

I also used this release to tighten the surrounding docs:

- updated `f-connection`, `f-connection-for-create`, and `f-snap-connection` guides
- refreshed the connection gradients example page
- rebuilt the roadmap docs around release history instead of a vague future-only list
- added a dedicated release article for this version

That should make it easier to answer two common questions:

- what changed in the connection model?
- which releases introduced which major capabilities?

## Migration Note

If you use connection gradients today, the main migration is straightforward:

1. Remove gradient color inputs from the connection component.
2. Add a projected `f-connection-gradient` child.
3. Keep the rest of the connection structure unchanged.

## Release Links

- Release: <https://github.com/Foblex/f-flow/releases/tag/v18.3.0>
- Changelog: <https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md>
- Connection Gradients example: <https://flow.foblex.com/examples/connection-gradients>
- Roadmap: <https://flow.foblex.com/docs/roadmap>

## Closing

v18.3.0 is a smaller release than v18.2.0, but it is an important one.

It locks in the projected gradient model, removes more unnecessary connection work, and makes the production worker path safe enough for real deployments.

If you are already on the v18 line, this is the release that makes the newer connection architecture feel more complete.
