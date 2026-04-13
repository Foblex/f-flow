import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ConnectionWorkerState } from '../../models';
import { IsConnectionWorkerEnabledRequest } from './is-connection-worker-enabled-request';
import { isConnectionWorkerRuntimeSupported } from '../runtime/connection-worker-runtime';

@Injectable()
@FExecutionRegister(IsConnectionWorkerEnabledRequest)
export class IsConnectionWorkerEnabled
  implements IExecution<IsConnectionWorkerEnabledRequest, boolean>
{
  private readonly _browser = inject(BrowserService);
  private readonly _state = inject(ConnectionWorkerState);

  public handle(_: IsConnectionWorkerEnabledRequest): boolean {
    if (this._state.isDisabled) {
      return false;
    }

    if (!this._isWorkerAvailable()) {
      return false;
    }

    const windowRef = this._browser.document.defaultView;

    return isConnectionWorkerRuntimeSupported(windowRef);
  }

  private _isWorkerAvailable(): boolean {
    return this._browser.isBrowser();
  }
}
