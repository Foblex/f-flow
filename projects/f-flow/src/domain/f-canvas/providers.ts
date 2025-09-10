import { CenterGroupOrNodeExecution } from './center-group-or-node';
import { FitToFlowExecution } from './fit-to-flow';
import { ResetScaleAndCenterExecution } from './reset-scale-and-center';
import { ResetScaleExecution } from './reset-scale';
import { UpdateScaleExecution } from './update-scale';
import { InputCanvasPositionExecution } from './input-canvas-position';
import { InputCanvasScaleExecution } from './input-canvas-scale';
import { AddCanvasToStoreExecution } from './add-canvas-to-store';
import { RemoveCanvasFromStoreExecution } from './remove-canvas-from-store';
import { GetCanvasExecution } from './get-canvas';
import { RedrawCanvasWithAnimationExecution } from './redraw-canvas-with-animation';

/**
 * This file exports all the canvas-related executions that can be used in the FCanvas feature.
 */
export const F_CANVAS_FEATURES = [

  AddCanvasToStoreExecution,

  CenterGroupOrNodeExecution,

  FitToFlowExecution,

  GetCanvasExecution,

  InputCanvasPositionExecution,

  InputCanvasScaleExecution,

  RedrawCanvasWithAnimationExecution,

  RemoveCanvasFromStoreExecution,

  ResetScaleExecution,

  ResetScaleAndCenterExecution,

  UpdateScaleExecution,
];
