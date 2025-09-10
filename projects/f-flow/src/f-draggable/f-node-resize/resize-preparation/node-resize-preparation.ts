import { inject, Injectable, Injector } from '@angular/core';
import { NodeResizePreparationRequest } from './node-resize-preparation-request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';
import { getDataAttrValueFromClosestElementWithClass, isClosestElementHasClass } from '@foblex/utils';

@Injectable()
@FExecutionRegister(NodeResizePreparationRequest)
export class NodeResizePreparation implements IExecution<NodeResizePreparationRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private _nodeOrGroup: FNodeBase | undefined;

  public handle(request: NodeResizePreparationRequest): void {
    if(!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._selectAndUpdateNodeLayer();

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    this._dragContext.draggableItems = [
      new NodeResizeDragHandler(
        this._injector, this._nodeOrGroup!, EFResizeHandleType[ this._getHandleType(request.event.targetElement) ],
      ),
    ];
  }

  private _isValid(request: NodeResizePreparationRequest): boolean {
    return this._dragContext.isEmpty()
      && this._isResizeHandleElement(request.event.targetElement)
      && this._isNodeCanBeDragged(this._getNode(request.event.targetElement));
  }

  private _isResizeHandleElement(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-resize-handle');
  }

  private _isNodeCanBeDragged(nodeOrGroup?: FNodeBase): boolean {
    return !!nodeOrGroup && !nodeOrGroup.fDraggingDisabled();
  }

  private _getNode(element: HTMLElement): FNodeBase | undefined {
    this._nodeOrGroup = this._store.fNodes.find(x => x.isContains(element));

    return this._nodeOrGroup;
  }

  private _isValidTrigger(request: NodeResizePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _selectAndUpdateNodeLayer() {
    this._mediator.execute(
      new SelectAndUpdateNodeLayerRequest(this._nodeOrGroup!),
    );
  }

  private _getHandleType(element: HTMLElement): keyof typeof EFResizeHandleType {
    return getDataAttrValueFromClosestElementWithClass(element, 'fResizeHandleType', '.f-resize-handle');
  }
}
