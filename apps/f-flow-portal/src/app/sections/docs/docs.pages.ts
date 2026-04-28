import { defineLazyComponent, IPageDefinition } from '@foblex/m-render';

/**
 * One entry per page in the /docs section.
 *
 * Adding or renaming a doc = editing this list, nothing else.
 * Sidebar entry, SEO and (when applicable) lazy components live here together.
 *
 * The section uses `appendAppNameToTitle: true`, so each `seo.title` is treated
 * as the long descriptive form and the meta service appends " | Foblex Flow".
 * Pages whose final title must be SHORT (e.g. SEO landing pages) override this
 * with `seo.titleIsFinal: true`.
 */
export const DOCS_PAGES: IPageDefinition[] = [
  // -------- Introduction --------
  {
    slug: 'intro',
    text: 'Introducing Foblex Flow',
    group: 'Introduction',
    seo: {
      title: 'Foblex Flow Docs — Getting Started with Angular Node Editors',
      description:
        'Learn how to build interactive node-based UIs in Angular with Foblex Flow. Custom nodes, drag-to-connect, minimap, undo/redo, and production-grade patterns.',
    },
  },
  {
    slug: 'get-started',
    text: 'Installation and Rendering',
    group: 'Introduction',
    seo: {
      title: 'Get Started with Foblex Flow - Install and Render Your First Flow',
      description:
        'Install Foblex Flow, render your first nodes and connections, and verify the base setup in a few steps.',
    },
  },
  {
    slug: 'angular-version-compatibility',
    text: 'Angular Compatibility',
    group: 'Introduction',
    seo: {
      // Frontmatter override → final title without " | Foblex Flow"
      titleIsFinal: true,
      title: 'Angular Version Compatibility',
      description:
        'Which Foblex Flow version to use with Angular 12 through Angular 20+, including legacy, transition, and current signal-based lines.',
    },
  },
  {
    // External changelog link — slug is a full URL; sidebar renders as external link.
    slug: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md',
    text: 'Changelog',
    group: 'Introduction',
    seo: {
      title: 'Foblex Flow Changelog - Releases, Features and Breaking Changes',
      description:
        'Track released features, fixes, and breaking changes before updating your Foblex Flow version.',
    },
  },
  {
    slug: 'roadmap',
    text: 'Roadmap',
    group: 'Introduction',
    seo: {
      title: 'Foblex Flow Roadmap and Release Timeline',
      description:
        'Track what is planned, what is already on the way, and which releases shipped each major Foblex Flow capability.',
    },
  },

  // -------- Styling --------
  {
    slug: 'default-theme-and-styling',
    text: 'Styling Overview',
    group: 'Styling',
    seo: {
      title: 'Foblex Flow Styling Overview - Default Theme, Mixins and Token-Based Customization',
      description:
        'Start with the shipped theme, understand the SCSS entrypoints, and navigate the styling and customization guides for Foblex Flow.',
    },
  },
  {
    slug: 'styling-mixins-and-scoping',
    text: 'Mixins and Scoping',
    group: 'Styling',
    seo: {
      title: 'Foblex Flow Styling Mixins and Scoping - Compose Theme Layers Correctly',
      description:
        'Learn the public SCSS mixins, how `$scoped` and `$selectorless` work, and which interaction layers are opt-in.',
    },
  },
  {
    slug: 'styling-tokens-and-overrides',
    text: 'Tokens and Overrides',
    group: 'Styling',
    seo: {
      title: 'Foblex Flow Styling Tokens and Overrides - Customize `--ff-*` Theme Variables',
      description:
        'Override alias tokens, scope themes per editor, and extend light and dark defaults without forking the shipped SCSS layers.',
    },
  },
  {
    slug: 'styling-recipes',
    text: 'Styling Recipes',
    group: 'Styling',
    seo: {
      title: 'Foblex Flow Styling Recipes - Practical Theme Composition Patterns',
      description:
        'Use ready-made styling patterns for minimal editors, grouping, external items, custom node shells, and plugin-heavy flows.',
    },
  },

  // -------- Concepts --------
  {
    slug: 'event-system',
    text: 'Event System',
    group: 'Concepts',
    seo: {
      title: 'Foblex Flow Event System - Drag, Selection and Connection Events',
      description:
        'Understand how drag, selection, connection, and canvas events are emitted and handled in Foblex Flow.',
    },
  },
  {
    slug: 'selection-system',
    text: 'Selection System',
    group: 'Concepts',
    seo: {
      title: 'Foblex Flow Selection System - Pointer, Box and Programmatic Selection',
      description:
        'Learn how click selection, box selection, multi-select, and programmatic selection work together.',
    },
  },

  // -------- Containers --------
  {
    slug: 'f-flow-component',
    text: 'Flow',
    group: 'Containers',
    seo: {
      title: 'FFlowComponent - Root Container for Angular Node Editors',
      description:
        'Reference for `f-flow`, the root container that hosts flow context and orchestrates rendering and interactions.',
    },
  },
  {
    slug: 'f-canvas-component',
    text: 'Canvas',
    group: 'Containers',
    seo: {
      title: 'FCanvasComponent - Viewport, Pan and Scale for Foblex Flow',
      description:
        'Reference for `f-canvas`: viewport container with pan/scale behavior, navigation methods, and canvas state events.',
    },
  },

  // -------- Nodes --------
  {
    slug: 'f-node-directive',
    text: 'Node',
    group: 'Nodes',
    seo: {
      title: 'FNodeDirective - Position, Size, Rotate and Selection for Nodes',
      description:
        'Reference for `fNode`: node identity, transforms, selection, and connector participation in flow layouts.',
    },
  },
  {
    slug: 'f-drag-handle-directive',
    text: 'Drag Handle',
    group: 'Nodes',
    seo: {
      title: 'FDragHandleDirective - Restrict Node Drag Start Areas',
      description:
        'Use `fDragHandle` to control where dragging starts inside a complex node template.',
    },
  },
  {
    slug: 'f-group-directive',
    text: 'Group',
    group: 'Nodes',
    seo: {
      title: 'FGroupDirective - Grouping, Parenting and Auto-Size Behaviors',
      description:
        'Reference for `fGroup` parent-child hierarchy, group transforms, and auto-size/auto-expand options.',
    },
  },
  {
    slug: 'f-resize-handle-directive',
    text: 'Resize Handle',
    group: 'Nodes',
    seo: {
      title: 'FResizeHandleDirective - Directional Resize Handles for Nodes and Groups',
      description:
        'Add and configure directional resize handles with `fResizeHandle` and `EFResizeHandleType`.',
    },
  },
  {
    slug: 'f-rotate-handle-directive',
    text: 'Rotate Handle',
    group: 'Nodes',
    seo: {
      title: 'FRotateHandleDirective - Rotation Handle for Node and Group Editing',
      description:
        'Use `fRotateHandle` to enable direct rotation interactions for nodes and groups.',
    },
  },

  // -------- Connectors --------
  {
    slug: 'f-node-output-directive',
    text: 'Output',
    group: 'Connectors',
    seo: {
      title: 'FNodeOutputDirective - Source Connectors for Outgoing Connections',
      description:
        'Reference for node output connectors, outgoing rules, and connectability behavior.',
    },
  },
  {
    slug: 'f-node-input-directive',
    text: 'Input',
    group: 'Connectors',
    seo: {
      title: 'FNodeInputDirective - Target Connectors for Incoming Connections',
      description:
        'Reference for node input connectors, categories, side constraints, and incoming connection states.',
    },
  },
  {
    slug: 'f-node-outlet-directive',
    text: 'Outlet',
    group: 'Connectors',
    seo: {
      title: 'FNodeOutletDirective - Shared Output Surface for Multiple Sources',
      description:
        'Use `fNodeOutlet` when one shared connector surface should route connection creation across outputs.',
    },
  },
  {
    slug: 'connection-rules',
    text: 'Connection Rules',
    group: 'Connectors',
    seo: {
      title: 'Connection Rules - Restrict and Validate Allowed Connector Targets',
      description:
        'Define target restrictions using allowed input IDs/categories and expose valid targets during drag-to-connect.',
    },
  },

  // -------- Connections --------
  {
    slug: 'f-connection-component',
    text: 'Connection',
    group: 'Connections',
    seo: {
      title: 'FConnectionComponent - Render and Control Graph Edges',
      description:
        'Reference for persisted connections, line types, styles, content projection, and interaction options.',
    },
  },
  {
    slug: 'f-connection-for-create-component',
    text: 'Create Connection',
    group: 'Connections',
    seo: {
      title: 'FConnectionForCreateComponent - Temporary Drag-to-Connect Preview',
      description:
        'Use `f-connection-for-create` as the temporary preview while users drag to create new links.',
    },
  },
  {
    slug: 'f-connection-marker-directive',
    text: 'Connection Marker',
    group: 'Connections',
    seo: {
      title: 'FConnectionMarker - Custom SVG Markers for Connection Start and End',
      description:
        'Use built-in or custom SVG connection markers for start, end, selected, and all-state connection visuals.',
    },
  },
  {
    slug: 'f-snap-connection-component',
    text: 'Snap Connection',
    group: 'Connections',
    seo: {
      title: 'FSnapConnectionComponent - Auto-Snap Helper for Connection Dragging',
      description:
        'Reference for snapping preview behavior that helps users connect to nearby valid targets.',
    },
  },
  {
    slug: 'f-connection-waypoints-component',
    text: 'Connection Waypoints',
    group: 'Connections',
    seo: {
      title: 'FConnectionWaypoints - Edit Intermediate Points on Connection Paths',
      description:
        'Add, move, and remove intermediate waypoint points to shape connection routing explicitly.',
    },
  },

  // -------- Interaction --------
  {
    slug: 'f-draggable-directive',
    text: 'Drag and Drop',
    group: 'Interaction',
    seo: {
      title: 'FDraggableDirective - Drag, Move, Connect and Reassign Interactions',
      description:
        'Core interaction directive that enables dragging nodes, box selection, creating connections, and reassigning existing connections.',
    },
  },
  {
    slug: 'f-auto-pan-component',
    text: 'Auto Pan',
    group: 'Interaction',
    seo: {
      title: 'FAutoPanComponent - Edge-Based Viewport Scrolling During Drag',
      description:
        'Add `f-auto-pan` to keep drag sessions moving when the pointer reaches the viewport edge during node drag, connection drag, or selection.',
    },
  },
  {
    slug: 'f-external-item-directive',
    text: 'External Item',
    group: 'Interaction',
    seo: {
      title: 'FExternalItem - Drag Items from a Palette into the Canvas',
      description:
        'Drag external palette items into the flow to create nodes on drop. Useful for toolboxes, sidebars, and node libraries.',
    },
  },
  {
    slug: 'f-zoom-directive',
    text: 'Zoom',
    group: 'Interaction',
    seo: {
      title: 'FZoomDirective - Wheel Zoom, Zoom Controls and API Methods',
      description:
        'Configure zoom behavior for large diagrams: mouse wheel zoom, programmatic scale changes, and navigation-friendly defaults.',
    },
  },
  {
    slug: 'f-selection-area-component',
    text: 'Selection Area',
    group: 'Interaction',
    seo: {
      title: 'FSelectionArea - Rectangle Multi-Select for Nodes and Connections',
      description:
        'Enable drag-to-select with a rectangular selection area. Supports multi-select UX for complex diagrams and editors.',
    },
  },

  // -------- Helpers --------
  {
    slug: 'f-background-component',
    text: 'Background',
    group: 'Helpers',
    seo: {
      title: 'FBackgroundComponent - Scalable Pattern Background for the Canvas',
      description:
        'Render an SVG background behind the canvas with built-in patterns or a custom pattern provider. Scales and moves with the viewport.',
    },
  },
  {
    slug: 'f-magnetic-lines-component',
    text: 'Magnetic Lines',
    group: 'Helpers',
    seo: {
      title: 'Magnetic Lines - Snap Lines and Alignment Guides While Dragging Nodes',
      description:
        'Show horizontal and vertical alignment guides and optionally snap dragged nodes to edges and centers of nearby nodes.',
    },
  },
  {
    slug: 'f-magnetic-rects-component',
    text: 'Magnetic Rects',
    group: 'Helpers',
    seo: {
      title: 'Magnetic Rects - Equal Spacing Helpers (Figma-Like) for Node Layout',
      description:
        'Visualize and snap to equal spacing between aligned nodes using helper rectangles. Ideal for clean, consistent layouts.',
    },
  },
  {
    slug: 'f-line-alignment-component',
    text: 'Line Alignment (Legacy)',
    group: 'Helpers',
    seo: {
      title: 'Line Alignment (Legacy) - Older Alignment Helper',
      description:
        'Legacy alignment helper kept for compatibility. For modern alignment UX, use Magnetic Lines and Magnetic Rects.',
    },
  },
  {
    slug: 'f-minimap-component',
    text: 'Minimap',
    group: 'Helpers',
    seo: {
      title: 'FMinimapComponent - Overview Map and Quick Navigation',
      description:
        'Render a minimap preview of the entire diagram and navigate quickly across large canvases.',
    },
  },

  // -------- Use Cases (SEO landing pages — short final titles, no app-name suffix) --------
  {
    slug: 'angular-node-based-ui-library',
    text: 'Angular Node-Based UI Library',
    group: 'Use Cases',
    seo: {
      titleIsFinal: true,
      title: 'Angular Node-Based UI Library',
      description:
        'Foblex Flow is an Angular-native node-based UI library for teams that want to start simple in Angular and grow into richer graph interfaces later.',
    },
  },
  {
    slug: 'angular-node-editor-library',
    text: 'Angular Node Editor Library',
    group: 'Use Cases',
    seo: {
      titleIsFinal: true,
      title: 'Angular Node Editor Library',
      description:
        'Build Angular node editors with Foblex Flow using a small starting path, then add richer interaction patterns only when you need them.',
    },
  },
  {
    slug: 'angular-workflow-builder',
    text: 'Angular Workflow Builder',
    group: 'Use Cases',
    seo: {
      titleIsFinal: true,
      title: 'Angular Workflow Builder',
      description:
        'Build an Angular workflow builder with Foblex Flow using a simple core flow surface first, then add validation, minimaps, and richer editor features later.',
    },
  },
  {
    slug: 'angular-diagram-library',
    text: 'Angular Diagram Library',
    group: 'Use Cases',
    seo: {
      titleIsFinal: true,
      title: 'Angular Diagram Library',
      description:
        'Use Foblex Flow as an Angular diagram library when you need interactive diagrams with a simple starting path and room for richer graph behavior.',
    },
  },
  {
    slug: 'react-flow-vs-foblex-flow-for-angular-teams',
    text: 'React Flow vs Foblex Flow',
    group: 'Use Cases',
    seo: {
      titleIsFinal: true,
      title: 'React Flow vs Foblex Flow — Honest Comparison for Angular Teams',
      description:
        'Side-by-side comparison of React Flow (with Angular wrapper) and Foblex Flow. Framework fit, bundle size, SSR, migration notes, and when each is the right choice.',
    },
  },
];

/**
 * Components used inside docs markdown via custom container syntax.
 *
 * Kept at section level (escape hatch) — moving each entry to the page that
 * actually uses it can be done incrementally; that requires inspecting each
 * .md to map components -> guides.
 */
export const DOCS_COMPONENTS = [
  defineLazyComponent(
    'draggable-flow',
    () => import('@foblex/examples/nodes/draggable-flow/example'),
  ),
  defineLazyComponent('custom-nodes', () => import('@foblex/examples/nodes/custom-nodes/example')),
  defineLazyComponent(
    'node-selection',
    () => import('@foblex/examples/nodes/node-selection/example'),
  ),
  defineLazyComponent('drag-handle', () => import('@foblex/examples/nodes/drag-handle/example')),
  defineLazyComponent(
    'drag-start-end-events',
    () => import('@foblex/examples/advanced/drag-start-end-events/example'),
  ),
  defineLazyComponent(
    'add-node-from-palette',
    () => import('@foblex/examples/extensions/add-node-from-palette/example'),
  ),
  defineLazyComponent('zoom', () => import('@foblex/examples/extensions/zoom/example')),
  defineLazyComponent(
    'connection-types',
    () => import('@foblex/examples/connections/connection-types/example'),
  ),
  defineLazyComponent(
    'connection-behaviours',
    () => import('@foblex/examples/connections/connection-behaviours/example'),
  ),
  defineLazyComponent(
    'custom-connection-type',
    () => import('@foblex/examples/connections/custom-connection-type/example'),
  ),
  defineLazyComponent(
    'drag-to-connect',
    () => import('@foblex/examples/connections/drag-to-connect/example'),
  ),
  defineLazyComponent(
    'drag-to-reassign',
    () => import('@foblex/examples/connections/drag-to-reassign/example'),
  ),
  defineLazyComponent(
    'connection-waypoints',
    () => import('@foblex/examples/connections/connection-waypoints/example'),
  ),
  defineLazyComponent('auto-snap', () => import('@foblex/examples/connections/auto-snap/example')),
  defineLazyComponent(
    'connectable-side',
    () => import('@foblex/examples/connectors/connectable-side/example'),
  ),
  defineLazyComponent(
    'connector-inside-node',
    () => import('@foblex/examples/connectors/connector-inside-node/example'),
  ),
  defineLazyComponent(
    'connection-rules',
    () => import('@foblex/examples/connectors/connection-rules/example'),
  ),
  defineLazyComponent(
    'connector-outlet',
    () => import('@foblex/examples/connectors/connector-outlet/example'),
  ),
  defineLazyComponent(
    'connection-markers',
    () => import('@foblex/examples/connections/connection-markers/example'),
  ),
  defineLazyComponent(
    'background-example',
    () => import('@foblex/examples/extensions/background-example/example'),
  ),
  defineLazyComponent(
    'help-in-positioning',
    () => import('@foblex/examples/extensions/help-in-positioning/example'),
  ),
  defineLazyComponent(
    'magnetic-lines',
    () => import('@foblex/examples/extensions/magnetic-lines/example'),
  ),
  defineLazyComponent(
    'magnetic-rects',
    () => import('@foblex/examples/extensions/magnetic-rects/example'),
  ),
  defineLazyComponent(
    'selection-area',
    () => import('@foblex/examples/extensions/selection-area/example'),
  ),
  defineLazyComponent('grouping', () => import('@foblex/examples/nodes/grouping/example')),
  defineLazyComponent(
    'resize-handle',
    () => import('@foblex/examples/nodes/resize-handle/example'),
  ),
  defineLazyComponent(
    'rotate-handle',
    () => import('@foblex/examples/nodes/rotate-handle/example'),
  ),
  defineLazyComponent(
    'minimap-example',
    () => import('@foblex/examples/extensions/minimap-example/example'),
  ),
];
