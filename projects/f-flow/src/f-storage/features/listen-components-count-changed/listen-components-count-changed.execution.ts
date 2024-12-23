import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ListenComponentsCountChangedRequest } from './listen-components-count-changed-request';
import { FComponentsStore } from '../../../f-storage';
import { Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
@FExecutionRegister(ListenComponentsCountChangedRequest)
export class ListenComponentsCountChangedExecution implements IExecution<ListenComponentsCountChangedRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: ListenComponentsCountChangedRequest): Observable<any> {
    return this._fComponentsStore.componentsCount$
      .pipe(
        startWith(null), debounceTime(1), takeUntilDestroyed(request.destroyRef)
      );
  }
}
