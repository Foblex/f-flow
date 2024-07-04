import { Injectable } from '@angular/core';
import { ExternalItemFinalizeRequest } from './external-item-finalize.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { EFDraggableType } from '../../e-f-draggable-type';
import { FDraggableDataContext } from '../../f-draggable-data-context';

@Injectable()
@FValidatorRegister(ExternalItemFinalizeRequest)
export class ExternalItemFinalizeValidator implements IValidator<ExternalItemFinalizeRequest> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: ExternalItemFinalizeRequest): boolean {
    return this.fDraggableDataContext.draggableItems.some((x) =>
      x.type === EFDraggableType.PALETTE_ITEM);
  }
}
