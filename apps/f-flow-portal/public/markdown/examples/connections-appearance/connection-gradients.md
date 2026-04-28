---
toc: false
wideContent: true
publishedAt: "2026-03-08"
updatedAt: "2026-03-11"
---

# Connection Gradients

## Description

This example focuses on projected gradients for connections. It shows how to keep the base connection lightweight, opt into gradients only where needed, and drive the gradient colors from regular Angular state.

That makes it a good reference when you want richer edge styling without turning every connection into a permanently heavier SVG structure.

## What it demonstrates

- projected `f-connection-gradient`
- connection-local SVG gradient creation
- live start/end color switching with `mat-select`
- fallback to normal single-color connections when no gradient config is projected

## Example

::: ng-component <connection-gradients></connection-gradients> [height]="600"
[example.html] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/custom-connections/example.html
[example.ts] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/custom-connections/example.ts
[example.scss] <<< https://raw.githubusercontent.com/Foblex/f-flow/main/libs/f-examples/connections/custom-connections/example.scss
:::

## When to use it

- Add branded or stateful visual styling to selected connections.
- Keep plain connections cheap while enabling richer edges only where needed.
- Validate the projected gradient API before introducing it into a larger graph editor.

## Related docs

- [Connection Component](./docs/f-connection-component)
- [Connection For Create Component](./docs/f-connection-for-create-component)
- [Snap Connection Component](./docs/f-snap-connection-component)
- [Custom Connection Type Example](./examples/custom-connection-type)
