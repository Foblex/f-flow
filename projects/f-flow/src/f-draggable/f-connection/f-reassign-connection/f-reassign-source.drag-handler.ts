import { FMediator } from '@foblex/mediator';
import {
  CalculateConnectionLineByBehaviorRequest,
  CalculateClosestConnectorRequest,
  GetAllCanBeConnectedSourceConnectorsAndRectsRequest,
  IClosestConnector,
  IConnectorAndRect,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import {
  EFConnectableSide,
  FNodeInputDirective,
  FNodeOutputDirective,
} from '../../../f-connectors';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { ILine, IPoint, RoundedRect } from '@foblex/2d';
import {
  IFReassignHandler,
  isClosestConnectorInsideSnapThreshold,
  roundedRectFromPoint,
} from './i-f-reassign-handler';

export class FReassignSourceDragHandler implements IFReassignHandler {
  private _connectableConnectors: IConnectorAndRect[] = [];

  private get _sourceConnector(): FNodeOutputDirective {
    return this._sourceConnectorAndRect.fConnector as FNodeOutputDirective;
  }

  private get _targetConnector(): FNodeInputDirective {
    return this._targetConnectorAndRect.fConnector as FNodeInputDirective;
  }

  private readonly _connectorRect!: RoundedRect;

  private _snapConnection: FSnapConnectionComponent | undefined;

  constructor(
    private readonly _mediator: FMediator,
    private readonly _connection: FConnectionBase,
    private readonly _sourceConnectorAndRect: IConnectorAndRect,
    private readonly _targetConnectorAndRect: IConnectorAndRect,
  ) {
    this._connectorRect = roundedRectFromPoint(this._connection.line.point1);
  }

  public getConnectableConnectors(): IConnectorAndRect[] {
    return this._connectableConnectors;
  }

  public markConnectableConnector(): void {
    this._connectableConnectors = this._mediator.execute<IConnectorAndRect[]>(
      new GetAllCanBeConnectedSourceConnectorsAndRectsRequest(this._targetConnector),
    );
    const isExistCurrentSourceConnector = this._connectableConnectors.some(
      (x) => x.fConnector.fId() === this._sourceConnector.fId(),
    );
    if (!isExistCurrentSourceConnector) {
      this._connectableConnectors.push(this._sourceConnectorAndRect);
    }

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.fConnector)),
    );
  }

  public initializeSnapConnection(snapConnection: FSnapConnectionComponent | undefined): void {
    this._snapConnection = snapConnection;
    if (!snapConnection) {
      return;
    }
    snapConnection.fInputId.set(this._connection.fInputId());
    snapConnection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const newPoint = this._connectorRect.addPoint(difference);

    const fClosestConnector = this._findClosestConnector(newPoint, this._connectableConnectors);
    this._drawConnection(
      newPoint,
      fClosestConnector?.fConnector.fConnectableSide || this._sourceConnector.fConnectableSide,
    );
    if (this._snapConnection) {
      this._drawSnapConnection(
        isClosestConnectorInsideSnapThreshold(fClosestConnector, this._snapConnection),
      );
    }
  }

  private _findClosestConnector(
    point: IPoint,
    connectors: IConnectorAndRect[],
  ): IClosestConnector | undefined {
    return this._mediator.execute<IClosestConnector | undefined>(
      new CalculateClosestConnectorRequest(point, connectors),
    );
  }

  private _drawConnection(newPoint: IPoint, fSide: EFConnectableSide): void {
    const line = this._calculateNewLine(newPoint, fSide);
    this._connection.setLine(line, fSide, this._targetConnectorAndRect.fConnector.fConnectableSide);
    this._connection.redraw();
  }

  private _calculateNewLine(sourcePoint: IPoint, fSide: EFConnectableSide): ILine {
    return this._mediator.execute<ILine>(
      new CalculateConnectionLineByBehaviorRequest(
        roundedRectFromPoint(sourcePoint),
        this._targetConnectorAndRect.fRect,
        this._connection.fBehavior,
        fSide,
        this._targetConnectorAndRect.fConnector.fConnectableSide,
      ),
    );
  }

  private _drawSnapConnection(fClosestConnector: IClosestConnector | undefined): void {
    const snapConnection = this._snapConnection!;
    if (fClosestConnector) {
      const line = this._getLineToClosestSourceConnector(fClosestConnector, snapConnection);
      snapConnection.show();
      snapConnection.setLine(
        line,
        fClosestConnector.fConnector.fConnectableSide,
        this._targetConnector.fConnectableSide,
      );
      snapConnection.redraw();
    } else {
      snapConnection.hide();
    }
  }

  private _getLineToClosestSourceConnector(
    fClosestInput: IClosestConnector,
    snapConnection: FSnapConnectionComponent,
  ): ILine {
    return this._mediator.execute<ILine>(
      new CalculateConnectionLineByBehaviorRequest(
        fClosestInput.fRect,
        this._targetConnectorAndRect.fRect,
        snapConnection.fBehavior,
        fClosestInput.fConnector.fConnectableSide,
        this._targetConnector.fConnectableSide,
      ),
    );
  }

  public onPointerUp(): void {
    this._drawConnection(
      this._connectorRect,
      this._sourceConnectorAndRect.fConnector.fConnectableSide,
    );
    this._snapConnection?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.fConnector)),
    );
  }
}
