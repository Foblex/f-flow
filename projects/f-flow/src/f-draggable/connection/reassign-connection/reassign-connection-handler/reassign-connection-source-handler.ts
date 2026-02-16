import { FMediator } from '@foblex/mediator';
import {
  CalculateClosestConnectorRequest,
  CalculateSourceConnectorsToConnectRequest,
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

export class ReassignConnectionSourceHandler implements IReassignHandler {
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
    this._anchorRect = rectFromPoint(this._connection.line.point1);
  }

  public candidates(): IConnectorRectRef[] {
    return this._candidates;
  }

  public collectAndMarkCandidates(): void {
    this._candidates = this._mediator.execute<IConnectorRectRef[]>(
      new CalculateSourceConnectorsToConnectRequest(
        this._target,
        this._targetRef.rect.gravityCenter,
      ),
    );

    // Ensure current source is always available as a fallback.
    if (!this._candidates.some((x) => x.connector.fId() === this._source.fId())) {
      this._candidates.push(this._sourceRef);
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

    // Target is fixed, so snap-preview always ends at current target.
    snap.fInputId.set(this._connection.fInputId());
    snap.initialize();
  }

  public onPointerMove(difference: IPoint): void {
    const pointerRect = this._anchorRect.addPoint(difference);

    const closest = this._findClosest(pointerRect.gravityCenter);
    const sourceSide = closest?.connector.fConnectableSide ?? this._source.fConnectableSide;

    this._draw(pointerRect, sourceSide);

    const snap = this._snap;
    if (!snap) {
      return;
    }

    this._drawSnap(withinSnapThreshold(closest, snap));
  }

  private _findClosest(point: IPoint): IClosestConnectorRef | undefined {
    return this._mediator.execute<IClosestConnectorRef | undefined>(
      new CalculateClosestConnectorRequest(point, this._candidates),
    );
  }

  private _draw(sourceRect: RoundedRect, sourceSide: EFConnectableSide): void {
    const line = this._behaviour.handle(
      new ConnectionBehaviourBuilderRequest(
        sourceRect,
        this._targetRef.rect,
        this._connection,
        sourceSide,
        this._targetRef.connector.fConnectableSide,
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
        closest.rect,
        this._targetRef.rect,
        snap,
        closest.connector.fConnectableSide,
        this._target.fConnectableSide,
      ),
    );

    snap.show();
    snap.setLine(line);
    snap.redraw();
  }

  public onPointerUp(): void {
    this._draw(this._anchorRect, this._sourceRef.connector.fConnectableSide);
    this._snap?.hide();

    this._mediator.execute(
      new UnmarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)),
    );
  }
}
