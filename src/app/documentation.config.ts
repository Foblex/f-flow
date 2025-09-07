import {
  defineLazyComponent,
  defineNavigationGroup, INavigationGroup,
  provide404Markdown,
  provideComponents,
  provideDirectory,
  provideFooterNavigation,
  provideHeader,
  provideHeaderMediaLinks,
  provideHeaderNavigation, provideHeaderSearch,
  provideLanguage,
  provideLogo,
  provideNavigation,
  provideTitle,
  provideTableOfContent, provideMeta,
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
      defineLazyComponent('custom-connection-type', () => import('../../projects/f-examples/connections/custom-connection-type/custom-connection-type.component')),
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
    provideTableOfContent({
      title: 'In this articles',
      range: {start: 2, end: 6},
    }),
    provideHeader(
      provideHeaderSearch(false),
      provideHeaderNavigation([{
        link: '/docs/get-started',
        active: '/docs',
        text: 'Docs',
      }, {
        link: '/examples/overview',
        active: '/examples',
        text: 'Examples',
      }, {
        link: '/showcase/overview',
        active: '/showcase',
        text: 'Showcase',
      }]),
      provideHeaderMediaLinks([
        {icon: 'github', link: 'https://github.com/Foblex/f-flow'},
        {icon: 'twitter', link: 'https://x.com/foblexflow'},
      ]),
    ),
    provideFooterNavigation({
      editLink: {
        pattern: 'https://github.com/foblex/f-flow/edit/main/public/docs/',
        text: 'Edit this page on GitHub'
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
    description: "Introducing Foblex Flow — Angular library for building flowcharts, graphs and interactive node-based UIs with connections",
  }, {
    link: 'get-started',
    text: 'Installation and Rendering',
    description: "Get started with Foblex Flow — Angular flowchart & diagram library. Install, render nodes and connections, copy-paste snippets.",
  }])
}

function containerGroup(): INavigationGroup {
  return defineNavigationGroup('Containers', [{
    link: 'f-flow-component',
    text: 'Flow',
    description: 'Angular Flow Component — core diagram builder. Inputs, outputs, events and patterns for creating scalable flowcharts & graphs.',
  }, {
    link: 'f-canvas-component',
    text: 'Canvas',
    description: 'Angular Canvas Component — scalable container for flowcharts. Supports zoom, pan, fitting, and rendering interactive diagrams.',
  }])
}

function nodeGroup(): INavigationGroup {
  return defineNavigationGroup('Node', [{
    link: 'f-node-directive',
    text: 'Node',
    description: 'Angular Node Directive — create draggable, selectable and styled nodes. Build interactive diagrams and node-based UIs.',
    image: 'https://flow.foblex.com/f-node-directive.png',
    image_type: 'image/png',
    image_width: 1458,
    image_height: 959,
  }, {
    link: 'f-drag-handle-directive',
    text: 'Drag Handle',
    description: 'Angular Drag Handle Directive — define draggable areas for nodes. Precise drag control for custom flowcharts and diagrams.',
  }])
}

function connectionGroup(): INavigationGroup {
  return defineNavigationGroup('Connection', [{
    link: 'f-connection-component',
    text: 'Connection',
    description: 'Angular Connection Component — customizable connectors between nodes. Supports styles, behaviors and interactive flows.',
  }, {
    link: 'f-connection-for-create-component',
    text: 'Create Connection',
    description: 'Angular Create Connection Component — drag to create node links. Build dynamic workflows in Angular diagrams.',
  }, {
    link: 'f-connection-marker-directive',
    text: 'Connection Marker',
    description: 'Angular Connection Marker Directive — add start or end markers. SVG customization for flowchart connectors.',
  }, {
    link: 'f-snap-connection-component',
    text: 'Snap Connection',
    description: 'Angular Snap Connection Component — auto-snap links to inputs. Intuitive drag-to-connect in flowcharts & node editors.',
  }])
}

function connectorGroup(): INavigationGroup {
  return defineNavigationGroup('Connectors', [{
    link: 'f-node-output-directive',
    text: 'Output',
    description: 'Angular Node Output Directive — manage multiple outputs and sides. Flexible connectors for complex flowcharts & diagrams.',
  }, {
    link: 'f-node-input-directive',
    text: 'Input',
    description: 'Angular Node Input Directive — define node inputs with connect rules. Control connections in Angular diagrams & workflows.',
  }, {
    link: 'f-node-outlet-directive',
    text: 'Outlet',
    description: 'Angular Node Outlet Directive — single outlet for node connections. Simplify node management in flowcharts & graphs.',
  }]);
}

function extendsGroup(): INavigationGroup {
  return defineNavigationGroup('Extends', [{
    link: 'f-draggable-directive',
    text: 'Drag and Drop',
    description: 'Angular Draggable Directive — enable drag-and-drop for nodes. Move, create and reassign elements in flowcharts.'
  }, {
    link: 'f-zoom-directive',
    text: 'Zoom',
    description: 'Angular Zoom Directive — zoom and pan canvas with mouse or API. Navigate large diagrams and workflows in Angular.'
  }, {
    link: 'f-background-component',
    text: 'Background',
    description: 'Angular Background Component — add grid or pattern backgrounds. Scales and adapts with flowchart transformations.'
  }, {
    link: 'f-line-alignment-component',
    text: 'Line Alignment',
    description: 'Angular Line Alignment Component — show guides while dragging. Align nodes precisely in flowcharts and diagrams.'
  }, {
    link: 'f-minimap-component',
    text: 'Minimap',
    description: 'Angular Minimap Component — mini view of the whole diagram. Pan, zoom and explore complex Angular workflows.'
  }]);
}


