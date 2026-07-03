import { IFControlScheme } from '../i-f-control-scheme';
import { isOnFlowBackground } from '../is-on-flow-background';
import {
  defaultEventTrigger,
  FTriggerEvent,
  middleButtonEventTrigger,
  primaryButtonEventTrigger,
} from '../../../../domain';

/**
 * A Miro-style scheme: the wheel and two-finger trackpad scroll pan the canvas,
 * `Ctrl`/`Cmd`+wheel or pinch zooms, a drag on the empty canvas draws a selection
 * rectangle, a middle-mouse drag pans, and a drag on a node moves it.
 */
export const F_SCROLL_PAN_CONTROL_SCHEME: IFControlScheme = {
  nodeMove: primaryButtonEventTrigger,
  canvasMove: middleButtonEventTrigger,
  selection: (event: FTriggerEvent) =>
    primaryButtonEventTrigger(event) && isOnFlowBackground(event),
  createConnection: primaryButtonEventTrigger,
  reassignConnection: primaryButtonEventTrigger,
  nodeResize: primaryButtonEventTrigger,
  nodeRotate: primaryButtonEventTrigger,
  scrollPan: true,
  zoom: defaultEventTrigger,
};
