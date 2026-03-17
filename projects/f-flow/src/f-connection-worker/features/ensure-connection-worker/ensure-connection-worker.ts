import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { DisableConnectionWorkerRequest } from '../disable-connection-worker';
import { HandleConnectionWorkerMessageRequest } from '../handle-connection-worker-message';
import { FConnectionWorker, IFConnectionWorkerResponse } from '../../model';
import { EnsureConnectionWorkerRequest } from './ensure-connection-worker-request';
import { ResetConnectionWorkerRuntimeRequest } from '../reset-connection-worker-runtime';
import {
  createConnectionWorkerUrl,
  isConnectionWorkerRuntimeSupported,
  resolveConnectionWorkerRuntime,
  revokeConnectionWorkerUrl,
} from '../../worker/connection-worker-runtime';

@Injectable()
@FExecutionRegister(EnsureConnectionWorkerRequest)
export class EnsureConnectionWorker
  implements IExecution<EnsureConnectionWorkerRequest, Worker | null>
{
  private readonly _browser = inject(BrowserService);
  private readonly _state = inject(FConnectionWorker);
  private readonly _mediator = inject(FMediator);

  public handle(_: EnsureConnectionWorkerRequest): Worker | null {
    if (this._state.worker) {
      return this._state.worker;
    }

    const windowRef = this._browser.document.defaultView;
    if (!isConnectionWorkerRuntimeSupported(windowRef)) {
      return null;
    }

    const runtime = resolveConnectionWorkerRuntime(windowRef);
    if (!runtime) {
      return null;
    }

    const workerUrl = createConnectionWorkerUrl(runtime);

    try {
      const worker = new runtime.workerCtor(workerUrl, {
        name: 'f-flow-connection-worker',
      });

      worker.onmessage = (event: MessageEvent<IFConnectionWorkerResponse>) => {
        this._mediator.execute(new HandleConnectionWorkerMessageRequest(event.data));
      };
      worker.onerror = () => {
        this._resetWorkerAfterRuntimeError(new Error('Connection worker runtime error.'));
      };
      worker.onmessageerror = () => {
        this._resetWorkerAfterRuntimeError(
          new Error('Connection worker message deserialization error.'),
        );
      };

      this._state.workerUrl = workerUrl;
      this._state.worker = worker;

      return worker;
    } catch (error) {
      revokeConnectionWorkerUrl(workerUrl, runtime.urlApi);
      this._disableWorker(
        error instanceof Error ? error : new Error('Connection worker initialization failed.'),
      );

      return null;
    }
  }

  private _disableWorker(error: Error): void {
    this._mediator.execute(new DisableConnectionWorkerRequest(error));
  }

  private _resetWorkerAfterRuntimeError(error: Error): void {
    this._mediator.execute(new ResetConnectionWorkerRuntimeRequest(error));
  }
}
