import { Injectable } from '@angular/core';
import { ExternalItemPreparationRequest } from './external-item-preparation.request';
import { Point } from '@foblex/core';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FExternalItemBase, FExternalItemService, getExternalItem } from '../../../f-external-item';
import { ExternalItemDragHandler } from '../external-item.drag-handler';

@Injectable()
@FExecutionRegister(ExternalItemPreparationRequest)
export class ExternalItemPreparationExecution implements IExecution<ExternalItemPreparationRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fExternalItemService: FExternalItemService
  ) {
  }

  public handle(request: ExternalItemPreparationRequest): void {

    this.fDraggableDataContext.onPointerDownScale = 1;

    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this.flowHost);

    this.fDraggableDataContext.draggableItems = [
      new ExternalItemDragHandler(this.getExternalItem(request.event.targetElement))
    ];
  }

  private getExternalItem(targetElement: HTMLElement): FExternalItemBase<any> {
    return this.fExternalItemService.getItem(getExternalItem(targetElement))!;
  }
}
