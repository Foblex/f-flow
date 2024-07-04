import { IPoint, IRect, IVector, RectExtensions } from '@foblex/core';
import { IDraggableItem } from '../../i-draggable-item';
import { EFDraggableType } from '../../e-f-draggable-type';
import {
  GetConnectionVectorRequest,
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse,
  GetOutputRectInFlowRequest,
  GetOutputRectInFlowResponse
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { FFlowMediator } from '../../../infrastructure';

export class ReassignConnectionDragHandler implements IDraggableItem {

  public readonly type: EFDraggableType = EFDraggableType.REASSIGN_CONNECTION;

  private onPointerDownFromConnectorRect: IRect = RectExtensions.initialize();
  private onPointerDownToConnectorRect: IRect = RectExtensions.initialize();

  private outputSide: EFConnectableSide = EFConnectableSide.BOTTOM;
  private inputSide: EFConnectableSide = EFConnectableSide.TOP;

  constructor(
      private fMediator: FFlowMediator,
      public connection: FConnectionBase
  ) {
  }

  public initialize(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
        new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.inputSide = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId)).fConnectableSide;
    this.outputSide = fromConnector.fConnectableSide;
    this.onPointerDownFromConnectorRect = fromConnector.rect;
    this.onPointerDownToConnectorRect = RectExtensions.initialize(this.connection.vector.point2.x, this.connection.vector.point2.y, 0, 0);
  }

  public move(difference: IPoint): void {
    const toRect = RectExtensions.addPoint(this.onPointerDownToConnectorRect, difference);

    const vector = this.fMediator.send<IVector>(new GetConnectionVectorRequest(
            this.onPointerDownFromConnectorRect,
            toRect,
            this.connection.fBehavior,
            this.outputSide,
            this.inputSide,
        )
    );

    this.connection.setVector(vector.point1, this.outputSide, vector.point2, this.inputSide);
    this.connection.redraw();
  }

  public complete(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
        new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId));

    const vector = this.fMediator.send<IVector>(new GetConnectionVectorRequest(
            fromConnector.rect,
            toConnector.rect,
            this.connection.fBehavior,
            fromConnector.fConnectableSide,
            toConnector.fConnectableSide,
        )
    );

    this.connection.setVector(vector.point1, fromConnector.fConnectableSide, vector.point2, toConnector.fConnectableSide);
    this.connection.redraw();
  }
}
