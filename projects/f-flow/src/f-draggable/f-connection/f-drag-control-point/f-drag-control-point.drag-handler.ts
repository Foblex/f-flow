import { IPoint, PointExtensions } from '@foblex/2d';
import { IFDragHandler } from '../../f-drag-handler';
import { FConnectionBase } from '../../../f-connection';
import { Injector } from '@angular/core';
import { FComponentsStore } from '../../../f-storage';
import { FDragHandlerResult } from '../../f-drag-handler';

export class FDragControlPointDragHandler implements IFDragHandler {
  public fEventType = 'drag-control-point';
  public fData: unknown;

  private readonly _result: FDragHandlerResult<unknown>;
  private readonly _store: FComponentsStore;
  private readonly _startPosition: IPoint;

  constructor(
    private readonly _injector: Injector,
    private readonly _connection: FConnectionBase,
    private readonly _controlPointIndex: number,
  ) {
    this._result = _injector.get(FDragHandlerResult);
    this._store = _injector.get(FComponentsStore);

    this.fData = {
      fConnectionId: this._connection.fId(),
      controlPointIndex: this._controlPointIndex,
    };

    // Store the initial position of the control point
    this._startPosition = { ...this._connection.fControlPoints[this._controlPointIndex] };
  }

  public prepareDragSequence(): void {
    // Mark the connection as being edited
    this._connection.hostElement.classList.add('control-point-dragging');
  }

  public onPointerMove(difference: IPoint): void {
    // Calculate the new position based on the difference
    const newPosition = PointExtensions.sum(this._startPosition, difference);

    // Update the control point in place
    this._connection.fControlPoints[this._controlPointIndex] = newPosition;

    // Trigger a redraw of the connection
    this._store.fCanvas?.redraw();
  }

  public onPointerUp(): void {
    // Remove the dragging class
    this._connection.hostElement.classList.remove('control-point-dragging');

    // Emit the connection change event if needed
    this._store.fCanvas?.emitCanvasChangeEvent();
  }
}
