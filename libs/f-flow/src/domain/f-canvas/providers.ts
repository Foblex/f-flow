import { CenterGroupOrNode } from './center-group-or-node';
import { FitToFlow } from './fit-to-flow';
import { ResetScaleAndCenter } from './reset-scale-and-center';
import { ResetScale } from './reset-scale';
import { UpdateScale } from './update-scale';
import { InputCanvasPosition } from './input-canvas-position';
import { InputCanvasScale } from './input-canvas-scale';
import { AddCanvasToStore } from './add-canvas-to-store';
import { RemoveCanvasFromStore } from './remove-canvas-from-store';
import { RedrawCanvasWithAnimation } from './redraw-canvas-with-animation';
import { ScrollCanvas } from './scroll-canvas';
import { fExecution } from '../../_libs/f-mediator';
import { AddCanvasToStoreRequest } from './add-canvas-to-store/add-canvas-to-store-request';
import { CenterGroupOrNodeRequest } from './center-group-or-node/center-group-or-node-request';
import { FitToFlowRequest } from './fit-to-flow/fit-to-flow-request';
import { InputCanvasPositionRequest } from './input-canvas-position/input-canvas-position-request';
import { InputCanvasScaleRequest } from './input-canvas-scale/input-canvas-scale-request';
import { RedrawCanvasWithAnimationRequest } from './redraw-canvas-with-animation/redraw-canvas-with-animation-request';
import { RemoveCanvasFromStoreRequest } from './remove-canvas-from-store/remove-canvas-from-store-request';
import { ResetScaleAndCenterRequest } from './reset-scale-and-center/reset-scale-and-center-request';
import { ResetScaleRequest } from './reset-scale/reset-scale-request';
import { ScrollCanvasRequest } from './scroll-canvas/scroll-canvas-request';
import { UpdateScaleRequest } from './update-scale/update-scale-request';

/**
 * This file exports all the canvas-related executions that can be used in the FCanvas feature.
 */
export const F_CANVAS_FEATURES = [
  fExecution(AddCanvasToStoreRequest, AddCanvasToStore),

  fExecution(CenterGroupOrNodeRequest, CenterGroupOrNode),

  fExecution(FitToFlowRequest, FitToFlow),

  fExecution(InputCanvasPositionRequest, InputCanvasPosition),

  fExecution(InputCanvasScaleRequest, InputCanvasScale),

  fExecution(RedrawCanvasWithAnimationRequest, RedrawCanvasWithAnimation),

  fExecution(RemoveCanvasFromStoreRequest, RemoveCanvasFromStore),

  fExecution(ResetScaleRequest, ResetScale),

  fExecution(ResetScaleAndCenterRequest, ResetScaleAndCenter),

  fExecution(ScrollCanvasRequest, ScrollCanvas),

  fExecution(UpdateScaleRequest, UpdateScale),
];
