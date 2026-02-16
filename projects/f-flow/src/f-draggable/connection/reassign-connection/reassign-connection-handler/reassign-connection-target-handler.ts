import { FMediator } from '@foblex/mediator';
import {
  CalculateClosestConnectorRequest,
  CalculateTargetConnectorsToConnectRequest,
  IClosestConnectorRef,
  IConnectorRectRef,
  MarkConnectableConnectorsRequest,
  UnmarkConnectableConnectorsRequest,
} from '../../../../domain';
import { FNodeInputDirective, FNodeOutputDirective } from '../../../../f-connectors';
import { FSnapConnectionComponent } from '../../../../f-connection';
import { ILine, IPoint, RoundedRect } from '@foblex/2d';
import { IReassignHandler, rectFromPoint, withinSnapThreshold } from './i-reassign-handler';
import {
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  EFConnectableSide,
  FConnectionBase,
} from '../../../../f-connection-v2';

export class ReassignConnectionTargetHandler implements IReassignHandler {
  private _candidates: IConnectorRectRef[] = [];
  private _snap: FSnapConnectionComponent | undefined;

  private readonly _anchorRect: RoundedRect;

  private get _source(): FNodeOutputDirective {
    return this._sourceRef.connector as FNodeOutputDirective;
  }

  private get _target(): FNodeInputDirective {
    return this._targetRef.connector as FNodeInputDirective;
  }

  constructor(
    private readonly _mediator: FMediator,
    private readonly _behaviour: ConnectionBehaviourBuilder,
    private readonly _connection: FConnectionBase,
    private readonly _sourceRef: IConnectorRectRef,
    private readonly _targetRef: IConnectorRectRef,
  ) {
    this._anchorRect = rectFromPoint(this._connection.line.point2);
  }

  public candidates(): IConnectorRectRef[] {
    return this._candidates;
  }

  public collectAndMarkCandidates(): void {
    this._candidates = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateTargetConnectorsToConnectRequest(
        this._source,
        this._sourceRef.rect.gravityCenter,
      ),
    );

    // Ensure current target exists (usually it already does).
    const currentTargetId = this._connection.fInputId();
    if (currentTargetId && !this._candidates.some((x) => x.connector.fId() === currentTargetId)) {
      this._candidates.push(this._targetRef);
    }

    this._mediator.execute(
      new MarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)),
    );
  }

  public setSnapConnection(snap: FSnapConnectionComponent | undefined): void {
    this._snap = snap;
    if (!snap) {
      return;
    }

    // Source is fixed, so snap-preview always starts at current source.
    snap.fOutputId.set(this._connection.fOutputId());
    snap.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const pointerRect = this._anchorRect.addPoint(difference);

    const closest = this._findClosest(pointerRect.gravityCenter);
    const targetSide = closest?.connector.fConnectableSide ?? this._target.fConnectableSide;

    this._draw(pointerRect, targetSide);

    const snap = this._snap;
    if (!snap) {
      return;
    }

    this._drawSnap(withinSnapThreshold(closest, snap));
  }

  public onPointerUp(): void {
    this._draw(this._anchorRect, this._targetRef.connector.fConnectableSide);
    this._snap?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)),
    );
  }

  private _findClosest(point: IPoint): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(point, this._candidates),
    );
  }

  private _draw(targetRect: RoundedRect, targetSide: EFConnectableSide): void {
    const line = this._behaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceRef.rect,
        targetRect,
        this._connection,
        this._source.fConnectableSide,
        targetSide,
      ),
    );

    this._connection.setLine(line);
    this._connection.redraw();
  }

  private _drawSnap(closest: IClosestConnectorRef | undefined): void {
    const snap = this._snap;
    if (!snap) {
      return;
    }

    if (!closest) {
      snap.hide();

      return;
    }

    const line: ILine = this._behaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        this._sourceRef.rect,
        closest.rect,
        snap,
        this._source.fConnectableSide,
        closest.connector.fConnectableSide,
      ),
    );

    snap.show();
    snap.setLine(line);
    snap.redraw();
  }
}
