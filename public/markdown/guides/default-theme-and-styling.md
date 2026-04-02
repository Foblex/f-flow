# Default Theme and Styling

Foblex Flow ships with a **default SCSS theme** and a **selective SCSS API**.  
Use the default entrypoint when you want the shipped visual system immediately, and switch to mixins when you need tighter control over feature styling, scope, or bundle shape.

## What ships in the package

There are two public styling entry points:

- `@use '@foblex/flow/styles/default';`  
  A ready-to-use default theme.
- `@use '@foblex/flow/styles' as flow-theme;`  
  A selective API built from domain mixins and CSS variables.

The theme is layered like this:

1. **Primitive tokens**: palette, radii, fonts, shadows.
2. **Semantic tokens**: surfaces, borders, text, accents, helper colors.
3. **`--ff-*` alias tokens**: the public variables consumed by runtime primitives.
4. **Domain mixins**: flow/canvas, nodes/groups, connectors, connections, external items, plugins.

For application code, the public contract is:

- the exported mixins from `@foblex/flow/styles`;
- the `--ff-*` alias tokens.

## Fastest way to connect the theme

### `ng add`

```bash
ng add @foblex/flow
```

`ng add` installs the library and also adds `node_modules/@foblex/flow/styles/default.scss` to the app styles when the entry is missing.

### Manual `angular.json` setup

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/@foblex/flow/styles/default.scss"
            ]
          }
        }
      }
    }
  }
}
```

### Import from a global SCSS file

```scss
@use '@foblex/flow/styles/default';
```

`default.scss` is the same as:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.theme-all();
```

## Selective setup with mixins

If you want to compose the theme by feature:

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();
@include flow-theme.flow-canvas();
@include flow-theme.node-group();
@include flow-theme.connector();
@include flow-theme.connection-all();
@include flow-theme.plugins();
```

Add optional layers only when your editor needs them:

```scss
@include flow-theme.external-item-all();
@include flow-theme.grouping();
@include flow-theme.connection-drag-handles-visible();
```

Important details:

- `theme-all()` includes flow/canvas, node/group, connector, connection-all, external-item-all, and plugins.
- `grouping()` is **opt-in** and is not part of `theme-all()`.
- `connection-all()` includes the base drag-handle styling, but **not** always-visible drag handles. Use `connection-drag-handles-visible()` for that behavior.

## Where to place theme code in Angular

The simplest option is a **global stylesheet** such as `src/styles.scss`.

If you apply theme mixins from a component stylesheet, remember that Angular view encapsulation will scope selectors unless you deliberately pierce it. Typical options are:

- place the theme in a global stylesheet;
- use `::ng-deep` for demo/example-level scoping;
- switch that component to `ViewEncapsulation.None`.

In real applications, `theme-tokens()` is usually connected **once** at the application level, while per-editor overrides are done with CSS variables on a wrapper element.

## Read next

- [Styling Mixins and Scoping](styling-mixins-and-scoping)
- [Styling Tokens and Overrides](styling-tokens-and-overrides)
- [Styling Recipes](styling-recipes)

That keeps your app aligned with future theme updates.

## Styling `fConnectionContent`

`fConnectionContent` renders as a normal HTML element with the `.f-connection-content` class. It is not part of the SVG stroke itself, so the safest customization path is to style `.f-connection-content` directly.

The library base styles give it intrinsic width sizing (`inline-size: max-content`), which avoids the usual absolute-positioned shrink-to-fit behavior. If you want wrapped labels, set your own `width` or `max-width`.

```scss
@use '@foblex/flow/styles' as flow-theme;

@include flow-theme.theme-tokens();

::ng-deep f-flow {
  @include flow-theme.connection($scoped: false);

  .f-connection-content {
    background: var(--ff-node-background-color);
    border: 1px solid var(--ff-node-border-color);
    border-radius: var(--ff-node-border-radius);
  }

  .f-connection.f-selected {
    .f-connection-content {
      border-color: var(--ff-connection-content-border-color-selected);
    }
  }
}
```

Available default aliases for this element:

- `--ff-connection-content-color`
- `--ff-connection-content-background-color`
- `--ff-connection-content-border-color`
- `--ff-connection-content-border-color-selected`
- `--ff-connection-content-border-radius`
- `--ff-connection-content-font-size`
- `--ff-connection-content-padding-y`
- `--ff-connection-content-padding-x`

## Where to place custom styles

Use one of these strategies:

- **Global stylesheet** for theme connection and app-wide token overrides.
- **Wrapper-scoped CSS variables** for per-editor themes.
- **Component-local overrides** only when you need a local variation.

If you override connection internals from a component stylesheet, remember that projected SVG/content often requires global styles or `::ng-deep`.

## Notes and pitfalls

- The shipped theme styles **runtime primitives only**. The inner layout of custom node content remains yours.
- `theme-tokens()` should usually be included once per application theme root.
- `default.scss` is best when you want the whole theme quickly.
- Selective mixins are best when some features are lazy-loaded or not present in every editor.
- External item previews/placeholders can be rendered outside the flow subtree. If you theme them, put shared variables high enough in the DOM tree.

## Related docs

- [Installing and Rendering Your First Flow](get-started)
- [External Item](f-external-item-directive)
- [Background](f-background-component)
- [Minimap](f-minimap-component)
- [Selection Area](f-selection-area-component)

## Support Foblex Flow

If this guide saved time in your editor setup, please ⭐ the repo on [GitHub](https://github.com/Foblex/f-flow).
