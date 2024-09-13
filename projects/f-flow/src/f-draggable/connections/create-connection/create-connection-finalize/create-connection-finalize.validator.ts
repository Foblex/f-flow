import { Injectable } from '@angular/core';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { CreateConnectionDragHandler } from '../create-connection.drag-handler';

@Injectable()
@FValidatorRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalizeValidator implements IValidator<CreateConnectionFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: CreateConnectionFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof CreateConnectionDragHandler
    );
  }
}
