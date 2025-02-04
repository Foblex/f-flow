import { FDragHandlerResult, IFDragHandler } from '../../f-drag-handler';
import {
  CalculateClosestInputRequest,
  GetAllCanBeConnectedInputsAndRectsRequest,
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorAndRectRequest,
  IConnectorAndRect, IClosestInput, MarkAllCanBeConnectedInputsRequest, UnmarkAllCanBeConnectedInputsRequest
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import {
  EFConnectableSide, FNodeOutletBase,
  FNodeOutputBase,
} from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, IRoundedRect } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { fInject } from '../../f-injector';
import { IFCreateConnectionDragResult } from './i-f-create-connection-drag-result';

export class FCreateConnectionDragHandler implements IFDragHandler {

  public fEventType = 'create-connection';
  public fData: any;

  private _fResult = fInject(FDragHandlerResult<IFCreateConnectionDragResult>);

  private _fMediator = fInject(FMediator);
  private _fComponentsStore = fInject(FComponentsStore);

  private readonly _toConnectorRect = new RoundedRect();

  private get _fConnection(): FConnectionBase {
    return this._fComponentsStore.fTempConnection!;
  }

  private get _fSnapConnection(): FSnapConnectionComponent | undefined {
    return this._fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  private _fOutputWithRect!: IConnectorAndRect;

  private _canBeConnectedInputs: IConnectorAndRect[] = [];

  constructor(
    private _fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
    _onPointerDownPosition: IPoint,
  ) {
    this._toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(_onPointerDownPosition.x, _onPointerDownPosition.y)
    );
    this.fData = {
      fOutputOrOutletId: this._fOutputOrOutlet.fId,
    };
  }

  public prepareDragSequence(): void {
    this._getAndMarkCanBeConnectedInputs();
    this._initializeSnapConnection();
    this._initializeConnectionForCreate();

    this._fOutputWithRect = this._fMediator.execute<IConnectorAndRect>(new GetConnectorAndRectRequest(this._fOutputOrOutlet));

    this._fConnection.show();
    this.onPointerMove(PointExtensions.initialize());

    this._fResult.setData({
      toConnectorRect: this._toConnectorRect,
      canBeConnectedInputs: this._canBeConnectedInputs,
      fOutputId: this._fOutputOrOutlet.fId,
    });
  }

  private _getAndMarkCanBeConnectedInputs(): void {
    this._canBeConnectedInputs = this._fMediator.execute<IConnectorAndRect[]>(
      new GetAllCanBeConnectedInputsAndRectsRequest(this._fOutputOrOutlet)
    );

    this._fMediator.execute(
      new MarkAllCanBeConnectedInputsRequest(this._canBeConnectedInputs.map((x) => x.fConnector))
    );
  }

  private _initializeSnapConnection(): void {
    if (!this._fSnapConnection) {
      return;
    }
    this._fSnapConnection.fOutputId = this._fOutputOrOutlet.fId;
    this._fSnapConnection.initialize();
  }

  private _initializeConnectionForCreate(): void {
    this._fConnection.fOutputId = this._fOutputOrOutlet.fId;
    this._fConnection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const fClosestInput = this._findClosestInput(difference);

    this._drawConnectionForCreate(
      this._toConnectorRect.addPoint(difference),
      fClosestInput?.fConnector.fConnectableSide || EFConnectableSide.TOP
    );

    if (this._fSnapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(fClosestInput));
    }
  }

  private _drawConnectionForCreate(toConnectorRect: IRoundedRect, fSide: EFConnectableSide): void {
    const line = this._fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
        this._fOutputWithRect.fRect,
        toConnectorRect,
        this._fConnection.fBehavior,
        this._fOutputWithRect.fConnector.fConnectableSide,
        fSide
      )
    );

    this._fConnection.setLine(line.point1, this._fOutputWithRect.fConnector.fConnectableSide, line.point2, fSide);
    this._fConnection.redraw();
  }

  private _drawSnapConnection(fClosestInput: IClosestInput | undefined): void {
    if (fClosestInput) {
      const line = this._fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
          this._fOutputWithRect.fRect,
          fClosestInput.fRect,
          this._fSnapConnection!.fBehavior,
          this._fOutputWithRect.fConnector.fConnectableSide,
          fClosestInput.fConnector.fConnectableSide
        )
      );
      this._fSnapConnection!.show();
      this._fSnapConnection!.setLine(line.point1, this._fOutputWithRect.fConnector.fConnectableSide, line.point2, fClosestInput.fConnector.fConnectableSide);
      this._fSnapConnection!.redraw();
    } else {
      this._fSnapConnection?.hide();
    }
  }

  private _findClosestInput(difference: IPoint): IClosestInput | undefined {
    return this._fMediator.execute<IClosestInput | undefined>(
      new CalculateClosestInputRequest(
        this._toConnectorRect.addPoint(difference),
        this._canBeConnectedInputs,
      )
    );
  }

  private _getClosestInputForSnapConnection(fClosestInput: IClosestInput | undefined): IClosestInput | undefined {
    return fClosestInput && fClosestInput.distance < this._fSnapConnection!.fSnapThreshold ? fClosestInput : undefined;
  }

  public onPointerUp(): void {
    this._fConnection.redraw();
    this._fConnection.hide();
    this._fSnapConnection?.hide();

    this._fMediator.execute(
      new UnmarkAllCanBeConnectedInputsRequest(this._canBeConnectedInputs.map((x) => x.fConnector))
    );
  }
}
