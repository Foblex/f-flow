import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F_CONNECTION_PROVIDERS, } from './f-connection';
import { F_NODE_PROVIDERS } from './f-node';
import { F_FLOW_PROVIDERS } from './f-flow';
import { F_BACKGROUND_PROVIDERS } from './f-backgroud';
import { F_CANVAS_PROVIDERS } from './f-canvas';
import { F_CONNECTORS_PROVIDERS } from './f-connectors';
import { FDraggableDirective } from './f-draggable';
import { F_EXTERNAL_ITEM_PROVIDERS } from './f-external-item';
import { F_SELECTION_AREA_PROVIDERS } from './f-selection-area';
import { F_LINE_ALIGNMENT_PROVIDERS } from './f-line-alignment';

@NgModule({
  declarations: [
    ...F_BACKGROUND_PROVIDERS,
    ...F_CANVAS_PROVIDERS,
    ...F_CONNECTION_PROVIDERS,
    ...F_CONNECTORS_PROVIDERS,
    ...F_EXTERNAL_ITEM_PROVIDERS,
    ...F_FLOW_PROVIDERS,
    ...F_LINE_ALIGNMENT_PROVIDERS,
    ...F_NODE_PROVIDERS,
    ...F_SELECTION_AREA_PROVIDERS,

    FDraggableDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...F_BACKGROUND_PROVIDERS,
    ...F_CANVAS_PROVIDERS,
    ...F_CONNECTION_PROVIDERS,
    ...F_CONNECTORS_PROVIDERS,
    ...F_EXTERNAL_ITEM_PROVIDERS,
    ...F_FLOW_PROVIDERS,
    ...F_LINE_ALIGNMENT_PROVIDERS,
    ...F_NODE_PROVIDERS,
    ...F_SELECTION_AREA_PROVIDERS,

    FDraggableDirective,
  ]
})
export class FFlowModule {
}
