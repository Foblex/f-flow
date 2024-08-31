import { ILine, IPoint, Point, RectExtensions, } from '@foblex/core';
import { IDraggableItem } from '../../i-draggable-item';
import {
  GetConnectionLineRequest, GetOutputRectInFlowRequest, GetOutputRectInFlowResponse, RoundedRect
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { FFlowMediator } from '../../../infrastructure';

export class CreateConnectionDragHandler implements IDraggableItem {

  private onPointerDownFromConnectorRect: RoundedRect = new RoundedRect();
  private onPointerDownToConnectorRect: RoundedRect = new RoundedRect();

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
    this.onPointerDownFromConnectorRect = RoundedRect.fromRoundedRect(outputRect.rect);
    this.onPointerDownToConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.mouseDownPoint.x, this.mouseDownPoint.y, 0, 0)
    );
    (this.connection as FConnectionBase).show();
    this.move(new Point(0, 0));
  }

  public move(difference: IPoint): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.onPointerDownFromConnectorRect,
        this.onPointerDownToConnectorRect.addPoint(difference),
        this.connection.fBehavior,
        this.outputSide,
        EFConnectableSide.TOP,
      )
    );

    this.connection.setLine(line.point1, this.outputSide, line.point2, EFConnectableSide.TOP);
    this.connection.redraw();
  }

  public complete(): void {
    this.connection.redraw();
    (this.connection as FConnectionBase).hide();
  }
}
