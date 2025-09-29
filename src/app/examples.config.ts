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
  provideNavigation,
  provideTitle,
  provideTableOfContent,
  provideMeta,
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
      advancedGroup(),
      proExamplesGroup(),
    ),
    provideComponents([
      defineLazyComponent(
        'custom-nodes',
        () => import('../../projects/f-examples/nodes/custom-nodes/custom-nodes.component'),
      ),
      defineLazyComponent(
        'drag-handle',
        () => import('../../projects/f-examples/nodes/drag-handle/drag-handle.component'),
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
        'grouping',
        () => import('../../projects/f-examples/nodes/grouping/grouping'),
      ),
      defineLazyComponent(
        'drag-to-group',
        () => import('../../projects/f-examples/nodes/drag-to-group/drag-to-group.component'),
      ),
      defineLazyComponent(
        'stress-test',
        () => import('../../projects/f-examples/nodes/stress-test/stress-test.component'),
      ),
      defineLazyComponent(
        'stress-test-with-connections',
        () =>
          import(
            '../../projects/f-examples/nodes/stress-test-with-connections/stress-test-with-connections.component'
          ),
      ),
      defineLazyComponent(
        'node-selection',
        () => import('../../projects/f-examples/nodes/node-selection/node-selection.component'),
      ),
      defineLazyComponent(
        'node-as-connector',
        () =>
          import(
            '../../projects/f-examples/connectors/node-as-connector/node-as-connector.component'
          ),
      ),
      defineLazyComponent(
        'connector-inside-node',
        () =>
          import(
            '../../projects/f-examples/connectors/connector-inside-node/connector-inside-node.component'
          ),
      ),
      defineLazyComponent(
        'connector-outlet',
        () =>
          import(
            '../../projects/f-examples/connectors/connector-outlet/connector-outlet.component'
          ),
      ),
      defineLazyComponent(
        'limiting-connections',
        () =>
          import(
            '../../projects/f-examples/connectors/limiting-connections/limiting-connections.component'
          ),
      ),
      defineLazyComponent(
        'connection-rules',
        () => import('../../projects/f-examples/connectors/connection-rules/connection-rules'),
      ),
      defineLazyComponent(
        'connectable-side',
        () => import('../../projects/f-examples/connectors/connectable-side/connectable-side'),
      ),
      defineLazyComponent(
        'drag-to-connect',
        () =>
          import('../../projects/f-examples/connections/drag-to-connect/drag-to-connect.component'),
      ),
      defineLazyComponent(
        'drag-to-reassign',
        () =>
          import(
            '../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component'
          ),
      ),
      defineLazyComponent(
        'create-node-on-connection-drop',
        () =>
          import(
            '../../projects/f-examples/connections/create-node-on-connection-drop/create-node-on-connection-drop.component'
          ),
      ),
      defineLazyComponent(
        'remove-connection-on-drop',
        () =>
          import(
            '../../projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component'
          ),
      ),
      defineLazyComponent(
        'assign-node-to-connection-on-drop',
        () =>
          import(
            '../../projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component'
          ),
      ),
      defineLazyComponent(
        'auto-snap',
        () => import('../../projects/f-examples/connections/auto-snap/auto-snap.component'),
      ),
      defineLazyComponent(
        'connection-types',
        () =>
          import(
            '../../projects/f-examples/connections/connection-types/connection-types.component'
          ),
      ),
      defineLazyComponent(
        'custom-connection-type',
        () =>
          import(
            '../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component'
          ),
      ),
      defineLazyComponent(
        'connection-behaviours',
        () =>
          import(
            '../../projects/f-examples/connections/connection-behaviours/connection-behaviours.component'
          ),
      ),
      defineLazyComponent(
        'connection-markers',
        () =>
          import(
            '../../projects/f-examples/connections/connection-markers/connection-markers.component'
          ),
      ),
      defineLazyComponent(
        'connection-text',
        () =>
          import('../../projects/f-examples/connections/connection-text/connection-text.component'),
      ),
      defineLazyComponent(
        'connection-center',
        () =>
          import(
            '../../projects/f-examples/connections/connection-center/connection-center.component'
          ),
      ),
      defineLazyComponent(
        'connection-content',
        () => import('../../projects/f-examples/connections/connection-content/connection-content'),
      ),
      defineLazyComponent(
        'custom-connections',
        () =>
          import(
            '../../projects/f-examples/connections/custom-connections/custom-connections.component'
          ),
      ),
      defineLazyComponent(
        'dagre-layout',
        () => import('../../projects/f-examples/advanced/dagre-layout/dagre-layout'),
      ),
      defineLazyComponent(
        'elkjs-layout-example',
        () =>
          import(
            '../../projects/f-examples/advanced/elkjs-layout-example/elkjs-layout-example.component'
          ),
      ),
      defineLazyComponent(
        'selection-area',
        () =>
          import('../../projects/f-examples/extensions/selection-area/selection-area.component'),
      ),
      defineLazyComponent(
        'help-in-positioning',
        () =>
          import(
            '../../projects/f-examples/extensions/help-in-positioning/help-in-positioning.component'
          ),
      ),
      defineLazyComponent(
        'zoom',
        () => import('../../projects/f-examples/extensions/zoom/zoom.component'),
      ),
      defineLazyComponent(
        'minimap-example',
        () =>
          import('../../projects/f-examples/extensions/minimap-example/minimap-example.component'),
      ),
      defineLazyComponent(
        'background-example',
        () =>
          import(
            '../../projects/f-examples/extensions/background-example/background-example.component'
          ),
      ),
      defineLazyComponent(
        'vp-flow',
        () =>
          import(
            '../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component'
          ),
      ),
      defineLazyComponent(
        'db-management-flow',
        () =>
          import(
            '../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component'
          ),
      ),
      defineLazyComponent(
        'uml-diagram-example',
        () =>
          import(
            '../../projects/f-pro-examples/uml-diagram-example/flow/uml-diagram-example.component'
          ),
      ),
      defineLazyComponent(
        'tournament-bracket',
        () =>
          import('../../projects/f-pro-examples/tournament-bracket/tournament-bracket.component'),
      ),
      defineLazyComponent(
        'grid-system',
        () => import('../../projects/f-examples/extensions/grid-system/grid-system.component'),
      ),
      defineLazyComponent(
        'copy-paste',
        () => import('../../projects/f-examples/advanced/copy-paste/copy-paste'),
      ),
      defineLazyComponent(
        'undo-redo',
        () => import('../../projects/f-examples/advanced/undo-redo/undo-redo.component'),
      ),
      defineLazyComponent(
        'undo-redo-v2',
        () => import('../../projects/f-examples/advanced/undo-redo-v2/undo-redo-v2'),
      ),
      defineLazyComponent(
        'add-node-from-palette',
        () =>
          import(
            '../../projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component'
          ),
      ),
      defineLazyComponent(
        'drag-start-end-events',
        () =>
          import(
            '../../projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component'
          ),
      ),
      defineLazyComponent(
        'custom-event-triggers',
        () =>
          import(
            '../../projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component'
          ),
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
      ]),
      provideHeaderMediaLinks([
        { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
        { icon: 'twitter', link: 'https://x.com/foblexflow' },
      ]),
    ),
    provideFooterNavigation({
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/examples/',
        text: 'Edit this page on GitHub',
      },
      previous: 'Previous Page',
      next: 'Next Page',
    }),
    provideMeta({
      url: 'https://flow.foblex.com',
      type: 'website',
      title: 'Angular Library for Flow-Based UIs - Foblex Flow',
      app_name: 'Foblex Flow',
      locale: 'en',
      description:
        'Foblex Flow is an Angular library that simplifies the creation of flow-based UIs, providing components for building interactive UIs with nodes and connections',
      image: 'https://flow.foblex.com/site-preview.png',
      image_type: 'image/png',
      image_width: 2986,
      image_height: 1926,
    }),
  ],
};

function overviewGroup() {
  return defineNavigationGroup('Introduction', [
    {
      link: 'overview',
      text: 'Overview',
      pageTitle: 'Foblex Flow – Angular Flowchart & Diagram Library Examples Overview',
      description:
        'Foblex Flow: Angular library for interactive flowcharts and diagrams. Explore features, live demos, and learn how to start building diagrams quickly.',
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
        'Click, box and keyboard selection for diagram nodes in Angular. Multi-select, modifiers and clean UX patterns with code.',
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
      pageTitle: 'Angular Flowchart Example – Resizable Nodes with Handles',
      image: './previews/examples/resize-handle.light.png',
      image_dark: './previews/examples/resize-handle.dark.png',
      description:
        'Make diagram nodes resizable with handles. Constraints, snapping and clean UX — complete Angular example.',
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
        'Add rotation handles with snapping and constraints for diagram nodes. Lightweight Angular example with code.',
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
      badge: {
        text: 'Updated',
        type: 'info',
      },
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
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'stress-test',
      text: 'Stress Test',
      pageTitle: 'Angular Diagram Performance Example – Thousands of Nodes',
      image: './previews/examples/stress-test.light.png',
      image_dark: './previews/examples/stress-test.dark.png',
      description:
        'Performance test with thousands of nodes in Angular. FPS tips, batching and rendering strategies for large diagrams.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-11-22 17:19:38'),
    },
    {
      link: 'stress-test-with-connections',
      text: 'Stress Test with Connections',
      pageTitle: 'Angular Flowchart Performance Example – Many Connections',
      image: './previews/examples/stress-test-with-connections.light.png',
      image_dark: './previews/examples/stress-test-with-connections.dark.png',
      description:
        'Performance with many connections: throttling, async updates and routing tips. Angular example you can reuse.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-01-16 19:19:10'),
    },
  ]);
}

function connectorGroup() {
  return defineNavigationGroup('Connectors', [
    {
      link: 'node-as-connector',
      text: 'Node as Connector',
      description:
        'Use nodes as interactive connectors with dynamic ports. Patterns and Angular code for complex flows.',
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
      description:
        'Place connectors inside nodes for compact UIs. Alignment, routing and a practical Angular example.',
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
      description:
        'Control connectors via outlets and route multiple edges. Clean patterns for complex flows in Angular.',
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
      description:
        'Limit connections per node or port with validation rules. Prevent spaghetti graphs in Angular diagrams.',
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
      badge: {
        text: 'New',
        type: 'success',
      },
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
      badge: {
        text: 'Updated',
        type: 'info',
      },
    },
    {
      link: 'create-node-on-connection-drop',
      text: 'Create Node on Connection Drop',
      description:
        'Create a node when an edge is dropped. Context-aware creation and UX details — Angular example.',
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
      description:
        'Remove a connection on drop to trash/invalid targets. Guards, feedback and concise Angular code.',
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
      description:
        'Assign a node to an existing edge when dropped on it. Mid-edge targets, events and Angular demo.',
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
      text: 'Connection Types (Straight, Bezier, Step)',
      description:
        'Compare edge types for Angular diagrams: straight, bezier, step. Code samples, when to use which, and visuals.',
      image: './previews/examples/connection-types.light.png',
      image_dark: './previews/examples/connection-types.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-02 20:12:01'),
    },
    {
      link: 'custom-connection-type',
      text: 'Custom Connection Type',
      description:
        'Define your own connection style and behavior. Full example with rendering, hit-tests, and interaction hooks.',
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
      description:
        'Customize connection behavior: snapping, rerouting, constraints and hover feedback for Angular diagrams.',
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
        'Add arrowheads and markers to edges. SVG styling, sizes and examples for Angular flowcharts.',
      image: './previews/examples/connection-markers.light.png',
      image_dark: './previews/examples/connection-markers.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-06 14:49:44'),
    },
    {
      link: 'connection-text',
      text: 'Connection Text',
      description:
        'Add labels to connections with smart placement and scaling. Centered or offset text — Angular example.',
      image: './previews/examples/connection-text.light.png',
      image_dark: './previews/examples/connection-text.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-01-31 17:16:33'),
      badge: {
        text: 'Deprecated',
        type: 'danger',
      },
    },
    {
      link: 'connection-center',
      text: 'Connection Center',
      description:
        'Place centered widgets (badges/buttons) on edges. Interaction patterns and Angular code.',
      image: './previews/examples/connection-center.light.png',
      image_dark: './previews/examples/connection-center.dark.png',
      image_width: 781,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-01-31 18:23:26'),
      badge: {
        text: 'Deprecated',
        type: 'danger',
      },
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
      link: 'custom-connections',
      text: 'Custom Connections',
      description:
        'Build fully custom connections: drawing, routing and interactivity. Complete Angular example with code.',
      image: './previews/examples/custom-connections.light.png',
      image_dark: './previews/examples/custom-connections.dark.png',
      image_width: 791,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-03 01:32:33'),
    },
  ]);
}

function extensionGroup() {
  return defineNavigationGroup('Extensions', [
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
      text: 'Help in Positioning',
      description:
        'Auto-align nodes with guides and snap lines. Spacing, alignment rules and clean UX for Angular diagrams.',
      image: './previews/examples/help-in-positioning.light.png',
      image_dark: './previews/examples/help-in-positioning.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-09 12:37:27'),
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
        'Add zoom controls and wheel zoom with sensible limits. Smooth UX and performance tips for Angular diagrams.',
      image: './previews/examples/zoom.light.png',
      image_dark: './previews/examples/zoom.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-06 13:57:22'),
    },
    {
      link: 'background',
      text: 'Background',
      description:
        'Add background shapes and frames to structure the canvas. Layering and styling patterns in Angular.',
      image: './previews/examples/background-example.light.png',
      image_dark: './previews/examples/background-example.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2024-10-06 14:49:44'),
    },
  ]);
}

function advancedGroup() {
  return defineNavigationGroup('Advanced', [
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
      link: 'dagre-layout',
      text: 'Dagre Layout (Directed Graph)',
      pageTitle: 'Angular Dagre Graph Layout Example',
      image: './previews/examples/dagre-layout.light.png',
      image_dark: './previews/examples/dagre-layout.dark.png',
      description:
        'Interactive Angular example showing automatic graph and tree layouts with Dagre and Foblex Flow. Learn how to build directed graphs, org charts, and hierarchical diagrams with auto-arranged nodes, connections, and layout controls.',
      image_width: 1600,
      image_height: 1200,
      image_type: 'image/png',
      date: new Date('2025-09-14 14:01:26'),
    },
    {
      link: 'elkjs-layout',
      text: 'ELKJS Layout (Directed Graph)',
      image: './previews/examples/elkjs-layout.light.png',
      image_dark: './previews/examples/elkjs-layout.dark.png',
      description:
        'Create tidy tree & layered layouts with ELKJS in Angular. Working example, config options, performance notes, and live demo in Foblex Flow.',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
      date: new Date('2025-02-08 14:01:26'),
    },
    {
      link: 'drag-start-end-events',
      text: 'Drag Start/End Events',
      description:
        'Listen to drag start and end events on nodes and edges. Clean event patterns with Angular example.',
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
  return defineNavigationGroup('Pro Examples', [
    {
      text: 'Visual Programming',
      link: 'f-visual-programming-flow',
      description:
        'Visual programming editor in Angular: create nodes, connect logic and run workflows in an interactive diagram.',
      image: './previews/examples/vp-flow.light.png',
      image_dark: './previews/examples/vp-flow.dark.png',
      image_width: 757,
      image_height: 600,
      image_type: 'image/png',
    },
    {
      text: 'DB Management',
      link: 'f-db-management-flow',
      description:
        'Database workflow builder in Angular. Nodes, CRUD connections and interactive diagram with live demo.',
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
        'Build UML diagrams in Angular with Foblex Flow. Class nodes, relationships and auto-layout demo.',
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
        'Create a tournament bracket in Angular. Automatic match connections, updates and live demo.',
      image: './previews/examples/tournament-bracket.light.png',
      image_dark: './previews/examples/tournament-bracket.dark.png',
      image_width: 821,
      image_height: 600,
      image_type: 'image/png',
    },
  ]);
}
