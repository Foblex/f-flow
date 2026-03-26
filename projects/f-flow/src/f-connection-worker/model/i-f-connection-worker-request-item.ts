import { IFConnectionWorkerRect } from './i-f-connection-worker-rect';

export interface IFConnectionWorkerRequestItem {
  originalIndex?: number;
  behavior: string;
  outputSide: string;
  inputSide: string;
  sourceConnectableSide: string;
  targetConnectableSide: string;
  sourceRotation: number;
  targetRotation: number;
  sourceRect: IFConnectionWorkerRect;
  targetRect: IFConnectionWorkerRect;
}
