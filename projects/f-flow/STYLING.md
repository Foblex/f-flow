# Styling Guide for `@foblex/flow`

## Introduction

Styling in `@foblex/flow` depends partly on CSS classes applied by the library at runtime.
Observed host/base classes in source include `.f-flow`, `.f-canvas`, `.f-node`, `.f-group`, `.f-connection`, `.f-node-input`, `.f-node-output`, and `.f-node-outlet`.

## Observed Runtime Classes

- Observed in source and examples: `.f-selected` for selected nodes, groups, connections, and minimap items.
- Observed in source: `.f-dragging` is applied during drag sequences. It is used on dragged items and also on the flow host during an active drag sequence.
- Observed in source and examples: `.f-connections-dragging` is applied while connection creation/reassignment is looking for valid targets.
- Observed in source and examples: `.f-connector-connectable` marks connectors that are currently valid connection targets.
- Observed in source: `.f-node-output-connected` and `.f-node-input-connected` mark connectors that are currently connected.
- Observed in source: `.f-node-output-not-connectable` and `.f-node-input-not-connectable` mark connectors that are present but currently not connectable.
- Observed in source: `.f-grouping-drop-active` and `.f-grouping-over-boundary` are applied during drop-to-group interactions.
- Observed in source: `.f-node-dragging-disabled`, `.f-node-selection-disabled`, `.f-group-dragging-disabled`, `.f-group-selection-disabled`, `.f-connection-reassign-disabled`, and `.f-connection-selection-disabled` are host modifier classes for disabled interaction states.
- Observed in source: `.f-node-input-disabled`, `.f-node-output-disabled`, and `.f-node-outlet-disabled` are connector/outlet disabled-state classes.
- Observed in source: `.f-node-input-multiple`, `.f-node-output-multiple`, and `.f-node-output-self-connectable` are connector capability/modifier classes.

## Safe Styling Approach

- Prefer styling your own semantic classes first, then combine them with high-level Foblex host classes.
- Safe selectors usually start from host elements such as `.f-node`, `.f-group`, `.f-connection`, `.f-node-input`, `.f-node-output`, and `.f-node-outlet`.
- For state styling, prefer selectors like `.my-node.f-selected`, `.my-connector.f-node-input-connected`, or `f-flow.f-connections-dragging .f-node-input`.
- Avoid depending on deep internal DOM structure for connections, markers, or helper overlays unless you inspect the runtime DOM in the installed version.
- If you need a very specific selector, inspect the rendered DOM first instead of assuming structure from examples.

## Warnings

- Not every runtime class should be treated as stable public styling API.
- Some classes are clearly internal interaction/animation helpers, for example `.f-canvas-dragging`, `.f-scaled-animate`, `.f-external-item-preview`, and `.f-external-item-placeholder`.
- `.canvas-dragging` is a deprecated compatibility alias. Prefer `.f-canvas-dragging`.
- Example styles prove that a class exists, not that it is guaranteed stable across versions.
- If a class is not verified in source or shipped examples, do not invent it. Say: `not found in @foblex/flow`.
