import { Injectable } from '@angular/core';
import { NodeMoveFinalizeRequest } from './node-move-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { EFDraggableType } from '../../e-f-draggable-type';

@Injectable()
@FValidatorRegister(NodeMoveFinalizeRequest)
export class NodeMoveFinalizeValidator implements IValidator<NodeMoveFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeMoveFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) => x.type === EFDraggableType.NODE);
  }
}
