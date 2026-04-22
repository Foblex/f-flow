# MRender: Markdown Renderer for Angular

**MRender** is an Angular library for rendering Markdown-based documentation with SSR support, built-in Angular components, customizable UI, and extended syntax.

---

## 🚀 Features

- Render `.md` files in Angular apps
- Extended syntax: `ng-component`, `code-group`, `preview-group`, alert blocks (`tip`, `info`, `danger`, etc.)
- Fully SSR-compatible
- Embed Angular components inside markdown
- Provider-based configuration for documentation
- Lazy loading of examples
- Built-in Table of Contents, SEO and meta support

---

## 📦 Installation

```bash
npm install @foblex/m-render
```

---

## 🧩 Usage

### Documentation Configuration

```ts
import {
  provideDirectory, provideNavigation, provideComponents,
  provideTableOfContent, provideHeader, provideFooterNavigation,
  provideMeta
} from '@foblex/m-render';

export const DOCUMENTATION_CONFIGURATION = {
  providers: [
    provideDirectory('./markdown/guides/'),
    provideNavigation(...),
    provideComponents([...]),
    provideTableOfContent({ title: 'In this article', range: { start: 2, end: 6 } }),
    provideHeader(...),
    provideFooterNavigation(...),
    provideMeta({ ... }),
  ],
};
```

### Route Setup

```ts
import { provideDocumentation } from '@foblex/m-render';

export const routes: Routes = [
  {
    path: 'docs',
    loadChildren: () => import('@foblex/m-render').then((m) =>
      m.DOCUMENTATION_ROUTES.map((route) => ({
        ...route,
        providers: [provideDocumentation(DOCUMENTATION_CONFIGURATION)],
      }))
    ),
  },
];
```

---

## ✨ Markdown Extensions

### `ng-component`

Render Angular components or external URLs (via `iframe`) with optional height and linked source code:

```markdown
::: ng-component <component-selector></component-selector> [height]="YOUR EXAMPLE HEIGHT"
[component.ts] <<< /assets/component.ts
[component.html] <<< /assets/component.html
:::
```

```markdown
::: ng-component [url]="https://example.com" [height]="60vh"
[component.ts] <<< /assets/component.ts
:::
```

`ng-component` supports full-screen mode out of the box for both Angular previews and iframe previews.

### `code-group`

Group multiple code snippets into tabs:

````markdown
::: code-group
```ts [Component]
console.log('Component code');
```

```html [Template]
<div>Hello</div>
```
:::
````

### `preview-group`

Display preview groups with filters:

```markdown
::: preview-group
[Nodes]
[Connectors]
[Connections]
:::
```

### Alerts

Use `tip`, `danger`, `info`, etc.:

```markdown
::: tip Title
This is a tip block
:::
```

---

## 🧑‍💻 Contributing

Open for contributions, feedback and PRs.

GitHub: [https://github.com/Foblex/m-render](https://github.com/Foblex/m-render)

---

## 🧾 License

[MIT](./LICENSE)

---

## Inspiration

The design and layout of MRender were heavily inspired by [VitePress](https://vitepress.dev), an open-source static site generator for Vue by Evan You.  
MRender is a complete reimplementation in Angular, but its UI and structure intentionally follow VitePress for familiarity and clarity.
