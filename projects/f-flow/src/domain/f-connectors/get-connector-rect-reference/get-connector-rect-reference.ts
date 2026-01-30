import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetConnectorRectReferenceRequest } from './get-connector-rect-reference-request';
import { IRoundedRect } from '@foblex/2d';
import { IConnectorRectRef } from '../i-connector-rect-ref';
import { FConnectorBase } from '../../../f-connectors';
import { GetNormalizedConnectorRectRequest } from '../../get-normalized-connector-rect';

/**
 * Returns a connector + its normalized rounded rect.
 */
@Injectable()
@FExecutionRegister(GetConnectorRectReferenceRequest)
export class GetConnectorRectReference
  implements IExecution<GetConnectorRectReferenceRequest, IConnectorRectRef>
{
  private readonly _mediator = inject(FMediator);

  public handle({ connector }: GetConnectorRectReferenceRequest): IConnectorRectRef {
    return {
      connector,
      rect: this._getRect(connector),
    };
  }

  private _getRect(x: FConnectorBase): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(x.hostElement),
    );
  }
}
