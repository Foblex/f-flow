import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { CompleteConnectionRedrawRequest } from '../complete-connection-redraw';
import { IsConnectionRedrawCurrentRequest } from '../is-connection-redraw-current';
import { RenderConnectionRequest } from '../../main-thread/render-connection';
import { ApplyConnectionWorkerResultRequest } from '../../worker/apply-connection-worker-result';
import { IConnectionRedrawSession } from '../../models';
import { RunConnectionRedrawSliceRequest } from './run-connection-redraw-slice-request';

const CONNECTIONS_PER_SLICE_LIMIT = 500;
const SLICE_BUDGET_MS = 6;

@Injectable()
@FExecutionRegister(RunConnectionRedrawSliceRequest)
export class RunConnectionRedrawSlice implements IExecution<RunConnectionRedrawSliceRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);

  public handle({
    connections,
    cache,
    startIndex,
    session,
    batchItems,
    workerResults,
  }: RunConnectionRedrawSliceRequest): void {
    if (!this._isCurrent(session)) {
      return;
    }

    const sliceStart = this._now();
    let endIndex = startIndex;
    let processed = 0;

    while (
      endIndex < connections.length &&
      processed < CONNECTIONS_PER_SLICE_LIMIT &&
      this._isWithinSliceBudget(sliceStart)
    ) {
      const connection = connections[endIndex];

      if (batchItems) {
        this._mediator.execute<void>(
          new ApplyConnectionWorkerResultRequest(
            batchItems[endIndex] ?? null,
            workerResults?.[endIndex],
          ),
        );
      } else {
        this._mediator.execute<void>(new RenderConnectionRequest(connection, cache));
      }

      endIndex++;
      processed++;

      if (!this._isCurrent(session)) {
        return;
      }
    }

    if (endIndex >= connections.length) {
      this._mediator.execute<void>(new CompleteConnectionRedrawRequest(session));

      return;
    }

    this._requestAnimationFrame(() =>
      this._mediator.execute<void>(
        new RunConnectionRedrawSliceRequest(
          connections,
          cache,
          endIndex,
          session,
          batchItems,
          workerResults,
        ),
      ),
    );
  }

  private _isCurrent(session: IConnectionRedrawSession): boolean {
    return this._mediator.execute<boolean>(new IsConnectionRedrawCurrentRequest(session));
  }

  private _requestAnimationFrame(callback: () => void): void {
    const windowRef = this._browser.document.defaultView;
    if (!windowRef) {
      callback();

      return;
    }

    windowRef.requestAnimationFrame(callback);
  }

  private _now(): number {
    const performanceRef = this._browser.document.defaultView?.performance;

    return performanceRef ? performanceRef.now() : Date.now();
  }

  private _isWithinSliceBudget(sliceStart: number): boolean {
    if (!this._browser.isBrowser()) {
      return true;
    }

    return this._now() - sliceStart < SLICE_BUDGET_MS;
  }
}
