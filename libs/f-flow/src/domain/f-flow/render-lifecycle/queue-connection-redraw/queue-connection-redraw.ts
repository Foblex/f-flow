import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { QueueConnectionRedrawRequest } from './queue-connection-redraw-request';
import { QueueConnectionRedrawState } from './queue-connection-redraw-state';
import { FComponentsStore } from '../../../../f-storage';
import { RedrawConnectionsRequest } from '../../../f-connection';

@Injectable()
@FExecutionRegister(QueueConnectionRedrawRequest)
export class QueueConnectionRedraw implements IExecution<QueueConnectionRedrawRequest, void> {
  private readonly _state = inject(QueueConnectionRedrawState);
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  public handle(request: QueueConnectionRedrawRequest): void {
    this._state.pendingRedraw = true;

    if (this._state.isWaitingForViewportAnimation) {
      return;
    }

    this._state.isWaitingForViewportAnimation = true;

    const stop = this._store.viewportAnimationChanges$.listen(() => {
      if (this._store.isViewportAnimating) {
        return;
      }

      const shouldRedraw = this._state.pendingRedraw;
      stop();
      this._state.isWaitingForViewportAnimation = false;
      this._state.pendingRedraw = false;

      if (!shouldRedraw) {
        return;
      }

      this._mediator.execute(new RedrawConnectionsRequest());
    });

    request.destroyRef.onDestroy(stop);
  }
}
