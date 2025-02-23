import { inject, Injectable } from '@angular/core';
import { FNodeRotatePreparationRequest } from './f-node-rotate-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { FNodeBase, isRotateHandle } from '../../../f-node';
import { FNodeRotateDragHandler } from '../f-node-rotate.drag-handler';

@Injectable()
@FExecutionRegister(FNodeRotatePreparationRequest)
export class FNodeRotatePreparationExecution implements IExecution<FNodeRotatePreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: FNodeRotatePreparationRequest): void {
    if(!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    this._fDraggableDataContext.draggableItems = [
      new FNodeRotateDragHandler(this._fNode!)
    ];
  }

  private _isValid(request: FNodeRotatePreparationRequest): boolean {
    return this._fDraggableDataContext.isEmpty()
      && isRotateHandle(request.event.targetElement)
      && this._isNodeCanBeDragged(this._getNode(request.event.targetElement));
  }

  private _isNodeCanBeDragged(fNode?: FNodeBase): boolean {
    return !!fNode && !fNode.fDraggingDisabled;
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._fNode = this._fComponentsStore
      .fNodes.find(x => x.isContains(element));
    return this._fNode;
  }

  private _isValidTrigger(request: FNodeRotatePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _selectAndUpdateNodeLayer() {
    this._fMediator.execute(
      new SelectAndUpdateNodeLayerRequest(this._fNode!)
    );
  }

  // private _getHandleType(element: HTMLElement): keyof typeof EFResizeHandleType {
  //   return getDataAttrValueFromClosestElementWithClass(element, 'fResizeHandleType', '.f-resize-handle');
  // }
}
