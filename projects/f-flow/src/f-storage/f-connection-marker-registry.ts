import { FIdRegistryBase } from './base';
import { FConnectionMarkerBase } from '../f-connection-v2';

export class FConnectionMarkerRegistry extends FIdRegistryBase<FConnectionMarkerBase> {
  protected readonly kind = 'Connection Marker';
}
