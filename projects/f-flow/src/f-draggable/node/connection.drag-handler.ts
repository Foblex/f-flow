import { ILine, IPoint, LineExtensions, Point } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFDraggableType } from '../e-f-draggable-type';
import {
  GetConnectionLineRequest,
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse,
  GetOutputRectInFlowRequest,
  GetOutputRectInFlowResponse
} from '../../domain';
import { FConnectionBase } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { FFlowMediator } from '../../infrastructure';

export class ConnectionDragHandler implements IDraggableItem {

  public readonly type = EFDraggableType.CONNECTION;

  private onPointerDownLine: ILine = LineExtensions.initialize();

  private fromConnectorSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  private toConnectorSide: EFConnectableSide = EFConnectableSide.TOP;

  constructor(
      private fMediator: FFlowMediator,
      public connection: FConnectionBase,
  ) {
  }

  public initialize() {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
        new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.fromConnectorSide = fromConnector.fConnectableSide;

    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId));
    this.toConnectorSide = toConnector.fConnectableSide;

    this.onPointerDownLine = this.fMediator.send(new GetConnectionLineRequest(
            fromConnector.rect,
            toConnector.rect,
            this.connection.fBehavior,
            fromConnector.fConnectableSide,
            toConnector.fConnectableSide,
        )
    );
  }

  public move(difference: IPoint): void {
    const fromPoint = Point.fromPoint(this.onPointerDownLine.point1).add(difference);
    const toPoint = Point.fromPoint(this.onPointerDownLine.point2).add(difference);

    this.connection.setLine(fromPoint, this.fromConnectorSide, toPoint, this.toConnectorSide);
    this.connection.redraw();
  }
}
