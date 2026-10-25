import { SetZoom } from './set-zoom';
import { ResetZoom } from './reset-zoom';
import { fExecution } from '../../_libs/f-mediator';
import { ResetZoomRequest } from './reset-zoom/reset-zoom-request';
import { SetZoomRequest } from './set-zoom/set-zoom-request';

/**
 * Collection of all FZoom feature executions.
 * These executions handle the addition, removal, and resetting of zoom levels
 * in the FComponentsStore.
 */
export const F_ZOOM_FEATURES = [
  fExecution(ResetZoomRequest, ResetZoom),
  fExecution(SetZoomRequest, SetZoom),
];
