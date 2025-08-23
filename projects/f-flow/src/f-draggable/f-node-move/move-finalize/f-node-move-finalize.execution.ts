import {inject, Injectable} from '@angular/core';
import {FNodeMoveFinalizeRequest} from './f-node-move-finalize.request';
import {IPoint, Point} from '@foblex/2d';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {FComponentsStore} from '../../../f-storage';
import {FDraggableDataContext} from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest
} from '../../domain';
import {ISnapResult, ISnapCoordinate} from '../../../f-line-alignment';
import {MoveSummaryDragHandler} from '../move-summary.drag-handler';
import {FNodeBase} from '../../../f-node';
import {FMoveNodesEvent} from "../f-move-nodes.event";

@Injectable()
@FExecutionRegister(FNodeMoveFinalizeRequest)
export class FNodeMoveFinalizeExecution implements IExecution<FNodeMoveFinalizeRequest, void> {

  private _mediator = inject(FMediator);
  private _store = inject(FComponentsStore);
  private _dragContext = inject(FDraggableDataContext);

  private _summaryHandler: MoveSummaryDragHandler | undefined;

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  public handle(request: FNodeMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const difference = this._getDifferenceBetweenPreparationAndFinalize(request.event.getPosition());

    const snappedDifference = this._applySnapDifference(difference, this._getSnapLinesResult(difference))

    this._finalizeMove(snappedDifference);

    this._applyConnectionUnderDroppedNode();
  }

  private _isValid(): boolean {
    this._summaryHandler = this._dragContext.draggableItems.find((x) => x instanceof MoveSummaryDragHandler);
    return !!this._summaryHandler;
  }

  private _finalizeMove(snappedDifference: IPoint): void {
    this._summaryHandler!.onPointerMove({...snappedDifference});
    this._summaryHandler!.onPointerUp?.();

    const eventNodes = this._summaryHandler!.fData.fNodeIds.map((id: string) => {
      return {
        id,
        position: this._store.fNodes.find(x => x.fId() === id)!._position,
      }
    });
    this._store.fDraggable?.fMoveNodes.emit(new FMoveNodesEvent(eventNodes));
  }

  private _getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this._fHost)
      .div(this._dragContext.onPointerDownScale)
      .sub(this._dragContext.onPointerDownPosition);
  }

  private _getSnapLinesResult(difference: IPoint): ISnapResult | undefined {
    return this._summaryHandler?.findClosestAlignment(difference);
  }

  private _applySnapDifference(difference: IPoint, intersection: ISnapResult | undefined): IPoint {
    if (intersection) {
      difference.x = this._isIntersectValue(intersection.xResult) ? (difference.x - intersection.xResult.distance!) : difference.x;
      difference.y = this._isIntersectValue(intersection.yResult) ? (difference.y - intersection.yResult.distance!) : difference.y;
    }
    return difference;
  }

  private _isIntersectValue(result: ISnapCoordinate): boolean {
    return result.value !== undefined && result.value !== null;
  }

  private _applyConnectionUnderDroppedNode(): void {
    if (this._isDraggedJustOneNode() && this._store.fDraggable?.fEmitOnNodeIntersect) {

      const fNode = this._getFirstNodeOrGroup();
      setTimeout(() => this._mediator.execute(new IsConnectionUnderNodeRequest(fNode)));
    }
  }

  private _isDraggedJustOneNode(): boolean {
    return (this._dragContext.draggableItems[0] as MoveSummaryDragHandler).rootHandlers.length === 1;
  }

  private _getFirstNodeOrGroup(): FNodeBase {
    return (this._dragContext.draggableItems[0] as MoveSummaryDragHandler).rootHandlers[0].nodeOrGroup;
  }
}
