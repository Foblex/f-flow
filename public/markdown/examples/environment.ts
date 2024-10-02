import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';

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
  //    extensionGroup(),
      proExamplesGroup(),
    ],
    headerNavigation: [{
      link: '/docs/get-started',
      active: '/docs',
      text: 'Docs',
    }, {
      link: '/examples/overview',
      active: '/examples',
      text: 'Examples',
    }],
    footerNavigation: {
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/en/',
        text: 'Edit this page on GitHub'
      },
      previous: 'Previous Page',
      next: 'Next Page',
    },
    components: [
      { tag: 'custom-nodes', component: import('../../../projects/f-examples/nodes/custom-nodes/custom-nodes.component') },
      { tag: 'drag-handle', component: import('../../../projects/f-examples/nodes/drag-handle/drag-handle.component') },
      { tag: 'resize-handle', component: import('../../../projects/f-examples/nodes/resize-handle/resize-handle.component') },
      { tag: 'grouping', component: import('../../../projects/f-examples/nodes/grouping/grouping.component') },

      { tag: 'node-as-connector', component: import('../../../projects/f-examples/connectors/node-as-connector/node-as-connector.component') },
      { tag: 'connector-inside-node', component: import('../../../projects/f-examples/connectors/connector-inside-node/connector-inside-node.component') },
      { tag: 'connector-outlet', component: import('../../../projects/f-examples/connectors/connector-outlet/connector-outlet.component') },
      { tag: 'limiting-connections', component: import('../../../projects/f-examples/connectors/limiting-connections/limiting-connections.component') },
      { tag: 'connectable-side', component: import('../../../projects/f-examples/connectors/connectable-side/connectable-side.component') },

      { tag: 'drag-to-connect', component: import('../../../projects/f-examples/connections/drag-to-connect/drag-to-connect.component') },
      { tag: 'drag-to-reassign', component: import('../../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component') },
      { tag: 'create-node-on-connection-drop', component: import('../../../projects/f-examples/connections/create-node-on-connection-drop/create-node-on-connection-drop.component') },
      { tag: 'remove-connection-on-drop', component: import('../../../projects/f-examples/connections/remove-connection-on-drop/remove-connection-on-drop.component') },
      { tag: 'auto-snap', component: import('../../../projects/f-examples/connections/auto-snap/auto-snap.component') },
      { tag: 'connection-types', component: import('../../../projects/f-examples/connections/connection-types/connection-types.component') },
      { tag: 'custom-connection-type', component: import('../../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component') },
      { tag: 'connection-behaviours', component: import('../../../projects/f-examples/connections/connection-behaviours/connection-behaviours.component') },
      { tag: 'connection-markers', component: import('../../../projects/f-examples/connections/connection-markers/connection-markers.component') },

      { tag: 'dagre-layout-example', component: import('../../../projects/f-examples/layouts/dagre-layout-example/dagre-layout-example.component') },
      { tag: 'elkjs-layout-example', component: import('../../../projects/f-examples/layouts/elkjs-layout-example/elkjs-layout-example.component') },

      { tag: 'draggable-flow', component: import('../../../projects/f-guides-examples/draggable-flow/draggable-flow.component') },
      { tag: 'vp-flow', component: import('../../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component') },
      { tag: 'db-management-flow', component: import('../../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component') },
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
        description: 'Learn about Foblex Flow, a modern Angular library for building interactive flow-based diagrams. This article provides an overview of the library, its features, and how to get started with it.',
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
        description: 'Learn how to display any content inside a node. This example demonstrates how to create custom nodes with varied content, styles, and behaviors, providing a comprehensive guide to building interactive flow-based diagrams.',
        image_width: 795,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'drag-handle',
        text: 'Drag Handle',
        image: './previews/examples/drag-handle.light.png',
        image_dark: './previews/examples/drag-handle.dark.png',
        description: 'This example showcases how to create a draggable handle for nodes, allowing users to move them easily within Angular and Foblex Flow.',
        image_width: 795,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'resize-handle',
        text: 'Resize Handle',
        image: './previews/examples/resize-handle.light.png',
        image_dark: './previews/examples/resize-handle.dark.png',
        description: 'Discover how to add a resize handle to nodes. This example demonstrates how to make nodes resizable, enabling users to adjust their size easily within Angular and Foblex Flow.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'grouping',
        text: 'Grouping',
        image: './previews/examples/grouping.light.png',
        image_dark: './previews/examples/grouping.dark.png',
        description: 'Explore how to group nodes together. This example demonstrates how to create groups of nodes, allowing users to organize and manage them efficiently within Angular and Foblex Flow.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
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
        description: 'Learn how to use nodes as connectors. This example demonstrates how to create nodes with connectors, enabling users to connect them easily within Angular and Foblex Flow.',
        image: './previews/examples/node-as-connector.light.png',
        image_dark: './previews/examples/node-as-connector.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connector-inside-node',
        text: 'Connector Inside Node',
        description: 'Discover how to add connectors inside nodes. This example demonstrates how to create nodes with internal connectors, allowing users to connect them easily within Angular and Foblex Flow.',
        image: './previews/examples/connector-inside-node.light.png',
        image_dark: './previews/examples/connector-inside-node.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connector-outlet',
        text: 'Connector Outlet',
        description: 'Learn how to add a connector that controls other connectors. This example demonstrates how to create connectors that connect other connectors, allowing users to create complex connections in Angular and Foblex Flow.',
        image: './previews/examples/connector-outlet.light.png',
        image_dark: './previews/examples/connector-outlet.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'limiting-connections',
        text: 'Limiting Connections',
        description: 'Explore how to limit the number of connections. This example demonstrates how to restrict the number of connections between nodes, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/limiting-connections.light.png',
        image_dark: './previews/examples/limiting-connections.dark.png',
        image_width: 726,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connectable-side',
        text: 'Connectable Side',
        description: 'Discover how to connect connectors from specific sides. This example demonstrates how to connect connectors from specific sides, enabling users to create custom connections within Angular and Foblex Flow.',
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
  return  {
    text: 'Connections',
    items: [
      {
        link: 'drag-to-connect',
        text: 'Drag to Connect',
        image: './previews/examples/drag-to-connect.light.png',
        image_dark: './previews/examples/drag-to-connect.dark.png',
        description: 'Learn how to connect nodes by dragging a connection between them. This example demonstrates how to create connections between nodes, providing a comprehensive guide to building interactive flow-based diagrams.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'drag-to-reassign',
        text: 'Drag to Reassign',
        image: './previews/examples/drag-to-reassign.light.png',
        image_dark: './previews/examples/drag-to-reassign.dark.png',
        description: 'Discover how to reassign connections by dragging them to a new connector. This example demonstrates how to move connections between nodes, enabling users to reassign them easily within Angular and Foblex Flow.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'create-node-on-connection-drop',
        text: 'Create Node on Connection Drop',
        description: 'Explore how to create a node when a connection is dropped. This example demonstrates how to add nodes when connections are dropped, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/create-node-on-connection-drop.light.png',
        image_dark: './previews/examples/create-node-on-connection-drop.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'remove-connection-on-drop',
        text: 'Remove Connection on Drop',
        description: 'Learn how to remove a connection when it is dropped. This example demonstrates how to delete connections when they are dropped, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/remove-connection-on-drop.light.png',
        image_dark: './previews/examples/remove-connection-on-drop.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'auto-snap',
        text: 'Auto Snap',
        description: 'Discover how to automatically snap connections to nodes. This example demonstrates how to snap connections to nodes automatically, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/auto-snap.light.png',
        image_dark: './previews/examples/auto-snap.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connection-types',
        text: 'Connection Types',
        description: 'Learn how to set different connection types. This example demonstrates how to create connections with different types, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/connection-types.light.png',
        image_dark: './previews/examples/connection-types.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'custom-connection-type',
        text: 'Custom Connection Type',
        description: 'Explore how to create custom connection types. This example demonstrates how to define custom connection types, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/custom-connection-type.light.png',
        image_dark: './previews/examples/custom-connection-type.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connection-behaviours',
        text: 'Connection Behaviours',
        description: 'Learn how to customize connection behaviours. This example demonstrates how to modify connection behaviours, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/connection-behaviours.light.png',
        image_dark: './previews/examples/connection-behaviours.dark.png',
        image_width: 791,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'connection-markers',
        text: 'Connection Markers',
        description: 'Discover how to add markers to connections. This example demonstrates how to create connections with markers, providing a comprehensive guide to building interactive flow-based diagrams.',
        image: './previews/examples/connection-markers.light.png',
        image_dark: './previews/examples/connection-markers.dark.png',
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
        description: 'Explore a tree layout example using Dagre.js with Angular and Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the Dagre layout engine.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      },
      {
        link: 'elkjs-layout',
        text: 'ELKJS Layout',
        image: './previews/examples/elkjs-layout.light.png',
        image_dark: './previews/examples/elkjs-layout.dark.png',
        description: 'Explore a tree layout example using ELKJS with Angular and Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the ELKJS layout engine.',
        image_width: 806,
        image_height: 600,
        image_type: 'image/png',
      }
    ],
  }
}

// function extensionGroup(): INavigationGroup {
//   return {
//     text: 'Extensions',
//     items: [
//       {
//         link: 'add-node-on-drag-and-drop',
//         text: 'Add Node on Drag and Drop',
//       },
//       {
//         link: 'help-in-positioning',
//         text: 'Help in Positioning',
//       },
//       {
//         link: 'minimap',
//         text: 'Minimap',
//       },
//       {
//         link: 'zoom',
//         text: 'Zoom',
//       },
//       {
//         link: 'background',
//         text: 'Background',
//       }
//     ],
//   }
// }

function proExamplesGroup(): INavigationGroup {
  return {
    text: 'Pro Examples',
    items: [ {
      text: 'Visual Programming Flow',
      link: 'f-visual-programming-flow',
      description: 'Learn how to create a visual programming interface using Angular and Foblex Flow. This example showcases features like adding and connecting nodes, zooming, panning, alignment, and more, providing a comprehensive guide to building interactive, flow-based diagrams.',
      image: './previews/examples/vp-flow.light.png',
      image_dark: './previews/examples/vp-flow.dark.png',
      image_width: 757,
      image_height: 600,
      image_type: 'image/png',
    },{
      text: 'DB Management Flow',
      link: 'f-db-management-flow',
      description: 'Discover how to create a database management flow using Angular and Foblex Flow. This example demonstrates connecting nodes, zooming, panning, alignment, form validation, and more, offering a comprehensive solution for building interactive database management interfaces.',
      image: './previews/examples/db-management-flow.light.png',
      image_dark: './previews/examples/db-management-flow.dark.png',
      image_width: 806,
      image_height: 600,
      image_type: 'image/png',
    },
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
