import { Injectable } from '@angular/core';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize.request';
import { FValidatorRegister, IValidator } from '../../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { EFDraggableType } from '../../../e-f-draggable-type';

@Injectable()
@FValidatorRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalizeValidator implements IValidator<CreateConnectionFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: CreateConnectionFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) => x.type === EFDraggableType.CREATE_CONNECTION);
  }
}
