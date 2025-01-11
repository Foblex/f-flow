import { IDraggableItem } from '../../i-draggable-item';
import {
  FindClosestInputUsingSnapThresholdRequest,
  GetAllCanBeConnectedInputPositionsRequest,
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorWithRectRequest,
  IConnectorWithRect
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, Point, } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

export class CreateConnectionDragHandler implements IDraggableItem {

  private toConnectorRect: RoundedRect = new RoundedRect();

  public get fConnection(): FConnectionBase {
    return this.fComponentsStore.fTempConnection!;
  }

  private get fSnapConnection(): FSnapConnectionComponent | undefined {
    return this.fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  private fOutputWithRect!: IConnectorWithRect;

  private canBeConnectedInputs: IConnectorWithRect[] = [];

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
    private fOutput: FConnectorBase,
    private onPointerDownPosition: IPoint,
  ) {
  }

  public prepareDragSequence(): void {
    if (this.fSnapConnection) {
      this.fSnapConnection.fOutputId = this.fOutput.fId;
      this.fSnapConnection.initialize();
      this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
        new GetAllCanBeConnectedInputPositionsRequest(this.fOutput.fId)
      );
    }
    this.fConnection.fOutputId = this.fOutput.fId;
    this.fConnection.initialize();


    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.fOutput));

    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.onPointerDownPosition.x, this.onPointerDownPosition.y)
    );

    this.fConnection.show();
    this.onPointerMove(PointExtensions.initialize());
  }

  public onPointerMove(difference: IPoint): void {
    this.drawTempConnection(this.toConnectorRect.addPoint(difference));
    if (this.fSnapConnection) {
      this.drawSnapConnection(this.getClosetInput(difference));
    }
  }

  private drawTempConnection(fInputRect: RoundedRect): void {
    const line = this.fMediator.send<ILine>(new CalculateConnectionLineByBehaviorRequest(
        this.fOutputWithRect.fRect,
        fInputRect,
        this.fConnection.fBehavior,
        this.fOutputWithRect.fConnector.fConnectableSide,
        EFConnectableSide.TOP,
      )
    );

    this.fConnection.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, EFConnectableSide.TOP);
    this.fConnection.redraw();
  }

  private drawSnapConnection(fInputWithRect: IConnectorWithRect | undefined): void {
    if (fInputWithRect) {
      const line = this.fMediator.send<ILine>(new CalculateConnectionLineByBehaviorRequest(
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
    if (!this.fSnapConnection) {
      return undefined;
    }
    return this.fMediator.send<IConnectorWithRect | undefined>(
      new FindClosestInputUsingSnapThresholdRequest(
        Point.fromPoint(this.toConnectorRect).add(difference),
        this.canBeConnectedInputs,
        this.fSnapConnection!.fSnapThreshold
      )
    );
  }

  public onPointerUp(): void {
    this.fConnection.redraw();
    this.fConnection.hide();
    this.fSnapConnection?.hide();
  }
}
