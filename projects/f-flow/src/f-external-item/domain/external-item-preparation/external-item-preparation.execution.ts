import { inject, Injectable } from '@angular/core';
import { ExternalItemPreparationRequest } from './external-item-preparation.request';
import { Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FExternalItemBase, FExternalItemService, getExternalItem, isExternalItem } from '../../../f-external-item';
import { ExternalItemDragHandler } from '../external-item.drag-handler';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(ExternalItemPreparationRequest)
export class ExternalItemPreparationExecution implements IExecution<ExternalItemPreparationRequest, void> {

  private _fExternalItemService = inject(FExternalItemService);
  private _fDraggableDataContext = inject(FDraggableDataContext);
  private _fComponentsStore = inject(FComponentsStore);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  public handle(request: ExternalItemPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }
    this._fDraggableDataContext.onPointerDownScale = 1;

    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this._fHost);

    this._fDraggableDataContext.draggableItems = [
      new ExternalItemDragHandler(this._getExternalItem(request.event.targetElement)!)
    ];
  }

  private _isValid(request: ExternalItemPreparationRequest): boolean {
    return this._isValidExternalItem(request.event.targetElement, this._getExternalItem(request.event.targetElement));
  }

  private _isValidExternalItem(element: HTMLElement, fExternalItem?: FExternalItemBase): boolean {
    return isExternalItem(element) && !!fExternalItem && !fExternalItem.fDisabled;
  }

  private _getExternalItem(targetElement: HTMLElement): FExternalItemBase<any> | undefined {
    return this._fExternalItemService.getItem(getExternalItem(targetElement));
  }
}
