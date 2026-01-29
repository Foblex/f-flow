import { SelectRequest } from './select.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { FConnectionBase } from '../../../f-connection-v2';
import { FNodeBase } from '../../../f-node';

/**
 * Execution that handles the selection of nodes and connections in the FFlow.
 */
@Injectable()
@FExecutionRegister(SelectRequest)
export class SelectExecution implements IExecution<SelectRequest, void> {

  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);

  public handle(request: SelectRequest): void {
    this._dragContext.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._dragContext.selectedItems = [];

    request.nodes.forEach((key) => {
      const node = this._store.nodes.getAll<FNodeBase>().find((x) => x.fId() === key);
      if(node) {
        node.markAsSelected();
        this._dragContext.selectedItems.push(node);
      }
    });

    request.connections.forEach((key) => {
      const connection = this._store.connections.getAll<FConnectionBase>().find((x) => x.fId() === key);
      if(connection) {
        connection.markAsSelected();
        this._dragContext.selectedItems.push(connection);
      }
    });

    this._dragContext.isSelectedChanged = request.isSelectedChanged;
  }
}
