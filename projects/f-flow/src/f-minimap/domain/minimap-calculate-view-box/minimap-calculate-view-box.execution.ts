import { inject, Injectable } from '@angular/core';
import { MinimapCalculateViewBoxRequest } from './minimap-calculate-view-box.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IRect, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { FCanvasBase } from '../../../f-canvas';
import { FFlowBase } from '../../../f-flow';

@Injectable()
@FExecutionRegister(MinimapCalculateViewBoxRequest)
export class MinimapCalculateViewBoxExecution implements IExecution<MinimapCalculateViewBoxRequest, IRect> {

  private _fComponentStore = inject(FComponentsStore);

  private get _fFlow(): FFlowBase | undefined {
    return this._fComponentStore.fFlow;
  }

  private get _fCanvas(): FCanvasBase {
    return this._fComponentStore.fCanvas!;
  }

  public handle(request: MinimapCalculateViewBoxRequest): IRect {
    if(!this._fFlow || !this._fCanvas) {
      return RectExtensions.initialize();
    }
    return this._getRectForMinimapView();
  }

  private _getRectForMinimapView(): IRect {
    const result = this._calculateViewBox();
    result.x = 0;
    result.y = 0;
    return result;
  }

  private _calculateViewBox(): IRect {
    return RectExtensions.div(RectExtensions.fromElement(this._fFlow!.hostElement), this._fCanvas.transform.scale);
  }
}
