import { inject, Injectable } from '@angular/core';
import { FNodeMoveFinalizeRequest } from './f-node-move-finalize.request';
import { IPoint, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest,
} from '../../domain';
import { ISnapResult, ISnapCoordinate } from '../../../f-line-alignment';
import { MoveSummaryDragHandler } from '../move-summary-drag-handler';
import { FNodeBase } from '../../../f-node';
import { FMoveNodesEvent } from "../f-move-nodes.event";

@Injectable()
@FExecutionRegister(FNodeMoveFinalizeRequest)
export class FNodeMoveFinalizeExecution implements IExecution<FNodeMoveFinalizeRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private _summaryHandler: MoveSummaryDragHandler | undefined;

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  public handle({ event }: FNodeMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const difference = this._getDifferenceBetweenPreparationAndFinalize(event.getPosition());

    const snapLinesDifference = this._applySnapLinesDifference(difference, this._getSnapLinesResult(difference))

    this._finalizeMove(snapLinesDifference);

    this._applyConnectionUnderDroppedNode();
  }

  private _isValid(): boolean {
    this._summaryHandler = this._dragContext.draggableItems.find((x) => x instanceof MoveSummaryDragHandler);

    return !!this._summaryHandler;
  }

  private _getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this._fHost)
      .div(this._dragContext.onPointerDownScale)
      .sub(this._dragContext.onPointerDownPosition);
  }

  private _getSnapLinesResult(difference: IPoint): ISnapResult | undefined {
    return this._summaryHandler?.findClosestAlignment(difference);
  }

  private _applySnapLinesDifference(difference: IPoint, intersection: ISnapResult | undefined): IPoint {
    if (intersection) {
      difference.x = this._isIntersectValue(intersection.xResult) ? (difference.x - intersection.xResult.distance!) : difference.x;
      difference.y = this._isIntersectValue(intersection.yResult) ? (difference.y - intersection.yResult.distance!) : difference.y;
    }

    return difference;
  }

  private _isIntersectValue(result: ISnapCoordinate): boolean {
    return result.value !== undefined && result.value !== null;
  }

  private _finalizeMove(snappedDifference: IPoint): void {
    this._summaryHandler?.rootHandlers.forEach((x) => x.assignFinalConstraints());
    this._summaryHandler!.onPointerMove({ ...snappedDifference });
    this._summaryHandler!.onPointerUp?.();

    this._store.fDraggable?.fMoveNodes.emit(this._createMoveNodesEvent());
  }

  private _createMoveNodesEvent(): FMoveNodesEvent {
    const eventNodes = this._summaryHandler!.fData.fNodeIds.map((id: string) => {
      return {
        id,
        position: this._store.fNodes.find(x => x.fId() === id)!._position,
      }
    });

    return new FMoveNodesEvent(eventNodes);
  }

  private _applyConnectionUnderDroppedNode(): void {
    if (this._isDraggedJustOneNode() && this._store.fDraggable?.fEmitOnNodeIntersect) {
      setTimeout(() => this._mediator.execute(new IsConnectionUnderNodeRequest(this._firstNodeOrGroup())));
    }
  }

  private _isDraggedJustOneNode(): boolean {
    return this._summaryHandler!.rootHandlers.length === 1;
  }

  private _firstNodeOrGroup(): FNodeBase {
    return this._summaryHandler!.rootHandlers[0].nodeOrGroup;
  }
}
