import {
  defineLazyComponent,
  defineNavigationGroup,
  INavigationGroup,
  provide404Markdown,
  provideComponents,
  provideDirectory,
  provideFooterNavigation,
  provideHeader,
  provideHeaderMediaLinks,
  provideHeaderNavigation,
  provideHeaderSearch,
  provideLanguage,
  provideLogo,
  provideNavigation,
  provideTitle,
  provideTableOfContent,
  provideMeta,
} from '@foblex/m-render';

export const DOCUMENTATION_CONFIGURATION = {
  providers: [
    provideLanguage('en'),
    provideDirectory('./markdown/guides/'),
    provide404Markdown('./markdown/404.md'),
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideNavigation(
      introductionGroup(),
      stylingGroup(),
      conceptsGroup(),
      containerGroup(),
      nodeGroup(),
      connectorGroup(),
      connectionGroup(),
      interactionGroup(),
      helpersGroup(),
      seoPagesGroup(),
    ),
    provideComponents([
      defineLazyComponent(
        'draggable-flow',
        () => import('@foblex/examples/nodes/draggable-flow/example'),
      ),
      defineLazyComponent(
        'custom-nodes',
        () => import('@foblex/examples/nodes/custom-nodes/example'),
      ),
      defineLazyComponent(
        'node-selection',
        () => import('@foblex/examples/nodes/node-selection/example'),
      ),
      defineLazyComponent(
        'drag-handle',
        () => import('@foblex/examples/nodes/drag-handle/example'),
      ),
      defineLazyComponent(
        'drag-start-end-events',
        () =>
          import('@foblex/examples/advanced/drag-start-end-events/example'),
      ),
      defineLazyComponent(
        'add-node-from-palette',
        () =>
          import(
            '@foblex/examples/extensions/add-node-from-palette/example'
          ),
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
        () =>
          import(
            '@foblex/examples/connections/custom-connection-type/example'
          ),
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
      defineLazyComponent(
        'auto-snap',
        () => import('@foblex/examples/connections/auto-snap/example'),
      ),
      defineLazyComponent(
        'connectable-side',
        () => import('@foblex/examples/connectors/connectable-side/example'),
      ),
      defineLazyComponent(
        'connector-inside-node',
        () =>
          import(
            '@foblex/examples/connectors/connector-inside-node/example'
          ),
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
        () =>
          import('@foblex/examples/extensions/help-in-positioning/example'),
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
    ]),
    provideTableOfContent({
      title: 'In this article',
      range: { start: 2, end: 6 },
    }),
    provideHeader(
      provideHeaderSearch(false),
      provideHeaderNavigation([
        {
          link: '/docs/get-started',
          active: '/docs',
          text: 'Docs',
        },
        {
          link: '/examples/overview',
          active: '/examples',
          text: 'Examples',
        },
        {
          link: '/showcase/overview',
          active: '/showcase',
          text: 'Showcase',
        },
        {
          link: '/blog/overview',
          active: '/blog',
          text: 'Articles',
        },
      ]),
      provideHeaderMediaLinks([
        { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
        { icon: 'twitter', link: 'https://x.com/foblexflow' },
      ]),
    ),
    provideFooterNavigation({
      editLink: {
        pattern:
          'https://github.com/foblex/f-flow/edit/main/apps/f-flow-portal/public/markdown/guides/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    }),
    provideMeta({
      url: 'https://flow.foblex.com/docs/intro',
      canonical: 'https://flow.foblex.com/docs/intro',
      type: 'website',
      title: 'Foblex Flow Documentation - Angular-Native Node-Based UI Library',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Official Foblex Flow documentation for Angular node-based UI apps: node editors, workflow builders, diagram interfaces, components, directives, and interaction patterns.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 1688,
      image_height: 937,
      keywords:
        'foblex flow docs, angular node based ui, angular node editor docs, angular workflow builder docs, angular diagram library docs',
      robots: 'index, follow, max-image-preview:large',
      twitter_card: 'summary_large_image',
      twitter_site: '@foblexflow',
      twitter_creator: '@foblexflow',
    }),
  ],
};

function introductionGroup(): INavigationGroup {
  return defineNavigationGroup('Introduction', [
    {
      link: 'intro',
      text: 'Introducing Foblex Flow',
      pageTitle: 'Foblex Flow Docs - Angular-Native Node-Based UI Library',
      description:
        'Learn the core Foblex Flow concepts for building interactive node-based UIs, node editors, and workflow builders in Angular.',
    },
    {
      link: 'get-started',
      text: 'Installation and Rendering',
      pageTitle: 'Get Started with Foblex Flow - Install and Render Your First Flow',
      description:
        'Install Foblex Flow, render your first nodes and connections, and verify the base setup in a few steps.',
    },
    {
      link: 'angular-version-compatibility',
      text: 'Angular Compatibility',
      pageTitle: 'Foblex Flow Angular Version Compatibility Matrix',
      description:
        'Find the correct Foblex Flow line for Angular 12 through Angular 20+, including legacy, transition, and current signal-based releases.',
    },
    {
      link: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md',
      text: 'Changelog',
      pageTitle: 'Foblex Flow Changelog - Releases, Features and Breaking Changes',
      description:
        'Track released features, fixes, and breaking changes before updating your Foblex Flow version.',
    },
    {
      link: 'roadmap',
      text: 'Roadmap',
      pageTitle: 'Foblex Flow Roadmap and Release Timeline',
      description:
        'Track what is planned, what is already on the way, and which releases shipped each major Foblex Flow capability.',
    },
  ]);
}

function seoPagesGroup(): INavigationGroup {
  return defineNavigationGroup('Use Cases', [
    {
      link: 'angular-node-based-ui-library',
      text: 'Angular Node-Based UI Library',
      pageTitle: 'Angular Node-Based UI Library - Why Teams Use Foblex Flow',
      description:
        'See when to use Foblex Flow as an Angular-native node-based UI library for interactive graph interfaces and custom visual editors.',
    },
    {
      link: 'angular-node-editor-library',
      text: 'Angular Node Editor Library',
      pageTitle: 'Angular Node Editor Library - Build Editors with Foblex Flow',
      description:
        'Build node editors in Angular with reusable primitives for nodes, connections, selection, zoom, and advanced editor UX.',
    },
    {
      link: 'angular-workflow-builder',
      text: 'Angular Workflow Builder',
      pageTitle: 'Angular Workflow Builder - Build Visual Workflow Editors',
      description:
        'Use Foblex Flow to build Angular workflow builders with drag-to-connect, validation rules, minimaps, and application-owned state.',
    },
    {
      link: 'angular-diagram-library',
      text: 'Angular Diagram Library',
      pageTitle: 'Angular Diagram Library - Interactive Diagrams with Foblex Flow',
      description:
        'Build interactive Angular diagrams with custom nodes, graph navigation, routing controls, and production-ready interaction helpers.',
    },
    {
      link: 'react-flow-vs-foblex-flow-for-angular-teams',
      text: 'React Flow vs Foblex Flow',
      pageTitle: 'React Flow vs Foblex Flow for Angular Teams',
      description:
        'Compare React Flow and Foblex Flow when your product team needs Angular-native APIs, SSR-aware rendering, and custom graph interactions.',
    },
  ]);
}

function stylingGroup(): INavigationGroup {
  return defineNavigationGroup('Styling', [
    {
      link: 'default-theme-and-styling',
      text: 'Styling Overview',
      pageTitle:
        'Foblex Flow Styling Overview - Default Theme, Mixins and Token-Based Customization',
      description:
        'Start with the shipped theme, understand the SCSS entrypoints, and navigate the styling and customization guides for Foblex Flow.',
    },
    {
      link: 'styling-mixins-and-scoping',
      text: 'Mixins and Scoping',
      pageTitle: 'Foblex Flow Styling Mixins and Scoping - Compose Theme Layers Correctly',
      description:
        'Learn the public SCSS mixins, how `$scoped` and `$selectorless` work, and which interaction layers are opt-in.',
    },
    {
      link: 'styling-tokens-and-overrides',
      text: 'Tokens and Overrides',
      pageTitle: 'Foblex Flow Styling Tokens and Overrides - Customize `--ff-*` Theme Variables',
      description:
        'Override alias tokens, scope themes per editor, and extend light and dark defaults without forking the shipped SCSS layers.',
    },
    {
      link: 'styling-recipes',
      text: 'Styling Recipes',
      pageTitle: 'Foblex Flow Styling Recipes - Practical Theme Composition Patterns',
      description:
        'Use ready-made styling patterns for minimal editors, grouping, external items, custom node shells, and plugin-heavy flows.',
    },
  ]);
}

function conceptsGroup(): INavigationGroup {
  return defineNavigationGroup('Concepts', [
    {
      link: 'event-system',
      text: 'Event System',
      pageTitle: 'Foblex Flow Event System - Drag, Selection and Connection Events',
      description:
        'Understand how drag, selection, connection, and canvas events are emitted and handled in Foblex Flow.',
    },
    {
      link: 'selection-system',
      text: 'Selection System',
      pageTitle: 'Foblex Flow Selection System - Pointer, Box and Programmatic Selection',
      description:
        'Learn how click selection, box selection, multi-select, and programmatic selection work together.',
    },
  ]);
}

function containerGroup(): INavigationGroup {
  return defineNavigationGroup('Containers', [
    {
      link: 'f-flow-component',
      text: 'Flow',
      pageTitle: 'FFlowComponent - Root Container for Angular Node Editors',
      description:
        'Reference for `f-flow`, the root container that hosts flow context and orchestrates rendering and interactions.',
    },
    {
      link: 'f-canvas-component',
      text: 'Canvas',
      pageTitle: 'FCanvasComponent - Viewport, Pan and Scale for Foblex Flow',
      description:
        'Reference for `f-canvas`: viewport container with pan/scale behavior, navigation methods, and canvas state events.',
    },
  ]);
}

function nodeGroup(): INavigationGroup {
  return defineNavigationGroup('Nodes', [
    {
      link: 'f-node-directive',
      text: 'Node',
      pageTitle: 'FNodeDirective - Position, Size, Rotate and Selection for Nodes',
      description:
        'Reference for `fNode`: node identity, transforms, selection, and connector participation in flow layouts.',
    },
    {
      link: 'f-drag-handle-directive',
      text: 'Drag Handle',
      pageTitle: 'FDragHandleDirective - Restrict Node Drag Start Areas',
      description:
        'Use `fDragHandle` to control where dragging starts inside a complex node template.',
    },
    {
      link: 'f-group-directive',
      text: 'Group',
      pageTitle: 'FGroupDirective - Grouping, Parenting and Auto-Size Behaviors',
      description:
        'Reference for `fGroup` parent-child hierarchy, group transforms, and auto-size/auto-expand options.',
    },
    {
      link: 'f-resize-handle-directive',
      text: 'Resize Handle',
      pageTitle: 'FResizeHandleDirective - Directional Resize Handles for Nodes and Groups',
      description:
        'Add and configure directional resize handles with `fResizeHandle` and `EFResizeHandleType`.',
    },
    {
      link: 'f-rotate-handle-directive',
      text: 'Rotate Handle',
      pageTitle: 'FRotateHandleDirective - Rotation Handle for Node and Group Editing',
      description:
        'Use `fRotateHandle` to enable direct rotation interactions for nodes and groups.',
    },
  ]);
}

function connectionGroup(): INavigationGroup {
  return defineNavigationGroup('Connections', [
    {
      link: 'f-connection-component',
      text: 'Connection',
      pageTitle: 'FConnectionComponent - Render and Control Graph Edges',
      description:
        'Reference for persisted connections, line types, styles, content projection, and interaction options.',
    },
    {
      link: 'f-connection-for-create-component',
      text: 'Create Connection',
      pageTitle: 'FConnectionForCreateComponent - Temporary Drag-to-Connect Preview',
      description:
        'Use `f-connection-for-create` as the temporary preview while users drag to create new links.',
    },
    {
      link: 'f-connection-marker-directive',
      text: 'Connection Marker',
      pageTitle: 'FConnectionMarker - Custom SVG Markers for Connection Start and End',
      description:
        'Use built-in or custom SVG connection markers for start, end, selected, and all-state connection visuals.',
    },
    {
      link: 'f-snap-connection-component',
      text: 'Snap Connection',
      pageTitle: 'FSnapConnectionComponent - Auto-Snap Helper for Connection Dragging',
      description:
        'Reference for snapping preview behavior that helps users connect to nearby valid targets.',
    },
    {
      link: 'f-connection-waypoints-component',
      text: 'Connection Waypoints',
      pageTitle: 'FConnectionWaypoints - Edit Intermediate Points on Connection Paths',
      description:
        'Add, move, and remove intermediate waypoint points to shape connection routing explicitly.',
    },
  ]);
}

function connectorGroup(): INavigationGroup {
  return defineNavigationGroup('Connectors', [
    {
      link: 'f-node-output-directive',
      text: 'Output',
      pageTitle: 'FNodeOutputDirective - Source Connectors for Outgoing Connections',
      description:
        'Reference for node output connectors, outgoing rules, and connectability behavior.',
    },
    {
      link: 'f-node-input-directive',
      text: 'Input',
      pageTitle: 'FNodeInputDirective - Target Connectors for Incoming Connections',
      description:
        'Reference for node input connectors, categories, side constraints, and incoming connection states.',
    },
    {
      link: 'f-node-outlet-directive',
      text: 'Outlet',
      pageTitle: 'FNodeOutletDirective - Shared Output Surface for Multiple Sources',
      description:
        'Use `fNodeOutlet` when one shared connector surface should route connection creation across outputs.',
    },
    {
      link: 'connection-rules',
      text: 'Connection Rules',
      pageTitle: 'Connection Rules - Restrict and Validate Allowed Connector Targets',
      description:
        'Define target restrictions using allowed input IDs/categories and expose valid targets during drag-to-connect.',
    },
  ]);
}

function interactionGroup(): INavigationGroup {
  return defineNavigationGroup('Interaction', [
    {
      link: 'f-draggable-directive',
      text: 'Drag and Drop',
      pageTitle: 'FDraggableDirective - Drag, Move, Connect and Reassign Interactions',
      description:
        'Core interaction directive that enables dragging nodes, box selection, creating connections, and reassigning existing connections.',
    },
    {
      link: 'f-external-item-directive',
      text: 'External Item',
      pageTitle: 'FExternalItem - Drag Items from a Palette into the Canvas',
      description:
        'Drag external palette items into the flow to create nodes on drop. Useful for toolboxes, sidebars, and node libraries.',
    },
    {
      link: 'f-zoom-directive',
      text: 'Zoom',
      pageTitle: 'FZoomDirective - Wheel Zoom, Zoom Controls and API Methods',
      description:
        'Configure zoom behavior for large diagrams: mouse wheel zoom, programmatic scale changes, and navigation-friendly defaults.',
    },
    {
      link: 'f-selection-area-component',
      text: 'Selection Area',
      pageTitle: 'FSelectionArea - Rectangle Multi-Select for Nodes and Connections',
      description:
        'Enable drag-to-select with a rectangular selection area. Supports multi-select UX for complex diagrams and editors.',
    },
  ]);
}

function helpersGroup(): INavigationGroup {
  return defineNavigationGroup('Helpers', [
    {
      link: 'f-background-component',
      text: 'Background',
      pageTitle: 'FBackgroundComponent - Scalable Pattern Background for the Canvas',
      description:
        'Render an SVG background behind the canvas with built-in patterns or a custom pattern provider. Scales and moves with the viewport.',
    },
    {
      link: 'f-magnetic-lines-component',
      text: 'Magnetic Lines',
      pageTitle: 'Magnetic Lines - Snap Lines and Alignment Guides While Dragging Nodes',
      description:
        'Show horizontal and vertical alignment guides and optionally snap dragged nodes to edges and centers of nearby nodes.',
    },
    {
      link: 'f-magnetic-rects-component',
      text: 'Magnetic Rects',
      pageTitle: 'Magnetic Rects - Equal Spacing Helpers (Figma-Like) for Node Layout',
      description:
        'Visualize and snap to equal spacing between aligned nodes using helper rectangles. Ideal for clean, consistent layouts.',
    },
    {
      link: 'f-line-alignment-component',
      text: 'Line Alignment (Legacy)',
      pageTitle: 'Line Alignment (Legacy) - Older Alignment Helper',
      description:
        'Legacy alignment helper kept for compatibility. For modern alignment UX, use Magnetic Lines and Magnetic Rects.',
    },
    {
      link: 'f-minimap-component',
      text: 'Minimap',
      pageTitle: 'FMinimapComponent - Overview Map and Quick Navigation',
      description:
        'Render a minimap preview of the entire diagram and navigate quickly across large canvases.',
    },
  ]);
}
