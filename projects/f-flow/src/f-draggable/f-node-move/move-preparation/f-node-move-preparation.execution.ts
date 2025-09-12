import { inject, Injectable } from '@angular/core';
import { FNodeMovePreparationRequest } from './f-node-move-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { CreateDragModelFromSelectionRequest } from '../create-drag-model-from-selection';
import { FEventTrigger, isValidEventTrigger, SelectAndUpdateNodeLayerRequest } from '../../../domain';
import { isClosestElementHasClass } from '@foblex/utils';
import { CreateSnapLinesRequest } from '../create-snap-lines';
import { MoveSummaryDragHandler } from '../move-summary-drag-handler';
import { IPointerEvent } from "../../../drag-toolkit";

@Injectable()
@FExecutionRegister(FNodeMovePreparationRequest)
export class FNodeMovePreparationExecution implements IExecution<FNodeMovePreparationRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle({ event, fTrigger }: FNodeMovePreparationRequest): void {
    if (!this._isValid(event) || !this._isValidTrigger(event, fTrigger)) {
      return;
    }

    const summaryDragHandler = this._calculateDraggedItems(this._fNode!);

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._dragContext.draggableItems = [summaryDragHandler];

    if (this._store.fLineAlignment) {
      this._mediator.execute<void>(new CreateSnapLinesRequest(summaryDragHandler));
    }
  }

  private _isValid(event: IPointerEvent): boolean {
    return this._dragContext.isEmpty()
      && this._isDragHandleElement(event.targetElement)
      && !!this._getNode(event.targetElement);
  }

  private _isDragHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._store.fNodes
      .find(x => x.isContains(element) && !x.fDraggingDisabled());

    return this._fNode;
  }

  private _isValidTrigger(event: IPointerEvent, fTrigger: FEventTrigger): boolean {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }

  //We drag nodes from selection model
  private _calculateDraggedItems(fNode: FNodeBase): MoveSummaryDragHandler {
    let result: MoveSummaryDragHandler;
    if (!fNode.fSelectionDisabled()) {
      // Need to select node before drag
      this._mediator.execute(new SelectAndUpdateNodeLayerRequest(fNode));

      result = this._dragModelFromSelection();
    } else {
      // User can drag node that can't be selected
      result = this._dragModelFromSelection(fNode);
    }

    return result;
  }

  private _dragModelFromSelection(nodeWithDisabledSelection?: FNodeBase): MoveSummaryDragHandler {
    return this._mediator.execute(
      new CreateDragModelFromSelectionRequest(nodeWithDisabledSelection),
    );
  }
}
