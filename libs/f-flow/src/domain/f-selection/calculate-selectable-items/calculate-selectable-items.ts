import { inject, Injectable } from '@angular/core';
import { ICanBeSelectedElementAndRect } from './i-can-be-selected-element-and-rect';
import { CalculateSelectableItemsRequest } from './calculate-selectable-items-request';
import { FNodeBase } from '../../../f-node';
import { FExecutionRegister, FMediator, IExecution } from '../../../_libs/f-mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import { FConnectionBase } from '../../../f-connection-v2';

/**
 * Execution that retrieves elements that can be selected in the Flow, along with their bounding rectangles.
 * It filters out elements that are already selected in the FDraggableDataContext.
 */
@Injectable()
@FExecutionRegister(CalculateSelectableItemsRequest)
export class CalculateSelectableItems implements IExecution<void, ICanBeSelectedElementAndRect[]> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _nodes(): FNodeBase[] {
    return this._store.nodes.getAll();
  }

  private get _connections(): FConnectionBase[] {
    return this._store.connections.getAll();
  }

  public handle(): ICanBeSelectedElementAndRect[] {
    return [...this._nodeRects(), ...this._connectionRects()].filter((x) => {
      return !this._dragContext.selectedItems.includes(x.element);
    });
  }

  /**
   * Retrieves nodes with their bounding rectangles that can be selected.
   * @private
   */
  private _nodeRects(): ICanBeSelectedElementAndRect[] {
    return this._nodes
      .filter((x) => !x.fSelectionDisabled())
      .map((x) => {
        return {
          element: x,
          fRect: this._mediator.execute(new GetNormalizedElementRectRequest(x.hostElement)),
        };
      });
  }

  /**
   * Retrieves connections with their bounding rectangles that can be selected.
   * @private
   */
  private _connectionRects(): ICanBeSelectedElementAndRect[] {
    return this._connections
      .filter((x) => !x.fSelectionDisabled())
      .map((x) => {
        return {
          element: x,
          fRect: this._mediator.execute(new GetNormalizedElementRectRequest(x.boundingElement)),
        };
      });
  }
}
