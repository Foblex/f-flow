import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectionWorker } from '../../model';
import { ResetConnectionWorkerRuntimeRequest } from './reset-connection-worker-runtime-request';

@Injectable()
@FExecutionRegister(ResetConnectionWorkerRuntimeRequest)
export class ResetConnectionWorkerRuntime implements IExecution<
  ResetConnectionWorkerRuntimeRequest,
  void
> {
  private readonly _state = inject(FConnectionWorker);

  public handle({ error }: ResetConnectionWorkerRuntimeRequest): void {
    this._state.resetRuntime(error);
  }
}
