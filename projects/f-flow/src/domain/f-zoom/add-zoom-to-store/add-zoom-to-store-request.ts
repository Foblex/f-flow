import { FZoomBase } from '../../../f-zoom';

export class AddZoomToStoreRequest {
  static readonly fToken = Symbol('AddZoomToStoreRequest');
  constructor(
    public fComponent: FZoomBase,
  ) {
  }
}
