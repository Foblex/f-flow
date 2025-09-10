import { inject, Injectable, Injector } from '@angular/core';
import { CreateSnapLinesRequest } from './create-snap-lines-request';
import { IRect, ISize } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetFlowHostElementRequest } from '../../../domain';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';
import { MoveSummaryDragHandler } from '../../index';
import { SnapLinesDragHandler } from './snap-lines.drag-handler';
import { FNodeBase } from '../../../f-node';
import { SnapLineService } from '../../../f-line-alignment';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(CreateSnapLinesRequest)
export class CreateSnapLines implements IExecution<CreateSnapLinesRequest, void> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _browser = inject(BrowserService);
  private readonly _injector = inject(Injector);

  private _lineService: SnapLineService | undefined;

  public handle({ summaryHandler }: CreateSnapLinesRequest): void {
    this._addLineAlignmentDragHandler(summaryHandler);
  }

  private _addLineAlignmentDragHandler(handler: MoveSummaryDragHandler): void {
    handler.setLineAlignment(
      new SnapLinesDragHandler(
        this._injector,
        this._lineService || this._createLineService(),
        this._getFlowHostSize(),
        this._collectNotDraggedNodeRects(this._allDraggedNodes(handler)),
      ),
    )
  }

  private _allDraggedNodes(handler: MoveSummaryDragHandler): FNodeBase[] {
    return handler.allDraggedNodeHandlers.map((x) => x.nodeOrGroup);
  }

  private _getFlowHostSize(): ISize {
    return this._mediator.execute<HTMLElement>(new GetFlowHostElementRequest()).getBoundingClientRect();
  }

  private _createLineService(): SnapLineService {
    this._lineService = new SnapLineService(this._browser, this._store.fLineAlignment!.hostElement);

    return this._lineService;
  }

  private _collectNotDraggedNodeRects(allDraggedNodes: FNodeBase[]): IRect[] {
    return this._calculateNotDraggedNodes(allDraggedNodes).map((x) => {
      return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement));
    })
  }

  private _calculateNotDraggedNodes(allDraggedNodes: FNodeBase[]): FNodeBase[] {
    return this._store.fNodes.filter((x) => !allDraggedNodes.includes(x));
  }
}
