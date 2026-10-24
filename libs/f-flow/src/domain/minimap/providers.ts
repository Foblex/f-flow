import { MinimapDrawNodes } from './minimap-draw-nodes';
import { MinimapCalculateViewport } from './minimap-calculate-viewport';
import { MinimapCalculateViewRect } from './minimap-calculate-view-rect';
import { MinimapNodeRects } from './minimap-node-rects';
import { fExecution } from '../../_libs/f-mediator';
import { MinimapCalculateViewRectRequest } from './minimap-calculate-view-rect/minimap-calculate-view-rect-request';
import { MinimapCalculateViewportRequest } from './minimap-calculate-viewport/minimap-calculate-viewport-request';
import { MinimapDrawNodesRequest } from './minimap-draw-nodes/minimap-draw-nodes-request';

export const F_MINIMAP_FEATURES = [
  fExecution(MinimapDrawNodesRequest, MinimapDrawNodes),

  fExecution(MinimapCalculateViewportRequest, MinimapCalculateViewport),

  fExecution(MinimapCalculateViewRectRequest, MinimapCalculateViewRect),

  MinimapNodeRects,
];
