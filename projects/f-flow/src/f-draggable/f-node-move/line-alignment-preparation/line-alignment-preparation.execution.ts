import { inject, Injectable, Injector } from '@angular/core';
import { LineAlignmentPreparationRequest } from './line-alignment-preparation.request';
import { IMinMaxPoint, IRect, ISize } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetFlowHostElementRequest } from '../../../domain';
import { GetNormalizedElementRectRequest } from '../../../domain';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext, FSummaryNodeMoveDragHandler } from '../../index';
import { FLineAlignmentDragHandler } from '../f-line-alignment.drag-handler';
import { FNodeBase } from '../../../f-node';
import { LineService } from '../../../f-line-alignment';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(LineAlignmentPreparationRequest)
export class LineAlignmentPreparationExecution implements IExecution<LineAlignmentPreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);
  private readonly _fDraggableDataContext = inject(FDraggableDataContext);
  private readonly _fBrowser = inject(BrowserService);
  private readonly _injector = inject(Injector);

  private _lineService: LineService | undefined;

  public handle(request: LineAlignmentPreparationRequest): void {
    this._addLineAlignmentDragHandler(request.fNodes, request.commonRect);
  }

  private _addLineAlignmentDragHandler(fNodes: FNodeBase[], commonRect: IRect): void {
    this._fDraggableDataContext.draggableItems.push(
      new FLineAlignmentDragHandler(
        this._injector,
        this._lineService || this._createLineService(),
        this._getFlowHostSize(),
        commonRect,
        this._getStaticNodeRects(fNodes),
        this._getCommonRestrictions()
      )
    );
  }

  private _getFlowHostSize(): ISize {
    return this._fMediator.execute<HTMLElement>(new GetFlowHostElementRequest())
      .getBoundingClientRect();
  }

  private _createLineService(): LineService {
    this._lineService = new LineService(
      this._fBrowser,
      this._fComponentsStore.fLineAlignment!.hostElement
    );
    return this._lineService;
  }

  private _getStaticNodeRects(fNodes: FNodeBase[]): IRect[] {
    return this._getStaticNodes(fNodes).map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement));
    })
  }

  private _getStaticNodes(fNodes: FNodeBase[]): FNodeBase[] {
    return this._fComponentsStore.fNodes
      .filter((x) => !fNodes.includes(x));
  }

  private _getCommonRestrictions(): IMinMaxPoint {
    return this._fDraggableDataContext.draggableItems
      .filter((x) => x instanceof FSummaryNodeMoveDragHandler)[0].limits;
  }
}
