import { AddInputToStore } from './add-input-to-store';
import { AddOutletToStore } from './add-outlet-to-store';
import { AddOutputToStore } from './add-output-to-store';
import { RemoveInputFromStore } from './remove-input-from-store';
import { RemoveOutletFromStoreExecution } from './remove-outlet-from-store';
import { RemoveOutputFromStoreExecution } from './remove-output-from-store';
import { MarkConnectableConnectors } from './mark-connectable-connectors';
import { UnmarkConnectableConnectors } from './unmark-connectable-connectors';
import { CalculateTargetConnectorsToConnect } from './calculate-target-connectors-to-connect';
import { GetConnectorRectReference } from './get-connector-rect-reference';
import { CalculateClosestConnector } from './calculate-closest-connector';
import { CalculateSourceConnectorsToConnect } from './calculate-source-connectors-to-connect';
import { FindConnectableConnectorUsingPriorityAndPositionExecution } from './find-connectable-connector-using-priority-and-position';
/*
 * This file exports all the connector-related executions that can be used in the FFlow domain.
 */
export const F_CONNECTORS_FEATURES = [
  AddInputToStore,

  AddOutletToStore,

  AddOutputToStore,

  CalculateClosestConnector,

  FindConnectableConnectorUsingPriorityAndPositionExecution,

  CalculateSourceConnectorsToConnect,

  CalculateTargetConnectorsToConnect,

  GetConnectorRectReference,

  MarkConnectableConnectors,

  RemoveInputFromStore,

  RemoveOutletFromStoreExecution,

  RemoveOutputFromStoreExecution,

  UnmarkConnectableConnectors,
];
