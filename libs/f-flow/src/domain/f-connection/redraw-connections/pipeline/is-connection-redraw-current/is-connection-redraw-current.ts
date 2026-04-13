import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { IsConnectionRedrawCurrentRequest } from './is-connection-redraw-current-request';
import { ConnectionRedrawState } from '../../models';

@Injectable()
@FExecutionRegister(IsConnectionRedrawCurrentRequest)
export class IsConnectionRedrawCurrent
  implements IExecution<IsConnectionRedrawCurrentRequest, boolean>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _state = inject(ConnectionRedrawState);

  public handle({ session }: IsConnectionRedrawCurrentRequest): boolean {
    return (
      session.renderTicket === this._state.renderTicket &&
      session.nodesRevision === this._store.nodesRevision
    );
  }
}
