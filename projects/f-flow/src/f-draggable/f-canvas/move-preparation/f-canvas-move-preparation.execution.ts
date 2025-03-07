import { inject, Injectable, Injector } from '@angular/core';
import { FCanvasMovePreparationRequest } from './f-canvas-move-preparation.request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FCanvasDragHandler } from '../f-canvas.drag-handler';
import { FNodeBase } from '../../../f-node';
import { isValidEventTrigger } from '../../../domain';

@Injectable()
@FExecutionRegister(FCanvasMovePreparationRequest)
export class FCanvasMovePreparationExecution implements IExecution<FCanvasMovePreparationRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  public handle(request: FCanvasMovePreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }
    this._fDraggableDataContext.onPointerDownScale = 1;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost);
    this._fDraggableDataContext.draggableItems = [ new FCanvasDragHandler(this._injector) ];
  }

  private _isValid(request: FCanvasMovePreparationRequest): boolean {
    return this._fDraggableDataContext.isEmpty() &&
      (this._isBackgroundElement(request.event.targetElement) || this._isDragOnHost(request.event.targetElement));
  }

  private _isBackgroundElement(targetElement: HTMLElement): boolean | undefined {
    return this._fComponentsStore.fBackground?.hostElement.contains(targetElement);
  }

  private _isDragOnHost(targetElement: HTMLElement): boolean {
    return this._fHost.contains(targetElement) && !this._getNode(targetElement);
  }

  private _getNode(targetElement: HTMLElement): FNodeBase | undefined {
    let result = this._fComponentsStore.fNodes
      .find(x => x.isContains(targetElement));
    if (result && result.fDraggingDisabled) {
      result = undefined;
    }
    return result;
  }

  private _isValidTrigger(request: FCanvasMovePreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
}
