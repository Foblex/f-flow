import { ResizeNodeConnectionHandlerBase } from './resize-node-dependent-connection-handlers';
import { FConnectorBase } from '../../../f-connectors';

export interface IResizeNodeConnectionEndpointHandler {
  handler: ResizeNodeConnectionHandlerBase;
  connector: FConnectorBase;
}

export interface IResizeNodeConnectionHandlers {
  source: IResizeNodeConnectionEndpointHandler[];
  target: IResizeNodeConnectionEndpointHandler[];
}
