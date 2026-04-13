import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState, IConnectionWorkerResultItem } from '../../models';
import { EnsureConnectionWorkerRequest } from '../ensure-connection-worker';
import { IsConnectionWorkerEnabledRequest } from '../is-connection-worker-enabled';
import { RunConnectionWorkerRequest } from './run-connection-worker-request';

@Injectable()
@FExecutionRegister(RunConnectionWorkerRequest)
export class RunConnectionWorker
  implements IExecution<RunConnectionWorkerRequest, Promise<IConnectionWorkerResultItem[]>>
{
  private readonly _state = inject(ConnectionWorkerState);
  private readonly _mediator = inject(FMediator);

  public handle({ payload }: RunConnectionWorkerRequest): Promise<IConnectionWorkerResultItem[]> {
    if (!payload.length) {
      return Promise.resolve([]);
    }

    if (!this._mediator.execute<boolean>(new IsConnectionWorkerEnabledRequest())) {
      return Promise.reject(new Error('Connection worker is disabled.'));
    }

    this._interruptPendingRequests();

    const worker = this._mediator.execute<Worker | null>(new EnsureConnectionWorkerRequest());
    if (!worker) {
      return Promise.reject(new Error('Unable to initialize connection worker.'));
    }

    const requestId = ++this._state.nextRequestId;

    return new Promise((resolve, reject) => {
      this._state.pending.set(requestId, { resolve, reject });

      try {
        worker.postMessage({
          requestId,
          items: payload,
        });
      } catch (error) {
        this._state.pending.delete(requestId);
        reject(
          error instanceof Error
            ? error
            : new Error('Unknown error while posting message to connection worker.'),
        );
      }
    });
  }

  private _interruptPendingRequests(): void {
    if (!this._state.pending.size) {
      return;
    }

    const error = new Error('Connection worker request was superseded by a newer redraw.');
    this._state.pending.forEach((request) => request.reject(error));
    this._state.pending.clear();
  }
}
