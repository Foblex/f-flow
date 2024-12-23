import { ListenTransformChangesRequest } from './listen-transform-changes.request';
import { inject, Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { FComponentsStore, FTransformStore } from '../../index';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(ListenTransformChangesRequest)
export class ListenTransformChangesExecution
  implements IExecution<ListenTransformChangesRequest, Observable<void>> {

  private _fTransformStore = inject(FTransformStore);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenTransformChangesRequest): Observable<void> {
    return merge(
      this._fTransformStore.changes,
      this._fComponentsStore.componentsData$,
      this._fComponentsStore.componentsCount$
    );
  }
}
