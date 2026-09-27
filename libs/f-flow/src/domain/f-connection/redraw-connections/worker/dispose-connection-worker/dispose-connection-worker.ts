import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState } from '../../models';
import { DisposeConnectionWorkerRequest } from './dispose-connection-worker-request';

@Injectable()
@FExecutionRegister(DisposeConnectionWorkerRequest)
export class DisposeConnectionWorker implements IExecution<DisposeConnectionWorkerRequest, void> {
  private readonly _state = inject(ConnectionWorkerState);

  public handle(_: DisposeConnectionWorkerRequest): void {
    this._state.dispose();
  }
}
