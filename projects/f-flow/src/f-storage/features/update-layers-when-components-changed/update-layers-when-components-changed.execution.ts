import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateLayersWhenComponentsChangedRequest } from './update-layers-when-components-changed-request';
import { FComponentsStore } from '../../../f-storage';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SortItemLayersRequest } from '../../../domain';

@Injectable()
@FExecutionRegister(UpdateLayersWhenComponentsChangedRequest)
export class UpdateLayersWhenComponentsChangedExecution implements IExecution<UpdateLayersWhenComponentsChangedRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: UpdateLayersWhenComponentsChangedRequest): void {
    this._fComponentsStore.componentsCount$
      .pipe(
        startWith(null), debounceTime(1), takeUntilDestroyed(request.destroyRef)
      ).subscribe(() => this._fMediator.send(new SortItemLayersRequest()));
  }
}
