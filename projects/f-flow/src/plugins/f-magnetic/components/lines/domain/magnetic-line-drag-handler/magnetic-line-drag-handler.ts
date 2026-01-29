import { IRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import {
  FComponentsStore,
  FDraggableDataContext,
  FNodeBase,
  GetNormalizedElementRectRequest,
  IDragHandler,
  MagneticLinesScheduleRenderer,
  MoveSummaryDragHandler,
} from '@foblex/flow';
import { BrowserService } from '@foblex/platform';
import { FMediator } from '@foblex/mediator';

@Injectable()
export class MagneticLineDragHandler implements IDragHandler {
  public readonly fEventType = 'magnetic-lines';
  public readonly fData: any;

  private readonly _renderer: MagneticLinesScheduleRenderer;
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _browser = inject(BrowserService);
  private readonly _dragContext = inject(FDraggableDataContext);
  constructor() {
    this._renderer = new MagneticLinesScheduleRenderer(this._store, this._browser);
  }

  public prepareDragSequence(): void {
    const handler = this._dragContext.draggableItems.find(
      (x) => x.fEventType === 'move-node',
    ) as MoveSummaryDragHandler;
    const rects = this._collectNotDraggedNodeRects(this._allDraggedNodes(handler));

    this._renderer.scheduleRender();
  }

  private _allDraggedNodes(handler: MoveSummaryDragHandler): FNodeBase[] {
    return handler.allDraggedNodeHandlers.map((x) => x.nodeOrGroup);
  }

  private _collectNotDraggedNodeRects(allDraggedNodes: FNodeBase[]): IRect[] {
    return this._calculateNotDraggedNodes(allDraggedNodes).map((x) => {
      return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement));
    });
  }

  private _calculateNotDraggedNodes(draggedNodes: FNodeBase[]): FNodeBase[] {
    return this._store.nodes.getAll<FNodeBase>().filter((x) => !draggedNodes.includes(x));
  }
}
