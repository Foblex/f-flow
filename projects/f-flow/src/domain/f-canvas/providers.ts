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

/**
 * This file exports all the canvas-related executions that can be used in the FCanvas feature.
 */
export const F_CANVAS_FEATURES = [
  AddCanvasToStore,

  CenterGroupOrNode,

  FitToFlow,

  InputCanvasPosition,

  InputCanvasScale,

  RedrawCanvasWithAnimation,

  RemoveCanvasFromStore,

  ResetScale,

  ResetScaleAndCenter,

  UpdateScale,
];
