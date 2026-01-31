import { FIdRegistry } from './f-id-registry';
import { FConnectionMarkerBase } from '../f-connection-v2';

export class FConnectionMarkerRegistry extends FIdRegistry<FConnectionMarkerBase> {
  protected readonly kind = 'Connection Marker';
}
