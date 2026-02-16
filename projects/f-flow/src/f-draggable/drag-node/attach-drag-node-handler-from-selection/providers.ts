import { AttachDragNodeHandlerFromSelection } from './attach-drag-node-handler-from-selection';
import { AttachTargetConnectionDragHandlersToNode } from './attach-target-connection-drag-handlers-to-node';
import { AttachSourceConnectionDragHandlersToNode } from './attach-source-connection-drag-handlers-to-node';
import { CreateDragNodeHierarchy } from './create-drag-node-hierarchy';
import { BuildDragNodeConstraints } from './build-drag-node-constraints';
import { CreateDragNodeHandler } from './create-drag-node-handler';
import { ReadNodeBoundsWithPaddings } from './read-node-bounds-with-paddings';

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [
  CreateDragNodeHierarchy,

  BuildDragNodeConstraints,

  CreateDragNodeHandler,

  AttachTargetConnectionDragHandlersToNode,

  AttachSourceConnectionDragHandlersToNode,

  ReadNodeBoundsWithPaddings,

  AttachDragNodeHandlerFromSelection,
];
