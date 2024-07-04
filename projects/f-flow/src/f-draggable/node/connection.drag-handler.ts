import { IPoint, IVector, Point, VectorExtensions } from '@foblex/core';
import { IDraggableItem } from '../i-draggable-item';
import { EFDraggableType } from '../e-f-draggable-type';
import {
  GetConnectionVectorRequest,
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

  private onPointerDownVector: IVector = VectorExtensions.initialize();

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

    this.onPointerDownVector = this.fMediator.send(new GetConnectionVectorRequest(
            fromConnector.rect,
            toConnector.rect,
            this.connection.fBehavior,
            fromConnector.fConnectableSide,
            toConnector.fConnectableSide,
        )
    );
  }

  public move(difference: IPoint): void {
    const fromPoint = Point.fromPoint(this.onPointerDownVector.point1).add(difference);
    const toPoint = Point.fromPoint(this.onPointerDownVector.point2).add(difference);

    this.connection.setVector(fromPoint, this.fromConnectorSide, toPoint, this.toConnectorSide);
    this.connection.redraw();
  }
}
