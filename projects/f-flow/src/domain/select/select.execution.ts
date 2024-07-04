import { IHandler } from '@foblex/core';
import { SelectRequest } from './select.request';
import { Injectable } from '@angular/core';
import { FDraggableDataContext } from '../../f-draggable';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(SelectRequest)
export class SelectExecution implements IExecution<SelectRequest, void> {

  constructor(
    private fDataContext: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(request: SelectRequest): void {
    this.fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
    });
    this.fDraggableDataContext.selectedItems = [];

    request.nodes.forEach((key) => {
      const node = this.fDataContext.fNodes.find((x) => x.fId === key);
      if(node) {
        node.select();
        this.fDraggableDataContext.selectedItems.push(node);
      }
    });

    request.connections.forEach((key) => {
      const connection = this.fDataContext.fConnections.find((x) => x.fConnectionId === key);
      if(connection) {
        connection.select();
        this.fDraggableDataContext.selectedItems.push(connection);
      }
    });

    this.fDraggableDataContext.isSelectedChanged = true;
  }
}
