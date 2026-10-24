import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { AddCanvasToStoreRequest } from './add-canvas-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a canvas to the FComponentsStore.
 */
@Injectable()
export class AddCanvasToStore implements IExecution<AddCanvasToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle({ instance }: AddCanvasToStoreRequest): void {
    this._store.fCanvas = instance;
  }
}
