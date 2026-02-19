import { inject, Injectable } from '@angular/core';
import { ResizeNodePreparationRequest } from './resize-node-preparation-request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { isValidEventTrigger, SelectAndUpdateNodeLayerRequest } from '../../../domain';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { ResizeNodeHandler } from '../resize-node-handler';
import {
  getDataAttrValueFromClosestElementWithClass,
  isClosestElementHasClass,
} from '@foblex/utils';
import { DragHandlerInjector } from '../../infrastructure';

@Injectable()
@FExecutionRegister(ResizeNodePreparationRequest)
export class ResizeNodePreparation implements IExecution<ResizeNodePreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ event, fTrigger }: ResizeNodePreparationRequest): void {
    if (!this._dragSession.isEmpty()) {
      return;
    }

    if (!this._isResizeHandle(event.targetElement)) {
      return;
    }

    if (!isValidEventTrigger(event.originalEvent, fTrigger)) {
      return;
    }

    const nodeOrGroup = this._findResizableNode(event.targetElement);
    if (!nodeOrGroup) {
      return;
    }

    this._selectBeforeResize(nodeOrGroup);

    const scale = this._transform.scale ?? 1;
    this._dragSession.onPointerDownScale = scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(this._store.flowHost)
      .div(scale);

    const handler = this._dragInjector.createInstance(ResizeNodeHandler);
    handler.initialize(nodeOrGroup, this._readResizeHandleType(event.targetElement));

    this._dragSession.draggableItems = [handler];
  }

  private _isResizeHandle(target: HTMLElement): boolean {
    return isClosestElementHasClass(target, '.f-resize-handle');
  }

  private _findResizableNode(target: HTMLElement): FNodeBase | undefined {
    const nodeOrGroup = this._store.nodes.getAll().find((x) => x.isContains(target));
    if (!nodeOrGroup) {
      return undefined;
    }

    return nodeOrGroup.fDraggingDisabled() ? undefined : nodeOrGroup;
  }

  private _selectBeforeResize(nodeOrGroup: FNodeBase): void {
    queueMicrotask(() => {
      this._mediator.execute<void>(new SelectAndUpdateNodeLayerRequest(nodeOrGroup));
    });
  }

  private _readResizeHandleType(target: HTMLElement): EFResizeHandleType {
    const key = getDataAttrValueFromClosestElementWithClass(
      target,
      'fResizeHandleType',
      '.f-resize-handle',
    ) as keyof typeof EFResizeHandleType;

    return EFResizeHandleType[key];
  }
}
