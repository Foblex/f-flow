import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetBackgroundTransformRequest } from './set-background-transform-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';

/**
 * Execution that sets the transform for the background when canvas is transformed.
 */
@Injectable()
@FExecutionRegister(SetBackgroundTransformRequest)
export class SetBackgroundTransform implements IExecution<SetBackgroundTransformRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: SetBackgroundTransformRequest): void {
    this._store.instances.get(INSTANCES.BACKGROUND)?.setTransform(request.fTransform);
  }
}
