import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { GetNormalizedPointRequest } from './get-normalized-point-request';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';

/**
 * Execution that retrieves the normalized point of a position.
 * It calculates the point based on the position's transformation
 * and the canvas transformation.
 */
@Injectable()
@FExecutionRegister(GetNormalizedPointRequest)
export class GetNormalizedPointExecution implements IExecution<GetNormalizedPointRequest, IPoint> {

  private readonly _store = inject(FComponentsStore);

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }
  // BrowserWindow
  // +------------------------------------------+
  // |  F-Flow                                  |
  // |  +----------------------------------+    |
  // |  |  F-Canvas (scale: 0.5)           |    |
  // |  |  +-------------------------+     |    |
  // |  |  |                         |     |    |
  // |  |  |   Element               |     |    |
  // |  |  |   System: (500,300)     |     |    |
  // |  |  |   Normalize: (200,150)  |     |    |
  // |  |  |                         |     |    |
  // |  |  |                         |     |    |
  // |  |  +-------------------------+     |    |
  // |  |                                  |    |
  // |  +----------------------------------+    |
  // |                                          |
  // +------------------------------------------+
  // Transform from the browser window to the canvas coordinates:
  public handle(request: GetNormalizedPointRequest): IPoint {
    return Point.fromPoint(request.position)
      .elementTransform(this._store.flowHost)
      .sub(this._transform.scaledPosition)
      .sub(this._transform.position)
      .div(this._transform.scale);
  }
}
