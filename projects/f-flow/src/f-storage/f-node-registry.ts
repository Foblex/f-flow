import { FIdRegistry } from './f-id-registry';
import { FNodeBase } from '../f-node';

export class FNodeRegistry extends FIdRegistry<FNodeBase> {
  protected readonly kind = 'Node';
}
