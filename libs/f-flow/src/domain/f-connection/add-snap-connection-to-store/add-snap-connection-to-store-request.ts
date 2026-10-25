import { FSnapConnectionComponent } from '../../../f-connection';

export class AddSnapConnectionToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddSnapConnectionToStoreRequest');

  constructor(public readonly connection: FSnapConnectionComponent) {}
}
