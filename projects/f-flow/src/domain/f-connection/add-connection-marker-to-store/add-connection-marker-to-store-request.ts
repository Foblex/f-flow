import { FConnectionMarkerBase } from '../../../f-connection-v2';

export class AddConnectionMarkerToStoreRequest {
  static readonly fToken = Symbol('AddConnectionMarkerToStoreRequest');

  constructor(public readonly component: FConnectionMarkerBase) {}
}
