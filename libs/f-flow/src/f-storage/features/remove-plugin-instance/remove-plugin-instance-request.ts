import { FInstanceKey } from '../../base';

export class RemovePluginInstanceRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RemovePluginInstanceRequest');
  constructor(public readonly key: FInstanceKey<unknown>) {}
}
