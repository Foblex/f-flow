import { FGeometryCache } from './f-geometry-cache';
import { RegisterNodeGeometryExecution } from './register-node-geometry';
import { RegisterConnectorGeometryExecution } from './register-connector-geometry';
import { GetConnectorGeometryExecution } from './get-connector-geometry';
import { BeginNodeDragSessionExecution } from './begin-node-drag-session';
import { UpdateNodeDragDeltaExecution } from './update-node-drag-delta';
import { EndNodeDragSessionExecution } from './end-node-drag-session';
import { QueryVisibleNodesExecution } from './query-visible-nodes';
import { InvalidateNodeGeometryExecution } from './invalidate-node-geometry';
import { EnsureNodeGeometryFreshExecution } from './ensure-node-geometry-fresh';
import { SetModelNodeRectExecution } from './set-model-node-rect';
import { SetModelConnectorAnchorExecution } from './set-model-connector-anchor';

export const F_GEOMETRY_CACHE_FEATURES = [
  FGeometryCache,
  RegisterNodeGeometryExecution,
  RegisterConnectorGeometryExecution,
  GetConnectorGeometryExecution,
  BeginNodeDragSessionExecution,
  UpdateNodeDragDeltaExecution,
  EndNodeDragSessionExecution,
  QueryVisibleNodesExecution,
  InvalidateNodeGeometryExecution,
  EnsureNodeGeometryFreshExecution,
  SetModelNodeRectExecution,
  SetModelConnectorAnchorExecution,
];
