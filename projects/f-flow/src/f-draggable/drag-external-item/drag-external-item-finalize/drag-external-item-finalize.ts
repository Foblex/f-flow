import { EventEmitter, inject, Injectable } from '@angular/core';
import { DragExternalItemFinalizeRequest } from './drag-external-item-finalize-request';
import { IPoint, IRect } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FCreateNodeEvent } from '../f-create-node-event';
import { FDragHandlerResult } from '../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { DragExternalItemHandler } from '../drag-external-item-handler';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { isDragExternalItemHandler } from '../is-drag-external-item-handler';
import { DropToGroupHandler } from '../../drop-to-group';
import { BrowserService } from '@foblex/platform';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { IDragExternalItemDragResult } from '../i-drag-external-item-drag-result';

@Injectable()
@FExecutionRegister(DragExternalItemFinalizeRequest)
export class DragExternalItemFinalize implements IExecution<DragExternalItemFinalizeRequest, void> {
  private readonly _result: FDragHandlerResult<IDragExternalItemDragResult> =
    inject(FDragHandlerResult);

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _browser = inject(BrowserService);

  private get _createNodeEmitter(): EventEmitter<FCreateNodeEvent> {
    return this._store.fDraggable!.fCreateNode;
  }

  public handle(request: DragExternalItemFinalizeRequest): void {
    const handler = this._findExternalItemHandler();
    if (!handler) {
      return;
    }

    const targetContainerId = this._getDestinationNodeOrGroupId();

    this._emitEvent(
      this._getElementsFromPoint(request.event.getPosition()),
      targetContainerId,
      request.event.getPosition(),
    );

    handler.onPointerUp();
    this._dragSession.draggableItems = [];
  }

  private _findExternalItemHandler(): DragExternalItemHandler | undefined {
    return this._dragSession.draggableItems.find((x) => isDragExternalItemHandler(x));
  }

  private _getDestinationNodeOrGroupId(): string | undefined {
    const handler = this._getDropToGroupHandler();
    const result = handler.activeTarget?.node.fId();
    handler.onPointerUp?.();

    return result;
  }

  private _getDropToGroupHandler(): DropToGroupHandler {
    const result = this._dragSession.draggableItems.find((x) => x instanceof DropToGroupHandler);
    if (!result) {
      throw new Error('NodeDragToParentDragHandler not found');
    }

    return result;
  }

  private _getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this._browser.document
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
      this._createNodeEmitter.emit(
        new FCreateNodeEvent(
          this._getPreviewRect(),
          this._result.getData().fExternalItem.data(),
          destinationNodeOrGroupId,
          destinationNodeOrGroupId ? eventPosition : undefined,
        ),
      );
    }
  }

  private _isPointerInCanvasRect(elements: HTMLElement[]): boolean {
    return elements.length ? this._store.flowHost.contains(elements[0]) : false;
  }

  private _getPreviewRect(): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(this._result.getData().preview),
    );
  }
}
