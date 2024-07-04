import { IPoint, IRect, IVector, RectExtensions } from '@foblex/core';
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

export class ConnectionTargetDragHandler implements IDraggableItem {

  public readonly type: EFDraggableType = EFDraggableType.CONNECTION;

  private fromConnectorRect: IRect = RectExtensions.initialize();
  private fromConnectorSide: EFConnectableSide = EFConnectableSide.BOTTOM;

  private toConnectorRect: IRect = RectExtensions.initialize();
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
    this.fromConnectorRect = fromConnector.rect;
    this.fromConnectorSide = fromConnector.fConnectableSide;

    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId));
    this.toConnectorRect = toConnector.rect;
    this.toConnectorSide = toConnector.fConnectableSide;
  }

  public move(difference: IPoint): void {
    const toConnectorRect = RectExtensions.addPoint(this.toConnectorRect, difference);

    const vector = this.fMediator.send<IVector>(new GetConnectionVectorRequest(
            this.fromConnectorRect,
            toConnectorRect,
            this.connection.fBehavior,
            this.fromConnectorSide,
            this.toConnectorSide,
        )
    );

    this.connection.setVector(vector.point1, this.fromConnectorSide, vector.point2, this.toConnectorSide);
    this.connection.redraw();
  }
}
