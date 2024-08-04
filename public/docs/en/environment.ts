import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';
import { SimpleFlowComponent } from '../../../projects/f-examples/simple-flow/simple-flow.component';
import { DraggableFlowComponent } from '../../../projects/f-examples/draggable-flow/draggable-flow.component';
import { ConnectionTypeComponent } from '../../../projects/f-examples/connection-type/connection-type.component';
import {
  ConnectionBehaviourComponent
} from '../../../projects/f-examples/connection-behaviour/connection-behaviour.component';
import {
  CustomConnectionTypeComponent
} from '../../../projects/f-examples/custom-connection-type/custom-connection-type.component';
import { CreateConnectionComponent } from '../../../projects/f-examples/create-connection/create-connection.component';
import { ConnectableSideComponent } from '../../../projects/f-examples/connectable-side/connectable-side.component';
import {
  ConnectionFromOutletComponent
} from '../../../projects/f-examples/connection-from-outlet/connection-from-outlet.component';
import {
  ConnectionMarkersComponent
} from '../../../projects/f-examples/connection-markers/connection-markers.component';
import { ZoomExampleComponent } from '../../../projects/f-examples/zoom-example/zoom-example.component';
import {
  BackgroundExampleComponent
} from '../../../projects/f-examples/background-example/background-example.component';
import {
  LineAlignmentExampleComponent
} from '../../../projects/f-examples/line-alignment-example/line-alignment-example.component';

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
      extendsGroup()
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
      { tag: 'simple-flow', component: SimpleFlowComponent },
      { tag: 'draggable-flow', component: DraggableFlowComponent },
      { tag: 'connection-type', component: ConnectionTypeComponent },
      { tag: 'connection-behaviour', component: ConnectionBehaviourComponent },
      { tag: 'custom-connection-type', component: CustomConnectionTypeComponent },
      { tag: 'create-connection', component: CreateConnectionComponent },
      { tag: 'connectable-side', component: ConnectableSideComponent },
      { tag: 'connection-from-outlet', component: ConnectionFromOutletComponent },
      { tag: 'connection-markers', component: ConnectionMarkersComponent },
      { tag: 'zoom-example', component: ZoomExampleComponent },
      { tag: 'background-example', component: BackgroundExampleComponent },
      { tag: 'line-alignment-example', component: LineAlignmentExampleComponent },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@foblex/flow' },
    ],
    toC:{
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
      },
      {
        link: 'f-canvas-component',
        text: 'Canvas',
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
      },
      {
        link: 'f-connection-for-create-component',
        text: 'Create Connection',
      },
      {
        link: 'f-connection-marker-directive',
        text: 'Connection Marker',
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
      },
      {
        link: 'f-node-input-directive',
        text: 'Input',
      },
      {
        link: 'f-node-outlet-directive',
        text: 'Outlet',
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
      },
      {
        link: 'f-zoom-directive',
        text: 'Zoom',
      },
      {
        link: 'f-background-component',
        text: 'Background',
      },
      {
        link: 'f-line-alignment-component',
        text: 'Line Alignment',
      },
    ],
  }
}

