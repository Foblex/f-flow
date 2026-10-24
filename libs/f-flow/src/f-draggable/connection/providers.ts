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
import { fExecution } from '../../_libs/f-mediator';
import { CreateConnectionCreateDragHandlerRequest } from './create-connection/create-connection-preparation/create-drag-handler/create-connection-create-drag-handler-request';
import { CreateConnectionFinalizeRequest } from './create-connection/create-connection-finalize/create-connection-finalize-request';
import { CreateConnectionFromConnectorPreparationRequest } from './create-connection/create-connection-preparation/from-connector-preparation/create-connection-from-connector-preparation-request';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection/create-connection-preparation/from-outlet-preparation/create-connection-from-outlet-preparation-request';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection/create-connection-preparation/from-output-preparation/create-connection-from-output-preparation-request';
import { CreateConnectionPreparationRequest } from './create-connection/create-connection-preparation/create-connection-preparation-request';
import { DragConnectionWaypointFinalizeRequest } from './drag-connection-waypoint/drag-connection-waypoint-finalize/drag-connection-waypoint-finalize-request';
import { DragConnectionWaypointPreparationRequest } from './drag-connection-waypoint/drag-connection-waypoint-preparation/drag-connection-waypoint-preparation-request';
import { ReassignConnectionFinalizeRequest } from './reassign-connection/reassign-connection-finalize/reassign-connection-finalize-request';
import { ReassignConnectionPreparationRequest } from './reassign-connection/reassign-connection-preparation/reassign-connection-preparation-request';
import { ResolveConnectableOutputForOutletRequest } from './create-connection/resolve-connectable-output-for-outlet/resolve-connectable-output-for-outlet-request';
import {
  DragConnectionWaypointFinalize,
  DragConnectionWaypointPreparation,
} from './drag-connection-waypoint';

export const DRAG_CONNECTIONS_PROVIDERS = [
  FCreateConnectionSession,

  fExecution(CreateConnectionFinalizeRequest, CreateConnectionFinalize),

  fExecution(CreateConnectionCreateDragHandlerRequest, CreateConnectionCreateDragHandler),

  fExecution(
    CreateConnectionFromConnectorPreparationRequest,
    CreateConnectionFromConnectorPreparation,
  ),

  fExecution(CreateConnectionFromOutletPreparationRequest, CreateConnectionFromOutletPreparation),

  fExecution(ResolveConnectableOutputForOutletRequest, ResolveConnectableOutputForOutlet),

  fExecution(CreateConnectionFromOutputPreparationRequest, CreateConnectionFromOutputPreparation),

  fExecution(CreateConnectionPreparationRequest, CreateConnectionPreparation),

  fExecution(ReassignConnectionFinalizeRequest, ReassignConnectionFinalize),

  fExecution(ReassignConnectionPreparationRequest, ReassignConnectionPreparation),

  fExecution(DragConnectionWaypointPreparationRequest, DragConnectionWaypointPreparation),

  fExecution(DragConnectionWaypointFinalizeRequest, DragConnectionWaypointFinalize),
];
