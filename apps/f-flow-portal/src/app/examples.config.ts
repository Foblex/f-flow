import {
  defineLazyComponent,
  defineNavigationGroup,
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
  provideMeta,
  provideNavigation,
  provideTableOfContent,
  provideTitle,
} from '@foblex/m-render';

export const EXAMPLES_CONFIGURATION = {
  providers: [
    provideLanguage('en'),
    provideDirectory('./markdown/examples/'),
    provide404Markdown('./markdown/404.md'),
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideNavigation(
      overviewGroup(),
      nodesGroup(),
      connectorGroup(),
      connectionGroup(),
      extensionGroup(),
      pluginsGroup(),
      advancedGroup(),
      proExamplesGroup(),
    ),
    provideComponents([
      defineLazyComponent(
        'custom-nodes',
        () => import('@foblex/examples/nodes/custom-nodes/example'),
      ),
      defineLazyComponent(
        'drag-handle',
        () => import('@foblex/examples/nodes/drag-handle/example'),
      ),
      defineLazyComponent(
        'resize-handle',
        () => import('@foblex/examples/nodes/resize-handle/example'),
      ),
      defineLazyComponent(
        'rotate-handle',
        () => import('@foblex/examples/nodes/rotate-handle/example'),
      ),
      defineLazyComponent('grouping', () => import('@foblex/examples/nodes/grouping/example')),
      defineLazyComponent(
        'drag-to-group',
        () => import('@foblex/examples/nodes/drag-to-group/example'),
      ),
      defineLazyComponent(
        'stress-test',
        () => import('@foblex/examples/nodes/stress-test/example'),
      ),
      defineLazyComponent(
        'stress-test-with-connections',
        () =>
          import(
            '@foblex/examples/nodes/stress-test-with-connections/example'
          ),
      ),
      defineLazyComponent(
        'node-selection',
        () => import('@foblex/examples/nodes/node-selection/example'),
      ),
      defineLazyComponent(
        'node-as-connector',
        () => import('@foblex/examples/connectors/node-as-connector/example'),
      ),
      defineLazyComponent(
        'connector-inside-node',
        () =>
          import(
            '@foblex/examples/connectors/connector-inside-node/example'
          ),
      ),
      defineLazyComponent(
        'connector-outlet',
        () => import('@foblex/examples/connectors/connector-outlet/example'),
      ),
      defineLazyComponent(
        'limiting-connections',
        () =>
          import('@foblex/examples/connectors/limiting-connections/example'),
      ),
      defineLazyComponent(
        'connection-rules',
        () => import('@foblex/examples/connectors/connection-rules/example'),
      ),
      defineLazyComponent(
        'connectable-side',
        () => import('@foblex/examples/connectors/connectable-side/example'),
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
        'create-node-on-connection-drop',
        () =>
          import(
            '@foblex/examples/connections/create-node-on-connection-drop/example'
          ),
      ),
      defineLazyComponent(
        'remove-connection-on-drop',
        () =>
          import(
            '@foblex/examples/connections/remove-connection-on-drop/example'
          ),
      ),
      defineLazyComponent(
        'assign-node-to-connection-on-drop',
        () =>
          import(
            '@foblex/examples/connections/assign-node-to-connection-on-drop/example'
          ),
      ),
      defineLazyComponent(
        'auto-snap',
        () => import('@foblex/examples/connections/auto-snap/example'),
      ),
      defineLazyComponent(
        'connection-types',
        () => import('@foblex/examples/connections/connection-types/example'),
      ),
      defineLazyComponent(
        'connection-waypoints',
        () => import('@foblex/examples/connections/connection-waypoints/example'),
      ),
      defineLazyComponent(
        'custom-connection-type',
        () =>
          import(
            '@foblex/examples/connections/custom-connection-type/example'
          ),
      ),
      defineLazyComponent(
        'connection-behaviours',
        () => import('@foblex/examples/connections/connection-behaviours/example'),
      ),
      defineLazyComponent(
        'connection-markers',
        () => import('@foblex/examples/connections/connection-markers/example'),
      ),
      defineLazyComponent(
        'connection-content',
        () => import('@foblex/examples/connections/connection-content/example'),
      ),
      defineLazyComponent(
        'connection-gradients',
        () =>
          import('@foblex/examples/connections/custom-connections/example'),
      ),
      defineLazyComponent(
        'connection-connectable-side',
        () =>
          import(
            '@foblex/examples/connections/connection-connectable-side/example'
          ),
      ),
      defineLazyComponent(
        'dagre-layout',
        () => import('@foblex/examples/plugins/dagre-layout/example'),
      ),
      defineLazyComponent(
        'dagre-layout-auto',
        () => import('@foblex/examples/plugins/dagre-layout-auto/example'),
      ),
      defineLazyComponent(
        'elk-layout',
        () => import('@foblex/examples/plugins/elk-layout/example'),
      ),
      defineLazyComponent(
        'elk-layout-auto',
        () => import('@foblex/examples/plugins/elk-layout-auto/example'),
      ),
      defineLazyComponent(
        'selection-area',
        () => import('@foblex/examples/extensions/selection-area/example'),
      ),
      defineLazyComponent(
        'auto-pan',
        () => import('@foblex/examples/extensions/auto-pan/example'),
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
      defineLazyComponent('zoom', () => import('@foblex/examples/extensions/zoom/example')),
      defineLazyComponent(
        'minimap-example',
        () => import('@foblex/examples/extensions/minimap-example/example'),
      ),
      defineLazyComponent(
        'background-example',
        () => import('@foblex/examples/extensions/background-example/example'),
      ),
      defineLazyComponent(
        'schema-designer',
        () => import('./reference-app-previews/schema-designer.preview'),
      ),
      defineLazyComponent(
        'uml-diagram-example',
        () => import('./reference-app-previews/uml-diagram-example.preview'),
      ),
      defineLazyComponent(
        'tournament-bracket',
        () => import('./reference-app-previews/tournament-bracket.preview'),
      ),
      defineLazyComponent(
        'grid-system',
        () => import('@foblex/examples/extensions/grid-system/example'),
      ),
      defineLazyComponent(
        'copy-paste',
        () => import('@foblex/examples/advanced/copy-paste/example'),
      ),
      defineLazyComponent(
        'undo-redo',
        () => import('@foblex/examples/advanced/undo-redo/example'),
      ),
      defineLazyComponent(
        'undo-redo-v2',
        () => import('@foblex/examples/advanced/undo-redo-v2/example'),
      ),
      defineLazyComponent(
        'add-node-from-palette',
        () =>
          import(
            '@foblex/examples/extensions/add-node-from-palette/example'
          ),
      ),
      defineLazyComponent(
        'drag-start-end-events',
        () =>
          import('@foblex/examples/advanced/drag-start-end-events/example'),
      ),
      defineLazyComponent(
        'custom-event-triggers',
        () =>
          import('@foblex/examples/advanced/custom-event-triggers/example'),
      ),
      defineLazyComponent(
        'ai-low-code-platform',
        () => import('@foblex/pro-examples/ai-low-code-platform/ai-low-code-platform'),
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
          'https://github.com/foblex/f-flow/edit/main/apps/f-flow-portal/public/markdown/examples/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    }),
    provideMeta({
      url: 'https://flow.foblex.com/examples/overview',
      canonical: 'https://flow.foblex.com/examples/overview',
      type: 'website',
      title: 'Foblex Flow Examples - Angular Node Editors and Workflow Builders',
      app_name: 'Foblex Flow',
      locale: 'en_US',
      description:
        'Explore Angular examples for node editors, workflow builders, interactive diagrams, layout helpers, and production-style graph interfaces built with Foblex Flow.',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 1688,
      image_height: 937,
      keywords:
        'foblex flow examples, angular node editor examples, angular workflow builder examples, angular diagram examples, graph ui angular demos',
      robots: 'index, follow, max-image-preview:large',
      twitter_card: 'summary_large_image',
      twitter_site: '@foblexflow',
      twitter_creator: '@foblexflow',
    }),
  ],
};

function overviewGroup() {
  return defineNavigationGroup('Introduction', [
    {
      link: 'overview',
      text: 'Overview',
      pageTitle: 'Foblex Flow Examples - Angular Node Editors and Workflow Builders',
      description:
        'Explore the strongest Foblex Flow examples for Angular node editors, workflow builders, interactive diagrams, and advanced graph UX.',
      image: './previews/examples/examples-overview.light.png',
      image_dark: './previews/examples/examples-overview.dark.png',
      image_width: 1612,
      image_height: 1392,
      image_type: 'image/png',
    },
  ]);
}

function nodesGroup() {
  return defineNavigationGroup('Nodes', [
    {
      link: 'custom-nodes',
      text: 'Custom Nodes',
      pageTitle: 'Angular Flowchart Example – Custom Nodes with Ports, Styles & Events',
      image: './previews/examples/custom-nodes.light.png',
      image_dark: './previews/examples/custom-nodes.dark.png',
      description:
        'Create custom nodes in Angular flowcharts: ports, styles, templates and events. Practical example with reusable code.',
      image_width: 795,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'drag-handle',
      text: 'Drag Handle',
      pageTitle: 'Angular Diagram Example – Node Drag Handle for Precise Movement',
      image: './previews/examples/drag-handle.light.png',
      image_dark: './previews/examples/drag-handle.dark.png',
      description:
        'Add a drag handle to nodes for precise movement. Clean UX patterns and Angular code you can reuse.',
      image_width: 795,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-07-19 13:00:22'),
    },
    {
      link: 'node-selection',
      text: 'Node Selection',
      pageTitle: 'Angular Diagram Example – Node Selection & Multi-Select with Foblex Flow',
      description:
        'Select single and multiple nodes in Angular with click-based and keyboard-modified interactions. Solid base for batch actions, grouping, and richer editor UX.',
      image: './previews/examples/node-selection.light.png',
      image_dark: './previews/examples/node-selection.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-07-19 17:23:21'),
    },
    {
      link: 'resize-handle',
      text: 'Resize Handle',
      pageTitle: 'Angular Diagram Example – Resizable Nodes with Resize Handles',
      image: './previews/examples/resize-handle.light.png',
      image_dark: './previews/examples/resize-handle.dark.png',
      description:
        'Make Angular diagram nodes resizable with dedicated handles. Useful for notes, groups, panels, and richer node-based UI layouts.',
      image_width: 801,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'rotate-handle',
      text: 'Rotate Handle',
      pageTitle: 'Angular Diagram Example – Node Rotation Handles with Constraints',
      image: './previews/examples/rotate-handle.light.png',
      image_dark: './previews/examples/rotate-handle.dark.png',
      description:
        'Rotate Angular diagram nodes with a dedicated handle. Clear orientation control for design-like editors, architecture views, and custom canvas tools.',
      image_width: 795,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-23 20:56:08'),
    },
    {
      link: 'grouping',
      text: 'Grouping',
      pageTitle: 'Angular Flowchart Example – Node Grouping & Nested Structures',
      image: './previews/examples/grouping.light.png',
      image_dark: './previews/examples/grouping.dark.png',
      description:
        'Group nodes and build nested structures with auto-sizing and padding. Includes smart geometry tips and Angular example.',
      image_width: 1612,
      image_height: 1198,
      image_type: 'image/png',
      date: new Date('2025-08-23 16:04:08'),
    },
    {
      link: 'drag-to-group',
      text: 'Drag to Group',
      pageTitle: 'Angular Diagram Example – Drag Nodes into Groups with Foblex Flow',
      image: './previews/examples/drag-to-group.light.png',
      image_dark: './previews/examples/drag-to-group.dark.png',
      description:
        'Drag nodes into groups in Foblex Flow, create nested hierarchies, and build dynamic structures with auto-sizing, padding, and drop events in Angular.',
      image_width: 1616,
      image_height: 1208,
      image_type: 'image/png',
      date: new Date('2025-08-23 16:04:08'),
    },
  ]);
}

function connectorGroup() {
  return defineNavigationGroup('Connectors', [
    {
      link: 'node-as-connector',
      text: 'Node as Connector',
      pageTitle: 'Angular Diagram Example – Use a Node as a Connector',
      description:
        'Use the node itself as a connector in Angular graph UIs. A compact pattern for slot-based builders, touch-friendly editors, and dense canvases.',
      image: './previews/examples/node-as-connector.light.png',
      image_dark: './previews/examples/node-as-connector.dark.png',
      image_width: 726,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'connector-inside-node',
      text: 'Connector Inside Node',
      pageTitle: 'Angular Diagram Example – Place Connectors Inside Nodes',
      description:
        'Place connectors inside Angular nodes to keep ports close to the fields or actions they represent. A practical pattern for compact editor UIs.',
      image: './previews/examples/connector-inside-node.light.png',
      image_dark: './previews/examples/connector-inside-node.dark.png',
      image_width: 726,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'connector-outlet',
      text: 'Connector Outlet',
      pageTitle: 'Angular Diagram Example – Connector Outlet for Branching Nodes',
      description:
        'Use outlet connectors to control where edges leave a node. Cleaner fan-out, clearer branching, and better routing for Angular workflow builders.',
      image: './previews/examples/connector-outlet.light.png',
      image_dark: './previews/examples/connector-outlet.dark.png',
      image_width: 726,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'limiting-connections',
      text: 'Limiting Connections',
      pageTitle: 'Angular Diagram Example – Limit Connections per Port or Node',
      description:
        'Restrict how many connections a node or port can accept in Angular. Enforce graph rules early and prevent invalid or messy states.',
      image: './previews/examples/limiting-connections.light.png',
      image_dark: './previews/examples/limiting-connections.dark.png',
      image_width: 726,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'connection-rules',
      text: 'Connection Rules',
      pageTitle: 'Connection Rules in Angular Flow Diagrams',
      description:
        'Learn how to restrict and validate connections between nodes in Angular flow diagrams with Foblex Flow using IDs, categories, and visual feedback.',
      image: './previews/examples/connection-rules.light.png',
      image_dark: './previews/examples/connection-rules.dark.png',
      image_width: 1607,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-09-13 15:04:46'),
    },
    {
      link: 'connectable-side',
      text: 'Connectable Side',
      pageTitle:
        'Angular Diagram Connectors – Control Connectable Sides (Top, Right, Bottom, Left)',
      description:
        'Control how nodes connect by defining allowed sides (top, right, bottom, left) or using automatic calculation. Includes manual switching and dynamic side detection for Angular diagrams.',
      image: './previews/examples/connectable-side.light.png',
      image_dark: './previews/examples/connectable-side.dark.png',
      image_width: 1540,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-09-29 14:17:29'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
  ]);
}

function connectionGroup() {
  return defineNavigationGroup('Connections', [
    {
      link: 'drag-to-connect',
      text: 'Drag to Connect',
      image: './previews/examples/drag-to-connect.light.png',
      image_dark: './previews/examples/drag-to-connect.dark.png',
      description:
        'Let users create edges by dragging between ports. Validation, snapping and UX details with Angular code.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'drag-to-reassign',
      text: 'Drag to Reassign',
      image: './previews/examples/drag-to-reassign.light.png',
      image_dark: './previews/examples/drag-to-reassign.dark.png',
      description:
        'Reassign connections by dragging edges to new nodes. Guard rules and smooth UX in Angular diagrams.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-08-23 16:04:08'),
    },
    {
      link: 'create-node-on-connection-drop',
      text: 'Create Node on Connection Drop',
      pageTitle: 'Angular Workflow Builder Example – Create a Node on Connection Drop',
      description:
        'Create a new node when a dragged connection is dropped into empty space. A fast, product-style pattern for Angular workflow builders.',
      image: './previews/examples/create-node-on-connection-drop.light.png',
      image_dark: './previews/examples/create-node-on-connection-drop.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'remove-connection-on-drop',
      text: 'Remove Connection on Drop',
      pageTitle: 'Angular Diagram Example – Remove Connections on Drop',
      description:
        'Remove an existing connection as part of drag-and-drop editing. Useful for faster rewiring and cleaner Angular graph UX.',
      image: './previews/examples/remove-connection-on-drop.light.png',
      image_dark: './previews/examples/remove-connection-on-drop.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 16:04:08'),
    },
    {
      link: 'assign-node-to-connection-on-drop',
      text: 'Assign Node to Connection on Drop',
      pageTitle: 'Angular Workflow Builder Example – Insert a Node into a Connection',
      description:
        'Drop a node onto an existing edge to insert it into the graph. A practical pattern for Angular workflow builders and AI pipelines.',
      image: './previews/examples/assign-node-to-connection-on-drop.light.png',
      image_dark: './previews/examples/assign-node-to-connection-on-drop.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-12-30 15:26:54'),
    },
    {
      link: 'auto-snap',
      text: 'Auto Snap',
      description:
        'Auto-snap connections to nearest ports or nodes. Magnetic behavior, UX tips and Angular example.',
      image: './previews/examples/auto-snap.light.png',
      image_dark: './previews/examples/auto-snap.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-01-31 17:16:33'),
    },
    {
      link: 'connection-types',
      pageTitle:
        'Different Connection types in Foblex Flow Charts – Straight, Segment, Bezier, Adaptive Curve',
      text: 'Connection Types (Straight, Segment, Bezier, Adaptive Curve)',
      description:
        'Explore different connection types in Angular diagrams: straight, segment, bezier, and adaptive curve. Learn how to adjust offset and radius, and discover when each type works best. Includes visuals and a guide for creating custom connection types.',
      image: './previews/examples/connection-types.light.png',
      image_dark: './previews/examples/connection-types.dark.png',
      image_width: 1596,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-10-12 20:12:01'),
    },
    {
      link: 'custom-connection-type',
      text: 'Custom Connection Type',
      pageTitle: 'Angular Diagram Example – Custom Connection Type in Foblex Flow',
      description:
        'Define a reusable custom connection type with its own rendering and interaction model. Useful when different edge classes carry different meaning.',
      image: './previews/examples/custom-connection-type.light.png',
      image_dark: './previews/examples/custom-connection-type.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 20:12:01'),
    },
    {
      link: 'connection-behaviours',
      text: 'Connection Behaviours',
      pageTitle: 'Angular Diagram Example – Custom Connection Behaviours',
      description:
        'Apply different behaviors to different connections in the same Angular editor. Useful for mixed graphs with strict and flexible edge rules.',
      image: './previews/examples/connection-behaviours.light.png',
      image_dark: './previews/examples/connection-behaviours.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-03 00:50:53'),
    },
    {
      link: 'connection-markers',
      text: 'Connection Markers',
      description:
        'Use built-in or custom SVG connection markers, including normal and selected-state variants, in Angular flowcharts.',
      image: './previews/examples/connection-markers.light.png',
      image_dark: './previews/examples/connection-markers.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-06 14:49:44'),
    },
    {
      link: 'connection-content',
      text: 'Connection Content',
      pageTitle: 'Angular Diagram Example – Connection Content on Edges',
      description:
        'Attach custom content (labels, icons, buttons) to diagram connections in Angular with Foblex Flow. Control position, offset and alignment for interactive flowcharts.',
      image: './previews/examples/connection-content.light.png',
      image_dark: './previews/examples/connection-content.dark.png',
      image_width: 1572,
      image_height: 1204,
      image_type: 'image/png',
      date: new Date('2025-09-15 18:23:26'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'connection-waypoints',
      pageTitle:
        'Connection Waypoints in Foblex Flow – Add and Drag Waypoints for Any Connection Type',
      text: 'Connection Waypoints',
      description:
        'Learn how to control connection routing with Waypoints in Angular diagrams. Add waypoints from candidates, drag them to reshape connections, and bind waypoint data via [(waypoints)]. Works with straight, segment, bezier, and adaptive-curve connections.',
      image: './previews/examples/connection-waypoints.light.png',
      image_dark: './previews/examples/connection-waypoints.dark.png',
      image_width: 1570,
      image_height: 1202,
      image_type: 'image/png',
      date: new Date('2026-01-25 12:00:00'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'connection-gradients',
      text: 'Connection Gradients',
      pageTitle: 'Angular Diagram Example – Projected Connection Gradients',
      description:
        'Configure projected SVG gradients for Angular diagram connections and switch start/end colors live in a focused Foblex Flow example.',
      image: './previews/examples/custom-connections.light.png',
      image_dark: './previews/examples/custom-connections.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2026-03-11 12:00:00'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'connection-connectable-side',
      text: 'Connection Connectable Side',
      pageTitle:
        'Angular Diagram Connections – Control Connection Sides (Top, Right, Bottom, Left, Calculate)',
      description:
        'Control how connections attach to nodes by defining start and end sides (top, right, bottom, left) or using automatic calculation modes. Demonstrates manual side switching and dynamic side determination for Angular diagrams.',
      image: './previews/examples/connection-connectable-side.light.png',
      image_dark: './previews/examples/connection-connectable-side.dark.png',
      image_width: 1596,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-10-11 14:17:29'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
  ]);
}

function extensionGroup() {
  return defineNavigationGroup('Extensions', [
    {
      link: 'auto-pan',
      text: 'Auto Pan',
      description:
        'Pan the viewport automatically while dragging near the edge. Includes connection create/reassign, node drag, external items, and selection area.',
      image: './previews/examples/auto-pan.light.png',
      image_dark: './previews/examples/auto-pan.dark.png',
      image_width: 2120,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-03-26 13:00:00'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'add-node-from-palette',
      text: 'Add Node from Palette',
      description:
        'Drag nodes from an external palette into the canvas. Data binding, events and Angular implementation.',
      image: './previews/examples/add-node-from-palette.light.png',
      image_dark: './previews/examples/add-node-from-palette.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-09 12:37:27'),
    },
    {
      link: 'selection-area',
      text: 'Selection Area',
      description:
        'Add multi-select with a rubber-band box and keyboard modifiers. Accessibility and performance tips in Angular.',
      image: './previews/examples/selection-area.light.png',
      image_dark: './previews/examples/selection-area.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-06 13:57:22'),
    },
    {
      link: 'help-in-positioning',
      text: 'Help in Positioning (Legacy)',
      pageTitle: 'Angular Diagram Example – Legacy Node Alignment Helpers (Deprecated)',
      description:
        'Legacy node alignment helper example kept for reference. For new projects, use Magnetic Lines and Magnetic Rects instead.',
      image: './previews/examples/help-in-positioning.light.png',
      image_dark: './previews/examples/help-in-positioning.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-09 12:37:27'),
      badge: {
        text: 'Deprecated',
        type: 'danger',
      },
    },
    {
      link: 'magnetic-lines',
      text: 'Magnetic Lines',
      pageTitle: 'Angular Node Editor – Magnetic Snap Lines & Alignment Guides (Foblex Flow)',
      description:
        'Magnetic snap lines for Angular diagrams: align nodes by edges and centers while dragging. Clean UX, configurable thresholds, and a ready-to-use Foblex Flow example.',
      image: './previews/examples/magnetic-lines.light.png',
      image_dark: './previews/examples/magnetic-lines.dark.png',
      image_width: 1591,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-02-15 12:00:00'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'magnetic-rects',
      text: 'Magnetic Rects',
      pageTitle: 'Angular Node Editor – Equal Spacing Guides (Figma-Like) with Magnetic Rects',
      description:
        'Figma-like equal spacing for Angular diagrams. Magnetic rectangles visualize gaps and snap nodes to consistent spacing while keeping alignment lines. Includes configurable thresholds and a full Foblex Flow implementation.',
      image: './previews/examples/magnetic-rects.light.png',
      image_dark: './previews/examples/magnetic-rects.dark.png',
      image_width: 1591,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-02-15 12:00:00'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'grid-system',
      text: 'Grid System',
      description:
        'Add a configurable grid with snapping for precise positioning. Lightweight Angular example and code.',
      image: './previews/examples/grid-system.light.png',
      image_dark: './previews/examples/grid-system.dark.png',
      image_width: 770,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-09 12:37:27'),
    },
    {
      link: 'minimap',
      text: 'Minimap',
      description:
        'Show a minimap to navigate large diagrams. Viewport sync, performance tips and Angular example.',
      image: './previews/examples/minimap-example.light.png',
      image_dark: './previews/examples/minimap-example.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-07-23 13:28:05'),
    },
    {
      link: 'zoom',
      text: 'Zoom',
      description:
        'Zoom your canvas via mouse wheel, double click, buttons, and pinch-to-zoom (trackpad/touchscreen) with smooth limits and responsive UX.',
      image: './previews/examples/zoom.light.png',
      image_dark: './previews/examples/zoom.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2026-01-25 00:00:00'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'background',
      text: 'Background',
      description:
        'Add SVG background patterns to the flow diagrams in Angular, using built-in rect and circle presets or a fully custom pattern for complex, branded backgrounds.',
      image: './previews/examples/background-example.light.png',
      image_dark: './previews/examples/background-example.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-11-29 14:49:44'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
  ]);
}

function pluginsGroup() {
  return defineNavigationGroup('Plugins', [
    {
      link: 'dagre-layout',
      text: 'Dagre Layout',
      pageTitle: 'Angular Dagre Graph Layout Example',
      image: './previews/examples/dagre-layout.light.png',
      image_dark: './previews/examples/dagre-layout.dark.png',
      description:
        'Build directed graph and tree layouts with Dagre in Angular. The example generates a graph from node count, recalculates links automatically, and re-runs manual layout on demand.',
      image_width: 1600,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-09-14 14:01:26'),
    },
    {
      link: 'dagre-layout-auto',
      text: 'Dagre Auto Layout',
      pageTitle: 'Angular Dagre Auto Layout Example',
      image: './previews/examples/dagre-layout.light.png',
      image_dark: './previews/examples/dagre-layout.dark.png',
      description:
        'Use Foblex Flow auto mode with Dagre in Angular. The example keeps app state as the source of truth, rebuilds the graph reactively, and lets auto relayout reposition nodes.',
      image_width: 1600,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-04-09 12:00:00'),
    },
    {
      link: 'elkjs-layout',
      text: 'ELK.js Layout',
      pageTitle: 'Angular ELK.js Graph Layout Example',
      image: './previews/examples/elk-layout.light.png',
      image_dark: './previews/examples/elk-layout.dark.png',
      description:
        'Generate layered graph layouts with ELK.js in Angular. The example rebuilds nodes and connections from one graph factory and applies manual layout direction changes through Foblex Flow.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-08 14:01:26'),
    },
    {
      link: 'elk-layout-auto',
      text: 'ELK.js Auto Layout',
      pageTitle: 'Angular ELK.js Auto Layout Example',
      image: './previews/examples/elk-layout.light.png',
      image_dark: './previews/examples/elk-layout.dark.png',
      description:
        'Run ELK.js through Foblex Flow auto mode in Angular. The example rebuilds the source graph from component state and syncs calculated positions back with writeback.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2026-04-09 12:00:00'),
    },
  ]);
}

function advancedGroup() {
  return defineNavigationGroup('Advanced', [
    {
      link: 'stress-test',
      text: 'Large Scene Performance',
      pageTitle:
        'Angular Diagram Performance Example – Large Scene Performance with Cache and Virtualization',
      image: './previews/examples/stress-test.light.png',
      image_dark: './previews/examples/stress-test.dark.png',
      description:
        'Measure large scene performance with 200 to 5000 nodes, optional cache, progressive virtualization, and toggleable connections in Angular Foblex Flow.',
      image_width: 2140,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-03-09 12:00:00'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'stress-test-with-connections',
      text: 'Connection Redraw Performance',
      pageTitle: 'Angular Flowchart Performance Example – Connection Redraws and Routing Modes',
      image: './previews/examples/stress-test-with-connections.light.png',
      image_dark: './previews/examples/stress-test-with-connections.dark.png',
      description:
        'Measure dense fan-out connection redraws with switchable behaviors, path types, live updates, and custom markers in an Angular Foblex Flow example.',
      image_width: 2140,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2026-03-09 12:00:00'),
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'copy-paste',
      text: 'Cut/Copy/Paste',
      description:
        'Implement cut/copy/paste for diagram nodes and connections. Clipboard format, serialization, and a ready-to-use Angular example.',
      image: './previews/examples/copy-paste.light.png',
      image_dark: './previews/examples/copy-paste.dark.png',
      image_width: 799,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-08-23 17:23:57'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'undo-redo',
      text: 'Undo/Redo',
      description:
        'Undo/Redo basics for Angular diagrams. Snapshot patterns, node moves and connection restore with example.',
      image: './previews/examples/undo-redo.light.png',
      image_dark: './previews/examples/undo-redo.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-07-19 17:23:57'),
    },
    {
      link: 'undo-redo-v2',
      text: 'Undo/Redo V2',
      description:
        'Undo/Redo with @foblex/mutator: state snapshots, revert node moves, restore connections. Patterns and demo.',
      image: './previews/examples/undo-redo-v2.light.png',
      image_dark: './previews/examples/undo-redo-v2.dark.png',
      image_width: 799,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-08-23 17:23:57'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      link: 'drag-start-end-events',
      text: 'Drag Start/End Events',
      pageTitle: 'Angular Diagram Example – Drag Start and End Events',
      description:
        'Track drag start and end events for nodes and edges in Angular. Useful for helper UI, analytics, and external state coordination.',
      image: './previews/examples/drag-start-end-events.light.png',
      image_dark: './previews/examples/drag-start-end-events.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-08 14:01:26'),
    },
    {
      link: 'custom-event-triggers',
      text: 'Custom Event Triggers',
      description:
        'Create custom event triggers for diagram interactions. Hooks, callbacks and Angular example code.',
      image: './previews/examples/custom-event-triggers.light.png',
      image_dark: './previews/examples/custom-event-triggers.dark.png',
      image_width: 802,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-10 19:00:00'),
    },
  ]);
}

function proExamplesGroup() {
  return defineNavigationGroup('Reference Apps', [
    {
      text: 'AI Low-Code Platform',
      link: 'ai-low-code-platform',
      pageTitle: 'Angular AI Low-Code IDE Example – Flagship Product-Style Demo with Foblex Flow',
      description:
        'Flagship front-end-only AI low-code IDE demo in Angular with custom nodes, JSON import/export, multiple themes, right-side config panels, validation reflected on nodes, undo/redo, persistence, multi-select, and animated connections.',
      image: './previews/examples/ai-low-code.light.png',
      image_dark: './previews/examples/ai-low-code.dark.png',
      image_width: 3700,
      image_height: 2080,
      image_type: 'image/png',
      date: new Date('2026-03-09 12:00:00'),
      badge: {
        text: 'New',
        type: 'success',
      },
    },
    {
      text: 'Schema Designer',
      link: 'schema-designer',
      description:
        'Interactive schema modeler with table nodes, inline column editing, relation toolbars, context menus, selection area, and minimap.',
      image: './previews/examples/db-management-flow.light.png',
      image_dark: './previews/examples/db-management-flow.dark.png',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
    },
    {
      text: 'UML Diagram',
      link: 'uml-diagram-example',
      description:
        'Layered UML surface with package groups, relation filters, search, custom markers, details panel, and viewport controls.',
      image: './previews/examples/uml-diagram-example.light.png',
      image_dark: './previews/examples/uml-diagram-example.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
    },
    {
      text: 'Tournament Bracket',
      link: 'tournament-bracket',
      description:
        'Tournament bracket demo with multiple layout strategies, bracket visibility filters, match drill-down, team stats, and minimap.',
      image: './previews/examples/tournament-bracket.light.png',
      image_dark: './previews/examples/tournament-bracket.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
    },
  ]);
}
