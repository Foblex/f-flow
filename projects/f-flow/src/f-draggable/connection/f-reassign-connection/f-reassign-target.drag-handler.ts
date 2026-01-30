import { FMediator } from '@foblex/mediator';
import {
  CalculateClosestConnectorRequest,
  CalculateTargetConnectorsToConnectRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../domain';
import { FNodeInputDirective, FNodeOutputDirective } from '../../../f-connectors';
import { FSnapConnectionComponent } from '../../../f-connection';
import { ILine, IPoint, IRoundedRect, RoundedRect } from '@foblex/2d';
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

export class FReassignTargetDragHandler implements IFReassignHandler {
  private _connectableConnectors: IConnectorRectRef[] = [];

  private get _sourceConnector(): FNodeOutputDirective {
    return this._sourceConnectorAndRect.connector as FNodeOutputDirective;
  }

  private get _sourceConnectorRect(): IRoundedRect {
    return this._sourceConnectorAndRect.rect;
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
    this._connectorRect = roundedRectFromPoint(this._connection.line.point2);
  }

  public getConnectableConnectors(): IConnectorRectRef[] {
    return this._connectableConnectors;
  }

  public markConnectableConnector(): void {
    this._connectableConnectors = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateTargetConnectorsToConnectRequest(
        this._sourceConnector,
        this._sourceConnectorRect.gravityCenter,
      ),
    );

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.connector)),
    );
  }

  public initializeSnapConnection(snapConnection: FSnapConnectionComponent | undefined): void {
    this._snapConnection = snapConnection;
    if (!snapConnection) {
      return;
    }
    snapConnection.fOutputId.set(this._connection.fOutputId());
    snapConnection.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const newPoint = this._connectorRect.addPoint(difference);

    const fClosestConnector = this._findClosestConnector(newPoint, this._connectableConnectors);
    this._drawConnection(
      newPoint,
      fClosestConnector?.connector.fConnectableSide || this._targetConnector.fConnectableSide,
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

  private _calculateNewLine(targetPoint: IPoint, fSide: EFConnectableSide): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceConnectorRect,
        roundedRectFromPoint(targetPoint),
        this._connection,
        this._sourceConnector.fConnectableSide,
        fSide,
      ),
    );
  }

  private _drawSnapConnection(closestConnector: IClosestConnectorRef | undefined): void {
    const snapConnection = this._snapConnection!;
    if (closestConnector) {
      const line = this._getLineToClosestTargetConnector(closestConnector, snapConnection);
      snapConnection.show();
      snapConnection.setLine(line);
      snapConnection.redraw();
    } else {
      snapConnection.hide();
    }
  }

  private _getLineToClosestTargetConnector(
    fClosestInput: IClosestConnectorRef,
    snapConnection: FSnapConnectionComponent,
  ): ILine {
    return this._connectionBehaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceConnectorRect,
        fClosestInput.rect,
        snapConnection,
        this._sourceConnector.fConnectableSide,
        fClosestInput.connector.fConnectableSide,
      ),
    );
  }

  public onPointerUp(): void {
    this._drawConnection(
      this._connectorRect,
      this._targetConnectorAndRect.connector.fConnectableSide,
    );
    this._snapConnection?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._connectableConnectors.map((x) => x.connector)),
    );
  }
}
