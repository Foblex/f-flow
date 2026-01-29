import { inject, Injectable } from '@angular/core';
import { DragCanvasPreparationRequest } from './drag-canvas-preparation-request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { DragCanvasHandler } from '../drag-canvas-handler';
import { FNodeBase } from '../../../f-node';
import { FEventTrigger, isValidEventTrigger } from '../../../domain';
import { DragHandlerInjector } from '../../f-drag-handler';
import { IPointerEvent } from '../../../drag-toolkit';

@Injectable()
@FExecutionRegister(DragCanvasPreparationRequest)
export class DragCanvasPreparation implements IExecution<DragCanvasPreparationRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _dragInjector = inject(DragHandlerInjector);

  public handle({ event, fTrigger }: DragCanvasPreparationRequest): void {
    if (!this._isValid(event) || !this._isValidTrigger(event, fTrigger)) {
      return;
    }
    this._dragContext.onPointerDownScale = 1;
    this._dragContext.onPointerDownPosition = Point.fromPoint(event.getPosition()).elementTransform(
      this._store.flowHost,
    );
    this._dragContext.draggableItems = [this._dragInjector.get(DragCanvasHandler)];
  }

  private _isValid(event: IPointerEvent): boolean {
    return (
      this._dragContext.isEmpty() &&
      (this._isBackgroundElement(event.targetElement) || this._isDragOnHost(event.targetElement))
    );
  }

  private _isBackgroundElement(targetElement: HTMLElement): boolean | undefined {
    return this._store.fBackground?.hostElement.contains(targetElement);
  }

  private _isDragOnHost(targetElement: HTMLElement): boolean {
    return this._store.flowHost.contains(targetElement) && !this._getNode(targetElement);
  }

  private _getNode(targetElement: HTMLElement): FNodeBase | undefined {
    let result = this._store.nodes.getAll<FNodeBase>().find((x) => x.isContains(targetElement));
    if (result && result.fDraggingDisabled()) {
      result = undefined;
    }

    return result;
  }

  private _isValidTrigger(event: IPointerEvent, fTrigger: FEventTrigger): boolean {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }
}
