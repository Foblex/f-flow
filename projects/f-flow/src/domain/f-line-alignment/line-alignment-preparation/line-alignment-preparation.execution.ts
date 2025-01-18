import { inject, Injectable } from '@angular/core';
import { LineAlignmentPreparationRequest } from './line-alignment-preparation.request';
import { IRect, ISize, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetFlowHostElementRequest } from '../../f-flow';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(LineAlignmentPreparationRequest)
export class LineAlignmentPreparationExecution implements IExecution<LineAlignmentPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: LineAlignmentPreparationRequest): void {
    // this.size = this._getFlowHostSize();
    // this.rects = [];
    // const draggedNodeRects = request.fNodes.map((x) => {
    //   return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    // });
    // this.draggedNodeRect = RectExtensions.union(draggedNodeRects) || RectExtensions.initialize();
    //
    // const allNodesExcludeCurrents = this._fComponentsStore.fNodes.filter((x) => {
    //   return !request.fNodes.includes(x);
    // });
    //
    // this.rects = allNodesExcludeCurrents.map((x) => {
    //   return this._fMediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement, false));
    // });
  }

  private _getFlowHostSize(): ISize {
    return this._fMediator.send<HTMLElement>(new GetFlowHostElementRequest())
      .getBoundingClientRect();
  }
}
