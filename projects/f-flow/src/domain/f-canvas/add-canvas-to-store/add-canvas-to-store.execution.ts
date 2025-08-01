import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddCanvasToStoreRequest } from './add-canvas-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a canvas to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddCanvasToStoreRequest)
export class AddCanvasToStoreExecution implements IExecution<AddCanvasToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddCanvasToStoreRequest): void {
    this._store.fCanvas = request.fCanvas;
  }
}
