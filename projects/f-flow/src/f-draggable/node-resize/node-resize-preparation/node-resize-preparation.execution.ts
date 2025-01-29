import { inject, Injectable } from '@angular/core';
import { NodeResizePreparationRequest } from './node-resize-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';
import { getDataAttrValueFromClosestElementWithClass, isClosestElementHasClass } from '@foblex/utils';

@Injectable()
@FExecutionRegister(NodeResizePreparationRequest)
export class NodeResizePreparationExecution implements IExecution<NodeResizePreparationRequest, void> {

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

  public handle(request: NodeResizePreparationRequest): void {
    if(!this._isValid(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    this._fDraggableDataContext.draggableItems = [
      new NodeResizeDragHandler(
        this._fNode!,
        EFResizeHandleType[ this._getHandleType(request.event.targetElement) ]
      )
    ];
  }

  private _isValid(request: NodeResizePreparationRequest): boolean {
    return this._fDraggableDataContext.isEmpty()
      && this._isDragHandleElement(request.event.targetElement)
      && this._isNodeCanBeDragged(this._getNode(request.event.targetElement));
  }

  private _isDragHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-resize-handle');
  }

  private _isNodeCanBeDragged(fNode?: FNodeBase): boolean {
    return !!fNode && !fNode.fDraggingDisabled;
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._fComponentsStore
      .fNodes.find(x => x.isContains(element));
    return this._fNode;
  }

  private _selectAndUpdateNodeLayer() {
    this._fMediator.execute(
      new SelectAndUpdateNodeLayerRequest(this._fNode!)
    );
  }

  private _getHandleType(element: HTMLElement): keyof typeof EFResizeHandleType {
    return getDataAttrValueFromClosestElementWithClass(element, 'fResizeHandleType', '.f-resize-handle');
  }
}
