import { inject, Injectable } from '@angular/core';
import { CanvasMovePreparationRequest } from './canvas-move-preparation.request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { CanvasDragHandler } from '../canvas.drag-handler';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(CanvasMovePreparationRequest)
export class CanvasMovePreparationExecution implements IExecution<CanvasMovePreparationRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  public handle(request: CanvasMovePreparationRequest): void {
    if(!this._isValid(request)) {
      return;
    }
    this._fDraggableDataContext.onPointerDownScale = 1;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost);
    this._fDraggableDataContext.draggableItems = [
      new CanvasDragHandler(this._fComponentsStore)
    ];
  }

  private _isValid(request: CanvasMovePreparationRequest): boolean {
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
}
