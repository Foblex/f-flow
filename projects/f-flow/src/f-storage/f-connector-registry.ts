import { FHasId, FIdRegistry } from './f-id-registry';

export class FConnectorRegistry<TInstance extends FHasId> extends FIdRegistry<TInstance> {
  constructor(protected kind: string) {
    super();
  }
}
