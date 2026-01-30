import { FMediator } from '@foblex/mediator';
import {
  CalculateClosestConnectorRequest,
  CalculateSourceConnectorsToConnectRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import { FNodeInputDirective, FNodeOutputDirective } from '../../../f-connectors';
import { FSnapConnectionComponent } from '../../../f-connection';
import { ILine, IPoint, RoundedRect } from '@foblex/2d';
import {
  IFReassignHandler,
  isClosestConnectorInsideSnapThreshold,
  roundedRectFromPoint,
} from './i-f-reassign-handler';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  EFConnectableSide,
  FConnectionBase,
} from '../../../f-connection-v2';

export class FReassignSourceDragHandler implements IFReassignHandler {
  private _connectableConnectors: IConnectorRectRef[] = [];

  private get _sourceConnector(): FNodeOutputDirective {
    return this._sourceConnectorAndRect.connector as FNodeOutputDirective;
  }

  private get _targetConnector(): FNodeInputDirective {
    return this._targetConnectorAndRect.connector as FNodeInputDirective;
  }

  private readonly _connectorRect!: RoundedRect;

  private _snapConnection: FSnapConnectionComponent | undefined;

  constructor(
    private readonly _mediator: FMediator,
    private readonly _connectionBehaviour: ConnectionBehaviourBuilder,
    private readonly _connection: FConnectionBase,
    private readonly _sourceConnectorAndRect: IConnectorRectRef,
    private readonly _targetConnectorAndRect: IConnectorRectRef,
  ) {
    this._connectorRect = roundedRectFromPoint(this._connection.line.point1);
  }

  public getConnectableConnectors(): IConnectorRectRef[] {
    return this._connectableConnectors;
  }

  public markConnectableConnector(): void {
    this._connectableConnectors = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateSourceConnectorsToConnectRequest(
        this._targetConnector,
        this._targetConnectorAndRect.rect.gravityCenter,
      ),
    );
    const isExistCurrentSourceConnector = this._connectableConnectors.some(
      (x) => x.connector.fId() === this._sourceConnector.fId(),
    );
    if (!isExistCurrentSourceConnector) {
      this._connectableConnectors.push(this._sourceConnectorAndRect);
    }

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.connector)),
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
      fClosestConnector?.connector.fConnectableSide || this._sourceConnector.fConnectableSide,
    );
    if (this._snapConnection) {
      this._drawSnapConnection(
        isClosestConnectorInsideSnapThreshold(fClosestConnector, this._snapConnection),
      );
    }
  }

  private _findClosestConnector(
    point: IPoint,
    connectors: IConnectorRectRef[],
  ): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(point, connectors),
    );
  }

  private _drawConnection(newPoint: IPoint, fSide: EFConnectableSide): void {
    const line = this._calculateNewLine(newPoint, fSide);
    this._connection.setLine(line);
    this._connection.redraw();
  }

  private _calculateNewLine(sourcePoint: IPoint, fSide: EFConnectableSide): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        roundedRectFromPoint(sourcePoint),
        this._targetConnectorAndRect.rect,
        this._connection,
        fSide,
        this._targetConnectorAndRect.connector.fConnectableSide,
      ),
    );
  }

  private _drawSnapConnection(fClosestConnector: IClosestConnectorRef | undefined): void {
    const snapConnection = this._snapConnection!;
    if (fClosestConnector) {
      const line = this._getLineToClosestSourceConnector(fClosestConnector, snapConnection);
      snapConnection.show();
      snapConnection.setLine(line);
      snapConnection.redraw();
    } else {
      snapConnection.hide();
    }
  }

  private _getLineToClosestSourceConnector(
    fClosestInput: IClosestConnectorRef,
    snapConnection: FSnapConnectionComponent,
  ): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        fClosestInput.rect,
        this._targetConnectorAndRect.rect,
        snapConnection,
        fClosestInput.connector.fConnectableSide,
        this._targetConnector.fConnectableSide,
      ),
    );
  }

  public onPointerUp(): void {
    this._drawConnection(
      this._connectorRect,
      this._sourceConnectorAndRect.connector.fConnectableSide,
    );
    this._snapConnection?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.connector)),
    );
  }
}
