import { MarkConnectableConnectors } from './mark-connectable-connectors';
import { UnmarkConnectableConnectors } from './unmark-connectable-connectors';
import { CalculateTargetConnectorsToConnect } from './calculate-target-connectors-to-connect';
import { GetConnectorRectReference } from './get-connector-rect-reference';
import { CalculateClosestConnector } from './calculate-closest-connector';
import { CalculateSourceConnectorsToConnect } from './calculate-source-connectors-to-connect';
import { FindConnectableConnectorUsingPriorityAndPositionExecution } from './find-connectable-connector-using-priority-and-position';
import { AddConnectorToStore } from './add-connector-to-store';
import { RemoveConnectorFromStore } from './remove-connector-from-store';
/*
 * This file exports all the connector-related executions that can be used in the FFlow domain.
 */
export const F_CONNECTORS_FEATURES = [
  AddConnectorToStore,

  RemoveConnectorFromStore,

  CalculateClosestConnector,

  FindConnectableConnectorUsingPriorityAndPositionExecution,

  CalculateSourceConnectorsToConnect,

  CalculateTargetConnectorsToConnect,

  GetConnectorRectReference,

  MarkConnectableConnectors,

  UnmarkConnectableConnectors,
];
