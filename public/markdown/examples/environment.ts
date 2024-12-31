import { IDocsEnvironment, INavigationGroup } from '@foblex/m-render';

export const EXAMPLES_ENVIRONMENT: IDocsEnvironment = createEnvironment();

function createEnvironment(): IDocsEnvironment {
  return {
    lang: 'en',
    docsDir: './markdown/examples/',
    notFoundMD: './markdown/404.md',
    logo: './logo.svg',
    title: 'Foblex Flow',
    navigation: [
      overviewGroup(),
      nodesGroup(),
      connectorGroup(),
      connectionGroup(),
      layoutGroup(),
      extensionGroup(),
      proExamplesGroup(),
    ],
    headerNavigation: [ {
      link: '/docs/get-started',
      active: '/docs',
      text: 'Docs',
    }, {
      link: '/examples/overview',
      active: '/examples',
      text: 'Examples',
    } ],
    footerNavigation: {
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/en/',
        text: 'Edit this page on GitHub'
      },
      previous: 'Previous Page',
      next: 'Next Page',
    },
    components: [
      {
        tag: 'custom-nodes',
        component: import('../../../projects/f-examples/nodes/custom-nodes/custom-nodes.component')
      },
      {
        tag: 'drag-handle',
        component: import('../../../projects/f-examples/nodes/drag-handle/drag-handle.component')
      },
      {
        tag: 'resize-handle',
        component: import('../../../projects/f-examples/nodes/resize-handle/resize-handle.component')
      },
      {
        tag: 'grouping',
        component: import('../../../projects/f-examples/nodes/grouping/grouping.component')
      },
      {
        tag: 'drag-to-group',
        component: import('../../../projects/f-examples/nodes/drag-to-group/drag-to-group.component')
      },
      {
        tag: 'stress-test',
        component: import('../../../projects/f-examples/nodes/stress-test/stress-test.component')
      },
      {
        tag: 'node-selection',
        component: import('../../../projects/f-examples/nodes/node-selection/node-selection.component')
      },
      {
        tag: 'node-as-connector',
        component: import('../../../projects/f-examples/connectors/node-as-connector/node-as-connector.component')
      },
      {
        tag: 'connector-inside-node',
        component: import('../../../projects/f-examples/connectors/connector-inside-node/connector-inside-node.component')
      },
      {
        tag: 'connector-outlet',
        component: import('../../../projects/f-examples/connectors/connector-outlet/connector-outlet.component')
      },
      {
        tag: 'limiting-connections',
        component: import('../../../projects/f-examples/connectors/limiting-connections/limiting-connections.component')
      },
      {
        tag: 'connectable-side',
        component: import('../../../projects/f-examples/connectors/connectable-side/connectable-side.component')
      },
      {
        tag: 'drag-to-connect',
        component: import('../../../projects/f-examples/connections/drag-to-connect/drag-to-connect.component')
      },
      {
        tag: 'drag-to-reassign',
        component: import('../../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component')
      },
      {
        tag: 'create-node-on-connection-drop',
        component: import('../../../projects/f-examples/connections/create-node-on-connection-drop/create-node-on-connection-drop.component')
      },
      {
        tag: 'remove-connection-on-drop',
        component: import('../../../projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component')
      },
      {
        tag: 'assign-node-to-connection-on-drop',
        component: import('../../../projects/f-examples/connections/assign-node-to-connection-on-drop/assign-node-to-connection-on-drop.component')
      },
      {
        tag: 'auto-snap',
        component: import('../../../projects/f-examples/connections/auto-snap/auto-snap.component')
      },
      {
        tag: 'connection-types',
        component: import('../../../projects/f-examples/connections/connection-types/connection-types.component')
      },
      {
        tag: 'custom-connection-type',
        component: import('../../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component')
      },
      {
        tag: 'connection-behaviours',
        component: import('../../../projects/f-examples/connections/connection-behaviours/connection-behaviours.component')
      },
      {
        tag: 'connection-markers',
        component: import('../../../projects/f-examples/connections/connection-markers/connection-markers.component')
      },
      {
        tag: 'custom-connections',
        component: import('../../../projects/f-examples/connections/custom-connections/custom-connections.component')
      },
      {
        tag: 'dagre-layout-example',
        component: import('../../../projects/f-examples/layouts/dagre-layout-example/dagre-layout-example.component')
      },
      {
        tag: 'elkjs-layout-example',
        component: import('../../../projects/f-examples/layouts/elkjs-layout-example/elkjs-layout-example.component')
      },
      {
        tag: 'selection-area',
        component: import('../../../projects/f-examples/extensions/selection-area/selection-area.component')
      },
      {
        tag: 'help-in-positioning-example',
        component: import('../../../projects/f-examples/extensions/help-in-positioning-example/help-in-positioning-example.component')
      },
      {
        tag: 'zoom',
        component: import('../../../projects/f-examples/extensions/zoom/zoom.component')
      },
      {
        tag: 'minimap-example',
        component: import('../../../projects/f-examples/extensions/minimap-example/minimap-example.component')
      },
      {
        tag: 'background-example',
        component: import('../../../projects/f-examples/extensions/background-example/background-example.component')
      },
      {
        tag: 'vp-flow',
        component: import('../../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component')
      },
      {
        tag: 'db-management-flow',
        component: import('../../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component')
      },
      {
        tag: 'uml-diagram-example',
        component: import('../../../projects/f-pro-examples/uml-diagram-example/flow/uml-diagram-example.component')
      },
      {
        tag: 'mind-map-example',
        component: import('../../../projects/f-pro-examples/mind-map-example/flow/mind-map-example.component')
      },
      {
        tag: 'tournament-bracket',
        component: import('../../../projects/f-pro-examples/tournament-bracket/tournament-bracket.component')
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
      { icon: 'twitter', link: 'https://x.com/foblexflow' },
    ],
    toC: {
      title: 'In this article',
      range: { start: 2, end: 6 },
    }
  }
}

function overviewGroup(): INavigationGroup {
  return {
    text: 'Introduction',
    items: [
      {
        link: 'overview',
        text: 'Overview',
        description: 'Foblex Flow: Angular library for creating interactive diagrams. Overview of features and getting started guide.',
        image: './previews/examples/overview.png',
        image_width: 3244,
        image_height: 1832,
        image_type: 'image/png',
      },
    ],
  }
}

function nodesGroup(): INavigationGroup {
  return {
    text: 'Nodes',
    items: [
      {
        link: 'custom-nodes',
        text: 'Custom Nodes',
        image: './previews/examples/custom-nodes.light.png',
        image_dark: './previews/examples/custom-nodes.dark.png',
        description: 'Create custom nodes with varied content, styles, and behaviors using Foblex Flow for Angular.',
        image_width: 795,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'drag-handle',
        text: 'Drag Handle',
        image: './previews/examples/drag-handle.light.png',
        image_dark: './previews/examples/drag-handle.dark.png',
        description: 'Create draggable handles for nodes to enable easy movement in Foblex Flow for Angular.',
        image_width: 795,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'node-selection',
        text: 'Node Selection',
        description: 'Select nodes in Foblex Flow diagrams for Angular.',
        image: './previews/examples/node-selection.light.png',
        image_dark: './previews/examples/node-selection.dark.png',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png'
      },
      {
        link: 'resize-handle',
        text: 'Resize Handle',
        image: './previews/examples/resize-handle.light.png',
        image_dark: './previews/examples/resize-handle.dark.png',
        description: 'Add resize handles to make nodes adjustable in Foblex Flow diagrams for Angular',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'grouping',
        text: 'Grouping',
        image: './previews/examples/grouping.light.png',
        image_dark: './previews/examples/grouping.dark.png',
        description: 'Group nodes for better organization and management in Foblex Flow diagrams for Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'drag-to-group',
        text: 'Drag to Group',
        image: './previews/examples/drag-to-group.light.png',
        image_dark: './previews/examples/drag-to-group.dark.png',
        description: 'Drag nodes to group them together in Foblex Flow for Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
        badge: {
          text: 'New',
          type: 'info'
        }
      },
      {
        link: 'stress-test',
        text: 'Stress Test',
        image: './previews/examples/stress-test.light.png',
        image_dark: './previews/examples/stress-test.dark.png',
        description: 'Test the performance of Foblex Flow with a large number of nodes in Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
        badge: {
          text: 'New',
          type: 'info'
        }
      }
    ],
  }
}

function connectorGroup(): INavigationGroup {
  return {
    text: 'Connectors',
    items: [
      {
        link: 'node-as-connector',
        text: 'Node as Connector',
        description: 'Use nodes as connectors, enabling easy connections in Foblex Flow for Angular.',
        image: './previews/examples/node-as-connector.light.png',
        image_dark: './previews/examples/node-as-connector.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connector-inside-node',
        text: 'Connector Inside Node',
        description: 'Add connectors inside nodes, allowing easy connections in Foblex Flow for Angular.',
        image: './previews/examples/connector-inside-node.light.png',
        image_dark: './previews/examples/connector-inside-node.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connector-outlet',
        text: 'Connector Outlet',
        description: 'Create connectors that control other connectors, enabling complex connections in Foblex Flow for Angular.',
        image: './previews/examples/connector-outlet.light.png',
        image_dark: './previews/examples/connector-outlet.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'limiting-connections',
        text: 'Limiting Connections',
        description: 'Limit the number of connections between nodes in Foblex Flow diagrams for Angular.',
        image: './previews/examples/limiting-connections.light.png',
        image_dark: './previews/examples/limiting-connections.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connectable-side',
        text: 'Connectable Side',
        description: 'Connect nodes from specific sides in Foblex Flow.',
        image: './previews/examples/connectable-side.light.png',
        image_dark: './previews/examples/connectable-side.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
    ],
  }
}

function connectionGroup(): INavigationGroup {
  return {
    text: 'Connections',
    items: [
      {
        link: 'drag-to-connect',
        text: 'Drag to Connect',
        image: './previews/examples/drag-to-connect.light.png',
        image_dark: './previews/examples/drag-to-connect.dark.png',
        description: 'Drag to create connections between nodes in Foblex Flow diagrams for Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'drag-to-reassign',
        text: 'Drag to Reassign',
        image: './previews/examples/drag-to-reassign.light.png',
        image_dark: './previews/examples/drag-to-reassign.dark.png',
        description: 'Reassign connections by dragging them to new nodes in Foblex Flow for Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'create-node-on-connection-drop',
        text: 'Create Node on Connection Drop',
        description: 'Create a node when a connection is dropped in Foblex Flow for Angular.',
        image: './previews/examples/create-node-on-connection-drop.light.png',
        image_dark: './previews/examples/create-node-on-connection-drop.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'remove-connection-on-drop',
        text: 'Remove Connection on Drop',
        description: 'Remove a connection when it is dropped in Foblex Flow diagrams for Angular.',
        image: './previews/examples/remove-connection-on-drop.light.png',
        image_dark: './previews/examples/remove-connection-on-drop.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'assign-node-to-connection-on-drop',
        text: 'Assign Node to Connection on Drop',
        description: 'Assign a node to a connection when node is dropped and intersects with a connection in Foblex Flow for Angular.',
        image: './previews/examples/assign-node-to-connection-on-drop.light.png',
        image_dark: './previews/examples/assign-node-to-connection-on-drop.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
        badge: {
          text: 'New',
          type: 'info'
        }
      },
      {
        link: 'auto-snap',
        text: 'Auto Snap',
        description: 'Automatically snap connections to nodes in Foblex Flow, enabling easier diagram creation in Angular.',
        image: './previews/examples/auto-snap.light.png',
        image_dark: './previews/examples/auto-snap.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      // {
      //   link: 'connection-selection',
      //   text: 'Connection Selection',
      //   description: 'Select connections in Foblex Flow diagrams for Angular.',
      //   image: './previews/examples/connection-selection.light.png',
      //   image_dark: './previews/examples/connection-selection.dark.png',
      //   image_width: 806,
      //   image_height: 600,
      //   image_type: 'image/png',
      // },
      {
        link: 'connection-types',
        text: 'Connection Types',
        description: 'Set different connection types for building interactive flow-based diagrams in Foblex Flow for Angular.',
        image: './previews/examples/connection-types.light.png',
        image_dark: './previews/examples/connection-types.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'custom-connection-type',
        text: 'Custom Connection Type',
        description: 'Create custom connection types for interactive diagrams in Foblex Flow for Angular.',
        image: './previews/examples/custom-connection-type.light.png',
        image_dark: './previews/examples/custom-connection-type.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connection-behaviours',
        text: 'Connection Behaviours',
        description: 'Customize connection behaviors for interactive diagrams in Foblex Flow for Angular.',
        image: './previews/examples/connection-behaviours.light.png',
        image_dark: './previews/examples/connection-behaviours.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connection-markers',
        text: 'Connection Markers',
        description: 'Add markers to connections for better visualization in Foblex Flow diagrams.',
        image: './previews/examples/connection-markers.light.png',
        image_dark: './previews/examples/connection-markers.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'custom-connections',
        text: 'Custom Connections',
        description: 'Create and customize connections in Foblex Flow diagrams for Angular.',
        image: './previews/examples/custom-connections.light.png',
        image_dark: './previews/examples/custom-connections.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      // {
      //   link: 'connection-text',
      //   text: 'Connection Text',
      // },
      // {
      //   link: 'connection-center',
      //   text: 'Connection Center',
      // },
    ]
  }
}

function layoutGroup(): INavigationGroup {
  return {
    text: 'Layouts',
    items: [
      {
        link: 'dagre-layout',
        text: 'Dagre Layout',
        image: './previews/examples/dagre-layout.light.png',
        image_dark: './previews/examples/dagre-layout.dark.png',
        description: 'Use Dagre.js in Foblex Flow for structured tree diagrams in Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'elkjs-layout',
        text: 'ELKJS Layout',
        image: './previews/examples/elkjs-layout.light.png',
        image_dark: './previews/examples/elkjs-layout.dark.png',
        description: 'Create structured tree diagrams with ELKJS in Foblex Flow for Angular.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      }
    ],
  }
}

function extensionGroup(): INavigationGroup {
  return {
    text: 'Extensions',
    items: [
      // {
      //   link: 'add-node-from-palette',
      //   text: 'Add Node from Palette',
      // },
      {
        link: 'selection-area',
        text: 'Selection Area',
        description: 'Add a selection area for multiple node selection in Foblex Flow for Angular.',
        image: './previews/examples/selection-area.light.png',
        image_dark: './previews/examples/selection-area.dark.png',
        image_width: 821,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'help-in-positioning',
        text: 'Help in Positioning',
        description: 'Automatically align nodes to each other in Foblex Flow for Angular.',
        image: './previews/examples/help-in-positioning-example.light.png',
        image_dark: './previews/examples/help-in-positioning-example.dark.png',
        image_width: 821,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'minimap',
        text: 'Minimap',
        description: 'Add a minimap to navigate large diagrams in Foblex Flow for Angular.',
        image: './previews/examples/minimap-example.light.png',
        image_dark: './previews/examples/minimap-example.dark.png',
        image_width: 821,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'zoom',
        text: 'Zoom',
        description: 'Add zoom controls to Foblex Flow diagrams for Angular.',
        image: './previews/examples/zoom.light.png',
        image_dark: './previews/examples/zoom.dark.png',
        image_width: 821,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'background',
        text: 'Background',
        description: 'Add background shapes to Foblex Flow diagrams for Angular.',
        image: './previews/examples/background-example.light.png',
        image_dark: './previews/examples/background-example.dark.png',
        image_width: 821,
        image_height: 600,
        image_type: 'image/png',
      }
    ],
  }
}

function proExamplesGroup(): INavigationGroup {
  return {
    text: 'Pro Examples',
    items: [ {
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
      image_type: 'image/png',
      badge: {
        text: 'New',
        type: 'info'
      }
    }
    //   {
    //   text: 'Mind Map',
    //   link: 'mind-map-example',
    //   description: 'Design a mind map using Angular and Foblex Flow.',
    //   image: './previews/examples/mind-map-example.light.png',
    //   image_dark: './previews/examples/mind-map-example.dark.png',
    //   image_width: 821,
    //   image_height: 600,
    //   image_type: 'image/png',
    // }
      //   {
      //   text: 'Call Center Flow',
      //   link: 'https://github.com/Foblex/f-flow-example',
      // }, {
      //   text: 'Scheme Editor',
      //   link: 'https://github.com/Foblex/f-scheme-editor',
      // }
    ]
  }
}
