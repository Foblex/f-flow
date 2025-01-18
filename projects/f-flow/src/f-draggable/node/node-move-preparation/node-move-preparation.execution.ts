import { inject, Injectable } from '@angular/core';
import { NodeMovePreparationRequest } from './node-move-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { IDraggableItem } from '../../i-draggable-item';
import { NodeDragHandler } from '../node.drag-handler';
import { FNodeBase } from '../../../f-node';
import { CreateMoveNodesDragModelFromSelectionRequest } from '../create-move-nodes-drag-model-from-selection';
import { SelectAndUpdateNodeLayerRequest } from '../../../domain';

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

  public handle(request: NodeMovePreparationRequest): void {

    const itemsToDrag = this._calculateDraggableItems(
      this._getNode(request.event.targetElement)
    );

    this._initializeLineAlignment(itemsToDrag);

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.draggableItems = itemsToDrag;
  }

  private _getNode(targetElement: HTMLElement): FNodeBase {
    const result = this._fComponentsStore.fNodes.find(n => n.isContains(targetElement))!;
    if (!result) {
      throw new Error('Node not found');
    }
    return result;
  }

  //We drag nodes from selection model
  private _calculateDraggableItems(fNode: FNodeBase): IDraggableItem[] {
    let result: IDraggableItem[] = [];
    if (!fNode.fSelectionDisabled) {
      // Need to select node before drag
      this._fMediator.send(new SelectAndUpdateNodeLayerRequest(fNode));

      result = this._dragModelFromSelection();
    } else {
      // User can drag node that can't be selected
      result = this._dragModelFromSelection(fNode);
    }
    return result;
  }

  private _dragModelFromSelection(nodeWithDisabledSelection?: FNodeBase): IDraggableItem[] {
    return this._fMediator.send(
      new CreateMoveNodesDragModelFromSelectionRequest(nodeWithDisabledSelection)
    );
  }

  private _initializeLineAlignment(itemsToDrag: IDraggableItem[]): void {
    this._fComponentsStore.fLineAlignment?.initialize(
      this._fComponentsStore.fNodes, this._filterNodesFromDraggableItems(itemsToDrag)
    );
  }

  private _filterNodesFromDraggableItems(items: IDraggableItem[]): FNodeBase[] {
    return items.filter((x) => x instanceof NodeDragHandler)
      .map(x => (x as NodeDragHandler).fNode);
  }
}
