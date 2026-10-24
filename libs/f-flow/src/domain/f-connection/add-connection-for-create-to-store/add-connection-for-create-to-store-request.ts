import { FConnectionForCreateComponent } from '../../../f-connection';

export class AddConnectionForCreateToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddConnectionForCreateToStoreRequest');

  constructor(public readonly connection: FConnectionForCreateComponent) {}
}
