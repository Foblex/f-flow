import { FCache } from './model';
import { fExecution } from '../_libs/f-mediator';
import { GetCachedFCacheRectRequest } from './features/f-cache-rects/get-cached-rect/get-cached-rect-request';
import { InvalidateFCacheNodeRequest } from './features/f-cache-nodes/invalidate-node/invalidate-node-request';
import { RegisterFCacheConnectorRequest } from './features/f-cache-connectors/register-connector/register-connector-request';
import { RegisterFCacheNodeRequest } from './features/f-cache-nodes/register-node/register-node-request';
import { SetFCacheConnectorRectRequest } from './features/f-cache-rects/set-connector-rect/set-connector-rect-request';
import { SetFCacheNodeRectRequest } from './features/f-cache-rects/set-node-rect/set-node-rect-request';
import { UnregisterFCacheConnectorRequest } from './features/f-cache-connectors/unregister-connector/unregister-connector-request';
import { UnregisterFCacheNodeRequest } from './features/f-cache-nodes/unregister-node/unregister-node-request';
import { UpdateFCacheRectByElementRequest } from './features/f-cache-rects/update-rect-by-element/update-rect-by-element-request';
import {
  GetCachedFCacheRect,
  InvalidateFCacheNode,
  RegisterFCacheConnector,
  RegisterFCacheNode,
  SetFCacheConnectorRect,
  SetFCacheNodeRect,
  UnregisterFCacheConnector,
  UnregisterFCacheNode,
  UpdateFCacheRectByElement,
} from './features';

export const F_CACHE_FEATURES = [
  FCache,

  fExecution(RegisterFCacheNodeRequest, RegisterFCacheNode),
  fExecution(UnregisterFCacheNodeRequest, UnregisterFCacheNode),
  fExecution(InvalidateFCacheNodeRequest, InvalidateFCacheNode),

  fExecution(RegisterFCacheConnectorRequest, RegisterFCacheConnector),
  fExecution(UnregisterFCacheConnectorRequest, UnregisterFCacheConnector),

  fExecution(GetCachedFCacheRectRequest, GetCachedFCacheRect),
  fExecution(SetFCacheNodeRectRequest, SetFCacheNodeRect),
  fExecution(SetFCacheConnectorRectRequest, SetFCacheConnectorRect),
  fExecution(UpdateFCacheRectByElementRequest, UpdateFCacheRectByElement),
];
