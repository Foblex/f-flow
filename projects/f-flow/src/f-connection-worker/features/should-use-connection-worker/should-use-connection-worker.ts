import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ShouldUseConnectionWorkerRequest } from './should-use-connection-worker-request';
import { IsConnectionWorkerEnabledRequest } from '../is-connection-worker-enabled';

@Injectable()
@FExecutionRegister(ShouldUseConnectionWorkerRequest)
export class ShouldUseConnectionWorker implements IExecution<
  ShouldUseConnectionWorkerRequest,
  boolean
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connectionCount }: ShouldUseConnectionWorkerRequest): boolean {
    return (
      connectionCount > 0 && this._mediator.execute<boolean>(new IsConnectionWorkerEnabledRequest())
    );
  }
}
