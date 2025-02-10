import { inject, Injectable } from '@angular/core';
import { FNodeMoveFinalizeRequest } from './f-node-move-finalize.request';
import { IPoint, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest
} from '../../domain';
import { IFDragHandler } from '../../f-drag-handler';
import { FNodeDropToGroupDragHandler } from '../../f-drop-to-group';
import { ILineAlignmentResult, INearestCoordinateResult } from '../../../f-line-alignment';
import { FLineAlignmentDragHandler } from '../f-line-alignment.drag-handler';
import { FSummaryNodeMoveDragHandler } from '../f-summary-node-move.drag-handler';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(FNodeMoveFinalizeRequest)
export class FNodeMoveFinalizeExecution implements IExecution<FNodeMoveFinalizeRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  public handle(request: FNodeMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const difference = this._getDifferenceWithLineAlignment(
      this._getDifferenceBetweenPreparationAndFinalize(request.event.getPosition())
    );

    const firstNodeOrGroup: FSummaryNodeMoveDragHandler = this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FSummaryNodeMoveDragHandler)!;

    this._finalizeMove(firstNodeOrGroup.calculateRestrictedDifference(difference));

    this._applyConnectionUnderDroppedNode();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems.some((x) => x instanceof FSummaryNodeMoveDragHandler);
  }

  private _finalizeMove(difference: IPoint): void {
    this._getItems().forEach((x) => {
      x.onPointerMove({ ...difference });
      x.onPointerUp?.();
    });
  }

  private _getItems(): IFDragHandler[] {
    return this._fDraggableDataContext.draggableItems
      .filter((x) => !(x instanceof FNodeDropToGroupDragHandler));
  }

  private _getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this._fHost)
      .div(this._fDraggableDataContext.onPointerDownScale)
      .sub(this._fDraggableDataContext.onPointerDownPosition);
  }

  private _getDifferenceWithLineAlignment(difference: IPoint): IPoint {

    return this._applyLineAlignmentDifference(
      difference,
      this._getLineAlignmentDifference(difference)
    );
  }

  private _getLineAlignmentDifference(difference: IPoint): ILineAlignmentResult | undefined {
    return this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof FLineAlignmentDragHandler)
      ?.findNearestCoordinate(difference);
  }

  private _applyLineAlignmentDifference(difference: IPoint, intersection: ILineAlignmentResult | undefined): IPoint {
    if (intersection) {
      difference.x = this._isIntersectValue(intersection.xResult) ? (difference.x - intersection.xResult.distance!) : difference.x;
      difference.y = this._isIntersectValue(intersection.yResult) ? (difference.y - intersection.yResult.distance!) : difference.y;
    }
    return difference;
  }

  private _isIntersectValue(result: INearestCoordinateResult): boolean {
    return result.value !== undefined && result.value !== null;
  }

  private _applyConnectionUnderDroppedNode(): void {
    if (this._isDraggedJustOneNode() && this._fComponentsStore.fDraggable?.fEmitOnNodeIntersect) {

      const fNode = this._getFirstNodeOrGroup();
      setTimeout(() => this._fMediator.execute(new IsConnectionUnderNodeRequest(fNode)));
    }
  }

  private _isDraggedJustOneNode(): boolean {
    return (this._fDraggableDataContext.draggableItems[ 0 ] as FSummaryNodeMoveDragHandler).fHandlers.length === 1;
  }

  private _getFirstNodeOrGroup(): FNodeBase {
    return (this._fDraggableDataContext.draggableItems[ 0 ] as FSummaryNodeMoveDragHandler).fHandlers[ 0 ].fNode;
  }
}
