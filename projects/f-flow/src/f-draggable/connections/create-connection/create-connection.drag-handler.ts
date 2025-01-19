import { IDraggableItem } from '../../i-draggable-item';
import {
  FindClosestInputRequest,
  GetAllCanBeConnectedInputPositionsRequest,
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorWithRectRequest,
  IConnectorWithRect, IClosestInput
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
    this._initializeSnapConnection();
    this._initializeConnectionForCreate();

    this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
      new GetAllCanBeConnectedInputPositionsRequest(this.fOutput.fId)
    );

    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.fOutput));

    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.onPointerDownPosition.x, this.onPointerDownPosition.y)
    );

    this.fConnection.show();
    this.onPointerMove(PointExtensions.initialize());
  }

  private _initializeSnapConnection(): void {
    if (!this.fSnapConnection) {
      return;
    }
    this.fSnapConnection.fOutputId = this.fOutput.fId;
    this.fSnapConnection.initialize();
  }

  private _initializeConnectionForCreate(): void {
    this.fConnection.fOutputId = this.fOutput.fId;
    this.fConnection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const fClosestInput = this._findClosestInput(difference);

    this._drawConnectionForCreate(this.toConnectorRect.addPoint(difference), fClosestInput?.fConnector.fConnectableSide || EFConnectableSide.TOP);

    if (this.fSnapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(fClosestInput));
    }
  }

  private _drawConnectionForCreate(fInputRect: RoundedRect, fSide: EFConnectableSide): void {
    const line = this.fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
        this.fOutputWithRect.fRect,
        fInputRect,
        this.fConnection.fBehavior,
        this.fOutputWithRect.fConnector.fConnectableSide,
        fSide
      )
    );

    this.fConnection.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, fSide);
    this.fConnection.redraw();
  }

  private _drawSnapConnection(fClosestInput: IClosestInput | undefined): void {
    if (fClosestInput) {
      const line = this.fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
          this.fOutputWithRect.fRect,
          fClosestInput.fRect,
          this.fSnapConnection!.fBehavior,
          this.fOutputWithRect.fConnector.fConnectableSide,
          fClosestInput.fConnector.fConnectableSide
        )
      );
      this.fSnapConnection!.show();
      this.fSnapConnection!.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, fClosestInput.fConnector.fConnectableSide);
      this.fSnapConnection!.redraw();
    } else {
      this.fSnapConnection?.hide();
    }
  }

  public getClosetInput(difference: IPoint): IClosestInput | undefined {
    if (!this.fSnapConnection) {
      return undefined;
    }

    return this._getClosestInputForSnapConnection(this._findClosestInput(difference));
  }

  private _findClosestInput(difference: IPoint): IClosestInput | undefined {
    return this.fMediator.send<IClosestInput | undefined>(
      new FindClosestInputRequest(
        Point.fromPoint(this.toConnectorRect).add(difference),
        this.canBeConnectedInputs,
      )
    );
  }

  private _getClosestInputForSnapConnection(fClosestInput: IClosestInput | undefined): IClosestInput | undefined {
    return fClosestInput && fClosestInput.distance < this.fSnapConnection!.fSnapThreshold ? fClosestInput : undefined;
  }

  public onPointerUp(): void {
    this.fConnection.redraw();
    this.fConnection.hide();
    this.fSnapConnection?.hide();
  }
}
