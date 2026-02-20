import { inject, Injectable } from '@angular/core';
import { MinimapCalculateViewRectRequest } from './minimap-calculate-view-rect-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IRect, RectExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(MinimapCalculateViewRectRequest)
export class MinimapCalculateViewRect implements IExecution<
  MinimapCalculateViewRectRequest,
  IRect
> {
  private readonly _store = inject(FComponentsStore);

  public handle(_request: MinimapCalculateViewRectRequest): IRect {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;

    if (!flow || !canvas) {
      return RectExtensions.initialize();
    }

    // "view rect" is always drawn inside minimap with x/y = 0,0
    const rect = RectExtensions.div(
      RectExtensions.fromElement(flow.hostElement),
      canvas.transform.scale,
    );
    rect.x = 0;
    rect.y = 0;

    return rect;
  }
}
