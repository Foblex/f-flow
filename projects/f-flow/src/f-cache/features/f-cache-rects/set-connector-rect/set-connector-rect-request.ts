import { IRoundedRect } from '@foblex/2d';

export class SetFCacheConnectorRectRequest {
  static readonly fToken = Symbol('SetFCacheConnectorRectRequest');

  constructor(
    public readonly connectorId: string,
    public readonly kind: string,
    public readonly rect: IRoundedRect,
  ) {}
}
