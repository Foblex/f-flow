import { IConnectionWorkerBatchItem } from './i-connection-worker-batch-item';
import { IConnectionWorkerPayloadItem } from './i-connection-worker-payload-item';

export interface IConnectionWorkerBatch {
  items: (IConnectionWorkerBatchItem | null)[];
  payload: IConnectionWorkerPayloadItem[];
}
