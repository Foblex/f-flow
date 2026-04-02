# Styling Tokens and Overrides

Foblex Flow styling is token-driven.  
The shipped SCSS creates three token layers, but for application-level customization you should usually touch only the final one: **`--ff-*` alias tokens**.

## Token layers

### Primitive tokens

Defined in `primitive-tokens()`.  
These are the raw design values: grayscale, accent palette, radii, fonts, and shadows.

Examples:

- `--ff-gray-800`
- `--ff-blue-500`
- `--ff-radius-4`
- `--ff-shadow-2`

### Semantic tokens

Defined in `semantic-tokens()`.  
These map primitives to UI intent: surfaces, borders, text, selection, minimap, magnetic helpers, and state colors.

Examples:

- `--ff-color-surface-card`
- `--ff-color-border-accent`
- `--ff-color-connection-hover`
- `--ff-color-minimap-view`

### Alias tokens

Defined in `ff-aliases()`.  
These are the variables actually consumed by styling mixins and runtime classes.

Examples:

- `--ff-node-background-color`
- `--ff-group-background-color`
- `--ff-grouping-drop-target-border-color-active`
- `--ff-connector-size`
- `--ff-connection-selected-color`
- `--ff-selection-area-color`

For app code, these alias tokens are the recommended override layer.

## Recommended customization strategy

### 1. Keep the shipped structure

Use the mixins as-is and change only `--ff-*` values:

```scss
:root {
  --ff-node-background-color: #ffffff;
  --ff-node-border-color: rgba(15, 15, 13, 0.12);
  --ff-node-border-color-selected: #2759db;

  --ff-group-background-color: rgba(39, 89, 219, 0.12);
  --ff-group-border-color: rgba(39, 89, 219, 0.22);

  --ff-connector-connected-color: #2759db;
  --ff-outlet-color: #2759db;

  --ff-connection-color: rgba(80, 80, 72, 0.92);
  --ff-connection-hover-color: rgba(39, 89, 219, 0.18);
  --ff-connection-selected-color: #2759db;
}
```

This keeps all shipped selectors and interaction states, but changes the visual identity.

### 2. Scope tokens to one editor

CSS variables cascade, so you can theme a single editor instance:

```html
<section class="billing-editor">
  <f-flow fDraggable>
    <f-canvas>
      <!-- flow content -->
    </f-canvas>
  </f-flow>
</section>
```

```scss
.billing-editor {
  --ff-node-background-color: #fff8ef;
  --ff-node-border-color-selected: #bb8121;
  --ff-connection-selected-color: #bb8121;
  --ff-outlet-color: #bb8121;
  --ff-minimap-node-selected-color: #bb8121;
}
```

This is the preferred way to support multiple branded editors on the same page.

### 3. Extend dark mode

The shipped theme already defines defaults for `.dark` and `[data-theme='dark']`.

Override the same alias layer there:

```scss
.dark,
[data-theme='dark'] {
  --ff-node-background-color: #141412;
  --ff-node-border-color: rgba(255, 255, 255, 0.12);
  --ff-node-border-color-selected: #7db7ff;

  --ff-connection-selected-color: #7db7ff;
  --ff-selection-area-color: rgba(125, 183, 255, 0.16);
  --ff-minimap-view-color: rgba(125, 183, 255, 0.2);
}
```

## Alias token families

These families cover the main public customization surface:

- `--ff-flow-*`
- `--ff-canvas-*`
- `--ff-node-*`
- `--ff-group-*`
- `--ff-grouping-drop-target-*`
- `--ff-handle-*`
- `--ff-connector-*`
- `--ff-outlet-*`
- `--ff-connection-*`
- `--ff-marker-*`
- `--ff-waypoint-*`
- `--ff-background-*`
- `--ff-selection-area-*`
- `--ff-minimap-*`
- `--ff-magnetic-*`
- `--ff-external-item-*`

If you stay within these families, you can usually upgrade the library without forking its internal styling files.

## When to customize semantic or primitive layers instead

Touch the lower layers only when you are building a broader design system around Foblex Flow, for example:

- you want several alias families to inherit from a new shared semantic palette;
- you maintain a library-level theme package;
- you intentionally want to fork the shipped design tokens.

For normal application work, overriding aliases is simpler, safer, and easier to reason about.

## Common token combinations

### Node + group language

```scss
.operations-editor {
  --ff-node-border-radius: 12px;
  --ff-node-shadow: 0 10px 24px rgba(15, 15, 13, 0.08);

  --ff-group-background-color: rgba(39, 89, 219, 0.08);
  --ff-group-border-color: rgba(39, 89, 219, 0.24);
}
```

### Connection emphasis

```scss
.pipeline-editor {
  --ff-connection-width: 3px;
  --ff-connection-color: rgba(39, 89, 219, 0.82);
  --ff-connection-selected-color: #17379d;
  --ff-waypoint-stroke: #17379d;
}
```

### Grouping states

```scss
.builder-editor {
  --ff-grouping-drop-target-border-color: rgba(39, 89, 219, 0.34);
  --ff-grouping-drop-target-border-style: dashed;
  --ff-grouping-drop-target-border-width: 1px;

  --ff-grouping-drop-target-border-color-active: #2759db;
  --ff-grouping-drop-target-border-style-active: double;
  --ff-grouping-drop-target-border-width-active: 3px;
}
```
