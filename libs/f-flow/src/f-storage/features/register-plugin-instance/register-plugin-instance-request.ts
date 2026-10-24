import { FInstanceKey } from '../../base';

export class RegisterPluginInstanceRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RegisterPluginInstanceRequest');
  constructor(
    public readonly key: FInstanceKey<unknown>,
    public readonly instance: unknown,
  ) {}
}
