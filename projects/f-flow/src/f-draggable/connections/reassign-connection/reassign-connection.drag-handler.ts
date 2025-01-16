import { IDraggableItem } from '../../i-draggable-item';
import {
  FindClosestInputRequest,
  GetAllCanBeConnectedInputPositionsRequest,
  CalculateConnectionLineByBehaviorRequest, GetConnectorWithRectRequest,
  IConnectorWithRect, IClosestInput
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { ILine, IPoint, IRoundedRect, Point, RectExtensions, RoundedRect } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

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

  public prepareDragSequence(): void {
    this._initializeSnapConnection();

    this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
      new GetAllCanBeConnectedInputPositionsRequest(this.fConnection.fOutputId)
    );

    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getOutput()));
    this.fInputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.getInput()));
    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.fConnection.line.point2.x, this.fConnection.line.point2.y)
    );
  }

  private _initializeSnapConnection(): void {
    if (!this.fSnapConnection) {
      return;
    }
    this.fSnapConnection.fOutputId = this.fConnection.fOutputId;
    this.fSnapConnection.initialize();
  }

  private getOutput(): FConnectorBase {
    return this.fComponentsStore.fOutputs.find((x) => x.fId === this.fConnection.fOutputId)!;
  }

  private getInput(): FConnectorBase {
    return this.fComponentsStore.fInputs.find((x) => x.fId === this.fConnection.fInputId)!
  }

  public onPointerMove(difference: IPoint): void {
    const fClosestInput = this._findClosestInput(difference);

    this._drawConnection(
      this.toConnectorRect.addPoint(difference),
      fClosestInput?.fConnector.fConnectableSide || this.fInputWithRect.fConnector.fConnectableSide
    );
    if (this.fSnapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(fClosestInput));
    }
  }

  private _drawConnection(fInputRect: IRoundedRect, fSide: EFConnectableSide): void {
    const line = this.fMediator.send<ILine>(new CalculateConnectionLineByBehaviorRequest(
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
      const line = this.fMediator.send<ILine>(new CalculateConnectionLineByBehaviorRequest(
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
    this._drawConnection(this.fInputWithRect.fRect, this.fInputWithRect.fConnector.fConnectableSide);
    this.fSnapConnection?.hide();
  }
}
