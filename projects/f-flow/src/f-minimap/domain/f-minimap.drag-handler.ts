import { IPoint, IRect, Point } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { IFDragHandler } from '../../f-draggable';
import { FMediator } from '@foblex/mediator';
import { CalculateFlowPointFromMinimapPointRequest } from './calculate-flow-point-from-minimap-point';
import { FMinimapData } from './f-minimap-data';

export class FMinimapDragHandler implements IFDragHandler {

  public fEventType = 'minimap';

  private lastDifference: IPoint | null = null;

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator,
    private flowRect: IRect,
    private canvasPosition: IPoint,
    private eventPoint: IPoint,
    private minimap: FMinimapData,
  ) {
  }

  public prepareDragSequence(): void {
    this.fComponentsStore.fCanvas?.hostElement.classList.add('f-scaled-animate');
  }

  public onPointerMove(difference: IPoint): void {
    if (this.lastDifference && this.isSamePoint(difference, this.lastDifference)) {
      return;
    }

    this.lastDifference = difference;
    this.fComponentsStore.fCanvas!.setPosition(this.getNewPosition(Point.fromPoint(this.eventPoint).add(difference)));
    this.fComponentsStore.fCanvas!.redraw();
  }

  private isSamePoint(point1: IPoint, point2: IPoint): boolean {
    return point1.x === point2.x && point1.y === point2.y;
  }

  private getNewPosition(eventPoint: IPoint): IPoint {
    return this.fMediator.execute<IPoint>(new CalculateFlowPointFromMinimapPointRequest(
      this.flowRect, this.canvasPosition, eventPoint, this.minimap,
    ));
  }

  public onPointerUp(): void {
    this.fComponentsStore.fCanvas?.hostElement.classList.remove('f-scaled-animate');
    this.fComponentsStore.fCanvas!.emitCanvasChangeEvent();
  }
}
