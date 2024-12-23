import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenComponentsDataChangedRequest } from './listen-components-data-changed-request';
import { FComponentsStore } from '../../../f-storage';
import { Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
@FExecutionRegister(ListenComponentsDataChangedRequest)
export class ListenComponentsDataChangedExecution implements IExecution<ListenComponentsDataChangedRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenComponentsDataChangedRequest): Observable<any> {
    return this._fComponentsStore.componentsData$
      .pipe(
        startWith(null), debounceTime(1), takeUntilDestroyed(request.destroyRef)
      );
  }
}
