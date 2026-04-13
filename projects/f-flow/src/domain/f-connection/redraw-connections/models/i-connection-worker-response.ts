import { IConnectionWorkerResultItem } from './i-connection-worker-result-item';

export interface IConnectionWorkerResponse {
  requestId: number;
  results?: IConnectionWorkerResultItem[];
  error?: string;
}
