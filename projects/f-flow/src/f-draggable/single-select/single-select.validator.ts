import { Injectable } from '@angular/core';
import { FValidatorRegister, IValidator } from '../../infrastructure';
import { SingleSelectRequest } from './single-select.request';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../f-draggable-data-context';

@Injectable()
@FValidatorRegister(SingleSelectRequest)
export class SingleSelectValidator implements IValidator<SingleSelectRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: SingleSelectRequest): boolean {
    return this.fComponentsStore.fFlow!.hostElement.contains(request.event.targetElement)
      && !this.fDraggableDataContext.draggableItems.length;
  }
}
