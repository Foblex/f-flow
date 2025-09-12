import { FDragHandlerResult, IFDragHandler } from '../../f-drag-handler';
import {
  FindClosestConnectorRequest,
  GetAllCanBeConnectedInputsAndRectsRequest,
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorAndRectRequest,
  IConnectorAndRect, IClosestConnector, MarkConnectableConnectorsRequest, UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import {
  EFConnectableSide, FNodeOutletBase,
  FNodeOutputBase,
} from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, IRoundedRect } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { IFCreateConnectionDragResult } from './i-f-create-connection-drag-result';
import { Injector } from '@angular/core';

export class FCreateConnectionDragHandler implements IFDragHandler {

  public fEventType = 'create-connection';
  public fData: any;

  private readonly _fResult: FDragHandlerResult<IFCreateConnectionDragResult>;
  private readonly _fMediator: FMediator;
  private readonly _store: FComponentsStore;

  private readonly _toConnectorRect = new RoundedRect();

  private get _fConnection(): FConnectionBase {
    return this._store.fTempConnection!;
  }

  private get _fSnapConnection(): FSnapConnectionComponent | undefined {
    return this._store.fSnapConnection as FSnapConnectionComponent;
  }

  private _fOutputWithRect!: IConnectorAndRect;

  private _canBeConnectedInputs: IConnectorAndRect[] = [];

  constructor(
    _injector: Injector,
    private _fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
    _onPointerDownPosition: IPoint,
  ) {
    this._fResult = _injector.get(FDragHandlerResult);
    this._fMediator = _injector.get(FMediator);
    this._store = _injector.get(FComponentsStore);

    this._toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(_onPointerDownPosition.x, _onPointerDownPosition.y),
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
      new GetAllCanBeConnectedInputsAndRectsRequest(this._fOutputOrOutlet),
    );

    this._fMediator.execute(
      new MarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.fConnector)),
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
      fClosestInput?.fConnector.fConnectableSide || EFConnectableSide.TOP,
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
        fSide,
      ),
    );

    this._fConnection.setLine(line, this._fOutputWithRect.fConnector.fConnectableSide, fSide);
    this._fConnection.redraw();
  }

  private _drawSnapConnection(fClosestInput: IClosestConnector | undefined): void {
    if (fClosestInput) {
      const line = this._fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
          this._fOutputWithRect.fRect,
          fClosestInput.fRect,
          this._fSnapConnection!.fBehavior,
          this._fOutputWithRect.fConnector.fConnectableSide,
          fClosestInput.fConnector.fConnectableSide,
        ),
      );
      this._fSnapConnection!.show();
      this._fSnapConnection!.setLine(line, this._fOutputWithRect.fConnector.fConnectableSide, fClosestInput.fConnector.fConnectableSide);
      this._fSnapConnection!.redraw();
    } else {
      this._fSnapConnection?.hide();
    }
  }

  private _findClosestInput(difference: IPoint): IClosestConnector | undefined {
    return this._fMediator.execute<IClosestConnector | undefined>(
      new FindClosestConnectorRequest(
        this._toConnectorRect.addPoint(difference),
        this._canBeConnectedInputs,
      ),
    );
  }

  private _getClosestInputForSnapConnection(fClosestInput: IClosestConnector | undefined): IClosestConnector | undefined {
    return fClosestInput && fClosestInput.distance < this._fSnapConnection!.fSnapThreshold ? fClosestInput : undefined;
  }

  public onPointerUp(): void {
    this._fConnection.redraw();
    this._fConnection.hide();
    this._fSnapConnection?.hide();

    this._fMediator.execute(
      new UnmarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.fConnector)),
    );
  }
}
