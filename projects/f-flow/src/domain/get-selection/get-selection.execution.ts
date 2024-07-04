import { GetSelectionRequest } from './get-selection.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { FDraggableDataContext, FSelectionChangeEvent } from '../../f-draggable';

@Injectable()
@FExecutionRegister(GetSelectionRequest)
export class GetSelectionExecution implements IExecution<GetSelectionRequest, FSelectionChangeEvent> {

  constructor(
    private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(): FSelectionChangeEvent {

    let selectedNodes: string[] = [];
    let selectedConnections: string[] = [];

    this.fDraggableDataContext.selectedItems.forEach((x) => {
      if (x.hostElement.classList.contains('f-node')) {
        selectedNodes.push(x.hostElement.dataset['fNodeId']!)
      } else {
        selectedConnections.push(x.hostElement.id);
      }
    });

    return new FSelectionChangeEvent(selectedNodes, selectedConnections);
  }
}
