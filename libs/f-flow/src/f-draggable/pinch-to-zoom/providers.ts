import { PinchToZoomPreparation } from './pinch-to-zoom-preparation';
import { PinchToZoomFinalize } from './pinch-to-zoom-finalize';
import { fExecution } from '../../_libs/f-mediator';
import { PinchToZoomFinalizeRequest } from './pinch-to-zoom-finalize/pinch-to-zoom-finalize-request';
import { PinchToZoomPreparationRequest } from './pinch-to-zoom-preparation/pinch-to-zoom-preparation-request';

export const PINCH_TO_ZOOM_PROVIDERS = [
  fExecution(PinchToZoomPreparationRequest, PinchToZoomPreparation),
  fExecution(PinchToZoomFinalizeRequest, PinchToZoomFinalize),
];
