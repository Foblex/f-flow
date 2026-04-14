import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState } from '../../models';
import { ResetConnectionWorkerRuntimeRequest } from './reset-connection-worker-runtime-request';

@Injectable()
@FExecutionRegister(ResetConnectionWorkerRuntimeRequest)
export class ResetConnectionWorkerRuntime
  implements IExecution<ResetConnectionWorkerRuntimeRequest, void>
{
  private readonly _state = inject(ConnectionWorkerState);

  public handle({ error }: ResetConnectionWorkerRuntimeRequest): void {
    this._state.resetRuntime(error);
  }
}
