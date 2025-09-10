import { IPoint, IRect, Point, PointExtensions, RectExtensions } from '@foblex/2d';
import { CalculateFlowPointFromMinimapPointRequest } from './calculate-flow-point-from-minimap-point.request';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FMinimapData } from '../f-minimap-data';

@Injectable()
@FExecutionRegister(CalculateFlowPointFromMinimapPointRequest)
export class CalculateFlowPointFromMinimapPointExecution
  implements IExecution<CalculateFlowPointFromMinimapPointRequest, IPoint> {

  private readonly _store = inject(FComponentsStore);

  private get _canvasScale(): number {
    return this._store.fCanvas!.transform.scale;
  }

  public handle(payload: CalculateFlowPointFromMinimapPointRequest): IPoint {
    return PointExtensions.sub(
      payload.canvasPosition,
      PointExtensions.sub(
        this.getPositionInViewBox(payload.eventPoint, payload.minimap),
        this.getNormalizedFlowCenter(payload.flowRect),
      ),
    );
  }

  private getNormalizedFlowCenter(flowRect: IRect): IPoint {
    return Point.fromPoint(flowRect.gravityCenter).sub(flowRect);
  }

  private getPositionInViewBox(eventPoint: IPoint, minimap: FMinimapData): IPoint {
    const eventPointInFlow = this.normalizeEventPoint(eventPoint, minimap);
    return PointExtensions.sum(
      eventPointInFlow,
      RectExtensions.mult(minimap.viewBox, this._canvasScale),
    );
  }

  public normalizeEventPoint(point: IPoint, minimap: FMinimapData): Point {
    return this.getEventPointInMinimap(point, minimap)
     .mult(minimap.scale).mult(this._canvasScale);
  }

  private getEventPointInMinimap(eventPoint: IPoint, minimap: FMinimapData): Point {
    return Point.fromPoint(eventPoint).elementTransform(minimap.element as unknown as HTMLElement);
  }
}
