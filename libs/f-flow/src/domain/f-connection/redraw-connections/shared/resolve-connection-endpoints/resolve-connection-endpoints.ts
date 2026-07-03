import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { findSourceConnector, findTargetConnector } from '../../../../../f-connectors';
import { ResolveConnectionEndpointsRequest } from './resolve-connection-endpoints-request';
import { IConnectionEndpoints } from '../../models';

@Injectable()
@FExecutionRegister(ResolveConnectionEndpointsRequest)
export class ResolveConnectionEndpoints implements IExecution<
  ResolveConnectionEndpointsRequest,
  IConnectionEndpoints | null
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: ResolveConnectionEndpointsRequest): IConnectionEndpoints | null {
    const source = findSourceConnector(this._store, connection.sourceId());
    const target = findTargetConnector(this._store, connection.targetId());
    if (!source || !target) {
      return null;
    }

    return { source, target };
  }
}
