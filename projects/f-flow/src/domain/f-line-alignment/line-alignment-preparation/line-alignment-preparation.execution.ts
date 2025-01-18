import { inject, Injectable } from '@angular/core';
import { LineAlignmentPreparationRequest } from './line-alignment-preparation.request';
import { IRect, ISize, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetFlowHostElementRequest } from '../../f-flow';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';
import { LineAlignmentDragHandler } from '../line-alignment.drag-handler';
import { FNodeBase } from '../../../f-node';
import { LineService } from '../../../f-line-alignment';
import { BrowserService } from '@foblex/platform';

@Injectable()
@FExecutionRegister(LineAlignmentPreparationRequest)
export class LineAlignmentPreparationExecution implements IExecution<LineAlignmentPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private _fBrowser = inject(BrowserService);

  public handle(request: LineAlignmentPreparationRequest): void {
    this._fDraggableDataContext.draggableItems.push(
      new LineAlignmentDragHandler(
        this._fComponentsStore,
        this._createLineService(),
        this._getFlowHostSize(),
        this._getDraggedNodesRect(request.fNodes),
        this._getNotDraggedNodeRects(request.fNodes)
      )
    );
  }

  private _getFlowHostSize(): ISize {
    return this._fMediator.send<HTMLElement>(new GetFlowHostElementRequest())
      .getBoundingClientRect();
  }

  private _createLineService(): LineService {
    return new LineService(
      this._fBrowser,
      this._fComponentsStore.fLineAlignment!.hostElement as HTMLElement
    );
  }

  private _getDraggedNodesRect(fNodes: FNodeBase[]): IRect {
    return RectExtensions.union(fNodes.map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    })) || RectExtensions.initialize();
  }

  private _getNotDraggedNodeRects(fNodes: FNodeBase[]): IRect[] {
    return this._getNotDraggedNodes(fNodes).map((x) => {
      return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    })
  }

  private _getNotDraggedNodes(fNodes: FNodeBase[]): FNodeBase[] {
    return this._fComponentsStore.fNodes
      .filter((x) => !fNodes.includes(x));
  }
}
