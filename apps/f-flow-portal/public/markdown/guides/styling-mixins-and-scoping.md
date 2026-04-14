# Styling Mixins and Scoping

This page describes the **public SCSS API** exported from:

```scss
@use '@foblex/flow/styles' as flow-theme;
```

## Theme entrypoints

### `theme-tokens()`

Emits the shipped token layers:

- primitive tokens;
- semantic tokens;
- `--ff-*` alias tokens.

In a typical application, include this **once** per document or once per isolated theme scope.

### `theme-all($scoped: true)`

Emits the main shipped theme stack:

- `flow-canvas()`
- `node-group()`
- `connector()`
- `connection-all()`
- `external-item-all()`
- `plugins()`

Important: `theme-all()` does **not** include `grouping()` or `connection-drag-handles-visible()`. Those layers stay opt-in because they change interaction affordances.

## Core mixins

- `flow($scoped: true)` styles the root `f-flow` host.
- `canvas($scoped: true)` styles `.f-canvas`.
- `flow-canvas($scoped: true)` applies both.

Use `flow-canvas()` unless you have a specific reason to split those two layers.

## Node and group mixins

- `node($scoped: true, $selectorless: false)`
- `group($scoped: true, $selectorless: false)`
- `grouping($scoped: true)`
- `drag-handle($scoped: true)`
- `resize-handle($scoped: true)`
- `rotate-handle($scoped: true)`
- `node-group($scoped: true)`

Notes:

- `node-group()` includes node, group, drag-handle, resize-handle, and rotate-handle.
- `grouping()` is separate on purpose. It styles the drop-target states used while dragging into nodes/groups:
  - `.f-grouping-drop-active`
  - `.f-grouping-over-boundary`
- `grouping()` only becomes visible while the flow host is in `.f-dragging`.

## Connector mixins

- `connector-sockets($scoped: true, $selectorless: false)`
- `connector-outlet($scoped: true)`
- `connector($scoped: true)`

`connector()` includes both socket and outlet styling.

## Connection mixins

- `connection($scoped: true)`
- `connection-markers($scoped: true)`
- `connection-waypoints($scoped: true)`
- `connection-drag-handles($scoped: true)`
- `connection-drag-handles-visible($scoped: true)`
- `connection-all($scoped: true)`

Notes:

- `connection()` also styles `.f-connection-content`, because connection labels/widgets are regular HTML attached to an edge.
- `connection-all()` includes `connection-drag-handles()`, not `connection-drag-handles-visible()`.
- `connection-drag-handles-visible()` is an opt-in UX layer for editors where drag handles should always be visible rather than only styled when rendered by interaction state.

## External item mixins

- `external-item($scoped: true)`
- `external-item-preview($scoped: true)`
- `external-item-placeholder($scoped: true)`
- `external-item-all($scoped: true)`

These classes are usually rendered outside the flow host, so in practice they behave like global utility styling.

## Plugin mixins

- `background($scoped: true)`
- `selection-area($scoped: true)`
- `minimap($scoped: true)`
- `magnetic-lines($scoped: true)`
- `magnetic-rects($scoped: true)`
- `plugins($scoped: true)`

`plugins()` includes all shipped plugin styling layers.

## How `$scoped` works

When `$scoped: true`:

- selectors are emitted under `f-flow, .f-flow`;
- the theme becomes self-scoped to flow roots.

When `$scoped: false`:

- raw selectors are emitted;
- the mixin is meant to be nested under your own wrapper selector.

Example:

```scss
@use '@foblex/flow/styles' as flow-theme;

.billing-editor {
  @include flow-theme.flow-canvas($scoped: false);
  @include flow-theme.node-group($scoped: false);
  @include flow-theme.connector($scoped: false);
  @include flow-theme.connection-all($scoped: false);
}
```

That pattern is especially useful in component-local stylesheets and in pages that host multiple visually different editors.

## How `$selectorless` works

`$selectorless: true` is available for:

- `node()`
- `group()`
- `connector-sockets()`

Use it when you already own the selector and want to inject the shipped frame styles directly into it.

Example:

```scss
@use '@foblex/flow/styles' as flow-theme;

.task-card {
  @include flow-theme.node($selectorless: true);
  width: 240px;
  text-align: left;
}
```

Without `$selectorless: true`, the mixin would emit `.f-node { ... }`.  
With `$selectorless: true`, it applies the node frame to `.task-card` itself.

## Angular component stylesheet pattern

In Angular component styles with default view encapsulation, a practical pattern is:

```scss
@use '@foblex/flow/styles' as flow-theme;

::ng-deep {
  @include flow-theme.theme-tokens();
}

::ng-deep .editor-shell {
  @include flow-theme.flow-canvas($scoped: false);
  @include flow-theme.node-group($scoped: false);
  @include flow-theme.connector($scoped: false);
  @include flow-theme.connection-all($scoped: false);
}
```

If you do not want `::ng-deep`, move the theme to a global stylesheet or use `ViewEncapsulation.None`.
