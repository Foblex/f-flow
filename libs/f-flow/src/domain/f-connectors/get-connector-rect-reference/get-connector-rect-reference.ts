import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../_libs/f-mediator';
import { GetConnectorRectReferenceRequest } from './get-connector-rect-reference-request';
import { IRoundedRect } from '../../../_libs/f-2d';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import { FConnectorBase } from '../../../f-connectors';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';

/**
 * Returns a connector + its normalized rounded rect.
 */
@Injectable()
export class GetConnectorRectReference implements IExecution<
  GetConnectorRectReferenceRequest,
  IConnectorRectRef
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connector }: GetConnectorRectReferenceRequest): IConnectorRectRef {
    return {
      connector,
      rect: this._getRect(connector),
    };
  }

  private _getRect(x: FConnectorBase): IRoundedRect {
    return this._mediator.execute(new GetNormalizedConnectorRectRequest(x.hostElement));
  }
}
