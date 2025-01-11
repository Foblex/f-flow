import { IRect, RectExtensions } from '@foblex/2d';
import { CalculateNodesBoundingBoxRequest } from './calculate-nodes-bounding-box.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(CalculateNodesBoundingBoxRequest)
export class CalculateNodesBoundingBoxExecution implements IExecution<CalculateNodesBoundingBoxRequest, IRect | null> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: CalculateNodesBoundingBoxRequest): IRect | null {
    return RectExtensions.union(this._getNodesRects());
  }

  private _getNodesRects(): IRect[] {
    return this._fComponentsStore.fNodes.map((x) => {
      return this._getElementRect(x.hostElement);
    });
  }

  private _getElementRect(element: HTMLElement | SVGElement): IRect {
    return RectExtensions.fromElement(element)
  }
}
