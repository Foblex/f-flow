import {
  CreateConnectionFromOutputPreparation,
  CreateConnectionPreparation,
  FCreateConnectionDragHandlerPreparationExecution,
  FCreateConnectionFinalizeExecution,
  FCreateConnectionFromOutletPreparationExecution,
  GetFirstConnectableOutputExecution,
} from './f-create-connection';
import {
  FReassignConnectionFinalizeExecution,
  FReassignConnectionPreparationExecution,
} from './f-reassign-connection';
import {
  MoveConnectionWaypointFinalize,
  MoveConnectionWaypointPreparation,
} from './move-connection-waypoint';

export const CONNECTIONS_PROVIDERS = [
  FCreateConnectionFinalizeExecution,

  FCreateConnectionDragHandlerPreparationExecution,

  FCreateConnectionFromOutletPreparationExecution,

  GetFirstConnectableOutputExecution,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  FReassignConnectionFinalizeExecution,

  FReassignConnectionPreparationExecution,

  MoveConnectionWaypointPreparation,

  MoveConnectionWaypointFinalize,
];
