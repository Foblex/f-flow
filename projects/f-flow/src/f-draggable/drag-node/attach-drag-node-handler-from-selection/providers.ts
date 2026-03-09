import { AttachDragNodeHandlerFromSelection } from './attach-drag-node-handler-from-selection';
import { AttachTargetConnectionDragHandlersToNode } from './attach-target-connection-drag-handlers-to-node';
import { AttachSourceConnectionDragHandlersToNode } from './attach-source-connection-drag-handlers-to-node';
import { CreateDragNodeHierarchy } from './create-drag-node-hierarchy';
import { BuildDragNodeConstraints } from './build-drag-node-constraints';
import { CreateDragNodeHandler } from './create-drag-node-handler';
import { ReadNodeBoundsWithPaddings } from './read-node-bounds-with-paddings';
import { AttachSoftParentConnectionDragHandlersToNode } from './attach-soft-parent-connection-drag-handlers-to-node';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [
  CreateDragNodeHierarchy,

  BuildDragNodeConstraints,

  CreateDragNodeHandler,

  AttachTargetConnectionDragHandlersToNode,

  AttachSourceConnectionDragHandlersToNode,

  AttachSoftParentConnectionDragHandlersToNode,

  ReadNodeBoundsWithPaddings,

  AttachDragNodeHandlerFromSelection,
];
