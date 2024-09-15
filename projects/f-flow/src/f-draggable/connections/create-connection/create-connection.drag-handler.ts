import { IDraggableItem } from '../../i-draggable-item';
import {
  GetConnectionLineRequest, GetOutputRectInFlowRequest, GetOutputRectInFlowResponse
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, } from '@foblex/2d';

export class CreateConnectionDragHandler implements IDraggableItem {

  private onPointerDownFromConnectorRect: RoundedRect = new RoundedRect();
  private onPointerDownToConnectorRect: RoundedRect = new RoundedRect();

  private outputSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  constructor(
    private fMediator: FMediator,
    public connection: FConnectionBase,
    private onPointerDownPosition: IPoint
  ) {
  }

  public initialize(): void {
    const outputRect = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.outputSide = outputRect.fConnectableSide;
    this.onPointerDownFromConnectorRect = RoundedRect.fromRoundedRect(outputRect.rect);
    console.log('onPointerDown1', this.onPointerDownFromConnectorRect.x, this.onPointerDownFromConnectorRect.y);

    this.onPointerDownToConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.onPointerDownPosition.x, this.onPointerDownPosition.y, 0, 0)
    );
    console.log('onPointerDown2', this.onPointerDownPosition);
    (this.connection as FConnectionBase).show();
    this.move(PointExtensions.initialize());
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
