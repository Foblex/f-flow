import { EventEmitter, Injectable } from '@angular/core';
import { ExternalItemFinalizeRequest } from './external-item-finalize.request';
import { IPoint, IRect } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { ExternalItemDragHandler } from '../external-item.drag-handler';
import { FCreateNodeEvent } from '../f-create-node.event';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { FDraggableDataContext } from '../../../f-draggable';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(ExternalItemFinalizeRequest)
export class ExternalItemFinalizeExecution implements IExecution<ExternalItemFinalizeRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  private get fCreateNode(): EventEmitter<FCreateNodeEvent> {
    return this.fComponentsStore.fDraggable!.fCreateNode;
  }

  private get dragHandler(): ExternalItemDragHandler {
    return this.fDraggableDataContext.draggableItems[ 0 ] as ExternalItemDragHandler;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator,
    private fBrowser: BrowserService
  ) {
  }

  public handle(request: ExternalItemFinalizeRequest): void {
    this.emitEvent(
      this.getExternalItemElementsFromPoint(request.event.getPosition())
    );

    this.dragHandler.onPointerUp();
  }

  private getExternalItemElementsFromPoint(position: IPoint): HTMLElement[] {
    return this.fBrowser.document.elementsFromPoint(position.x, position.y)
      .filter(x => !x.closest('.f-external-item')) as HTMLElement[];
  }

  private emitEvent(elements: HTMLElement[]): void {
    if (this.isPointerInCanvasRect(elements)) {
      this.fCreateNode.emit(
        new FCreateNodeEvent(this.getRectInCanvas(), this.dragHandler.externalItem.fData)
      );
    }
  }

  private isPointerInCanvasRect(elements: HTMLElement[]): boolean {
    return elements.length ? this.flowHost.contains(elements[ 0 ]) : false;
  }

  private getRectInCanvas(): IRect {
    return this.fMediator.send<IRect>(new GetNormalizedElementRectRequest(this.dragHandler.placeholder!, false));
  }
}
