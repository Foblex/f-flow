import { FConnectionMarkerBase } from '../../../f-connection-v2';

export class RemoveConnectionMarkerFromStoreRequest {
  static readonly fToken = Symbol('RemoveConnectionMarkerFromStoreRequest');

  constructor(public readonly component: FConnectionMarkerBase) {}
}
