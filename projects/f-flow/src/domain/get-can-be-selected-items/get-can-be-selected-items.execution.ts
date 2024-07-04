import { Injectable } from '@angular/core';
import { IRect, ITransformModel, RectExtensions } from '@foblex/core';
import { ISelectableWithRect } from './i-selectable-with-rect';
import { GetCanBeSelectedItemsRequest } from './get-can-be-selected-items-request';
import { FNodeBase } from '../../f-node';
import { FConnectionBase } from '../../f-connection';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../../f-draggable';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';

@Injectable()
@FExecutionRegister(GetCanBeSelectedItemsRequest)
export class GetCanBeSelectedItemsExecution implements IExecution<void, ISelectableWithRect[]> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  constructor(
      private fComponentsStore: FComponentsStore,
      private fDraggableDataContext: FDraggableDataContext,
      private fMediator: FFlowMediator,
  ) {
  }

  public handle(): ISelectableWithRect[] {
    const nodeRects = this.getNodesWithRects();

    const lineRects = this.getConnectionsWithRects();

    const result = [ ...nodeRects, ...lineRects ].filter((x) => {
      return !this.fDraggableDataContext.selectedItems.includes(x.element);
    });

    return result;
  }

  private getNodesWithRects(): ISelectableWithRect[] {
    return this.fNodes.filter((x) => !x.fSelectionDisabled).map((x) => {

      const rect = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(x.hostElement));
      return {
        element: x,
        rect: RectExtensions.mult(rect, this.transform.scale)
      };
    });
  }

  private getConnectionsWithRects(): ISelectableWithRect[] {
    return this.fConnections.filter((x) => !x.fSelectionDisabled).map((x) => {
      const rect = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(x.boundingElement));
      return {
        element: x,
        rect: RectExtensions.mult(rect, this.transform.scale)
      };
    });
  }
}
