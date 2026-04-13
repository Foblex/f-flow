import { FInstanceKey } from '../../base';

export class RegisterPluginInstanceRequest {
  static readonly fToken = Symbol('RegisterPluginInstanceRequest');
  constructor(
    public readonly key: FInstanceKey<unknown>,
    public readonly instance: unknown,
  ) {}
}
