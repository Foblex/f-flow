import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { MarkConnectionConnectorsAsConnectedRequest } from './mark-connection-connectors-as-connected-request';
import { ConnectionRedrawState } from '../../models';

@Injectable()
@FExecutionRegister(MarkConnectionConnectorsAsConnectedRequest)
export class MarkConnectionConnectorsAsConnected
  implements IExecution<MarkConnectionConnectorsAsConnectedRequest, void>
{
  private readonly _state = inject(ConnectionRedrawState);

  public handle({ source, target }: MarkConnectionConnectorsAsConnectedRequest): void {
    source.setConnected(target);
    target.setConnected(source);
    this._state.trackConnectedConnectors(source, target);
  }
}
