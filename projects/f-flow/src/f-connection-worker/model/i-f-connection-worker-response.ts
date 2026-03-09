import { IFConnectionWorkerResultItem } from './i-f-connection-worker-result-item';

export interface IFConnectionWorkerResponse {
  requestId: number;
  results?: IFConnectionWorkerResultItem[];
  error?: string;
}
