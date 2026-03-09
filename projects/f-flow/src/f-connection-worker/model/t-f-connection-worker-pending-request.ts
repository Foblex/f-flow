import { IFConnectionWorkerResultItem } from './i-f-connection-worker-result-item';

export type TFConnectionWorkerPendingRequest = {
  resolve: (value: IFConnectionWorkerResultItem[]) => void;
  reject: (error: Error) => void;
};
