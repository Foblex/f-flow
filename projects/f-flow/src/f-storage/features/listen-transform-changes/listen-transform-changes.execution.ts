import { ListenTransformChangesRequest } from './listen-transform-changes.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../index';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FChannelHub } from '../../../reactivity';

@Injectable()
@FExecutionRegister(ListenTransformChangesRequest)
export class ListenTransformChangesExecution
  implements IExecution<ListenTransformChangesRequest, FChannelHub>
{
  private _store = inject(FComponentsStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(_request: ListenTransformChangesRequest): FChannelHub {
    return new FChannelHub(
      this._store.transformChanges$,
      this._store.dataChanges$,
      this._store.countChanges$,
    );
  }
}
