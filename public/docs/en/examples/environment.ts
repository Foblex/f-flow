import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';

export const EXAMPLES_ENVIRONMENT: IDocsEnvironment = createEnvironment();

function createEnvironment(): IDocsEnvironment {
  return {
    lang: 'en',
    docsDir: './docs/en/examples/',
    logo: './logo.svg',
    title: 'Foblex Flow',
    navigation: [
      overviewGroup(),
      introductionGroup(),
      connectorGroup(),
      connectionGroup(),
      layoutGroup(),
      extensionGroup(),
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
      { tag: 'custom-nodes', component: import('../../../../projects/f-examples/custom-nodes/custom-nodes.component') },
      { tag: 'drag-handle', component: import('../../../../projects/f-examples/drag-handle/drag-handle.component') },
      { tag: 'resize-handle', component: import('../../../../projects/f-examples/resize-handle/resize-handle.component') },
      { tag: 'draggable-flow', component: import('../../../../projects/f-guides-examples/draggable-flow/draggable-flow.component') },
      { tag: 'vp-flow', component: import('../../../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component') },
      { tag: 'db-management-flow', component: import('../../../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component') },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
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
      },
    ],
  }
}

function introductionGroup(): INavigationGroup {
  return {
    text: 'Nodes',
    items: [
      {
        link: 'custom-nodes',
        text: 'Custom Nodes',
        image: './previews/examples/custom-nodes.light.png',
        image_dark: './previews/examples/custom-nodes.dark.png',
        description: 'Learn how to display any content inside a node. This example demonstrates how to create custom nodes with varied content, styles, and behaviors, providing a comprehensive guide to building interactive flow-based diagrams.',
      },
      {
        link: 'drag-handle',
        text: 'Drag Handle',
        image: './previews/examples/drag-handle.light.png',
        image_dark: './previews/examples/drag-handle.dark.png',
        description: 'This example showcases how to create a draggable handle for nodes, allowing users to move them easily within Angular and Foblex Flow.',
      },
      {
        link: 'resize-handle',
        text: 'Resize Handle',
        image: './previews/examples/custom-nodes.light.png',
        image_dark: './previews/examples/custom-nodes.dark.png',
        description: 'Discover how to add a resize handle to nodes. This example demonstrates how to make nodes resizable, enabling users to adjust their size easily within Angular and Foblex Flow.',
      },
      {
        link: 'grouping',
        text: 'Grouping',
        image: 'https://flow.foblex.com/f-visual-programming-flow.png',
        description: 'Explore how to group nodes together. This example demonstrates how to create groups of nodes, allowing users to organize and manage them efficiently within Angular and Foblex Flow.',
      },
      {
        link: 'group-paddings',
        text: 'Group Paddings',
        image: 'https://flow.foblex.com/f-visual-programming-flow.png',
        description: 'Learn how to add padding to groups. This example showcases how to add padding to groups of nodes, providing a comprehensive guide to creating organized and visually appealing flow-based diagrams.',
      },
    ],
  }
}

function connectorGroup(): INavigationGroup {
  return {
    text: 'Connectors',
    items: [
      {
        link: 'connectable-nodes',
        text: 'Connectable Nodes',
      },
      {
        link: 'connectors-inside-nodes',
        text: 'Connectors Inside Nodes',
      },
      {
        link: 'limiting-connections',
        text: 'Limiting Connections',
      },
      {
        link: 'connector-outlet',
        text: 'Connector Outlet',
      },
      {
        link: 'connectable-side',
        text: 'Connectable Side',
      },
      {
        link: 'rounded-connectors',
        text: 'Rounded Connectors',
      }
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
      },
      {
        link: 'drag-to-reassign',
        text: 'Drag to Reassign',
      },
      {
        link: 'add-node-on-connection-drop',
        text: 'Add Node on Connection Drop',
      },
      {
        link: 'proximity-connect',
        text: 'Proximity Connect',
      },
      {
        link: 'delete-connection-on-drop',
        text: 'Delete Connection on Drop',
      },
      {
        link: 'connection-types',
        text: 'Connection Types',
      },
      {
        link: 'connection-behaviors',
        text: 'Connection Behaviors',
      },
      {
        link: 'custom-connection-type',
        text: 'Custom Connection Type',
      },
      {
        link: 'custom-connection',
        text: 'Custom Connection',
      },
      {
        link: 'connection-markers',
        text: 'Connection Markers',
      },
      {
        link: 'connection-text',
        text: 'Connection Text',
      },
      {
        link: 'connection-center',
        text: 'Connection Center',
      },
    ]
  }
}

function layoutGroup(): INavigationGroup {
  return {
    text: 'Layouts',
    items: [
      {
        link: 'dagre-layout',
        text: 'Dagre Tree',
        description: 'Explore a tree layout example using Dagre.js with Angular and Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the Dagre layout engine.'
      },
      {
        link: 'elkjs-layout',
        text: 'ELKJS Tree',
        description: 'Explore a tree layout example using ELKJS with Angular and Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the ELKJS layout engine.',
      }
    ],
  }
}

function extensionGroup(): INavigationGroup {
  return {
    text: 'Extensions',
    items: [
      {
        link: 'add-node-on-drag-and-drop',
        text: 'Add Node on Drag and Drop',
      },
      {
        link: 'help-in-positioning',
        text: 'Help in Positioning',
      },
      {
        link: 'minimap',
        text: 'Minimap',
      },
      {
        link: 'zoom',
        text: 'Zoom',
      },
      {
        link: 'background',
        text: 'Background',
      }
    ],
  }
}

function proExamplesGroup(): INavigationGroup {
  return {
    text: 'Pro Examples',
    items: [ {
      text: 'Visual Programming Flow',
      link: 'f-visual-programming-flow',
      description: 'Learn how to create a visual programming interface using Angular and Foblex Flow. This example showcases features like adding and connecting nodes, zooming, panning, alignment, and more, providing a comprehensive guide to building interactive, flow-based diagrams.',
      image: 'https://flow.foblex.com/f-visual-programming-flow.png',
      image_type: 'image/png',
      image_width: 1604,
      image_height: 1194,
    },{
      text: 'DB Management Flow',
      link: 'f-db-management-flow',
      description: 'Discover how to create a database management flow using Angular and Foblex Flow. This example demonstrates connecting nodes, zooming, panning, alignment, form validation, and more, offering a comprehensive solution for building interactive database management interfaces.',
      image: 'https://flow.foblex.com/f-db-management-flow.png',
      image_type: 'image/png',
      image_width: 1598,
      image_height: 1198,
    }, {
      text: 'Call Center Flow',
      link: 'https://github.com/Foblex/f-flow-example',
    }, {
      text: 'Scheme Editor',
      link: 'https://github.com/Foblex/f-scheme-editor',
    } ]
  }
}
