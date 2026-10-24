import { IRoundedRect } from '@foblex/2d';

export class SetFCacheConnectorRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SetFCacheConnectorRectRequest');

  constructor(
    public readonly connectorId: string,
    public readonly kind: string,
    public readonly rect: IRoundedRect,
  ) {}
}
