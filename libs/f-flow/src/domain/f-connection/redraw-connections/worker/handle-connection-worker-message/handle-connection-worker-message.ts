import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState } from '../../models';
import { HandleConnectionWorkerMessageRequest } from './handle-connection-worker-message-request';

@Injectable()
@FExecutionRegister(HandleConnectionWorkerMessageRequest)
export class HandleConnectionWorkerMessage
  implements IExecution<HandleConnectionWorkerMessageRequest, void>
{
  private readonly _state = inject(ConnectionWorkerState);

  public handle({ message }: HandleConnectionWorkerMessageRequest): void {
    if (!message || typeof message.requestId !== 'number') {
      return;
    }

    const request = this._state.pending.get(message.requestId);
    if (!request) {
      return;
    }

    this._state.pending.delete(message.requestId);

    if (message.error) {
      request.reject(new Error(message.error));

      return;
    }

    request.resolve(message.results ?? []);
  }
}
