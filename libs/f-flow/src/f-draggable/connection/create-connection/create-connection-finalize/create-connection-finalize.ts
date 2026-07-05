import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize-request';
import { FExecutionRegister } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { CreateConnectionHandler } from '../create-connection-handler';
import { FCreateConnectionSession } from '../f-create-connection-session';

/**
 * Completes a drag-to-connect session on pointer up: the session emits
 * `fCreateConnection` (target is `undefined` when dropped on nothing connectable) and
 * cleans the preview up. Guarded so an armed click-to-connect session is not completed
 * by an unrelated drag's pointer up.
 */
@Injectable()
@FExecutionRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalize implements IHandler<CreateConnectionFinalizeRequest, void> {
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _session = inject(FCreateConnectionSession);

  public handle(request: CreateConnectionFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }

    this._session.complete(request.event.getPosition());
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof CreateConnectionHandler);
  }
}
