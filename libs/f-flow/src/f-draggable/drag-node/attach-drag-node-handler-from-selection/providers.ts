import { AttachDragNodeHandlerFromSelection } from './attach-drag-node-handler-from-selection';
import { AttachTargetConnectionDragHandlersToNode } from './attach-target-connection-drag-handlers-to-node';
import { AttachSourceConnectionDragHandlersToNode } from './attach-source-connection-drag-handlers-to-node';
import { CreateDragNodeHierarchy } from './create-drag-node-hierarchy';
import { BuildDragNodeConstraints } from './build-drag-node-constraints';
import { CreateDragNodeHandler } from './create-drag-node-handler';
import { ReadNodeBoundsWithPaddings } from './read-node-bounds-with-paddings';
import { AttachSoftParentConnectionDragHandlersToNode } from './attach-soft-parent-connection-drag-handlers-to-node';
import { fExecution } from '../../../_libs/f-mediator';
import { AttachDragNodeHandlerFromSelectionRequest } from './attach-drag-node-handler-from-selection-request';
import { AttachSoftParentConnectionDragHandlersToNodeRequest } from './attach-soft-parent-connection-drag-handlers-to-node/attach-soft-parent-connection-drag-handlers-to-node-request';
import { AttachSourceConnectionDragHandlersToNodeRequest } from './attach-source-connection-drag-handlers-to-node/attach-source-connection-drag-handlers-to-node-request';
import { AttachTargetConnectionDragHandlersToNodeRequest } from './attach-target-connection-drag-handlers-to-node/attach-target-connection-drag-handlers-to-node-request';
import { BuildDragNodeConstraintsRequest } from './build-drag-node-constraints/build-drag-node-constraints-request';
import { CreateDragNodeHandlerRequest } from './create-drag-node-handler/create-drag-node-handler-request';
import { CreateDragNodeHierarchyRequest } from './create-drag-node-hierarchy/create-drag-node-hierarchy-request';
import { ReadNodeBoundsWithPaddingsRequest } from './read-node-bounds-with-paddings/read-node-bounds-with-paddings-request';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [
  fExecution(CreateDragNodeHierarchyRequest, CreateDragNodeHierarchy),

  fExecution(BuildDragNodeConstraintsRequest, BuildDragNodeConstraints),

  fExecution(CreateDragNodeHandlerRequest, CreateDragNodeHandler),

  fExecution(
    AttachTargetConnectionDragHandlersToNodeRequest,
    AttachTargetConnectionDragHandlersToNode,
  ),

  fExecution(
    AttachSourceConnectionDragHandlersToNodeRequest,
    AttachSourceConnectionDragHandlersToNode,
  ),

  fExecution(
    AttachSoftParentConnectionDragHandlersToNodeRequest,
    AttachSoftParentConnectionDragHandlersToNode,
  ),

  fExecution(ReadNodeBoundsWithPaddingsRequest, ReadNodeBoundsWithPaddings),

  fExecution(AttachDragNodeHandlerFromSelectionRequest, AttachDragNodeHandlerFromSelection),
];
