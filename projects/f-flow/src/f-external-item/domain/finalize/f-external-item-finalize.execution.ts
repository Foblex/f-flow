import { EventEmitter, inject, Injectable } from '@angular/core';
import { FExternalItemFinalizeRequest } from './f-external-item-finalize.request';
import { IPoint, IRect } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FExternalItemDragHandler } from '../f-external-item.drag-handler';
import { FCreateNodeEvent } from '../f-create-node.event';
import { GetNormalizedElementRectRequest } from '../../../domain';
import {
  FDraggableDataContext,
  FDragHandlerResult,
  FNodeDropToGroupDragHandler,
} from '../../../f-draggable';
import { BrowserService } from '@foblex/platform';
import { IFExternalItemDragResult } from '../i-f-external-item-drag-result';

@Injectable()
@FExecutionRegister(FExternalItemFinalizeRequest)
export class FExternalItemFinalizeExecution
  implements IExecution<FExternalItemFinalizeRequest, void>
{
  private readonly _fResult: FDragHandlerResult<IFExternalItemDragResult> =
    inject(FDragHandlerResult);

  private readonly _fMediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _fBrowser = inject(BrowserService);

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private get _fCreateNode(): EventEmitter<FCreateNodeEvent> {
    return this._store.fDraggable!.fCreateNode;
  }

  private get _fDragHandler(): FExternalItemDragHandler {
    return this._dragContext.draggableItems[0] as FExternalItemDragHandler;
  }

  public handle(request: FExternalItemFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }

    const destinationNodeOrGroupId = this._getDestinationNodeOrGroupId();

    this._emitEvent(
      this._getElementsFromPoint(request.event.getPosition()),
      destinationNodeOrGroupId,
      request.event.getPosition(),
    );

    this._fDragHandler.onPointerUp();
    this._dragContext.draggableItems = [];
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof FExternalItemDragHandler);
  }

  private _getDestinationNodeOrGroupId(): string | undefined {
    const dropToGroupHandler = this._getDropToGroupHandler();
    const result = dropToGroupHandler.fNodeWithRect?.node.fId();
    dropToGroupHandler.onPointerUp?.();

    return result;
  }

  private _getDropToGroupHandler(): FNodeDropToGroupDragHandler {
    const result = this._dragContext.draggableItems.find(
      (x) => x instanceof FNodeDropToGroupDragHandler,
    );
    if (!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }

    return result;
  }

  private _getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this._fBrowser.document
      .elementsFromPoint(position.x, position.y)
      .filter(
        (x) => !x.closest('.f-external-item') && !x.closest('.f-external-item-preview'),
      ) as HTMLElement[];
  }

  private _emitEvent(
    elements: HTMLElement[],
    destinationNodeOrGroupId: string | undefined,
    eventPosition: IPoint,
  ): void {
    if (this._isPointerInCanvasRect(elements)) {
      this._fCreateNode.emit(
        new FCreateNodeEvent(
          this._getPreviewRect(),
          this._fResult.getData().fExternalItem.fData,
          destinationNodeOrGroupId,
          destinationNodeOrGroupId ? eventPosition : undefined,
        ),
      );
    }
  }

  private _isPointerInCanvasRect(elements: HTMLElement[]): boolean {
    return elements.length ? this._fHost.contains(elements[0]) : false;
  }

  private _getPreviewRect(): IRect {
    return this._fMediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._fResult.getData().preview),
    );
  }
}
