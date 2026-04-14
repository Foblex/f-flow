import { FCache } from './model';
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

  RegisterFCacheNode,
  UnregisterFCacheNode,
  InvalidateFCacheNode,

  RegisterFCacheConnector,
  UnregisterFCacheConnector,

  GetCachedFCacheRect,
  SetFCacheNodeRect,
  SetFCacheConnectorRect,
  UpdateFCacheRectByElement,
];
