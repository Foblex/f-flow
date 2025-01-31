import { inject, Injectable } from '@angular/core';
import { NodeMovePreparationRequest } from './node-move-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { CreateMoveNodesDragModelFromSelectionRequest } from '../create-move-nodes-drag-model-from-selection';
import { SelectAndUpdateNodeLayerRequest } from '../../../domain';
import { isClosestElementHasClass } from '@foblex/utils';
import { LineAlignmentPreparationRequest } from '../line-alignment-preparation';
import { SummaryNodeDragHandler } from '../summary-node.drag-handler';

@Injectable()
@FExecutionRegister(NodeMovePreparationRequest)
export class NodeMovePreparationExecution implements IExecution<NodeMovePreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: NodeMovePreparationRequest): void {
    if(!this._isValid(request)) {
      return;
    }

    const summaryDragHandler = this._calculateDraggedItems(this._fNode!);

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.draggableItems = [summaryDragHandler];

    if(this._fComponentsStore.fLineAlignment) {
      this._fMediator.execute<void>(
        new LineAlignmentPreparationRequest(
          summaryDragHandler.fHandlers.map((x) => x.fNode), summaryDragHandler.commonRect
        )
      );
    }
  }

  private _isValid(request: NodeMovePreparationRequest): boolean {
    return this._fDraggableDataContext.isEmpty()
      && this._isDragHandleElement(request.event.targetElement)
      && !!this._getNode(request.event.targetElement);
  }

  private _isDragHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._fComponentsStore.fNodes
      .find(x => x.isContains(element) && !x.fDraggingDisabled);
    return this._fNode;
  }

  //We drag nodes from selection model
  private _calculateDraggedItems(fNode: FNodeBase): SummaryNodeDragHandler {
    let result: SummaryNodeDragHandler;
    if (!fNode.fSelectionDisabled) {
      // Need to select node before drag
      this._fMediator.execute(new SelectAndUpdateNodeLayerRequest(fNode));

      result = this._dragModelFromSelection();
    } else {
      // User can drag node that can't be selected
      result = this._dragModelFromSelection(fNode);
    }
    return result;
  }

  private _dragModelFromSelection(nodeWithDisabledSelection?: FNodeBase): SummaryNodeDragHandler {
    return this._fMediator.execute(
      new CreateMoveNodesDragModelFromSelectionRequest(nodeWithDisabledSelection)
    );
  }
}
