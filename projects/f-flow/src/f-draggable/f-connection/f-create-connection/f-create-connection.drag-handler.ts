import { FDragHandlerResult, IFDragHandler } from '../../f-drag-handler';
import {
  CalculateClosestConnectorRequest,
  GetAllCanBeConnectedInputsAndRectsRequest,
  CalculateConnectionLineByBehaviorRequest,
  GetConnectorAndRectRequest,
  IConnectorAndRect,
  IClosestConnector,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import { FConnectionForCreateComponent, FSnapConnectionComponent } from '../../../f-connection';
import { EFConnectableSide, FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import {
  RoundedRect,
  ILine,
  IPoint,
  PointExtensions,
  RectExtensions,
  IRoundedRect,
} from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { IFCreateConnectionDragResult } from './i-f-create-connection-drag-result';
import { Injector } from '@angular/core';

export class FCreateConnectionDragHandler implements IFDragHandler {
  public fEventType = 'create-connection';
  public fData: unknown;

  private readonly _result: FDragHandlerResult<IFCreateConnectionDragResult>;
  private readonly _mediator: FMediator;
  private readonly _store: FComponentsStore;

  private readonly _toConnectorRect = new RoundedRect();

  private get _connection(): FConnectionForCreateComponent {
    return this._store.fTempConnection as FConnectionForCreateComponent;
  }

  private get _snapConnection(): FSnapConnectionComponent | undefined {
    return this._store.fSnapConnection as FSnapConnectionComponent;
  }

  private _fOutputWithRect!: IConnectorAndRect;

  private _canBeConnectedInputs: IConnectorAndRect[] = [];

  constructor(
    _injector: Injector,
    private _fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
    _onPointerDownPosition: IPoint,
  ) {
    this._result = _injector.get(FDragHandlerResult);
    this._mediator = _injector.get(FMediator);
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

    this._fOutputWithRect = this._mediator.execute<IConnectorAndRect>(
      new GetConnectorAndRectRequest(this._fOutputOrOutlet),
    );

    this._connection.show();
    this.onPointerMove(PointExtensions.initialize());

    this._result.setData({
      toConnectorRect: this._toConnectorRect,
      canBeConnectedInputs: this._canBeConnectedInputs,
      fOutputId: this._fOutputOrOutlet.fId(),
    });
  }

  private _getAndMarkCanBeConnectedInputs(): void {
    this._canBeConnectedInputs = this._mediator.execute<IConnectorAndRect[]>(
      new GetAllCanBeConnectedInputsAndRectsRequest(this._fOutputOrOutlet),
    );

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.fConnector)),
    );
  }

  private _initializeSnapConnection(): void {
    if (!this._snapConnection) {
      return;
    }
    this._snapConnection.fOutputId.set(this._fOutputOrOutlet.fId());
    this._snapConnection.initialize();
  }

  private _initializeConnectionForCreate(): void {
    this._connection.fOutputId.set(this._fOutputOrOutlet.fId());
    this._connection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const fClosestInput = this._findClosestInput(difference);

    this._drawConnectionForCreate(
      this._toConnectorRect.addPoint(difference),
      fClosestInput?.fConnector.fConnectableSide || EFConnectableSide.TOP,
    );

    if (this._snapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(fClosestInput));
    }
  }

  private _drawConnectionForCreate(toConnectorRect: IRoundedRect, fSide: EFConnectableSide): void {
    const line = this._mediator.execute<ILine>(
      new CalculateConnectionLineByBehaviorRequest(
        this._fOutputWithRect.fRect,
        toConnectorRect,
        this._connection.fBehavior,
        this._fOutputWithRect.fConnector.fConnectableSide,
        fSide,
      ),
    );

    this._connection.setLine(line, this._fOutputWithRect.fConnector.fConnectableSide, fSide);
    this._connection.redraw();
  }

  private _drawSnapConnection(fClosestInput: IClosestConnector | undefined): void {
    if (fClosestInput) {
      const line = this._mediator.execute<ILine>(
        new CalculateConnectionLineByBehaviorRequest(
          this._fOutputWithRect.fRect,
          fClosestInput.fRect,
          this._snapConnection!.fBehavior,
          this._fOutputWithRect.fConnector.fConnectableSide,
          fClosestInput.fConnector.fConnectableSide,
        ),
      );
      this._snapConnection?.show();
      this._snapConnection?.setLine(
        line,
        this._fOutputWithRect.fConnector.fConnectableSide,
        fClosestInput.fConnector.fConnectableSide,
      );
      this._snapConnection?.redraw();
    } else {
      this._snapConnection?.hide();
    }
  }

  private _findClosestInput(difference: IPoint): IClosestConnector | undefined {
    return this._mediator.execute<IClosestConnector | undefined>(
      new CalculateClosestConnectorRequest(
        this._toConnectorRect.addPoint(difference),
        this._canBeConnectedInputs,
      ),
    );
  }

  private _getClosestInputForSnapConnection(
    fClosestInput: IClosestConnector | undefined,
  ): IClosestConnector | undefined {
    return fClosestInput && fClosestInput.distance < this._snapConnection!.fSnapThreshold
      ? fClosestInput
      : undefined;
  }

  public onPointerUp(): void {
    this._connection.redraw();
    this._connection.hide();
    this._snapConnection?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._canBeConnectedInputs.map((x) => x.fConnector)),
    );
  }
}
