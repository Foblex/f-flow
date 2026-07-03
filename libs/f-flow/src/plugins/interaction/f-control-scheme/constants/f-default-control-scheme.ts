import { IFControlScheme } from '../i-f-control-scheme';
import { defaultEventTrigger, FTriggerEvent, primaryButtonEventTrigger } from '../../../../domain';

/**
 * The out-of-the-box scheme: a drag pans the canvas, the wheel zooms, `Shift`+drag draws
 * a selection rectangle, and a drag moves nodes / creates connections. Matches the
 * library's behavior without `withControlScheme(...)`.
 *
 * `canvasMove` accepts only the primary button, so the middle mouse button stays
 * inert — it joins the drag pipeline only when a scheme claims it (see
 * {@link F_SCROLL_PAN_CONTROL_SCHEME}).
 */
export const F_DEFAULT_CONTROL_SCHEME: IFControlScheme = {
  nodeMove: defaultEventTrigger,
  canvasMove: primaryButtonEventTrigger,
  selection: (event: FTriggerEvent) => event.shiftKey,
  createConnection: defaultEventTrigger,
  reassignConnection: defaultEventTrigger,
  nodeResize: defaultEventTrigger,
  nodeRotate: defaultEventTrigger,
  scrollPan: false,
  zoom: defaultEventTrigger,
};
