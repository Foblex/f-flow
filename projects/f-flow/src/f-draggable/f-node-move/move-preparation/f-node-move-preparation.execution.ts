import { inject, Injectable } from '@angular/core';
import { FNodeMovePreparationRequest } from './f-node-move-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { CreateMoveNodesDragModelFromSelectionRequest } from '../create-move-nodes-drag-model-from-selection';
import { isValidEventTrigger, SelectAndUpdateNodeLayerRequest } from '../../../domain';
import { isClosestElementHasClass } from '@foblex/utils';
import { LineAlignmentPreparationRequest } from '../line-alignment-preparation';
import { FSummaryNodeMoveDragHandler } from '../f-summary-node-move.drag-handler';

@Injectable()
@FExecutionRegister(FNodeMovePreparationRequest)
export class FNodeMovePreparationExecution implements IExecution<FNodeMovePreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: FNodeMovePreparationRequest): void {
    if(!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    const summaryDragHandler = this._calculateDraggedItems(this._fNode!);

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._dragContext.draggableItems = [summaryDragHandler];

    if(this._fComponentsStore.fLineAlignment) {
      this._fMediator.execute<void>(
        new LineAlignmentPreparationRequest(
          summaryDragHandler.fHandlers.map((x) => x.fNode), summaryDragHandler.commonRect
        )
      );
    }
  }

  private _isValid(request: FNodeMovePreparationRequest): boolean {
    return this._dragContext.isEmpty()
      && this._isDragHandleElement(request.event.targetElement)
      && !!this._getNode(request.event.targetElement);
  }

  private _isDragHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._fComponentsStore.fNodes
      .find(x => x.isContains(element) && !x.fDraggingDisabled());
    return this._fNode;
  }

  private _isValidTrigger(request: FNodeMovePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  //We drag nodes from selection model
  private _calculateDraggedItems(fNode: FNodeBase): FSummaryNodeMoveDragHandler {
    let result: FSummaryNodeMoveDragHandler;
    if (!fNode.fSelectionDisabled()) {
      // Need to select node before drag
      this._fMediator.execute(new SelectAndUpdateNodeLayerRequest(fNode));

      result = this._dragModelFromSelection();
    } else {
      // User can drag node that can't be selected
      result = this._dragModelFromSelection(fNode);
    }
    return result;
  }

  private _dragModelFromSelection(nodeWithDisabledSelection?: FNodeBase): FSummaryNodeMoveDragHandler {
    return this._fMediator.execute(
      new CreateMoveNodesDragModelFromSelectionRequest(nodeWithDisabledSelection)
    );
  }
}
