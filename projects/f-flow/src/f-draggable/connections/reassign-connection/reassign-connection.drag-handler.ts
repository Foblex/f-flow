import { IDraggableItem } from '../../i-draggable-item';
import {
  GetConnectionLineRequest,
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse,
  GetOutputRectInFlowRequest,
  GetOutputRectInFlowResponse
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, RectExtensions  } from '@foblex/2d';

export class ReassignConnectionDragHandler implements IDraggableItem {

  private onPointerDownFromConnectorRect: RoundedRect = new RoundedRect();
  private onPointerDownToConnectorRect: RoundedRect = new RoundedRect();

  private outputSide: EFConnectableSide = EFConnectableSide.BOTTOM;
  private inputSide: EFConnectableSide = EFConnectableSide.TOP;

  constructor(
    private fMediator: FMediator,
    public connection: FConnectionBase
  ) {
  }

  public initialize(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    this.inputSide = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId)).fConnectableSide;
    this.outputSide = fromConnector.fConnectableSide;
    this.onPointerDownFromConnectorRect = RoundedRect.fromRoundedRect(fromConnector.rect);
    this.onPointerDownToConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.connection.line.point2.x, this.connection.line.point2.y, 0, 0)
    );
  }

  public move(difference: IPoint): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.onPointerDownFromConnectorRect,
        this.onPointerDownToConnectorRect.addPoint(difference),
        this.connection.fBehavior,
        this.outputSide,
        this.inputSide,
      )
    );

    this.connection.setLine(line.point1, this.outputSide, line.point2, this.inputSide);
    this.connection.redraw();
  }

  public complete(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.connection.fOutputId)
    );
    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.connection.fInputId));

    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        fromConnector.rect,
        toConnector.rect,
        this.connection.fBehavior,
        fromConnector.fConnectableSide,
        toConnector.fConnectableSide,
      )
    );

    this.connection.setLine(line.point1, fromConnector.fConnectableSide, line.point2, toConnector.fConnectableSide);
    this.connection.redraw();
  }
}
