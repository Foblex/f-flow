import { inject, Injectable, Injector } from '@angular/core';
import { FExternalItemPreparationRequest } from './f-external-item-preparation.request';
import {ITransformModel, Point} from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FExternalItemBase, FExternalItemService, getExternalItem, isExternalItem } from '../../../f-external-item';
import { FExternalItemDragHandler } from '../f-external-item.drag-handler';
import { FDraggableDataContext } from '../../../f-draggable';
import { isValidEventTrigger } from '../../../domain';

@Injectable()
@FExecutionRegister(FExternalItemPreparationRequest)
export class FExternalItemPreparationExecution implements IExecution<FExternalItemPreparationRequest, void> {

  private readonly _fExternalItemService = inject(FExternalItemService);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  public handle(request: FExternalItemPreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }
    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.draggableItems = [
      new FExternalItemDragHandler(
        this._injector,
        this._getExternalItem(request.event.targetElement)!,
      )
    ];
  }

  private _isValid(request: FExternalItemPreparationRequest): boolean {
    return this._isValidExternalItem(request.event.targetElement, this._getExternalItem(request.event.targetElement));
  }

  private _isValidExternalItem(element: HTMLElement, fExternalItem?: FExternalItemBase): boolean {
    return isExternalItem(element) && !!fExternalItem && !fExternalItem.fDisabled;
  }

  private _getExternalItem(targetElement: HTMLElement): FExternalItemBase<any> | undefined {
    return this._fExternalItemService.getItem(getExternalItem(targetElement));
  }

  private _isValidTrigger(request: FExternalItemPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
}
