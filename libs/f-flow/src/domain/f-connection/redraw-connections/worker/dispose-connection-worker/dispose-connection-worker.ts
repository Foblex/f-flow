import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../../../_libs/f-mediator';
import { ConnectionWorkerState } from '../../models';
import { DisposeConnectionWorkerRequest } from './dispose-connection-worker-request';

@Injectable()
export class DisposeConnectionWorker implements IExecution<DisposeConnectionWorkerRequest, void> {
  private readonly _state = inject(ConnectionWorkerState);

  public handle(_: DisposeConnectionWorkerRequest): void {
    this._state.dispose();
  }
}
