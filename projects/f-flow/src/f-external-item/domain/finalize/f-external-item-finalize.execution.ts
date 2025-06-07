import { EventEmitter, inject, Injectable } from '@angular/core';
import { FExternalItemFinalizeRequest } from './f-external-item-finalize.request';
import { IPoint, IRect } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FExternalItemDragHandler } from '../f-external-item.drag-handler';
import { FCreateNodeEvent } from '../f-create-node.event';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { FDraggableDataContext, FDragHandlerResult } from '../../../f-draggable';
import { BrowserService } from '@foblex/platform';
import { IFExternalItemDragResult } from '../i-f-external-item-drag-result';

@Injectable()
@FExecutionRegister(FExternalItemFinalizeRequest)
export class FExternalItemFinalizeExecution implements IExecution<FExternalItemFinalizeRequest, void> {

  private readonly _fResult: FDragHandlerResult<IFExternalItemDragResult> = inject(FDragHandlerResult);

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _fBrowser = inject(BrowserService);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _fCreateNode(): EventEmitter<FCreateNodeEvent> {
    return this._fComponentsStore.fDraggable!.fCreateNode;
  }

  private get _fDragHandler(): FExternalItemDragHandler {
    return this._fDraggableDataContext.draggableItems[ 0 ] as FExternalItemDragHandler;
  }

  public handle(request: FExternalItemFinalizeRequest): void {
    if (!this._isValid()) {
      return
    }

    this._emitEvent(
      this._getElementsFromPoint(request.event.getPosition())
    );

    this._fDragHandler.onPointerUp();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems.some(
      (x) => x instanceof FExternalItemDragHandler
    );
  }

  private _getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this._fBrowser.document.elementsFromPoint(position.x, position.y)
      .filter(x => !x.closest('.f-external-item')
        && !x.closest('.f-external-item-preview')) as HTMLElement[];
  }

  private _emitEvent(elements: HTMLElement[]): void {
    if (this.isPointerInCanvasRect(elements)) {
      this._fCreateNode.emit(
        new FCreateNodeEvent(this._getPreviewRect(), this._fResult.getData().fExternalItem.fData)
      );
    }
  }

  private isPointerInCanvasRect(elements: HTMLElement[]): boolean {
    return elements.length ? this._fHost.contains(elements[ 0 ]) : false;
  }

  private _getPreviewRect(): IRect {
    return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(this._fResult.getData().preview));
  }
}
