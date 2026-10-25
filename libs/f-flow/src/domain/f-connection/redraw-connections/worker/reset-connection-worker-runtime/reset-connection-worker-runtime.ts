import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../../../_libs/f-mediator';
import { ConnectionWorkerState } from '../../models';
import { ResetConnectionWorkerRuntimeRequest } from './reset-connection-worker-runtime-request';

@Injectable()
export class ResetConnectionWorkerRuntime implements IExecution<
  ResetConnectionWorkerRuntimeRequest,
  void
> {
  private readonly _state = inject(ConnectionWorkerState);

  public handle({ error }: ResetConnectionWorkerRuntimeRequest): void {
    this._state.resetRuntime(error);
  }
}
