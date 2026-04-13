import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { ConnectionRedrawState, IConnectionRedrawSession } from '../../models';
import { StartConnectionRedrawRequest } from './start-connection-redraw-request';

@Injectable()
@FExecutionRegister(StartConnectionRedrawRequest)
export class StartConnectionRedraw
  implements IExecution<StartConnectionRedrawRequest, IConnectionRedrawSession>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _state = inject(ConnectionRedrawState);

  public handle(_: StartConnectionRedrawRequest): IConnectionRedrawSession {
    this._state.resetConnectedConnectors();

    return {
      renderTicket: this._state.beginRender(),
      connectionsRevision: this._store.connectionsRevision,
      nodesRevision: this._store.nodesRevision,
    };
  }
}
