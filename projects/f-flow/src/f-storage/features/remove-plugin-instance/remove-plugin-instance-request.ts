import { FInstanceKey } from '../../base';

export class RemovePluginInstanceRequest {
  static readonly fToken = Symbol('RemovePluginInstanceRequest');
  constructor(public readonly key: FInstanceKey<unknown>) {}
}
