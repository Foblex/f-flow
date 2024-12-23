import { TransformChangedRequest } from './transform-changed.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FTransformStore } from '../../index';

@Injectable()
@FExecutionRegister(TransformChangedRequest)
export class TransformChangedExecution
  implements IExecution<TransformChangedRequest, void> {

  constructor(
    private fTransformStore: FTransformStore,
  ) {
  }

  public handle(request: TransformChangedRequest): void {
    this.fTransformStore.changes.next();
  }
}
