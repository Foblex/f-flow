import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenComponentsDataChangesRequest } from './listen-components-data-changes-request';
import { FComponentsStore } from '../../../f-storage';
import { Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
@FExecutionRegister(ListenComponentsDataChangesRequest)
export class ListenComponentsDataChangesExecution implements IExecution<ListenComponentsDataChangesRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenComponentsDataChangesRequest): Observable<any> {
    return this._fComponentsStore.componentsData$
      .pipe(
        startWith(null), debounceTime(1), takeUntilDestroyed(request.destroyRef)
      );
  }
}
