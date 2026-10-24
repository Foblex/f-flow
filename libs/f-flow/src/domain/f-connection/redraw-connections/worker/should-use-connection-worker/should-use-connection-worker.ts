import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../../../_libs/f-mediator';
import { ShouldUseConnectionWorkerRequest } from './should-use-connection-worker-request';
import { IsConnectionWorkerEnabledRequest } from '../is-connection-worker-enabled';

@Injectable()
export class ShouldUseConnectionWorker implements IExecution<
  ShouldUseConnectionWorkerRequest,
  boolean
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connectionCount }: ShouldUseConnectionWorkerRequest): boolean {
    return connectionCount > 0 && this._mediator.execute(new IsConnectionWorkerEnabledRequest());
  }
}
