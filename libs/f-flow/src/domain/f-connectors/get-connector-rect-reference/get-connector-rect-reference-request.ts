import { FConnectorBase } from '../../../f-connectors';
import type { IConnectorRectRef } from '../i-connector-rect-ref';

export class GetConnectorRectReferenceRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectorRectRef;

  static readonly fToken = Symbol('GetConnectorRectReferenceRequest');
  constructor(public readonly connector: FConnectorBase) {}
}
