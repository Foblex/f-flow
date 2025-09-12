import { FMarkerBase } from '../../../f-connection';

export class AddConnectionMarkerToStoreRequest {
  static readonly fToken = Symbol('AddConnectionMarkerToStoreRequest');

  constructor(
    public fComponent: FMarkerBase,
  ) {
  }
}
