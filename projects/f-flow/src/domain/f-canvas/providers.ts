import { CenterGroupOrNodeExecution } from './center-group-or-node';
import { FitToFlowExecution } from './fit-to-flow';
import { ResetScaleAndCenterExecution } from './reset-scale-and-center';
import { ResetScaleExecution } from './reset-scale';
import { UpdateScaleExecution } from './update-scale';
import { InputCanvasPositionExecution } from './input-canvas-position';
import { InputCanvasScaleExecution } from './input-canvas-scale';

export const F_CANVAS_FEATURES = [

  CenterGroupOrNodeExecution,

  FitToFlowExecution,

  InputCanvasPositionExecution,

  InputCanvasScaleExecution,

  ResetScaleExecution,

  ResetScaleAndCenterExecution,

  UpdateScaleExecution
];
