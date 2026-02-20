import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetModelConnectorAnchorRequest } from './set-model-connector-anchor-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(SetModelConnectorAnchorRequest)
export class SetModelConnectorAnchorExecution
  implements IExecution<SetModelConnectorAnchorRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ connectorId, anchorOffset }: SetModelConnectorAnchorRequest): void {
    this._cache.setModelConnectorAnchor(connectorId, anchorOffset);
  }
}
