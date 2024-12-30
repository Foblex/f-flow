import { inject, Injectable } from '@angular/core';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { IsConnectionUnderNodeRequest } from './is-connection-under-node.request';
import { FDraggableDataContext, NodeDragHandler } from '../../index';

@Injectable()
@FValidatorRegister(IsConnectionUnderNodeRequest)
export class IsConnectionUnderNodeValidator
  implements IValidator<IsConnectionUnderNodeRequest> {

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: IsConnectionUnderNodeRequest): boolean {
    return !!this._fDraggableDataContext.draggableItems.length &&
      this._fDraggableDataContext.draggableItems[ 0 ] instanceof NodeDragHandler;
  }
}
