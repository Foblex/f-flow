import { FConnectionBase } from '../../../../f-connection-v2';
import { IConnectionGeometry } from './i-connection-geometry';
import { IConnectionWorkerPayloadItem } from './i-connection-worker-payload-item';

export interface IConnectionWorkerBatchItem {
  connection: FConnectionBase;
  geometry: IConnectionGeometry;
  payload: IConnectionWorkerPayloadItem;
}
