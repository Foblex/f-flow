import { IConnectionWorkerRect } from './i-connection-worker-rect';

export interface IConnectionWorkerPayloadItem {
  originalIndex: number;
  behavior: string;
  outputSide: string;
  inputSide: string;
  sourceConnectableSide: string;
  targetConnectableSide: string;
  sourceRotation: number;
  targetRotation: number;
  sourceRect: IConnectionWorkerRect;
  targetRect: IConnectionWorkerRect;
}
