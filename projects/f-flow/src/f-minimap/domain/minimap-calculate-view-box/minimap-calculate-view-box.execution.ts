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

  private readonly _store = inject(FComponentsStore);

  private get _flowComponent(): FFlowBase | undefined {
    return this._store.fFlow;
  }

  private get _canvasComponent(): FCanvasBase {
    return this._store.fCanvas!;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(request: MinimapCalculateViewBoxRequest): IRect {
    if(!this._flowComponent || !this._canvasComponent) {
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
    return RectExtensions.div(RectExtensions.fromElement(this._flowComponent!.hostElement), this._canvasComponent.transform.scale);
  }
}
