import {
  CreateConnectionFromOutputPreparation,
  CreateConnectionPreparation,
  CreateConnectionCreateDragHandler,
  CreateConnectionFinalize,
  CreateConnectionFromOutletPreparation,
  ResolveConnectableOutputForOutlet,
} from './create-connection';
import { ReassignConnectionFinalize, ReassignConnectionPreparation } from './reassign-connection';
import {
  DragConnectionWaypointFinalize,
  DragConnectionWaypointPreparation,
} from './drag-connection-waypoint';

export const CONNECTIONS_PROVIDERS = [
  CreateConnectionFinalize,

  CreateConnectionCreateDragHandler,

  CreateConnectionFromOutletPreparation,

  ResolveConnectableOutputForOutlet,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  ReassignConnectionFinalize,

  ReassignConnectionPreparation,

  DragConnectionWaypointPreparation,

  DragConnectionWaypointFinalize,
];
