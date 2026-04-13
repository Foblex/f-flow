# UML Diagram

UML and architecture-diagram reference app built with Angular and Foblex Flow.

## User-Facing Functionality

- Explore a multi-package UML-style architecture map on a large canvas.
- Drag package groups and contained classes while preserving relationships.
- Filter the view by architectural layer: domain, application, or infrastructure.
- Filter individual relation kinds such as composition, inheritance, or dependency.
- Search across class names, stereotypes, attributes, and methods.
- Select a class to inspect its members and related relations.
- Select a relation to inspect its endpoints, multiplicity, and label.
- Use minimap, zoom, fit-to-screen, reset zoom, theme toggle, and alignment aids.

## Foblex Flow Building Blocks Used

- `f-flow` as the diagram root.
- `f-canvas` with `fZoom` for panning and scaling.
- `fNode` for UML class cards.
- `fGroup` for package containers.
- `fDragHandle` for movable class and package surfaces.
- `fAutoSizeToFitChildren`, `fAutoExpandOnChildHit`, and `fIncludePadding` for package-group behavior.
- `fConnection` for UML relations with explicit input and output ids.
- `fMarker` for custom SVG markers that represent relation semantics.
- `fBackground`, `fCirclePattern`, `fLineAlignment`, and `fMinimap` for canvas clarity and navigation.

## Integration Notes

- The example does not depend on a separate UML engine. It maps UML semantics directly onto Foblex Flow primitives and local Angular state.
- Layer and relation visibility are handled as app state, then projected into filtered node, group, and connection lists.
- Class and relation detail panels show how Flow selection can drive richer side-panel UX in a product-style editor.

## Run Locally

From this directory:

```bash
npm run dev
npm run build
npm run lint
```

Or from the workspace root:

```bash
npx nx serve uml-diagram --configuration development
```

## Source

- Portal page: `https://flow.foblex.com/examples/uml-diagram-example`
- App folder: `apps/example-apps/uml-diagram`
