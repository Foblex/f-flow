import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenConnectionsChangesRequest } from './listen-connections-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';

@Injectable()
@FExecutionRegister(ListenConnectionsChangesRequest)
export class ListenConnectionsChanges implements IExecution<
  ListenConnectionsChangesRequest,
  FChannelHub
> {
  private readonly _store = inject(FComponentsStore);

  public handle({ notifyOnSubscribe }: ListenConnectionsChangesRequest): FChannelHub {
    return notifyOnSubscribe
      ? new FChannelHub(this._store.connectionsChanges$).pipe(notifyOnStart(), debounceTime(1))
      : new FChannelHub(this._store.connectionsChanges$).pipe(debounceTime(1));
  }
}
