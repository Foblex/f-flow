import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenComponentsCountChangesRequest } from './listen-components-count-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
@FExecutionRegister(ListenComponentsCountChangesRequest)
export class ListenComponentsCountChangesExecution implements IExecution<ListenComponentsCountChangesRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenComponentsCountChangesRequest): Observable<any> {
    return this._fComponentsStore.componentsCount$
      .pipe(
        startWith(null), debounceTime(1), takeUntilDestroyed(request.destroyRef)
      );
  }
}
