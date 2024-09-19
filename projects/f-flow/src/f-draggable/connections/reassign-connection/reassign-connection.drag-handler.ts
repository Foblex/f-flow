import { IDraggableItem } from '../../i-draggable-item';
import {
  GetConnectionLineRequest,
  GetInputRectInFlowRequest,
  GetInputRectInFlowResponse
} from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, RectExtensions  } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

export class ReassignConnectionDragHandler implements IDraggableItem {

  private onPointerDownFromConnectorRect: RoundedRect = new RoundedRect();
  private onPointerDownToConnectorRect: RoundedRect = new RoundedRect();

  private outputSide: EFConnectableSide = EFConnectableSide.BOTTOM;
  private inputSide: EFConnectableSide = EFConnectableSide.TOP;

  private get fSnapConnection(): FConnectionBase | undefined {
    return this.fComponentsStore.fSnapConnection;
  }

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
    private fOutput: FConnectorBase,
    public fConnection: FConnectionBase,
  ) {
  }

  public initialize(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.fConnection.fOutputId)
    );
    this.inputSide = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.fConnection.fInputId)).fConnectableSide;
    this.outputSide = fromConnector.fConnectableSide;
    this.onPointerDownFromConnectorRect = RoundedRect.fromRoundedRect(fromConnector.rect);
    this.onPointerDownToConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.fConnection.line.point2.x, this.fConnection.line.point2.y, 0, 0)
    );
  }

  public move(difference: IPoint): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.onPointerDownFromConnectorRect,
        this.onPointerDownToConnectorRect.addPoint(difference),
        this.fConnection.fBehavior,
        this.outputSide,
        this.inputSide,
      )
    );

    this.fConnection.setLine(line.point1, this.outputSide, line.point2, this.inputSide);
    this.fConnection.redraw();
  }

  public complete(): void {
    const fromConnector = this.fMediator.send<GetOutputRectInFlowResponse>(
      new GetOutputRectInFlowRequest(this.fConnection.fOutputId)
    );
    const toConnector = this.fMediator.send<GetInputRectInFlowResponse>(new GetInputRectInFlowRequest(this.fConnection.fInputId));

    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        fromConnector.rect,
        toConnector.rect,
        this.fConnection.fBehavior,
        fromConnector.fConnectableSide,
        toConnector.fConnectableSide,
      )
    );

    this.fConnection.setLine(line.point1, fromConnector.fConnectableSide, line.point2, toConnector.fConnectableSide);
    this.fConnection.redraw();
  }
}
