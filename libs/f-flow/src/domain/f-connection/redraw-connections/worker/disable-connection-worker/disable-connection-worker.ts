import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState } from '../../models';
import { DisableConnectionWorkerRequest } from './disable-connection-worker-request';
import { ResetConnectionWorkerRuntimeRequest } from '../reset-connection-worker-runtime';

@Injectable()
@FExecutionRegister(DisableConnectionWorkerRequest)
export class DisableConnectionWorker implements IExecution<DisableConnectionWorkerRequest, void> {
  private readonly _state = inject(ConnectionWorkerState);
  private readonly _mediator = inject(FMediator);

  public handle({ error }: DisableConnectionWorkerRequest): void {
    this._state.isDisabled = true;

    this._mediator.execute(new ResetConnectionWorkerRuntimeRequest(error));
  }
}
