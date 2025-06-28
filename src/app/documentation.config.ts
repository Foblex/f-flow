import {
  defineLazyComponent,
  defineNavigationGroup, INavigationGroup,
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

export const DOCUMENTATION_CONFIGURATION = {
  providers: [
    provideLanguage('en'),
    provideDirectory('./markdown/guides/'),
    provide404Markdown('./markdown/404.md'),
    provideLogo('./logo.svg'),
    provideTitle('Foblex Flow'),
    provideNavigation(
      introductionGroup(),
      containerGroup(),
      nodeGroup(),
      connectorGroup(),
      connectionGroup(),
      extendsGroup()
    ),
    provideComponents([
      defineLazyComponent('simple-flow', () => import('../../projects/f-guides-examples/simple-flow/simple-flow.component')),
      defineLazyComponent('draggable-flow', () => import('../../projects/f-guides-examples/draggable-flow/draggable-flow.component')),
      defineLazyComponent('connection-type', () => import('../../projects/f-guides-examples/connection-type/connection-type.component')),
      defineLazyComponent('connection-behaviour', () => import('../../projects/f-guides-examples/connection-behaviour/connection-behaviour.component')),
      defineLazyComponent('custom-connection-type', () => import('../../projects/f-guides-examples/custom-connection-type/custom-connection-type.component')),
      defineLazyComponent('drag-to-connect', () => import('../../projects/f-examples/connections/drag-to-connect/drag-to-connect.component')),
      defineLazyComponent('drag-to-reassign', () => import('../../projects/f-examples/connections/drag-to-reassign/drag-to-reassign.component')),
      defineLazyComponent('drag-snap-connection', () => import('../../projects/f-guides-examples/drag-snap-connection/drag-snap-connection.component')),
      defineLazyComponent('connectable-side', () => import('../../projects/f-guides-examples/connectable-side/connectable-side.component')),
      defineLazyComponent('connection-from-outlet', () => import('../../projects/f-guides-examples/connection-from-outlet/connection-from-outlet.component')),
      defineLazyComponent('connection-markers', () => import('../../projects/f-guides-examples/connection-markers/connection-markers.component')),
      defineLazyComponent('zoom-example', () => import('../../projects/f-guides-examples/zoom-example/zoom-example.component')),
      defineLazyComponent('background-example', () => import('../../projects/f-guides-examples/background-example/background-example.component')),
      defineLazyComponent('line-alignment-example', () => import('../../projects/f-guides-examples/line-alignment-example/line-alignment-example.component')),
      defineLazyComponent('minimap-basic-example', () => import('../../projects/f-guides-examples/minimap-basic-example/minimap-basic-example.component')),
      defineLazyComponent('minimap-scaled-example', () => import('../../projects/f-guides-examples/minimap-scaled-example/minimap-scaled-example.component')),
      defineLazyComponent('node-with-connectors', () => import('../../projects/f-guides-examples/node-with-connectors/node-with-connectors.component')),
      defineLazyComponent('node-with-position-example', () => import('../../projects/f-guides-examples/node/node-with-position-example/node-with-position-example.component')),
      defineLazyComponent('adding-dragging-functionality-example', () => import('../../projects/f-guides-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component')),
      defineLazyComponent('node-with-drag-handle-example', () => import('../../projects/f-guides-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component')),
    ]),
    provideTocData({
      title: 'In this articles',
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
};


function introductionGroup(): INavigationGroup {
  return defineNavigationGroup('Introduction', [{
    link: 'intro',
    text: 'Introducing Foblex Flow',
    description: "Article that will help you to understand what Foblex Flow is and how it can help you to create flow-based UIs in Angular applications.",
  }, {
    link: 'get-started',
    text: 'Installation and Rendering',
    description: "Learn how to install Foblex Flow and render it in your Angular application.",
  }])
}

function containerGroup(): INavigationGroup {
  return defineNavigationGroup('Containers', [{
    link: 'f-flow-component',
    text: 'Flow',
    description: 'The FFlowComponent in Foblex Flow manages draggable and connectable elements within a visual canvas, enabling dynamic creation, positioning, and interaction of nodes. It supports layout calculation, event handling, and provides methods for node selection, flow manipulation, and custom styling for complex diagrams and workflows.',
  }, {
    link: 'f-canvas-component',
    text: 'Canvas',
    description: 'The FCanvasComponent in Foblex Flow offers a scalable and dynamic canvas for positioning and manipulating nodes and connections in flowcharts and graphs. It supports dynamic scaling, precise positioning, and optimized rendering, with methods for fitting the canvas to the screen and adjusting the scale.',
  }])
}

function nodeGroup(): INavigationGroup {
  return defineNavigationGroup('Node', [{
    link: 'f-node-directive',
    text: 'Node',
    description: 'The FNodeDirective in Foblex Flow represents a node within a flow, allowing dynamic positioning, styling, and interaction with other nodes and connectors. It supports drag-and-drop, selection management, and customizable behaviors, perfect for creating dynamic diagrams and node-based UIs.',
    image: 'https://flow.foblex.com/f-node-directive.png',
    image_type: 'image/png',
    image_width: 1458,
    image_height: 959,
  }, {
    link: 'f-drag-handle-directive',
    text: 'Drag Handle',
    description: 'The FDragHandle directive in Foblex Flow designates the drag handle within a node, enabling precise control over dragging operations in a flow. It integrates seamlessly with the FNode directive to facilitate customizable drag-and-drop functionality for dynamic flows and interactive elements.',
  }])
}

function connectionGroup(): INavigationGroup {
  return defineNavigationGroup('Connection', [{
    link: 'f-connection-component',
    text: 'Connection',
    description: 'The FConnectionComponent in Foblex Flow represents customizable connections between nodes in a flowchart or graph, supporting various visual types, behaviors, and interactivity options. It enables flexible connection styling, reassignment control, and dynamic flow management for complex dataflows.',
  }, {
    link: 'f-connection-for-create-component',
    text: 'Create Connection',
    description: 'The FConnectionForCreate component in Foblex Flow allows users to create connections between nodes by dragging to different node inputs. It supports dynamic connection creation within a flow, working seamlessly with the draggable directive for flexible node interaction in diagrams and workflows.',
  }, {
    link: 'f-connection-marker-directive',
    text: 'Connection Marker',
    description: 'The FMarkerDirective in Foblex Flow defines start or end markers for connections within a flow, enabling customization of marker type, size, and position. It ensures precise control over the visual representation of connection endpoints using SVG elements in your diagrams.',
  }, {
    link: 'f-snap-connection-component',
    text: 'Snap Connection',
    description: 'The FSnapConnection component in Foblex Flow allows users to create connections between nodes by snapping to the nearest input. It supports dynamic connection creation within a flow, working seamlessly with the draggable directive for flexible node interaction in diagrams and workflows.',
  }])
}

function connectorGroup(): INavigationGroup {
  return defineNavigationGroup('Connectors', [{
    link: 'f-node-output-directive',
    text: 'Output',
    description: 'The FNodeOutputDirective in Foblex Flow designates an element as an output within a node, managing connection behaviors such as multiple connections, disabled states, and connectable sides. It provides flexibility in managing output connections in dynamic flowcharts and complex diagrams.',
  }, {
    link: 'f-node-input-directive',
    text: 'Input',
    description: 'The FNodeInputDirective in Foblex Flow designates an element as an input within a node, managing connection behaviors such as multiple connections, disabled states, and connectability. It allows for flexible input management in complex flow-based diagrams and dataflows.',
  }, {
    link: 'f-node-outlet-directive',
    text: 'Outlet',
    description: 'The FNodeOutletDirective in Foblex Flow centralizes the creation of connections within a node by providing a single outlet point. It simplifies the connection process by linking new connections to the first available output, streamlining node management in dynamic graphs and workflows.',
  }]);
}

function extendsGroup(): INavigationGroup {
  return defineNavigationGroup('Extends', [{
    link: 'f-draggable-directive',
    text: 'Drag and Drop',
    description: 'The FDraggableDirective in Foblex Flow adds draggable functionality to flow components, enabling interactive movement and management of elements within flowcharts and node-based UIs. It supports drag-and-drop operations, node creation, and connection reassignment for enhanced user interaction.'
  }, {
    link: 'f-zoom-directive',
    text: 'Zoom',
    description: 'The FZoomDirective in Foblex Flow enables zoom and pan functionality for the canvas, allowing users to interactively control the scale and position of elements. It supports mouse wheel zooming, double-click zoom, and programmatic control, enhancing navigation in complex diagrams.'
  }, {
    link: 'f-background-component',
    text: 'Background',
    description: 'The FBackgroundComponent in Foblex Flow provides dynamic, pattern-based background designs for the canvas, supporting customizable circle and rectangle patterns. It allows for seamless integration of custom patterns, adapting to transformations like scaling and positioning in flow diagrams.'
  }, {
    link: 'f-line-alignment-component',
    text: 'Line Alignment',
    description: 'The FLineAlignmentComponent in Foblex Flow assists with aligning nodes on a canvas by providing visual guidelines. It detects node positions and draws intersecting lines when nodes are dragged within a specified threshold, ensuring precise alignment in flowcharts and diagrams.'
  }, {
    link: 'f-minimap-component',
    text: 'Minimap',
    description: 'The FMinimapComponent in Foblex Flow provides a miniature view of the larger flow, enhancing navigation with features like zooming, panning, and dynamic updates. It offers an efficient way to interact with and visualize the entire flow layout in complex diagrams.'
  }]);
}


