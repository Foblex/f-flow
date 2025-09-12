import { CreateDragModelFromSelection } from './create-drag-model-from-selection';
import { CreateInputConnectionHandlerAndSetToNodeHandler } from './create-input-connection-handler-and-set-to-node-handler';
import { CreateOutputConnectionHandlerAndSetToNodeHandler } from './create-output-connection-handler-and-set-to-node-handler';
import { BuildDragHierarchy } from "./build-drag-hierarchy";
import { CalculateDragLimits } from "./calculate-drag-limits";
import { CreateSummaryDragHandler } from "./create-summary-drag-handler";
import { GetNodeBoundingIncludePaddings } from "./get-node-bounding-include-paddings";

export const CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [

  BuildDragHierarchy,

  CalculateDragLimits,

  CreateSummaryDragHandler,

  CreateInputConnectionHandlerAndSetToNodeHandler,

  CreateOutputConnectionHandlerAndSetToNodeHandler,

  GetNodeBoundingIncludePaddings,

  CreateDragModelFromSelection,
];
