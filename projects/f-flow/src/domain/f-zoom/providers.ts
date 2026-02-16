import { SetZoom } from './set-zoom';
import { ResetZoom } from './reset-zoom';

/**
 * Collection of all FZoom feature executions.
 * These executions handle the addition, removal, and resetting of zoom levels
 * in the FComponentsStore.
 */
export const F_ZOOM_FEATURES = [ResetZoom, SetZoom];
