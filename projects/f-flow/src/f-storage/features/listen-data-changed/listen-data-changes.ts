import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenDataChangesRequest } from './listen-data-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';

@Injectable()
@FExecutionRegister(ListenDataChangesRequest)
export class ListenDataChanges implements IExecution<ListenDataChangesRequest, FChannelHub> {
  private readonly _store = inject(FComponentsStore);

  public handle({ notifyOnSubscribe }: ListenDataChangesRequest): FChannelHub {
    return notifyOnSubscribe
      ? new FChannelHub(this._store.dataChanges$).pipe(notifyOnStart(), debounceTime(1))
      : new FChannelHub(this._store.dataChanges$).pipe(debounceTime(1));
  }
}
