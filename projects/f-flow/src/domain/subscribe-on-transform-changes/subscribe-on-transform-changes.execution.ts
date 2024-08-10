import { SubscribeOnTransformChangesRequest } from './subscribe-on-transform-changes.request';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FTransformStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(SubscribeOnTransformChangesRequest)
export class SubscribeOnTransformChangesExecution
  implements IExecution<SubscribeOnTransformChangesRequest, Observable<void>> {

  constructor(
    private fTransformStore: FTransformStore,
  ) {
  }

  public handle(request: SubscribeOnTransformChangesRequest): Observable<void> {
    return this.fTransformStore.changes;
  }
}
