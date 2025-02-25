import { FDragHandlerResult, IFDragHandler } from '../../f-drag-handler';
import {
  CalculateClosestInputRequest,
  GetAllCanBeConnectedInputsAndRectsRequest,
  CalculateConnectionLineByBehaviorRequest, GetConnectorAndRectRequest,
  IConnectorAndRect, IClosestInput, MarkAllCanBeConnectedInputsRequest, UnmarkAllCanBeConnectedInputsRequest
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase, FNodeOutputDirective } from '../../../f-connectors';
import { ILine, IPoint, RectExtensions, RoundedRect } from '@foblex/2d';
import { fInject } from '../../f-injector';
import { FMediator } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { IFReassignConnectionDragResult } from './i-f-reassign-connection-drag-result';

export class FReassignConnectionDragHandler implements IFDragHandler {

  public fEventType = 'reassign-connection';
  public fData: any;

  private _fResult = fInject(FDragHandlerResult<IFReassignConnectionDragResult>);

  private _fMediator = fInject(FMediator);
  private _fComponentsStore = fInject(FComponentsStore);

  private readonly _toConnectorRect = new RoundedRect();

  private get _fSnapConnection(): FSnapConnectionComponent | undefined {
    return this._fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  private _fOutputWithRect!: IConnectorAndRect;
  private _fInputWithRect!: IConnectorAndRect;

  private _canBeConnectedInputs: IConnectorAndRect[] = [];

  private get _fOutput(): FConnectorBase {
    const result = this._fComponentsStore.fOutputs.find((x) => x.fId === this._fConnection.fOutputId);
    if (!result) {
      throw new Error('Connection output not found');
    }
    return result;
  }

  private get _fInput(): FConnectorBase {
    const result = this._fComponentsStore.fInputs.find((x) => x.fId === this._fConnection.fInputId);
    if (!result) {
      throw new Error('Connection input not found');
    }
    return result;
  }

  constructor(
    private _fConnection: FConnectionBase,
  ) {
    this._toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this._fConnection.line.point2.x, this._fConnection.line.point2.y)
    );
    this.fData = {
      fConnectionId: this._fConnection.fId
    };
  }

  public prepareDragSequence(): void {
    this._getAndMarkCanBeConnectedInputs();
    this._initializeSnapConnection();

    this._fOutputWithRect = this._fMediator.execute<IConnectorAndRect>(new GetConnectorAndRectRequest(this._fOutput));
    this._fInputWithRect = this._fMediator.execute<IConnectorAndRect>(new GetConnectorAndRectRequest(this._fInput));

    this._fResult.setData({
      toConnectorRect: this._toConnectorRect,
      canBeConnectedInputs: this._canBeConnectedInputs,
      fConnection: this._fConnection
    });
  }

  private _getAndMarkCanBeConnectedInputs(): void {
    this._canBeConnectedInputs = this._fMediator.execute<IConnectorAndRect[]>(
      new GetAllCanBeConnectedInputsAndRectsRequest(this._fOutput as FNodeOutputDirective)
    );

    this._fMediator.execute(
      new MarkAllCanBeConnectedInputsRequest(this._canBeConnectedInputs.map((x) => x.fConnector))
    );
  }

  private _initializeSnapConnection(): void {
    if (!this._fSnapConnection) {
      return;
    }
    this._fSnapConnection.fOutputId = this._fConnection.fOutputId;
    this._fSnapConnection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const fClosestInput = this._findClosestInput(difference);

    this._drawConnection(
      this._toConnectorRect.addPoint(difference),
      fClosestInput?.fConnector.fConnectableSide || this._fInputWithRect.fConnector.fConnectableSide
    );
    if (this._fSnapConnection) {
      this._drawSnapConnection(this._getClosestInputForSnapConnection(fClosestInput));
    }
  }

  private _drawConnection(difference: IPoint, fSide: EFConnectableSide): void {
    const line = this._getLineToPointer(difference, fSide);
    this._fConnection.setLine(line, this._fOutputWithRect.fConnector.fConnectableSide, fSide);
    this._fConnection.redraw();
  }

  private _getLineToPointer(difference: IPoint, fSide: EFConnectableSide): ILine {
    return this._fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
        this._fOutputWithRect.fRect,
        this._getNodeRotate(this._fOutputWithRect.fConnector.fNodeId),
        RoundedRect.fromRect(RectExtensions.initialize(difference.x, difference.y)),
        0,
        this._fConnection.fBehavior,
        this._fOutputWithRect.fConnector.fConnectableSide,
        fSide
      )
    );
  }

  private _drawSnapConnection(fClosestInput: IClosestInput | undefined): void {
    if (fClosestInput) {
      const line = this._getLineToClosestInput(fClosestInput);
      this._fSnapConnection!.show();
      this._fSnapConnection!.setLine(line, this._fOutputWithRect.fConnector.fConnectableSide, fClosestInput.fConnector.fConnectableSide);
      this._fSnapConnection!.redraw();
    } else {
      this._fSnapConnection?.hide();
    }
  }

  private _getLineToClosestInput(fClosestInput: IClosestInput): ILine {
    return this._fMediator.execute<ILine>(new CalculateConnectionLineByBehaviorRequest(
      this._fOutputWithRect.fRect,
      this._getNodeRotate(this._fOutputWithRect.fConnector.fNodeId),
      fClosestInput.fRect,
      this._getNodeRotate(fClosestInput.fConnector.fNodeId),
      this._fSnapConnection!.fBehavior,
      this._fOutputWithRect.fConnector.fConnectableSide,
      fClosestInput.fConnector.fConnectableSide
    ));
  }

  private _getNodeRotate(id: string): number {
    return this._fComponentsStore.fNodes.find((x) => x.fId === id)?.rotate || 0;
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
    this._drawConnection(this._toConnectorRect, this._fInputWithRect.fConnector.fConnectableSide);
    this._fSnapConnection?.hide();

    this._fMediator.execute(
      new UnmarkAllCanBeConnectedInputsRequest(this._canBeConnectedInputs.map((x) => x.fConnector))
    );
  }
}
