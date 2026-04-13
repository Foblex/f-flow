import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { ResolveConnectionEndpointsRequest } from './resolve-connection-endpoints-request';
import { IConnectionEndpoints } from '../../models';

@Injectable()
@FExecutionRegister(ResolveConnectionEndpointsRequest)
export class ResolveConnectionEndpoints
  implements IExecution<ResolveConnectionEndpointsRequest, IConnectionEndpoints | null>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: ResolveConnectionEndpointsRequest): IConnectionEndpoints | null {
    const source = this._store.outputs.get(connection.fOutputId());
    const target = this._store.inputs.get(connection.fInputId());
    if (!source || !target) {
      return null;
    }

    return { source, target };
  }
}
