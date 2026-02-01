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
import { CreateSnapLinesRequest } from '../create-snap-lines';
import { MoveSummaryDragHandler } from '../move-summary-drag-handler';
import { IPointerEvent } from '../../../drag-toolkit';

@Injectable()
@FExecutionRegister(DragNodePreparationRequest)
export class DragNodePreparation implements IExecution<DragNodePreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle({ event, trigger }: DragNodePreparationRequest): void {
    if (
      !this._dragSession.isEmpty() ||
      !this._isDragHandle(event.targetElement) ||
      !this._isValidTrigger(event, trigger)
    ) {
      return;
    }

    const node = this._findDraggableNode(event.targetElement);
    if (!node) {
      return;
    }

    // Store pointer-down context for other handlers
    const scale = this._store.transform.scale ?? 1;
    const host = this._store.flowHost;

    this._dragSession.onPointerDownScale = scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(host)
      .div(scale);

    const summaryHandler = this._createSummaryHandler(node);
    this._dragSession.draggableItems = [summaryHandler];

    if (this._store.fLineAlignment) {
      this._mediator.execute<void>(new CreateSnapLinesRequest(summaryHandler));
    }
  }

  private _isDragHandle(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _isValidTrigger(event: IPointerEvent, trigger: FEventTrigger): boolean {
    return isValidEventTrigger(event.originalEvent, trigger);
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

  private _createSummaryHandler(node: FNodeBase): MoveSummaryDragHandler {
    const nodeWithDisabledSelection = node.fSelectionDisabled() ? node : undefined;

    if (!nodeWithDisabledSelection) {
      // select before drag (same behavior as before)
      queueMicrotask(() => {
        this._mediator.execute<void>(new SelectAndUpdateNodeLayerRequest(node));
      });
    }

    return this._mediator.execute(
      new AttachDragNodeHandlerFromSelectionRequest(nodeWithDisabledSelection),
    );
  }
}
