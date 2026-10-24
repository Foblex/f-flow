import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { RemoveCanvasFromStoreRequest } from './remove-canvas-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the canvas from the FComponentsStore.
 */
@Injectable()
export class RemoveCanvasFromStore implements IExecution<RemoveCanvasFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: RemoveCanvasFromStoreRequest): void {
    this._store.fCanvas = undefined;
  }
}
