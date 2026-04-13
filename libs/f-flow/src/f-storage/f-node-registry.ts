import { FIdRegistryBase } from './base';
import { FNodeBase } from '../f-node';

export class FNodeRegistry extends FIdRegistryBase<FNodeBase> {
  protected readonly kind = 'Node';
}
