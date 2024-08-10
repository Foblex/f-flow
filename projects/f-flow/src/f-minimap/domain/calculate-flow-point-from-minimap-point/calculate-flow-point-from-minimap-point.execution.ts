import { IPoint, Point, PointExtensions, RectExtensions } from '@foblex/core';
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
    const positionInFlow = PointExtensions.sum(
      RectExtensions.mult(payload.minimap.viewBox, this.canvasScale),
      this.getScaledPoint(payload.eventPoint, payload.minimap)
    );

    return PointExtensions.sub(
      payload.canvasPosition,
      PointExtensions.sub(positionInFlow, payload.flowRect.gravityCenter)
    );
  }

  public getScaledPoint(point: IPoint, minimap: FMinimapData): Point {
    return Point.fromPoint(point).sub(
      RectExtensions.fromElement(minimap.element)
    ).mult(minimap.scale).mult(this.canvasScale);
  }
}
