# Styling Recipes

This page shows practical styling patterns built from the shipped SCSS API.

## Recipe: minimal editor styling

Use this when your editor needs the standard flow shell, nodes, connectors, connections, and helper plugins:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.flow-canvas();
@include flow-theme.node-group();
@include flow-theme.connector();
@include flow-theme.connection-all();
@include flow-theme.plugins();
```

That is the same base stack used by the default theme, except that it is connected explicitly in your stylesheet.

## Recipe: editor with drag-to-group highlighting

`grouping()` is separate because not every editor supports drop-to-group UX.

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.flow-canvas();
@include flow-theme.node-group();
@include flow-theme.grouping();
@include flow-theme.connector();
@include flow-theme.connection-all();
```

This adds styling for the runtime classes used during drag-to-group:

- `.f-grouping-drop-active`
- `.f-grouping-over-boundary`

Customize them with:

- `--ff-grouping-drop-target-border-color`
- `--ff-grouping-drop-target-border-style`
- `--ff-grouping-drop-target-border-width`
- `--ff-grouping-drop-target-border-color-active`
- `--ff-grouping-drop-target-border-style-active`
- `--ff-grouping-drop-target-border-width-active`

## Recipe: palette / external-item styling

If you use palette drag-and-drop or create nodes from external items, add:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.external-item-all();
```

This covers:

- `.f-external-item`
- `.f-external-item-preview`
- `.f-external-item-placeholder`

The external-item classes are usually rendered outside `f-flow`, so this styling is often placed at the application level.

## Recipe: custom node shell with shipped node frame

Use `$selectorless: true` when you want the shipped node frame on a custom host selector:

```scss
@use '@foblex/flow/styles' as flow-theme;

.task-card {
  @include flow-theme.node($selectorless: true);
  width: 280px;
  text-align: left;
}
```

That pattern is useful when your node body is built from Angular Material, custom cards, or a more application-specific component shell.

## Recipe: custom group shell

The same pattern works for groups:

```scss
@use '@foblex/flow/styles' as flow-theme;

.swimlane-group {
  @include flow-theme.group($selectorless: true);
  min-width: 320px;
}
```

## Recipe: component-local editor styles in Angular

If you want an editor-specific theme inside a component stylesheet:

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

.editor-shell {
  --ff-node-background-color: #fffaf2;
  --ff-node-border-color-selected: #bb8121;
  --ff-connection-selected-color: #bb8121;
}
```

If you would rather avoid `::ng-deep`, move the mixins to a global stylesheet or use `ViewEncapsulation.None`.

## Recipe: connections with markers, waypoints, and visible drag handles

Use the connection layers independently when your editor needs more explicit edge affordances:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.flow-canvas();
@include flow-theme.node-group();
@include flow-theme.connector();
@include flow-theme.connection();
@include flow-theme.connection-markers();
@include flow-theme.connection-waypoints();
@include flow-theme.connection-drag-handles-visible();
```

This is more explicit than `connection-all()` and makes it obvious that always-visible drag handles are part of the intended UX.
