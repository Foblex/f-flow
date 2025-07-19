import {
  defineLazyComponent,
  defineNavigationGroup,
  provide404Markdown,
  provideComponents,
  provideDirectory,
  provideDocumentationMeta,
  provideFooterNavigation,
  provideHeader,
  provideHeaderMediaLinks,
  provideHeaderNavigation,
  provideLanguage,
  provideLogo,
  provideNavigation,
  provideTitle,
  provideTocData,
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
        defineLazyComponent('custom-nodes', () => import('../../projects/f-examples/nodes/custom-nodes/custom-nodes.component')),
        defineLazyComponent('drag-handle', () => import('../../projects/f-examples/nodes/drag-handle/drag-handle.component')),
        defineLazyComponent('resize-handle', () => import('../../projects/f-examples/nodes/resize-handle/resize-handle.component')),
        defineLazyComponent('rotate-handle', () => import('../../projects/f-examples/nodes/rotate-handle/rotate-handle.component')),
        defineLazyComponent('grouping', () => import('../../projects/f-examples/nodes/grouping/grouping.component')),
        defineLazyComponent('drag-to-group', () => import('../../projects/f-examples/nodes/drag-to-group/drag-to-group.component')),
        defineLazyComponent('stress-test', () => import('../../projects/f-examples/nodes/stress-test/stress-test.component')),
        defineLazyComponent('stress-test-with-connections', () => import('../../projects/f-examples/nodes/stress-test-with-connections/stress-test-with-connections.component')),
        defineLazyComponent('node-selection', () => import('../../projects/f-examples/nodes/node-selection/node-selection.component')),
        defineLazyComponent('node-as-connector', () => import('../../projects/f-examples/connectors/node-as-connector/node-as-connector.component')),
        defineLazyComponent('connector-inside-node', () => import('../../projects/f-examples/connectors/connector-inside-node/connector-inside-node.component')),
        defineLazyComponent('connector-outlet', () => import('../../projects/f-examples/connectors/connector-outlet/connector-outlet.component')),
        defineLazyComponent('limiting-connections', () => import('../../projects/f-examples/connectors/limiting-connections/limiting-connections.component')),
        defineLazyComponent('connectability-check', () => import('../../projects/f-examples/connectors/connectability-check/connectability-check.component')),
        defineLazyComponent('connectable-side', () => import('../../projects/f-examples/connectors/connectable-side/connectable-side.component')),
        defineLazyComponent('drag-to-connect', () => import('../../projects/f-examples/connections/drag-to-connect/drag-to-connect.component')),
        defineLazyComponent('drag-to-reassign', () => import('../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component')),
        defineLazyComponent('create-node-on-connection-drop', () => import('../../projects/f-examples/connections/create-node-on-connection-drop/create-node-on-connection-drop.component')),
        defineLazyComponent('remove-connection-on-drop', () => import('../../projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component')),
        defineLazyComponent('assign-node-to-connection-on-drop', () => import('../../projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component')),
        defineLazyComponent('auto-snap', () => import('../../projects/f-examples/connections/auto-snap/auto-snap.component')),
        defineLazyComponent('connection-types', () => import('../../projects/f-examples/connections/connection-types/connection-types.component')),
        defineLazyComponent('custom-connection-type', () => import('../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component')),
        defineLazyComponent('connection-behaviours', () => import('../../projects/f-examples/connections/connection-behaviours/connection-behaviours.component')),
        defineLazyComponent('connection-markers', () => import('../../projects/f-examples/connections/connection-markers/connection-markers.component')),
        defineLazyComponent('connection-text', () => import('../../projects/f-examples/connections/connection-text/connection-text.component')),
        defineLazyComponent('connection-center', () => import('../../projects/f-examples/connections/connection-center/connection-center.component')),
        defineLazyComponent('custom-connections', () => import('../../projects/f-examples/connections/custom-connections/custom-connections.component')),
        defineLazyComponent('dagre-layout-example', () => import('../../projects/f-examples/advanced/dagre-layout-example/dagre-layout-example.component')),
        defineLazyComponent('elkjs-layout-example', () => import('../../projects/f-examples/advanced/elkjs-layout-example/elkjs-layout-example.component')),
        defineLazyComponent('selection-area', () => import('../../projects/f-examples/extensions/selection-area/selection-area.component')),
        defineLazyComponent('help-in-positioning', () => import('../../projects/f-examples/extensions/help-in-positioning/help-in-positioning.component')),
        defineLazyComponent('zoom', () => import('../../projects/f-examples/extensions/zoom/zoom.component')),
        defineLazyComponent('minimap-example', () => import('../../projects/f-examples/extensions/minimap-example/minimap-example.component')),
        defineLazyComponent('background-example', () => import('../../projects/f-examples/extensions/background-example/background-example.component')),
        defineLazyComponent('vp-flow', () => import('../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component')),
        defineLazyComponent('db-management-flow', () => import('../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component')),
        defineLazyComponent('uml-diagram-example', () => import('../../projects/f-pro-examples/uml-diagram-example/flow/uml-diagram-example.component')),
        defineLazyComponent('tournament-bracket', () => import('../../projects/f-pro-examples/tournament-bracket/tournament-bracket.component')),
        defineLazyComponent('grid-system', () => import('../../projects/f-examples/extensions/grid-system/grid-system.component')),
        defineLazyComponent('undo-redo', () => import('../../projects/f-examples/advanced/undo-redo/undo-redo.component')),
        defineLazyComponent('add-node-from-palette', () => import('../../projects/f-examples/extensions/add-node-from-palette/add-node-from-palette.component')),
        defineLazyComponent('drag-start-end-events', () => import('../../projects/f-examples/advanced/drag-start-end-events/drag-start-end-events.component')),
        defineLazyComponent('custom-event-triggers', () => import('../../projects/f-examples/advanced/custom-event-triggers/custom-event-triggers.component'))
      ]),
      provideTocData({
        title: 'In this article',
        range: {start: 2, end: 6},
      }),
      provideHeader(
        provideHeaderNavigation([{
          link: '/docs/get-started',
          active: '/docs',
          text: 'Docs',
        }, {
          link: '/examples/overview',
          active: '/examples',
          text: 'Examples',
        }]),
        provideHeaderMediaLinks([
          {icon: 'github', link: 'https://github.com/Foblex/f-flow'},
          {icon: 'twitter', link: 'https://x.com/foblexflow'},
        ]),
      ),
      provideFooterNavigation({
        editLink: {
          pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/en/',
          text: 'Edit this page on GitHub'
        },
        previous: 'Previous Page',
        next: 'Next Page',
      }),
      provideDocumentationMeta({
        url: 'https://flow.foblex.com',
        type: 'website',
        title: 'Angular Library for Flow-Based UIs - Foblex Flow',
        app_name: 'Foblex Flow',
        locale: 'en',
        description: 'Foblex Flow is an Angular library that simplifies the creation of flow-based UIs, providing components for building interactive UIs with nodes and connections',
        image: 'https://flow.foblex.com/site-preview.png',
        image_type: 'image/png',
        image_width: 2986,
        image_height: 1926
      }),
    ],
  }
;


function overviewGroup() {
  return defineNavigationGroup('Introduction', [{
    link: 'overview',
    text: 'Overview',
    description: 'Foblex Flow: Angular library for creating interactive diagrams. Overview of features and getting started guide.',
    image: './previews/examples/overview.png',
    image_width: 3244,
    image_height: 1832,
    image_type: 'image/png',
  }])
}

function nodesGroup() {
  return defineNavigationGroup('Nodes', [{
    link: 'custom-nodes',
    text: 'Custom Nodes',
    image: './previews/examples/custom-nodes.light.png',
    image_dark: './previews/examples/custom-nodes.dark.png',
    description: 'Create custom nodes with varied content, styles, and behaviors using Foblex Flow for Angular.',
    image_width: 795,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'drag-handle',
    text: 'Drag Handle',
    image: './previews/examples/drag-handle.light.png',
    image_dark: './previews/examples/drag-handle.dark.png',
    description: 'Create draggable handles for nodes to enable easy movement in Foblex Flow for Angular.',
    image_width: 795,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-19-07 13:00:22'),
    badge: {
      text: 'Updated',
      type: 'warning'
    },
  }, {
    link: 'node-selection',
    text: 'Node Selection',
    description: 'Select nodes in Foblex Flow diagrams for Angular.',
    image: './previews/examples/node-selection.light.png',
    image_dark: './previews/examples/node-selection.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-01-31 17:16:33')
  }, {
    link: 'resize-handle',
    text: 'Resize Handle',
    image: './previews/examples/resize-handle.light.png',
    image_dark: './previews/examples/resize-handle.dark.png',
    description: 'Add resize handles to make nodes adjustable in Foblex Flow diagrams for Angular',
    image_width: 801,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'Updated',
      type: 'warning'
    },
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'rotate-handle',
    text: 'Rotate Handle',
    image: './previews/examples/rotate-handle.light.png',
    image_dark: './previews/examples/rotate-handle.dark.png',
    description: 'Add rotate handles to make nodes adjustable in Foblex Flow diagrams for Angular',
    image_width: 795,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-02-23 20:56:08')
  }, {
    link: 'grouping',
    text: 'Grouping',
    image: './previews/examples/grouping.light.png',
    image_dark: './previews/examples/grouping.dark.png',
    description: 'Group nodes for better organization and management in Foblex Flow diagrams for Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'drag-to-group',
    text: 'Drag to Group',
    image: './previews/examples/drag-to-group.light.png',
    image_dark: './previews/examples/drag-to-group.dark.png',
    description: 'Drag nodes to group them together in Foblex Flow for Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-12-01 23:05:25')
  }, {
    link: 'stress-test',
    text: 'Stress Test',
    image: './previews/examples/stress-test.light.png',
    image_dark: './previews/examples/stress-test.dark.png',
    description: 'Test the performance of Foblex Flow with a large number of nodes in Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-11-22 17:19:38')
  }, {
    link: 'stress-test-with-connections',
    text: 'Stress Test with Connections',
    image: './previews/examples/stress-test-with-connections.light.png',
    image_dark: './previews/examples/stress-test-with-connections.dark.png',
    description: 'Test the performance of Foblex Flow with a large number of connections in Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-01-16 19:19:10')
  }])
}

function connectorGroup() {
  return defineNavigationGroup('Connectors', [{
    link: 'node-as-connector',
    text: 'Node as Connector',
    description: 'Use nodes as connectors, enabling easy connections in Foblex Flow for Angular.',
    image: './previews/examples/node-as-connector.light.png',
    image_dark: './previews/examples/node-as-connector.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'connector-inside-node',
    text: 'Connector Inside Node',
    description: 'Add connectors inside nodes, allowing easy connections in Foblex Flow for Angular.',
    image: './previews/examples/connector-inside-node.light.png',
    image_dark: './previews/examples/connector-inside-node.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'connector-outlet',
    text: 'Connector Outlet',
    description: 'Create connectors that control other connectors, enabling complex connections in Foblex Flow for Angular.',
    image: './previews/examples/connector-outlet.light.png',
    image_dark: './previews/examples/connector-outlet.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'limiting-connections',
    text: 'Limiting Connections',
    description: 'Limit the number of connections between nodes in Foblex Flow diagrams for Angular.',
    image: './previews/examples/limiting-connections.light.png',
    image_dark: './previews/examples/limiting-connections.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'connectability-check',
    text: 'Connectability Check',
    description: 'Check if nodes can be connected in Foblex Flow diagrams for Angular.',
    image: './previews/examples/connectability-check.light.png',
    image_dark: './previews/examples/connectability-check.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-01-25 15:04:46')
  }, {
    link: 'connectable-side',
    text: 'Connectable Side',
    description: 'Connect nodes from specific sides in Foblex Flow.',
    image: './previews/examples/connectable-side.light.png',
    image_dark: './previews/examples/connectable-side.dark.png',
    image_width: 726,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-03 14:17:29')
  }])
}

function connectionGroup() {
  return defineNavigationGroup('Connections', [{
    link: 'drag-to-connect',
    text: 'Drag to Connect',
    image: './previews/examples/drag-to-connect.light.png',
    image_dark: './previews/examples/drag-to-connect.dark.png',
    description: 'Drag to create connections between nodes in Foblex Flow diagrams for Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'drag-to-reassign',
    text: 'Drag to Reassign',
    image: './previews/examples/drag-to-reassign.light.png',
    image_dark: './previews/examples/drag-to-reassign.dark.png',
    description: 'Reassign connections by dragging them to new nodes in Foblex Flow for Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'create-node-on-connection-drop',
    text: 'Create Node on Connection Drop',
    description: 'Create a node when a connection is dropped in Foblex Flow for Angular.',
    image: './previews/examples/create-node-on-connection-drop.light.png',
    image_dark: './previews/examples/create-node-on-connection-drop.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'remove-connection-on-drop',
    text: 'Remove Connection on Drop',
    description: 'Remove a connection when it is dropped in Foblex Flow diagrams for Angular.',
    image: './previews/examples/remove-connection-on-drop.light.png',
    image_dark: './previews/examples/remove-connection-on-drop.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 16:04:08')
  }, {
    link: 'assign-node-to-connection-on-drop',
    text: 'Assign Node to Connection on Drop',
    description: 'Assign a node to a connection when node is dropped and intersects with a connection in Foblex Flow for Angular.',
    image: './previews/examples/assign-node-to-connection-on-drop.light.png',
    image_dark: './previews/examples/assign-node-to-connection-on-drop.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'Updated',
      type: 'warning'
    },
    date: new Date('2024-12-30 15:26:54')
  }, {
    link: 'auto-snap',
    text: 'Auto Snap',
    description: 'Automatically snap connections to nodes in Foblex Flow, enabling easier diagram creation in Angular.',
    image: './previews/examples/auto-snap.light.png',
    image_dark: './previews/examples/auto-snap.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'Updated',
      type: 'warning'
    },
    date: new Date('2025-01-31 17:16:33')
  }, {
    link: 'connection-types',
    text: 'Connection Types',
    description: 'Set different connection types for building interactive flow-based diagrams in Foblex Flow for Angular.',
    image: './previews/examples/connection-types.light.png',
    image_dark: './previews/examples/connection-types.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 20:12:01')
  }, {
    link: 'custom-connection-type',
    text: 'Custom Connection Type',
    description: 'Create custom connection types for interactive diagrams in Foblex Flow for Angular.',
    image: './previews/examples/custom-connection-type.light.png',
    image_dark: './previews/examples/custom-connection-type.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-02 20:12:01')
  }, {
    link: 'connection-behaviours',
    text: 'Connection Behaviours',
    description: 'Customize connection behaviors for interactive diagrams in Foblex Flow for Angular.',
    image: './previews/examples/connection-behaviours.light.png',
    image_dark: './previews/examples/connection-behaviours.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-03 00:50:53')
  }, {
    link: 'connection-markers',
    text: 'Connection Markers',
    description: 'Add markers to connections for better visualization in Foblex Flow diagrams.',
    image: './previews/examples/connection-markers.light.png',
    image_dark: './previews/examples/connection-markers.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-06 14:49:44')
  }, {
    link: 'connection-text',
    text: 'Connection Text',
    description: 'Add text to connections in Foblex Flow diagrams for Angular.',
    image: './previews/examples/connection-text.light.png',
    image_dark: './previews/examples/connection-text.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-01-31 17:16:33')
  }, {
    link: 'connection-center',
    text: 'Connection Center',
    description: 'Add centered content to connections with Foblex Flow for Angular',
    image: './previews/examples/connection-center.light.png',
    image_dark: './previews/examples/connection-center.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-01-31 18:23:26')
  }, {
    link: 'custom-connections',
    text: 'Custom Connections',
    description: 'Create and customize connections in Foblex Flow diagrams for Angular.',
    image: './previews/examples/custom-connections.light.png',
    image_dark: './previews/examples/custom-connections.dark.png',
    image_width: 791,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-03 01:32:33')
  }])
}

function extensionGroup() {
  return defineNavigationGroup('Extensions', [{
    link: 'add-node-from-palette',
    text: 'Add Node from Palette',
    description: 'Add nodes to the diagram from an external palette in Foblex Flow for Angular.',
    image: './previews/examples/add-node-from-palette.light.png',
    image_dark: './previews/examples/add-node-from-palette.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-02-09 12:37:27')
  }, {
    link: 'selection-area',
    text: 'Selection Area',
    description: 'Add a selection area for multiple node selection in Foblex Flow for Angular.',
    image: './previews/examples/selection-area.light.png',
    image_dark: './previews/examples/selection-area.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-06 13:57:22')
  }, {
    link: 'help-in-positioning',
    text: 'Help in Positioning',
    description: 'Automatically align nodes to each other in Foblex Flow for Angular.',
    image: './previews/examples/help-in-positioning.light.png',
    image_dark: './previews/examples/help-in-positioning.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-02-09 12:37:27')
  }, {
    link: 'grid-system',
    text: 'Grid System',
    description: 'Add a grid system to Foblex Flow diagrams for Angular.',
    image: './previews/examples/grid-system.light.png',
    image_dark: './previews/examples/grid-system.dark.png',
    image_width: 770,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'Updated',
      type: 'warning'
    },
    date: new Date('2025-02-09 12:37:27')
  }, {
    link: 'minimap',
    text: 'Minimap',
    description: 'Add a minimap to navigate large diagrams in Foblex Flow for Angular.',
    image: './previews/examples/minimap-example.light.png',
    image_dark: './previews/examples/minimap-example.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-04-23 13:00:05'),
    badge: {
      text: 'Updated',
      type: 'warning'
    },
  }, {
    link: 'zoom',
    text: 'Zoom',
    description: 'Add zoom controls to Foblex Flow diagrams for Angular.',
    image: './previews/examples/zoom.light.png',
    image_dark: './previews/examples/zoom.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'Updated',
      type: 'warning'
    },
    date: new Date('2024-10-06 13:57:22')
  }, {
    link: 'background',
    text: 'Background',
    description: 'Add background shapes to Foblex Flow diagrams for Angular.',
    image: './previews/examples/background-example.light.png',
    image_dark: './previews/examples/background-example.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2024-10-06 14:49:44')
  }]);
}

function advancedGroup() {
  return defineNavigationGroup('Advanced', [{
    link: 'undo-redo',
    text: 'Undo/Redo',
    description: 'Add Undo and Redo functionality with Foblex Flow for Angular.',
    image: './previews/examples/undo-redo.light.png',
    image_dark: './previews/examples/undo-redo.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-01-31 14:33:57')
  }, {
    link: 'dagre-layout',
    text: 'Dagre Layout',
    image: './previews/examples/dagre-layout.light.png',
    image_dark: './previews/examples/dagre-layout.dark.png',
    description: 'Use Dagre.js in Foblex Flow for structured tree diagrams in Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-02-08 14:01:26')
  }, {
    link: 'elkjs-layout',
    text: 'ELKJS Layout',
    image: './previews/examples/elkjs-layout.light.png',
    image_dark: './previews/examples/elkjs-layout.dark.png',
    description: 'Create structured tree diagrams with ELKJS in Foblex Flow for Angular.',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
    date: new Date('2025-02-08 14:01:26')
  }, {
    link: 'drag-start-end-events',
    text: 'Drag Start/End Events',
    description: 'Listen to drag start and end events in Foblex Flow for Angular.',
    image: './previews/examples/drag-start-end-events.light.png',
    image_dark: './previews/examples/drag-start-end-events.dark.png',
    image_width: 781,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-02-08 14:01:26')
  }, {
    link: 'custom-event-triggers',
    text: 'Custom Event Triggers',
    description: 'Create custom event triggers in Foblex Flow for Angular.',
    image: './previews/examples/custom-event-triggers.light.png',
    image_dark: './previews/examples/custom-event-triggers.dark.png',
    image_width: 802,
    image_height: 600,
    image_type: 'image/png',
    badge: {
      text: 'New',
      type: 'info'
    },
    date: new Date('2025-02-10 19:00:00')
  }]);
}

function proExamplesGroup() {
  return defineNavigationGroup('Pro Examples', [{
    text: 'Visual Programming',
    link: 'f-visual-programming-flow',
    description: 'Create a visual programming interface using Angular and Foblex Flow.',
    image: './previews/examples/vp-flow.light.png',
    image_dark: './previews/examples/vp-flow.dark.png',
    image_width: 757,
    image_height: 600,
    image_type: 'image/png',
  }, {
    text: 'DB Management',
    link: 'f-db-management-flow',
    description: 'Build a database management workflow using Angular and Foblex Flow.',
    image: './previews/examples/db-management-flow.light.png',
    image_dark: './previews/examples/db-management-flow.dark.png',
    image_width: 806,
    image_height: 600,
    image_type: 'image/png',
  }, {
    text: 'UML Diagram',
    link: 'uml-diagram-example',
    description: 'Create a UML diagram with Angular and Foblex Flow.',
    image: './previews/examples/uml-diagram-example.light.png',
    image_dark: './previews/examples/uml-diagram-example.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png',
  }, {
    text: 'Tournament Bracket',
    link: 'tournament-bracket',
    description: 'Create a tournament bracket using Angular and Foblex Flow.',
    image: './previews/examples/tournament-bracket.light.png',
    image_dark: './previews/examples/tournament-bracket.dark.png',
    image_width: 821,
    image_height: 600,
    image_type: 'image/png'
  }]);
}

