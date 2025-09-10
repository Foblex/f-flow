import { AddZoomToStoreExecution } from './add-zoom-to-store';
import { RemoveZoomFromStoreExecution } from './remove-zoom-from-store';
import { SetZoomExecution } from './set-zoom';
import { ResetZoomExecution } from './reset-zoom';

/**
 * Collection of all FZoom feature executions.
 * These executions handle the addition, removal, and resetting of zoom levels
 * in the FComponentsStore.
 */
export const F_ZOOM_FEATURES = [

  AddZoomToStoreExecution,

  RemoveZoomFromStoreExecution,

  ResetZoomExecution,

  SetZoomExecution,
];
