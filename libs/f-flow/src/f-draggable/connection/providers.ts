import {
  CreateConnectionFromOutputPreparation,
  CreateConnectionPreparation,
  CreateConnectionCreateDragHandler,
  CreateConnectionFinalize,
  CreateConnectionFromConnectorPreparation,
  CreateConnectionFromOutletPreparation,
  FCreateConnectionSession,
  ResolveConnectableOutputForOutlet,
} from './create-connection';
import { ReassignConnectionFinalize, ReassignConnectionPreparation } from './reassign-connection';
import {
  DragConnectionWaypointFinalize,
  DragConnectionWaypointPreparation,
} from './drag-connection-waypoint';

export const DRAG_CONNECTIONS_PROVIDERS = [
  FCreateConnectionSession,

  CreateConnectionFinalize,

  CreateConnectionCreateDragHandler,

  CreateConnectionFromConnectorPreparation,

  CreateConnectionFromOutletPreparation,

  ResolveConnectableOutputForOutlet,

  CreateConnectionFromOutputPreparation,

  CreateConnectionPreparation,

  ReassignConnectionFinalize,

  ReassignConnectionPreparation,

  DragConnectionWaypointPreparation,

  DragConnectionWaypointFinalize,
];
