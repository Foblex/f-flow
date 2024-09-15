import { SubscribeOnTransformChangesRequest } from './subscribe-on-transform-changes.request';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { FComponentsStore, FTransformStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(SubscribeOnTransformChangesRequest)
export class SubscribeOnTransformChangesExecution
  implements IExecution<SubscribeOnTransformChangesRequest, Observable<void>> {

  constructor(
    private fTransformStore: FTransformStore,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: SubscribeOnTransformChangesRequest): Observable<void> {
    return merge(
      this.fTransformStore.changes,
      this.fComponentsStore.componentsData$,
      this.fComponentsStore.componentsCount$
    );
  }
}
