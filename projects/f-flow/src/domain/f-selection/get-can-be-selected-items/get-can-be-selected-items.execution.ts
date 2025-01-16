import { inject, Injectable } from '@angular/core';
import { IRect, ITransformModel, RectExtensions } from '@foblex/2d';
import { ICanBeSelected } from './i-can-be-selected';
import { GetCanBeSelectedItemsRequest } from './get-can-be-selected-items-request';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';

@Injectable()
@FExecutionRegister(GetCanBeSelectedItemsRequest)
export class GetCanBeSelectedItemsExecution implements IExecution<void, ICanBeSelected[]> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  private get fNodes(): FNodeBase[] {
    return this._fComponentsStore.fNodes;
  }

  private get fConnections(): FConnectionBase[] {
    return this._fComponentsStore.fConnections;
  }

  private get transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  constructor(
      private fDraggableDataContext: FDraggableDataContext,
  ) {
  }

  public handle(): ICanBeSelected[] {
    return [ ...this.getNodesWithRects(), ...this.getConnectionsWithRects() ].filter((x) => {
      return !this.fDraggableDataContext.selectedItems.includes(x.element);
    });
  }

  private getNodesWithRects(): ICanBeSelected[] {
    return this.fNodes.filter((x) => !x.fSelectionDisabled).map((x) => {
      return {
        element: x,
        rect: RectExtensions.mult(
          this._fMediator.send<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false)),
          this.transform.scale
        )
      };
    });
  }

  private getConnectionsWithRects(): ICanBeSelected[] {
    return this.fConnections.filter((x) => !x.fSelectionDisabled).map((x) => {
      return {
        element: x,
        rect: RectExtensions.mult(
          this._fMediator.send<IRect>(new GetNormalizedElementRectRequest(x.boundingElement, false)),
          this.transform.scale
        )
      };
    });
  }
}
