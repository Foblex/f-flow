import { MarkConnectableConnectors } from './mark-connectable-connectors';
import { UnmarkConnectableConnectors } from './unmark-connectable-connectors';
import { CalculateTargetConnectorsToConnect } from './calculate-target-connectors-to-connect';
import { GetConnectorRectReference } from './get-connector-rect-reference';
import { CalculateClosestConnector } from './calculate-closest-connector';
import { CalculateSourceConnectorsToConnect } from './calculate-source-connectors-to-connect';
import { FindConnectableConnectorUsingPriorityAndPosition } from './find-connectable-connector-using-priority-and-position';
import { AddConnectorToStore } from './add-connector-to-store';
import { RemoveConnectorFromStore } from './remove-connector-from-store';
import { fExecution } from '../../_libs/f-mediator';
import { CalculateClosestConnectorRequest } from './calculate-closest-connector/calculate-closest-connector-request';
import { CalculateSourceConnectorsToConnectRequest } from './calculate-source-connectors-to-connect/calculate-source-connectors-to-connect-request';
import { CalculateTargetConnectorsToConnectRequest } from './calculate-target-connectors-to-connect/calculate-target-connectors-to-connect-request';
import { FindConnectableConnectorUsingPriorityAndPositionRequest } from './find-connectable-connector-using-priority-and-position/find-connectable-connector-using-priority-and-position-request';
import { GetConnectorRectReferenceRequest } from './get-connector-rect-reference/get-connector-rect-reference-request';
import { MarkConnectableConnectorsRequest } from './mark-connectable-connectors/mark-connectable-connectors-request';
import { RemoveConnectorFromStoreRequest } from './remove-connector-from-store/remove-connector-from-store-request';
import { UnmarkConnectableConnectorsRequest } from './unmark-connectable-connectors/unmark-connectable-connectors-request';
import { AddConnectorToStoreRequest } from './add-connector-to-store/add-connector-to-store-request';
/*
 * This file exports all the connector-related executions that can be used in the FFlow domain.
 */
export const F_CONNECTORS_FEATURES = [
  fExecution(AddConnectorToStoreRequest, AddConnectorToStore),

  fExecution(RemoveConnectorFromStoreRequest, RemoveConnectorFromStore),

  fExecution(CalculateClosestConnectorRequest, CalculateClosestConnector),

  fExecution(
    FindConnectableConnectorUsingPriorityAndPositionRequest,
    FindConnectableConnectorUsingPriorityAndPosition,
  ),

  fExecution(CalculateSourceConnectorsToConnectRequest, CalculateSourceConnectorsToConnect),

  fExecution(CalculateTargetConnectorsToConnectRequest, CalculateTargetConnectorsToConnect),

  fExecution(GetConnectorRectReferenceRequest, GetConnectorRectReference),

  fExecution(MarkConnectableConnectorsRequest, MarkConnectableConnectors),

  fExecution(UnmarkConnectableConnectorsRequest, UnmarkConnectableConnectors),
];
