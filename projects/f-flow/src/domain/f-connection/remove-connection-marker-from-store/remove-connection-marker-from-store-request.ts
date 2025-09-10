import { FMarkerBase } from '../../../f-connection';

export class RemoveConnectionMarkerFromStoreRequest {
  static readonly fToken = Symbol('RemoveConnectionMarkerFromStoreRequest');

  constructor(
    public fComponent: FMarkerBase,
  ) {
  }
}
