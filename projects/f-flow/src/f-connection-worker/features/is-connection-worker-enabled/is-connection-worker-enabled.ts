import { inject, Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectionWorker } from '../../model';
import { IsConnectionWorkerEnabledRequest } from './is-connection-worker-enabled-request';

@Injectable()
@FExecutionRegister(IsConnectionWorkerEnabledRequest)
export class IsConnectionWorkerEnabled implements IExecution<
  IsConnectionWorkerEnabledRequest,
  boolean
> {
  private readonly _browser = inject(BrowserService);
  private readonly _state = inject(FConnectionWorker);

  public handle(_: IsConnectionWorkerEnabledRequest): boolean {
    if (this._state.isDisabled) {
      return false;
    }

    if (!this._isWorkerAvailable()) {
      return false;
    }

    const windowRef = this._browser.document.defaultView;

    return !!windowRef?.Worker;
  }

  private _isWorkerAvailable(): boolean {
    return this._browser.isBrowser();
  }
}
