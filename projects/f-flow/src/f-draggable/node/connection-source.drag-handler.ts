import { ILine, IPoint } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import {
  GetConnectionLineRequest,
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse,
  GetOutputRectInFlowRequest,
  GetOutputRectInFlowResponse, RoundedRect
} from '../../domain';
import { FConnectionBase } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { FFlowMediator } from '../../infrastructure';

export class ConnectionSourceDragHandler implements IDraggableItem {

  private fromConnectorRect: RoundedRect = new RoundedRect();
  private fromConnectorSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  private toConnectorRect: RoundedRect = new RoundedRect();
  private toConnectorSide: EFConnectableSide = EFConnectableSide.TOP;

  constructor(
    private fMediator: FFlowMediator,
    private connection: FConnectionBase,
  ) {
  }

  public initialize(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.fromConnectorRect = RoundedRect.fromRoundedRect(fromConnector.rect);
    this.fromConnectorSide = fromConnector.fConnectableSide;

    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId));
    this.toConnectorRect = RoundedRect.fromRoundedRect(toConnector.rect);
    this.toConnectorSide = toConnector.fConnectableSide;
  }

  public move(difference: IPoint): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.fromConnectorRect.addPoint(difference),
        this.toConnectorRect,
        this.connection.fBehavior,
        this.fromConnectorSide,
        this.toConnectorSide,
      )
    );

    this.connection.setLine(line.point1, this.fromConnectorSide, line.point2, this.toConnectorSide);
    this.connection.redraw();
  }
}
