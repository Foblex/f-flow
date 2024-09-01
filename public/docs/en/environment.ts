import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';
import { ZoomExampleComponent } from '../../../projects/f-examples/zoom-example/zoom-example.component';
import {
  BackgroundExampleComponent
} from '../../../projects/f-examples/background-example/background-example.component';
import {
  LineAlignmentExampleComponent
} from '../../../projects/f-examples/line-alignment-example/line-alignment-example.component';
import {
  MinimapBasicExampleComponent
} from '../../../projects/f-examples/minimap-basic-example/minimap-basic-example.component';
import {
  MinimapScaledExampleComponent
} from '../../../projects/f-examples/minimap-scaled-example/minimap-scaled-example.component';

export const ENGLISH_ENVIRONMENT: IDocsEnvironment = createEnvironment();

function createEnvironment(): IDocsEnvironment {
  return {
    lang: 'en',
    docsDir: './docs/en/',
    logo: './logo.svg',
    title: 'Foblex Flow',
    version: {
      npmPackage: '@foblex/flow',
    },
    navigation: [
      introductionGroup(),
      containerGroup(),
      nodeGroup(),
      connectorGroup(),
      connectionGroup(),
      extendsGroup(),
      layoutGroup(),
      proExamplesGroup(),
    ],
    footerNavigation: {
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/en/',
        text: 'Edit this page on GitHub'
      },
      previous: 'Previous Page',
      next: 'Next Page',
    },
    components: [
      { tag: 'simple-flow', component: import('../../../projects/f-examples/simple-flow/simple-flow.component') },
      { tag: 'draggable-flow', component: import('../../../projects/f-examples/draggable-flow/draggable-flow.component') },
      { tag: 'connection-type', component: import('../../../projects/f-examples/connection-type/connection-type.component') },
      { tag: 'connection-behaviour', component: import('../../../projects/f-examples/connection-behaviour/connection-behaviour.component') },
      { tag: 'custom-connection-type', component: import('../../../projects/f-examples/custom-connection-type/custom-connection-type.component') },
      { tag: 'drag-to-connect', component: import('../../../projects/f-examples/drag-to-connect/drag-to-connect.component') },
      { tag: 'drag-to-reassign', component: import('../../../projects/f-examples/drag-to-reassign/drag-to-reassign.component') },
      { tag: 'connectable-side', component: import('../../../projects/f-examples/connectable-side/connectable-side.component') },
      { tag: 'connection-from-outlet', component: import('../../../projects/f-examples/connection-from-outlet/connection-from-outlet.component') },
      { tag: 'connection-markers', component: import('../../../projects/f-examples/connection-markers/connection-markers.component') },
      { tag: 'zoom-example', component: ZoomExampleComponent },
      { tag: 'background-example', component: BackgroundExampleComponent },
      { tag: 'line-alignment-example', component: LineAlignmentExampleComponent },
      { tag: 'vp-flow', component: import('../../../projects/f-pro-examples/visual-programming/components/flow/vp-flow.component') },
      { tag: 'db-management-flow', component: import('../../../projects/f-pro-examples/db-management-example/components/flow/db-management-flow.component') },
      { tag: 'minimap-basic-example', component: MinimapBasicExampleComponent },
      { tag: 'minimap-scaled-example', component: MinimapScaledExampleComponent },
      { tag: 'dagre-layout-example', component: import('../../../projects/f-examples/layout-and-behaviors/dagre-layout-example/dagre-layout-example.component') },
      { tag: 'elkjs-layout-example', component: import('../../../projects/f-examples/layout-and-behaviors/elkjs-layout-example/elkjs-layout-example.component') },
      { tag: 'node-with-connectors', component: import('../../../projects/f-examples/node-with-connectors/node-with-connectors.component') },
      { tag: 'node-with-position-example', component: import('../../../projects/f-examples/node/node-with-position-example/node-with-position-example.component') },
      { tag: 'adding-dragging-functionality-example', component: import('../../../projects/f-examples/node/adding-dragging-functionality-example/adding-dragging-functionality-example.component') },
      { tag: 'node-with-drag-handle-example', component: import('../../../projects/f-examples/node/node-with-drag-handle-example/node-with-drag-handle-example.component') },
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

function introductionGroup(): INavigationGroup {
  return {
    text: 'Introduction',
    items: [
      {
        link: 'get-started',
        text: 'Getting Started',
        description: 'Learn how to install and use Foblex Flow in your Angular project.',
      }
    ],
  }
}

function containerGroup(): INavigationGroup {
  return {
    text: 'Containers',
    items: [
      {
        link: 'f-flow-component',
        text: 'Flow',
        description: 'The FFlowComponent in Foblex Flow manages draggable and connectable elements within a visual canvas, enabling dynamic creation, positioning, and interaction of nodes. It supports layout calculation, event handling, and provides methods for node selection, flow manipulation, and custom styling.',
      },
      {
        link: 'f-canvas-component',
        text: 'Canvas',
        description: 'The FCanvasComponent in Foblex Flow provides a scalable and dynamic canvas for positioning and manipulating nodes and connections. It supports features like dynamic scaling, positioning, and optimized rendering, with methods for fitting the canvas to the screen and adjusting the scale.',
      },
    ],
  }
}

function nodeGroup(): INavigationGroup {
  return {
    text: 'Node',
    items: [
      {
        link: 'f-node-directive',
        text: 'Node',
        description: 'The FNodeDirective in Foblex Flow represents a node within a flow, allowing dynamic positioning, styling, and interaction with other nodes and connectors. It supports features like drag-and-drop, selection management, and customizable behaviors for advanced flow manipulations.',
        image: 'https://flow.foblex.com/f-node-directive.png'
      },
      {
        link: 'f-drag-handle-directive',
        text: 'Drag Handle',
        description: 'The FDragHandle directive in Foblex Flow designates the drag handle within a node, enabling precise control over dragging operations in a flow. It works with the FNode directive to facilitate customizable drag-and-drop functionality for interactive elements.',
      },
    ],
  }
}

function connectionGroup(): INavigationGroup {
  return {
    text: 'Connection',
    items: [
      {
        link: 'f-connection-component',
        text: 'Connection',
        description: 'The FConnectionComponent in Foblex Flow represents customizable connections between nodes in a flow, supporting various visual types, behaviors, and interactivity options. It allows for flexible connection styling, reassignment control, and dynamic flow management.',
      },
      {
        link: 'f-connection-for-create-component',
        text: 'Create Connection',
        description: 'The FConnectionForCreate component in Foblex Flow allows users to create connections between nodes by dragging to different node inputs. It supports dynamic connection creation within a flow, working seamlessly with the draggable directive for flexible node interaction.',
      },
      {
        link: 'f-connection-marker-directive',
        text: 'Connection Marker',
        description: 'The FMarkerDirective in Foblex Flow defines start or end markers for connections within a flow. It allows customization of marker type, size, and position, enabling precise control over the visual representation of connection endpoints using SVG elements.',
      },
    ],
  }
}

function connectorGroup(): INavigationGroup {
  return {
    text: 'Connectors',
    items: [
      {
        link: 'f-node-output-directive',
        text: 'Output',
        description: 'The FNodeOutputDirective in Foblex Flow designates an element as an output within a node, managing connection behaviors such as multiple connections, disabled states, and connectable sides. It provides flexibility in creating and managing output connections in complex flow diagrams.',
      },
      {
        link: 'f-node-input-directive',
        text: 'Input',
        description: 'The FNodeInputDirective in Foblex Flow designates an element as an input within a node, managing connection behaviors such as multiple connections, disabled states, and connectability. It allows for flexible input management in complex flow diagrams.',
      },
      {
        link: 'f-node-outlet-directive',
        text: 'Outlet',
        description: 'The FNodeOutletDirective in Foblex Flow centralizes the creation of connections within a node by providing a single outlet point. It simplifies the connection process by linking new connections to the first available output, offering a streamlined approach for managing node connections in flow diagrams.',
      },
    ],
  }
}

function extendsGroup(): INavigationGroup {
  return {
    text: 'Extends',
    items: [
      {
        link: 'f-draggable-directive',
        text: 'Drag and Drop',
        description: 'The FDraggableDirective in Foblex Flow adds draggable functionality to flow components, enabling interactive movement and management of elements within the flow. It supports drag-and-drop operations, node creation, and connection reassignment, enhancing user interaction in complex diagrams.'
      },
      {
        link: 'f-zoom-directive',
        text: 'Zoom',
        description: 'The FZoomDirective in Foblex Flow enables zoom and pan functionality for the canvas, allowing users to interactively control the scale and position of elements. It supports mouse wheel zooming, double-click zoom, and provides methods for programmatic control of the zoom level.'
      },
      {
        link: 'f-background-component',
        text: 'Background',
        description: 'The FBackgroundComponent in Foblex Flow provides dynamic, pattern-based background designs for the canvas, supporting customizable circle and rectangle patterns. It allows for seamless integration of custom patterns, adapting to transformations like scaling and positioning in flow diagrams.'
      },
      {
        link: 'f-line-alignment-component',
        text: 'Line Alignment',
        description: 'The FLineAlignmentComponent in Foblex Flow assists with aligning nodes on a canvas by providing visual guidelines. It detects node positions and draws intersecting lines when nodes are dragged within a specified threshold, helping to ensure precise alignment in flow diagrams.'
      },
      {
        link: 'f-minimap-component',
        text: 'Minimap',
        description: 'The FMinimapComponent in Foblex Flow provides a miniature view of the larger flow, enhancing navigation with features like zooming, panning, and dynamic updates. It offers users an efficient way to interact with and visualize the entire flow layout, with customizable scaling options.'
      }
    ],
  }
}

function layoutGroup(): INavigationGroup {
  return {
    text: 'Layouts & Behaviors',
    items: [
      {
        link: 'dagre-layout',
        text: 'Dagre Tree',
        description: 'Explore a tree layout example using Dagre.js with Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the Dagre layout engine.',
        image: 'https://flow.foblex.com/f-visual-programming-flow.png'
      },
      {
        link: 'elkjs-layout',
        text: 'ELKJS Tree',
        description: 'Explore a tree layout example using ELKJS with Foblex Flow to create structured and dynamic tree diagrams. This example demonstrates how to implement and customize tree layouts efficiently within a flow-based diagram using the ELKJS layout engine.',
        image: 'https://flow.foblex.com/f-db-management-flow.png'
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
      description: 'Learn how to create a visual programming interface using Foblex Flow. This example showcases features like adding and connecting nodes, zooming, panning, alignment, and more, providing a comprehensive guide to building interactive, flow-based diagrams.',
    },{
      text: 'DB Management Flow',
      link: 'f-db-management-flow',
      description: 'Discover how to create a database management flow using Foblex Flow. This example demonstrates connecting nodes, zooming, panning, alignment, form validation, and more, offering a comprehensive solution for building interactive database management interfaces.'
    }, {
      text: 'Call Center Flow',
      link: 'https://github.com/Foblex/f-flow-example',
    }, {
      text: 'Scheme Editor',
      link: 'https://github.com/Foblex/f-scheme-editor',
    } ]
  }
}
