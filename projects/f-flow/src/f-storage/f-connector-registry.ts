import { FHasId, FIdRegistryBase } from './base';

export class FConnectorRegistry<TInstance extends FHasId> extends FIdRegistryBase<TInstance> {
  constructor(protected kind: string) {
    super();
  }
}
