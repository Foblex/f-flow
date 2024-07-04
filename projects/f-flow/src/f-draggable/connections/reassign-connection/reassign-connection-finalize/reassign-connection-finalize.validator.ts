import { Injectable } from '@angular/core';
import { ReassignConnectionFinalizeRequest } from './reassign-connection-finalize.request';
import { FValidatorRegister, IValidator } from '../../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { EFDraggableType } from '../../../e-f-draggable-type';

@Injectable()
@FValidatorRegister(ReassignConnectionFinalizeRequest)
export class ReassignConnectionFinalizeValidator implements IValidator<ReassignConnectionFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: ReassignConnectionFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) => x.type === EFDraggableType.REASSIGN_CONNECTION);
  }
}
