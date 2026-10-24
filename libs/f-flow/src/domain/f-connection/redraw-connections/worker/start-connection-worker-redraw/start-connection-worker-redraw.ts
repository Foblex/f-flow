import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../../../_libs/f-mediator';
import { IConnectionWorkerResultItem } from '../../models';
import { IsConnectionRedrawCurrentRequest, RunConnectionRedrawSliceRequest } from '../../pipeline';
import { BuildConnectionWorkerBatchRequest } from '../build-connection-worker-batch';
import { RunConnectionWorkerBatchRequest } from '../run-connection-worker-batch';
import { StartConnectionWorkerRedrawRequest } from './start-connection-worker-redraw-request';

@Injectable()
export class StartConnectionWorkerRedraw implements IExecution<
  StartConnectionWorkerRedrawRequest,
  void
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connections, cache, session }: StartConnectionWorkerRedrawRequest): void {
    const batch = this._mediator.execute(new BuildConnectionWorkerBatchRequest(connections, cache));
    if (!batch.payload.length) {
      this._mediator.execute(
        new RunConnectionRedrawSliceRequest(connections, cache, 0, session, batch.items),
      );

      return;
    }

    this._mediator
      .execute(new RunConnectionWorkerBatchRequest(batch))
      .then((results) => {
        if (!this._mediator.execute(new IsConnectionRedrawCurrentRequest(session))) {
          return;
        }

        this._mediator.execute(
          new RunConnectionRedrawSliceRequest(
            connections,
            cache,
            0,
            session,
            batch.items,
            this._alignWorkerResults(results, connections.length),
          ),
        );
      })
      .catch(() => {
        if (!this._mediator.execute(new IsConnectionRedrawCurrentRequest(session))) {
          return;
        }

        this._mediator.execute(
          new RunConnectionRedrawSliceRequest(connections, cache, 0, session, batch.items),
        );
      });
  }

  private _alignWorkerResults(
    results: IConnectionWorkerResultItem[],
    connectionCount: number,
  ): (IConnectionWorkerResultItem | undefined)[] {
    const aligned: (IConnectionWorkerResultItem | undefined)[] = new Array(connectionCount);

    for (const result of results) {
      const index = result.originalIndex;
      if (index < 0 || index >= connectionCount) {
        continue;
      }

      aligned[index] = result;
    }

    return aligned;
  }
}
