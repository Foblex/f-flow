import { inject, Injectable } from '@angular/core';
import { IRect, ITransformModel, RectExtensions } from '@foblex/2d';
import { ICanBeSelectedElementAndRect } from './i-can-be-selected-element-and-rect';
import { GetCanBeSelectedItemsRequest } from './get-can-be-selected-items-request';
import { FNodeBase } from '../../../f-node';
import { FConnectionBase } from '../../../f-connection';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';

/**
 * Execution that retrieves elements that can be selected in the Flow, along with their bounding rectangles.
 * It filters out elements that are already selected in the FDraggableDataContext.
 */
@Injectable()
@FExecutionRegister(GetCanBeSelectedItemsRequest)
export class GetCanBeSelectedItemsExecution implements IExecution<void, ICanBeSelectedElementAndRect[]> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get fNodes(): FNodeBase[] {
    return this._store.fNodes;
  }

  private get fConnections(): FConnectionBase[] {
    return this._store.fConnections;
  }

  private get transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  public handle(): ICanBeSelectedElementAndRect[] {
    return [ ...this.getNodesWithRects(), ...this.getConnectionsWithRects() ].filter((x) => {
      return !this._dragContext.selectedItems.includes(x.element);
    });
  }

  /**
   * Retrieves nodes with their bounding rectangles that can be selected.
   * @private
   */
  private getNodesWithRects(): ICanBeSelectedElementAndRect[] {
    return this.fNodes.filter((x) => !x.fSelectionDisabled()).map((x) => {
      return {
        element: x,
        fRect: RectExtensions.mult(
          this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement)),
          this.transform.scale,
        ),
      };
    });
  }

  /**
   * Retrieves connections with their bounding rectangles that can be selected.
   * @private
   */
  private getConnectionsWithRects(): ICanBeSelectedElementAndRect[] {
    return this.fConnections.filter((x) => !x.fSelectionDisabled()).map((x) => {
      return {
        element: x,
        fRect: RectExtensions.mult(
          this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.boundingElement)),
          this.transform.scale,
        ),
      };
    });
  }
}
