import { IPoint, RectExtensions, RoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FSourceConnectorBase } from '../../../../f-connectors';
import { DragHandlerBase, FDragHandlerResult } from '../../../infrastructure';
import { ICreateConnectionEventData } from '../i-create-connection-event-data';
import { FCreateConnectionSession } from '../f-create-connection-session';

/**
 * Drag-to-connect gesture adapter: translates the drag lifecycle (threshold, move
 * deltas, pointer up) into {@link FCreateConnectionSession} calls. The session owns the
 * preview, snapping, marking and the `fCreateConnection` emission, so other gestures
 * (e.g. click-to-connect) reuse the exact same behavior.
 */
@Injectable()
export class CreateConnectionHandler extends DragHandlerBase<ICreateConnectionEventData> {
  protected readonly type = 'create-connection';
  protected readonly kind = 'create-connection';

  protected override data() {
    return { fOutputOrOutletId: this._source.fId() };
  }

  private readonly _result = inject(FDragHandlerResult);
  private readonly _session = inject(FCreateConnectionSession);

  private _source!: FSourceConnectorBase;
  private _pointerDown = new RoundedRect();

  public initialize(source: FSourceConnectorBase, pointer: IPoint): void {
    this._source = source;
    this._pointerDown = RoundedRect.fromRect(RectExtensions.initialize(pointer.x, pointer.y));
  }

  public override prepareDragSequence(): void {
    this._session.begin(this._source, this._pointerDown);

    this._result.setData({
      toConnectorRect: this._pointerDown,
      canBeConnectedInputs: this._session.connectableTargets,
      fOutputId: this._source.fId(),
    });
  }

  public override onPointerMove(difference: IPoint): void {
    this._session.update(this._pointerDown.addPoint(difference));
  }

  public override onPointerUp(): void {
    this._session.cancel();
  }
}
