import { IRoundedRect } from '@foblex/2d';
import { DragNodeConnectionHandlerBase } from '../../drag-node/drag-node-dependent-connection-handlers';
import { FConnectorBase } from '../../../f-connectors';

export interface IResizeNodeConnectionEndpointHandler {
  handler: DragNodeConnectionHandlerBase;
  connector: FConnectorBase;
  baselineRect: IRoundedRect;
}

export interface IResizeNodeConnectionHandlers {
  source: IResizeNodeConnectionEndpointHandler[];
  target: IResizeNodeConnectionEndpointHandler[];
}
