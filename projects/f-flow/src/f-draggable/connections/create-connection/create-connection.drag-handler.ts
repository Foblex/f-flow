import { IDraggableItem } from '../../i-draggable-item';
import { GetConnectionLineRequest } from '../../../domain';
import { FConnectionBase } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, Point, } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { GetAllCanBeConnectedInputPositionsRequest } from '../get-all-can-be-connected-input-positions';
import { FindClosestInputUsingSnapThresholdRequest } from '../find-closest-input-using-snap-threshold';
import { GetConnectorWithRectRequest, IConnectorWithRect } from '../get-connector-with-rect';

export class CreateConnectionDragHandler implements IDraggableItem {

  private toConnectorRect: RoundedRect = new RoundedRect();

  public get fConnection(): FConnectionBase {
    return this.fComponentsStore.fTempConnection!;
  }

  private get fSnapConnection(): FConnectionBase | undefined {
    return this.fComponentsStore.fSnapConnection;
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

  public initialize(): void {
    if (this.fSnapConnection) {
      this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
        new GetAllCanBeConnectedInputPositionsRequest(this.fConnection.fOutputId)
      );
    }
    this.fConnection.fOutputId = this.fOutput.id;
    this.fConnection.initialize();

    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.fOutput));

    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.onPointerDownPosition.x, this.onPointerDownPosition.y)
    );

    this.fConnection.show();
    this.move(PointExtensions.initialize());
  }

  public move(difference: IPoint): void {
    this.drawTempConnection(this.toConnectorRect.addPoint(difference));
    this.drawSnapConnection(this.getClosetInput(difference));
  }

  private drawTempConnection(fInputRect: RoundedRect): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
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

  private getClosetInput(difference: IPoint): IConnectorWithRect | undefined {
    return this.fMediator.send<IConnectorWithRect | undefined>(
      new FindClosestInputUsingSnapThresholdRequest(
        Point.fromPoint(this.toConnectorRect).add(difference),
        this.canBeConnectedInputs,
        50
      )
    );
  }

  public complete(): void {
    this.fConnection.redraw();
    this.fConnection.hide();
    this.fSnapConnection?.hide();
  }
}
