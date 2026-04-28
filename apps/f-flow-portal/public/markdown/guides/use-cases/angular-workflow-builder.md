---
publishedAt: "2026-03-08"
updatedAt: "2026-03-08"
---

# Angular Workflow Builder

Foblex Flow works well as the foundation for an **Angular workflow builder** because it separates editor UX from workflow logic. The library renders and manages the interactive canvas; your application decides which nodes exist, which connections are valid, and how the workflow is stored or executed.

That does not mean you need a huge setup on day one. Most workflow builders start with a small flow surface and add history, minimap, layout helpers, or performance modules later.

## When to use it

This approach fits products such as:

- business process editors,
- marketing or operations automation tools,
- AI workflow and agent orchestration builders,
- call flow or IVR editors,
- data transformation and ETL-style interfaces.

## Why Angular-first workflow teams use it

- You can reuse Angular forms, validators, dialogs, and Material components inside nodes.
- The graph stays in your own state layer, which makes persistence and execution easier.
- You can express workflow constraints with connection rules and custom event handlers instead of patching a black-box editor.
- It scales from a simple prototype to a richer builder with undo/redo, minimap, layout helpers, and optional performance tooling.

## Key capabilities for workflow builders

- Palette-driven node creation with [`fExternalItem`](f-external-item-directive)
- Drag-to-connect with validation and reassign flows
- Connection content, markers, and waypoints for more expressive edges
- Multi-select, zoom, and viewport navigation for larger diagrams
- Layout helpers such as Magnetic Lines and Magnetic Rects

## Related docs and examples

- [AI Low-Code Platform Example](./examples/ai-low-code-platform)
- [Call Workflow Tutorial](./blog/creating-a-visual-call-workflow-editor-with-angular)
- [Connection Rules Docs](connection-rules)
- [Selection Area Docs](f-selection-area-component)
- [Minimap Docs](f-minimap-component)

## GitHub and install

```bash
ng add @foblex/flow
```

For Nx workspaces:

```bash
nx g @foblex/flow:add
```

Or install it manually with the required companion packages:

```bash
npm install @foblex/flow @foblex/platform@^1.0.4 @foblex/mediator@^1.1.3 @foblex/2d@^1.2.2 @foblex/utils@^1.1.1
```

If you are evaluating architecture first, start with [Introducing Foblex Flow](intro) and then inspect the workflow-oriented examples.
