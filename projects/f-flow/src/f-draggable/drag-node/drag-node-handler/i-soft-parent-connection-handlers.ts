import { IRoundedRect } from '@foblex/2d';
import { DragNodeConnectionHandlerBase } from '../drag-node-dependent-connection-handlers';
import { FConnectorBase } from '../../../f-connectors';

export interface IParentConnectionEndpointHandler {
  handler: DragNodeConnectionHandlerBase;
  connector: FConnectorBase;
  baselineRect: IRoundedRect;
}

export interface IParentConnectionHandlers {
  source: IParentConnectionEndpointHandler[];
  target: IParentConnectionEndpointHandler[];
}
