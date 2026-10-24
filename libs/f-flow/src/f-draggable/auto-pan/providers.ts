import { RunAutoPanFrame } from './run-auto-pan-frame';
import { ScheduleAutoPanFrame } from './schedule-auto-pan-frame';
import { StopAutoPan } from './stop-auto-pan';
import { fExecution } from '../../_libs/f-mediator';
import { RunAutoPanFrameRequest } from './run-auto-pan-frame/run-auto-pan-frame-request';
import { ScheduleAutoPanFrameRequest } from './schedule-auto-pan-frame/schedule-auto-pan-frame-request';
import { StopAutoPanRequest } from './stop-auto-pan/stop-auto-pan-request';

export const DRAG_AUTO_PAN_PROVIDERS = [
  fExecution(ScheduleAutoPanFrameRequest, ScheduleAutoPanFrame),
  fExecution(RunAutoPanFrameRequest, RunAutoPanFrame),
  fExecution(StopAutoPanRequest, StopAutoPan),
];
