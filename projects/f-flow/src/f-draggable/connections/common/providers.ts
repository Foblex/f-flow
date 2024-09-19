import { FindClosestInputUsingSnapThresholdExecution } from './find-closest-input-using-snap-threshold';
import { GetAllCanBeConnectedInputPositionsExecution } from './get-all-can-be-connected-input-positions';
import { GetConnectorWithRectExecution } from './get-connector-with-rect';
import { GetInputUnderPointerExecution, GetInputUnderPointerValidator } from './get-input-under-pointer';

export const CONNECTION_DRAG_COMMON_PROVIDERS = [

  FindClosestInputUsingSnapThresholdExecution,

  GetAllCanBeConnectedInputPositionsExecution,

  GetConnectorWithRectExecution,

  GetInputUnderPointerExecution,
  GetInputUnderPointerValidator
];
