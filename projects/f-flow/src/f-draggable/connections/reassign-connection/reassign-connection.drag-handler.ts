import { IDraggableItem } from '../../i-draggable-item';
import { GetConnectionLineRequest } from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { ILine, IPoint, Point, RectExtensions, RoundedRect } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import {
  FindClosestInputUsingSnapThresholdRequest,
  GetAllCanBeConnectedInputPositionsRequest,
  GetConnectorWithRectRequest,
  IConnectorWithRect
} from '../common';

export class ReassignConnectionDragHandler implements IDraggableItem {

  public toConnectorRect: RoundedRect = new RoundedRect();

  private get fSnapConnection(): FSnapConnectionComponent | undefined {
    return this.fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  private fOutputWithRect!: IConnectorWithRect;
  private fInputWithRect!: IConnectorWithRect;

  private canBeConnectedInputs: IConnectorWithRect[] = [];

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
    public fConnection: FConnectionBase,
  ) {
  }

  public initialize(): void {
    if (this.fSnapConnection) {
      this.fSnapConnection.fOutputId = this.fConnection.fOutputId;
      this.fSnapConnection.initialize();
      this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
        new GetAllCanBeConnectedInputPositionsRequest(this.fConnection.fOutputId)
      );
    }

    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getOutput()));
    this.fInputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getInput()));
    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.fConnection.line.point2.x, this.fConnection.line.point2.y)
    );
  }

  private getOutput(): FConnectorBase {
    return this.fComponentsStore.fOutputs.find((x) => x.id === this.fConnection.fOutputId)!;
  }

  private getInput(): FConnectorBase {
    return this.fComponentsStore.fInputs.find((x) => x.id === this.fConnection.fInputId)!
  }

  public move(difference: IPoint): void {
    this.drawConnection({ fRect: this.toConnectorRect.addPoint(difference), fConnector: this.fInputWithRect.fConnector });
    this.drawSnapConnection(this.getClosetInput(difference));
  }

  private drawConnection(fInputWithRect: IConnectorWithRect): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.fOutputWithRect.fRect,
        fInputWithRect.fRect,
        this.fConnection.fBehavior,
        this.fOutputWithRect.fConnector.fConnectableSide,
        fInputWithRect.fConnector.fConnectableSide
      )
    );

    this.fConnection.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, fInputWithRect.fConnector.fConnectableSide);
    this.fConnection.redraw();
  }

  private drawSnapConnection(fInputWithRect: IConnectorWithRect | undefined): void {
    if (fInputWithRect) {
      const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
          this.fOutputWithRect.fRect,
          fInputWithRect.fRect,
          this.fSnapConnection!.fBehavior,
          this.fOutputWithRect.fConnector.fConnectableSide,
          fInputWithRect.fConnector.fConnectableSide
        )
      );
      this.fSnapConnection!.show();
      this.fSnapConnection!.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, fInputWithRect.fConnector.fConnectableSide);
      this.fSnapConnection!.redraw();
    } else {
      this.fSnapConnection?.hide();
    }
  }

  public getClosetInput(difference: IPoint): IConnectorWithRect | undefined {
    return this.fMediator.send<IConnectorWithRect | undefined>(
      new FindClosestInputUsingSnapThresholdRequest(
        Point.fromPoint(this.toConnectorRect).add(difference),
        this.canBeConnectedInputs,
        this.fSnapConnection!.fSnapThreshold
      )
    );
  }

  public complete(): void {
    this.drawConnection(this.fInputWithRect);
    this.fSnapConnection?.hide();
  }
}
