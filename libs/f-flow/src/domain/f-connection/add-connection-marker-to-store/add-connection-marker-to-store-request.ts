import { FConnectionMarkerBase } from '../../../f-connection-v2/components/connection-marker/models';

export class AddConnectionMarkerToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddConnectionMarkerToStoreRequest');

  constructor(public readonly instance: FConnectionMarkerBase) {}
}
