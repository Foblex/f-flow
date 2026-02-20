import { inject, Injectable, Injector } from '@angular/core';
import { DragExternalItemPreparationRequest } from './drag-external-item-preparation-request';
import { ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FExternalItemBase, FExternalItemService } from '../../../f-external-item';
import { DragExternalItemHandler, FDraggableDataContext } from '../../../f-draggable';
import { isValidEventTrigger } from '../../../domain';

@Injectable()
@FExecutionRegister(DragExternalItemPreparationRequest)
export class DragExternalItemPreparation implements IExecution<
  DragExternalItemPreparationRequest,
  void
> {
  private readonly _apiService = inject(FExternalItemService);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _store = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  public handle({ event, fTrigger }: DragExternalItemPreparationRequest): void {
    if (!this._dragSession.isEmpty()) {
      return;
    }

    if (!isValidEventTrigger(event.originalEvent, fTrigger)) {
      return;
    }

    const item = this._resolveExternalItem(event.targetElement);
    if (!item || item.disabled()) {
      return;
    }

    const scale = this._transform.scale ?? 1;

    this._dragSession.onPointerDownScale = scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition())
      .elementTransform(this._flowHost)
      .div(scale);

    this._dragSession.draggableItems = [new DragExternalItemHandler(this._injector, item)];
  }

  private _resolveExternalItem(target: HTMLElement): FExternalItemBase<unknown> | undefined {
    return this._apiService.getByElement(target);
  }
}
