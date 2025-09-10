import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenDataChangesRequest } from './listen-data-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';

@Injectable()
@FExecutionRegister(ListenDataChangesRequest)
export class ListenDataChangesExecution
  implements IExecution<ListenDataChangesRequest, FChannelHub>
{
  private readonly _store = inject(FComponentsStore);

  public handle(_request: ListenDataChangesRequest): FChannelHub {
    return new FChannelHub(this._store.dataChanges$).pipe(notifyOnStart(), debounceTime(1));
  }
}
