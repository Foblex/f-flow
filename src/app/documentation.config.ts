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
      conceptsGroup(),
      containerGroup(),
      nodeGroup(),
      connectorGroup(),
      connectionGroup(),
      interactionGroup(),
      helpersGroup(),
    ),
    provideComponents([
      defineLazyComponent(
        'draggable-flow',
        () => import('../../projects/f-guides-examples/draggable-flow/draggable-flow.component'),
      ),
      defineLazyComponent(
        'custom-nodes',
        () => import('../../projects/f-examples/nodes/custom-nodes/custom-nodes.component'),
      ),
      defineLazyComponent(
        'node-selection',
        () => import('../../projects/f-examples/nodes/node-selection/node-selection.component'),
      ),
      defineLazyComponent(
        'drag-handle',
        () => import('../../projects/f-examples/nodes/drag-handle/drag-handle'),
      ),
      defineLazyComponent(
        'drag-start-end-events',
        () =>
          import('../../projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component'),
      ),
      defineLazyComponent(
        'add-node-from-palette',
        () =>
          import('../../projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component'),
      ),
      defineLazyComponent(
        'zoom',
        () => import('../../projects/f-examples/extensions/zoom/zoom.component'),
      ),
      defineLazyComponent(
        'connection-types',
        () => import('../../projects/f-examples/connections/connection-types/connection-types'),
      ),
      defineLazyComponent(
        'connection-behaviours',
        () =>
          import('../../projects/f-examples/connections/connection-behaviours/connection-behaviours'),
      ),
      defineLazyComponent(
        'custom-connection-type',
        () =>
          import('../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component'),
      ),
      defineLazyComponent(
        'drag-to-connect',
        () => import('../../projects/f-examples/connections/drag-to-connect/drag-to-connect'),
      ),
      defineLazyComponent(
        'drag-to-reassign',
        () => import('../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign'),
      ),
      defineLazyComponent(
        'connection-waypoints',
        () =>
          import('../../projects/f-examples/connections/connection-waypoints/connection-waypoints'),
      ),
      defineLazyComponent(
        'auto-snap',
        () => import('../../projects/f-examples/connections/auto-snap/auto-snap.component'),
      ),
      defineLazyComponent(
        'connectable-side',
        () => import('../../projects/f-examples/connectors/connectable-side/connectable-side'),
      ),
      defineLazyComponent(
        'connector-inside-node',
        () =>
          import('../../projects/f-examples/connectors/connector-inside-node/connector-inside-node.component'),
      ),
      defineLazyComponent(
        'connection-rules',
        () => import('../../projects/f-examples/connectors/connection-rules/connection-rules'),
      ),
      defineLazyComponent(
        'connector-outlet',
        () =>
          import('../../projects/f-examples/connectors/connector-outlet/connector-outlet.component'),
      ),
      defineLazyComponent(
        'connection-markers',
        () => import('../../projects/f-examples/connections/connection-markers/connection-markers'),
      ),
      defineLazyComponent(
        'background-example',
        () =>
          import('../../projects/f-examples/extensions/background-example/background-example.component'),
      ),
      defineLazyComponent(
        'help-in-positioning',
        () =>
          import('../../projects/f-examples/extensions/help-in-positioning/help-in-positioning.component'),
      ),
      defineLazyComponent(
        'magnetic-lines',
        () => import('../../projects/f-examples/extensions/magnetic-lines/magnetic-lines'),
      ),
      defineLazyComponent(
        'magnetic-rects',
        () => import('../../projects/f-examples/extensions/magnetic-rects/magnetic-rects'),
      ),
      defineLazyComponent(
        'selection-area',
        () =>
          import('../../projects/f-examples/extensions/selection-area/selection-area.component'),
      ),
      defineLazyComponent(
        'grouping',
        () => import('../../projects/f-examples/nodes/grouping/grouping'),
      ),
      defineLazyComponent(
        'resize-handle',
        () => import('../../projects/f-examples/nodes/resize-handle/resize-handle.component'),
      ),
      defineLazyComponent(
        'rotate-handle',
        () => import('../../projects/f-examples/nodes/rotate-handle/rotate-handle.component'),
      ),
      defineLazyComponent(
        'minimap-example',
        () =>
          import('../../projects/f-examples/extensions/minimap-example/minimap-example.component'),
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
          text: 'Blog',
        },
      ]),
      provideHeaderMediaLinks([
        { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
        { icon: 'twitter', link: 'https://x.com/foblexflow' },
      ]),
    ),
    provideFooterNavigation({
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    }),
    provideMeta({
      url: 'https://flow.foblex.com/docs/intro',
      canonical: 'https://flow.foblex.com/docs/intro',
      type: 'website',
      title: 'Foblex Flow Documentation - Angular Library for Node-Based Editors',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Official Foblex Flow documentation for Angular node-based editors and diagram UIs: components, directives, interaction systems, and migration guides.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
      keywords:
        'foblex flow docs, angular flowchart documentation, angular diagram library docs, node editor angular, foblex flow guides',
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
      pageTitle: 'Foblex Flow Docs - Angular Library for Node-Based Editors',
      description:
        'Learn the core Foblex Flow concepts for building interactive node-based editors in Angular.',
    },
    {
      link: 'get-started',
      text: 'Installation and Rendering',
      pageTitle: 'Get Started with Foblex Flow - Install and Render Your First Flow',
      description:
        'Install Foblex Flow, render your first nodes and connections, and verify the base setup in a few steps.',
    },
    {
      link: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md',
      text: 'Changelog',
      pageTitle: 'Foblex Flow Changelog - Releases, Features and Breaking Changes',
      description:
        'Track released features, fixes, and breaking changes before updating your Foblex Flow version.',
    },
    {
      link: 'https://github.com/Foblex/f-flow/blob/main/ROADMAP.md',
      text: 'Roadmap',
      pageTitle: 'Foblex Flow Roadmap - Planned and In-Progress Features',
      description:
        'Follow planned, in-progress, and recently completed features to align your roadmap with Foblex Flow evolution.',
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
        'Define reusable SVG markers for connection start and end visuals, including selected-state variants.',
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
      pageTitle: 'FExternalItemDirective - Drag Items from a Palette into the Canvas',
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
