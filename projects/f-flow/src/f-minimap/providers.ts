import { FMinimapComponent } from './f-minimap.component';
import { FMinimapViewDirective } from './f-minimap-view.directive';
import { FMinimapFlowDirective } from './f-minimap-flow.directive';
import { FMinimapCanvasDirective } from './f-minimap-canvas.directive';

export const F_MINIMAP_PROVIDERS = [

  FMinimapComponent,

  FMinimapCanvasDirective,

  FMinimapViewDirective,

  FMinimapFlowDirective,
];
