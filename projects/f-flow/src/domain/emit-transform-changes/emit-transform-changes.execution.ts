import { EmitTransformChangesRequest } from './emit-transform-changes.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FTransformStore } from '../../f-storage';

@Injectable()
@FExecutionRegister(EmitTransformChangesRequest)
export class EmitTransformChangesExecution
  implements IExecution<EmitTransformChangesRequest, void> {

  constructor(
    private fTransformStore: FTransformStore,
  ) {
  }

  public handle(request: EmitTransformChangesRequest): void {
    this.fTransformStore.changes.next();
  }
}
