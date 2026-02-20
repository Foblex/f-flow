import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetConnectorRectReferenceRequest } from './get-connector-rect-reference-request';
import { IRoundedRect } from '@foblex/2d';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import { FConnectorBase } from '../../../f-connectors';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';
import { FGeometryCache } from '../../geometry-cache';

/**
 * Returns a connector + its normalized rounded rect.
 */
@Injectable()
@FExecutionRegister(GetConnectorRectReferenceRequest)
export class GetConnectorRectReference implements IExecution<
  GetConnectorRectReferenceRequest,
  IConnectorRectRef
> {
  private readonly _mediator = inject(FMediator);
  private readonly _geometryCache = inject(FGeometryCache);

  public handle({ connector }: GetConnectorRectReferenceRequest): IConnectorRectRef {
    return {
      connector,
      rect: this._getRect(connector),
    };
  }

  private _getRect(x: FConnectorBase): IRoundedRect {
    this._geometryCache.ensureConnectorGeometryFresh(x.fId(), x.kind);
    const cachedRect = this._geometryCache.getConnectorRect(x.fId(), x.kind);
    if (cachedRect) {
      return cachedRect;
    }

    return this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(x.hostElement),
    );
  }
}
