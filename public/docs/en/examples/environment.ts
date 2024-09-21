import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';

export const EXAMPLES_ENVIRONMENT: IDocsEnvironment = createEnvironment();

function createEnvironment(): IDocsEnvironment {
  return {
    lang: 'en',
    docsDir: './docs/en/examples/',
    logo: './logo.svg',
    title: 'Foblex Flow',
    version: {
      npmPackage: '@foblex/flow',
    },
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
      { tag: 'simple-flow', component: import('../../../../projects/f-examples/simple-flow/simple-flow.component') },
      { tag: 'draggable-flow', component: import('../../../../projects/f-examples/draggable-flow/draggable-flow.component') },
      { tag: 'connection-type', component: import('../../../../projects/f-examples/connection-type/connection-type.component') },
      { tag: 'connection-behaviour', component: import('../../../../projects/f-examples/connection-behaviour/connection-behaviour.component') },
      { tag: 'custom-connection-type', component: import('../../../../projects/f-examples/custom-connection-type/custom-connection-type.component') },
      { tag: 'drag-to-connect', component: import('../../../../projects/f-examples/drag-to-connect/drag-to-connect.component') },
      { tag: 'drag-to-reassign', component: import('../../../../projects/f-examples/drag-to-reassign/drag-to-reassign.component') },
      { tag: 'drag-snap-connection', component: import('../../../../projects/f-examples/drag-snap-connection/drag-snap-connection.component') },
      { tag: 'connectable-side', component: import('../../../../projects/f-examples/connectable-side/connectable-side.component') },
      { tag: 'connection-from-outlet', component: import('../../../../projects/f-examples/connection-from-outlet/connection-from-outlet.component') },
      { tag: 'connection-markers', component: import('../../../../projects/f-examples/connection-markers/connection-markers.component') },
      { tag: 'zoom-example', component: import('../../../../projects/f-examples/zoom-example/zoom-example.component') },
      { tag: 'background-example', component: import('../../../../projects/f-examples/background-example/background-example.component') },
      { tag: 'line-alignment-example', component: import('../../../../projects/f-examples/line-alignment-example/line-alignment-example.component') },
      { tag: 'vp-flow', component: import('../../../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component') },
      { tag: 'db-management-flow', component: import('../../../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component') },
      { tag: 'minimap-basic-example', component: import('../../../../projects/f-examples/minimap-basic-example/minimap-basic-example.component') },
      { tag: 'minimap-scaled-example', component: import('../../../../projects/f-examples/minimap-scaled-example/minimap-scaled-example.component') },
      { tag: 'dagre-layout-example', component: import('../../../../projects/f-examples/layout-and-behaviors/dagre-layout-example/dagre-layout-example.component') },
      { tag: 'elkjs-layout-example', component: import('../../../../projects/f-examples/layout-and-behaviors/elkjs-layout-example/elkjs-layout-example.component') },
      { tag: 'node-with-connectors', component: import('../../../../projects/f-examples/node-with-connectors/node-with-connectors.component') },
      { tag: 'node-with-position-example', component: import('../../../../projects/f-examples/node/node-with-position-example/node-with-position-example.component') },
      { tag: 'adding-dragging-functionality-example', component: import('../../../../projects/f-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component') },
      { tag: 'node-with-drag-handle-example', component: import('../../../../projects/f-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component') },
      { tag: 'groups-simple-example', component: import('../../../../projects/f-examples/group/groups-simple-example/groups-simple-example.component') },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@foblex/flow' },
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
        link: 'custom-node',
        text: 'Custom Nodes',
      },
      {
        link: 'drag-handle',
        text: 'Drag Handle',
      },
      {
        link: 'resize-handle',
        text: 'Resize Handle',
      },
      {
        link: 'grouping',
        text: 'Grouping',
      },
      {
        link: 'group-paddings',
        text: 'Group Paddings',
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
    text: 'Layouts & Behaviors',
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
