import { IConnectionWorkerResultItem } from './i-connection-worker-result-item';

export type TConnectionWorkerPendingRequest = {
  resolve: (value: IConnectionWorkerResultItem[]) => void;
  reject: (error: Error) => void;
};
