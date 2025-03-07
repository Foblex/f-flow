import { inject, Injectable, Injector } from '@angular/core';
import { FNodeResizePreparationRequest } from './f-node-resize-preparation.request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { FNodeResizeDragHandler } from '../f-node-resize.drag-handler';
import { getDataAttrValueFromClosestElementWithClass, isClosestElementHasClass } from '@foblex/utils';

@Injectable()
@FExecutionRegister(FNodeResizePreparationRequest)
export class FNodeResizePreparationExecution implements IExecution<FNodeResizePreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private _fNode: FNodeBase | undefined;

  public handle(request: FNodeResizePreparationRequest): void {
    if(!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    const resizeHandleType = EFResizeHandleType[ this._getHandleType(request.event.targetElement) ];
    this._fDraggableDataContext.draggableItems = [
      new FNodeResizeDragHandler(
        this._injector,
        this._fNode!, resizeHandleType
      )
    ];
  }

  private _isValid(request: FNodeResizePreparationRequest): boolean {
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

  private _isValidTrigger(request: FNodeResizePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
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
