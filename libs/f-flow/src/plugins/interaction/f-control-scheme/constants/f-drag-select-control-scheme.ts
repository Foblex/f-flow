import { IFControlScheme } from '../i-f-control-scheme';
import { isOnFlowBackground } from '../is-on-flow-background';
import {
  defaultEventTrigger,
  FTriggerEvent,
  middleButtonEventTrigger,
  primaryButtonEventTrigger,
} from '../../../../domain';

/**
 * A draw.io-style scheme: the wheel zooms, a drag on the empty canvas draws a selection
 * rectangle, a middle-mouse drag pans, and a drag on a node moves it.
 */
export const F_DRAG_SELECT_CONTROL_SCHEME: IFControlScheme = {
  nodeMove: primaryButtonEventTrigger,
  canvasMove: middleButtonEventTrigger,
  selection: (event: FTriggerEvent) =>
    primaryButtonEventTrigger(event) && isOnFlowBackground(event),
  createConnection: primaryButtonEventTrigger,
  reassignConnection: primaryButtonEventTrigger,
  nodeResize: primaryButtonEventTrigger,
  nodeRotate: primaryButtonEventTrigger,
  scrollPan: false,
  zoom: defaultEventTrigger,
};
