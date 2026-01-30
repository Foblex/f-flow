import {
  CreateConnectionFromOutputPreparation,
  CreateConnectionPreparation,
  CreateConnectionCreateDragHandler,
  CreateConnectionFinalize,
  CreateConnectionFromOutletPreparation,
  ResolveConnectableOutputForOutlet,
} from './create-connection';
import {
  FReassignConnectionFinalizeExecution,
  FReassignConnectionPreparationExecution,
} from './f-reassign-connection';
import {
  MoveConnectionWaypointFinalize,
  MoveConnectionWaypointPreparation,
} from './move-connection-waypoint';

export const CONNECTIONS_PROVIDERS = [
  CreateConnectionFinalize,

  CreateConnectionCreateDragHandler,

  CreateConnectionFromOutletPreparation,

  ResolveConnectableOutputForOutlet,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  FReassignConnectionFinalizeExecution,

  FReassignConnectionPreparationExecution,

  MoveConnectionWaypointPreparation,

  MoveConnectionWaypointFinalize,
];
