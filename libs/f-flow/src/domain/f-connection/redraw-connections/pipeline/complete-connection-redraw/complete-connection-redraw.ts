import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { IsConnectionRedrawCurrentRequest } from '../is-connection-redraw-current';
import { CompleteConnectionRedrawRequest } from './complete-connection-redraw-request';
import { ConnectionRedrawState } from '../../models';

@Injectable()
@FExecutionRegister(CompleteConnectionRedrawRequest)
export class CompleteConnectionRedraw implements IExecution<CompleteConnectionRedrawRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _state = inject(ConnectionRedrawState);

  public handle({ session }: CompleteConnectionRedrawRequest): void {
    if (!this._mediator.execute<boolean>(new IsConnectionRedrawCurrentRequest(session))) {
      return;
    }

    this._state.isPassCompleted = true;
    this._store.completeConnectionsRender(session.connectionsRevision, session.nodesRevision);
  }
}
