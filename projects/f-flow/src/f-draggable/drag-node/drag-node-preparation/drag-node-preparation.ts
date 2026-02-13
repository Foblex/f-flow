import { inject, Injectable } from '@angular/core';
import { DragNodePreparationRequest } from './drag-node-preparation-request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { AttachDragNodeHandlerFromSelectionRequest } from '../attach-drag-node-handler-from-selection';
import {
  FEventTrigger,
  isValidEventTrigger,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { isClosestElementHasClass } from '@foblex/utils';
import { DragNodeHandler } from '../drag-node-handler';
import { IPointerEvent } from '../../../drag-toolkit';
import { MagneticLinesPreparationRequest } from '../magnetic-lines';

@Injectable()
@FExecutionRegister(DragNodePreparationRequest)
export class DragNodePreparation implements IExecution<DragNodePreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle({ event, trigger }: DragNodePreparationRequest): void {
    if (!this._canStartDrag(event, trigger)) {
      return;
    }

    const node = this._findDraggableNode(event.targetElement);
    if (!node) {
      return;
    }

    this._storePointerDownContext(event);

    // Store pointer-down context for other handlers
    this._dragSession.draggableItems = [this._buildDragNodeHandler(node)];

    this._mediator.execute<void>(new MagneticLinesPreparationRequest());
  }

  private _canStartDrag(event: IPointerEvent, trigger: FEventTrigger): boolean {
    return (
      this._dragSession.isEmpty() &&
      this._isDragHandle(event.targetElement) &&
      isValidEventTrigger(event.originalEvent, trigger)
    );
  }

  private _isDragHandle(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _findDraggableNode(target: HTMLElement): FNodeBase | undefined {
    const nodes = this._store.nodes.getAll();

    for (const node of nodes) {
      if (node.fDraggingDisabled()) {
        continue;
      }

      if (node.isContains(target)) {
        return node;
      }
    }

    return undefined;
  }

  private _storePointerDownContext(event: IPointerEvent): void {
    this._dragSession.onPointerDownScale = this._store.transform.scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(this._store.flowHost)
      .div(this._store.transform.scale);
  }

  private _buildDragNodeHandler(node: FNodeBase): DragNodeHandler {
    if (node.fSelectionDisabled() || !node.isSelected()) {
      queueMicrotask(() => {
        this._mediator.execute<void>(new SelectAndUpdateNodeLayerRequest(node));
      });
    }

    return this._mediator.execute(new AttachDragNodeHandlerFromSelectionRequest(node));
  }
}
