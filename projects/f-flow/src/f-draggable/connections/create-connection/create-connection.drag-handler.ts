import { IPoint, IRect, IVector, Point, RectExtensions, } from '@foblex/core';
import { IDraggableItem } from '../../i-draggable-item';
import { EFDraggableType } from '../../e-f-draggable-type';
import {
  GetConnectionVectorRequest, GetOutputRectInFlowRequest, GetOutputRectInFlowResponse
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { FFlowMediator } from '../../../infrastructure';

export class CreateConnectionDragHandler implements IDraggableItem {

  public readonly type: EFDraggableType = EFDraggableType.CREATE_CONNECTION;

  private onPointerDownFromConnectorRect: IRect = RectExtensions.initialize();
  private onPointerDownToConnectorRect: IRect = RectExtensions.initialize();

  private outputSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  constructor(
      private fMediator: FFlowMediator,
      public connection: FConnectionBase,
      private mouseDownPoint: IPoint
  ) {
  }

  public initialize(): void {
    const outputRect = this.fMediator.send<GetOutputRectInFlowResponse>(
        new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.outputSide = outputRect.fConnectableSide;
    this.onPointerDownFromConnectorRect = outputRect.rect;
    this.onPointerDownToConnectorRect = RectExtensions.initialize(this.mouseDownPoint.x, this.mouseDownPoint.y, 0, 0);
    (this.connection as FConnectionBase).show();
    this.move(new Point(0, 0));
  }

  public move(difference: IPoint): void {
    const toPoint = RectExtensions.addPoint(this.onPointerDownToConnectorRect, difference);

    const vector = this.fMediator.send<IVector>(new GetConnectionVectorRequest(
            this.onPointerDownFromConnectorRect,
            toPoint,
            this.connection.fBehavior,
            this.outputSide,
            EFConnectableSide.TOP,
        )
    );

    this.connection.setVector(vector.point1, this.outputSide, vector.point2, EFConnectableSide.TOP);
    this.connection.redraw();
  }

  public complete(): void {
    this.connection.redraw();
    (this.connection as FConnectionBase).hide();
  }
}
