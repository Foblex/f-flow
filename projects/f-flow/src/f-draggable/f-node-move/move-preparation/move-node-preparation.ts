import { inject, Injectable } from '@angular/core';
import { MoveNodePreparationRequest } from './move-node-preparation-request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { CreateDragModelFromSelectionRequest } from '../create-drag-model-from-selection';
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
@FExecutionRegister(MoveNodePreparationRequest)
export class MoveNodePreparation implements IExecution<MoveNodePreparationRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle({ event, fTrigger }: MoveNodePreparationRequest): void {
    if (
      !this._dragContext.isEmpty() ||
      !this._isDragHandle(event.targetElement) ||
      !this._isValidTrigger(event, fTrigger)
    ) {
      return;
    }

    const node = this._findDraggableNode(event.targetElement);
    if (!node) {
      return;
    }

    const scale = this._store.fCanvas?.transform.scale ?? 1;
    const flowHost = this._store.flowHost;

    const summaryDragHandler = this._buildDragHandler(node);

    this._dragContext.onPointerDownScale = scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(flowHost)
      .div(scale);
    this._dragContext.draggableItems = [summaryDragHandler];

    if (this._store.fLineAlignment) {
      this._mediator.execute<void>(new CreateSnapLinesRequest(summaryDragHandler));
    }
  }

  private _isDragHandle(element: HTMLElement): boolean {
    return isClosestElementHasClass(element, '.f-drag-handle');
  }

  private _findDraggableNode(target: HTMLElement): FNodeBase | undefined {
    for (const node of this._store.nodes.getAll<FNodeBase>()) {
      if (!node.fDraggingDisabled() && node.isContains(target)) {
        return node;
      }
    }

    return undefined;
  }

  private _isValidTrigger(event: IPointerEvent, fTrigger: FEventTrigger): boolean {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }

  //We drag nodes from selection model
  private _buildDragHandler(node: FNodeBase): MoveSummaryDragHandler {
    if (!node.fSelectionDisabled()) {
      // Need to select node before drag
      this._selectBeforeDrag(node);

      return this._dragModelFromSelection();
    }

    // User can drag node that can't be selected
    return this._dragModelFromSelection(node);
  }

  private _selectBeforeDrag(node: FNodeBase): void {
    queueMicrotask(() => {
      this._mediator.execute<void>(new SelectAndUpdateNodeLayerRequest(node));
    });
  }

  private _dragModelFromSelection(nodeWithDisabledSelection?: FNodeBase): MoveSummaryDragHandler {
    return this._mediator.execute(
      new CreateDragModelFromSelectionRequest(nodeWithDisabledSelection),
    );
  }
}
