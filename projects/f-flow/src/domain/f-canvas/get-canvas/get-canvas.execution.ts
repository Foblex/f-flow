import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetCanvasRequest } from './get-canvas-request';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';

/**
 * Execution that retrieves the canvas from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(GetCanvasRequest)
export class GetCanvasExecution implements IExecution<GetCanvasRequest, FCanvasBase> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: GetCanvasRequest): FCanvasBase {
    const result = this._store.fCanvas;
    if (!result) {
      throw new Error(`Canvas not found in store`);
    }

    return result;
  }
}
