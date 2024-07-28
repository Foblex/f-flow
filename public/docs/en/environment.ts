import { IDocsEnvironment, INavigationGroup } from '@foblex/f-docs';
import { SimpleFlowComponent } from '../../../projects/f-examples/simple-flow/simple-flow.component';
import { DraggableFlowComponent } from '../../../projects/f-examples/draggable-flow/draggable-flow.component';
import { ConnectionTypeComponent } from '../../../projects/f-examples/connection-type/connection-type.component';
import {
  ConnectionBehaviourComponent
} from '../../../projects/f-examples/connection-behaviour/connection-behaviour.component';
import {
  ProvideConnectionTypeComponent
} from '../../../projects/f-examples/provide-connection-type/provide-connection-type.component';
import { CreateConnectionComponent } from '../../../projects/f-examples/create-connection/create-connection.component';
import { ConnectableSideComponent } from '../../../projects/f-examples/connectable-side/connectable-side.component';
import {
  ConnectionFromOutletComponent
} from '../../../projects/f-examples/connection-from-outlet/connection-from-outlet.component';
import {
  ConnectionMarkersComponent
} from '../../../projects/f-examples/connection-markers/connection-markers.component';
import { ZoomExampleComponent } from '../../../projects/f-examples/zoom-example/zoom-example.component';

export const ENGLISH_ENVIRONMENT: IDocsEnvironment = createEnvironment();

function createEnvironment(): IDocsEnvironment {
  return {
    lang: 'en',
    docsDir: './docs/en/',
    logo: './logo.svg',
    title: 'Documentation',
    version: '12.3.6',
    navigation: [
      introductionGroup(),
      containerGroup(),
      nodeGroup(),
      connectorGroup(),
      connectionGroup(),
      extendsGroup()
    ],
    components: [
      { tag: 'simple-flow', component: SimpleFlowComponent },
      { tag: 'draggable-flow', component: DraggableFlowComponent },
      { tag: 'connection-type', component: ConnectionTypeComponent },
      { tag: 'connection-behaviour', component: ConnectionBehaviourComponent },
      { tag: 'provide-connection-type', component: ProvideConnectionTypeComponent },
      { tag: 'create-connection', component: CreateConnectionComponent },
      { tag: 'connectable-side', component: ConnectableSideComponent },
      { tag: 'connection-from-outlet', component: ConnectionFromOutletComponent },
      { tag: 'connection-markers', component: ConnectionMarkersComponent },
      { tag: 'zoom-example', component: ZoomExampleComponent },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Foblex/f-flow' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@foblex/flow' },
    ]
  }
}

function introductionGroup(): INavigationGroup {
  return {
    text: 'Introduction',
    items: [
      {
        link: 'get-started',
        text: 'Getting Started',
      },
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
    ],
  }
}

