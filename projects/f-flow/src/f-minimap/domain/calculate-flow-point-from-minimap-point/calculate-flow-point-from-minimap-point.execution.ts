import { IPoint, IRect, Point, PointExtensions, RectExtensions } from '@foblex/core';
import { CalculateFlowPointFromMinimapPointRequest } from './calculate-flow-point-from-minimap-point.request';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FExecutionRegister, IExecution } from '../../../infrastructure';
import { FMinimapData } from '../f-minimap-data';

@Injectable()
@FExecutionRegister(CalculateFlowPointFromMinimapPointRequest)
export class CalculateFlowPointFromMinimapPointExecution
  implements IExecution<CalculateFlowPointFromMinimapPointRequest, IPoint> {

  private get canvasScale(): number {
    return this.fComponentsStore.fCanvas!.transform.scale;
  }

  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(payload: CalculateFlowPointFromMinimapPointRequest): IPoint {
    return PointExtensions.sub(
      payload.canvasPosition,
      PointExtensions.sub(
        this.getPositionInViewBox(payload.eventPoint, payload.minimap),
        this.getNormalizedFlowCenter(payload.flowRect)
      )
    );
  }

  private getNormalizedFlowCenter(flowRect: IRect): IPoint {
    return Point.fromPoint(flowRect.gravityCenter).sub(flowRect);
  }

  private getPositionInViewBox(eventPoint: IPoint, minimap: FMinimapData): IPoint {
    const eventPointInFlow = this.normalizeEventPoint(eventPoint, minimap);
    return PointExtensions.sum(
      eventPointInFlow,
      RectExtensions.mult(minimap.viewBox, this.canvasScale)
    );
  }

  public normalizeEventPoint(point: IPoint, minimap: FMinimapData): Point {
    return this.getEventPointInMinimap(point, minimap)
     .mult(minimap.scale).mult(this.canvasScale);
  }

  private getEventPointInMinimap(eventPoint: IPoint, minimap: FMinimapData): Point {
    return Point.fromPoint(eventPoint).elementTransform(minimap.element as unknown as HTMLElement);
  }
}
