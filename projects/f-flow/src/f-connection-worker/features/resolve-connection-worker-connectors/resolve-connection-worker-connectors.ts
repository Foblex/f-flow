import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import {
  IFConnectionWorkerConnectors,
  ResolveConnectionWorkerConnectorsRequest,
} from './resolve-connection-worker-connectors-request';

@Injectable()
@FExecutionRegister(ResolveConnectionWorkerConnectorsRequest)
export class ResolveConnectionWorkerConnectors implements IExecution<
  ResolveConnectionWorkerConnectorsRequest,
  IFConnectionWorkerConnectors | null
> {
  private readonly _store = inject(FComponentsStore);

  public handle({
    connection,
  }: ResolveConnectionWorkerConnectorsRequest): IFConnectionWorkerConnectors | null {
    const source = this._store.outputs.get(connection.fOutputId());
    const target = this._store.inputs.get(connection.fInputId());
    if (!source || !target) {
      return null;
    }

    return { source, target };
  }
}
