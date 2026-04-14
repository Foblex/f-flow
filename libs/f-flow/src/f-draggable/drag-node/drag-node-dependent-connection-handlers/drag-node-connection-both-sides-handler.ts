import { DragNodeConnectionHandlerBase } from './drag-node-connection-handler-base';
import { IPoint } from '@foblex/2d';
import { Injectable } from '@angular/core';

@Injectable()
export class DragNodeConnectionBothSidesHandler extends DragNodeConnectionHandlerBase {
  private _sourceUpdated = false;
  private _targetUpdated = false;

  public override setSourceDelta(delta: IPoint) {
    super.setSourceDelta(delta);
    this._sourceUpdated = true;
    this._redrawIfReady();
  }

  public override setTargetDelta(delta: IPoint) {
    super.setTargetDelta(delta);
    this._targetUpdated = true;
    this._redrawIfReady();
  }

  private _redrawIfReady() {
    if (!this._sourceUpdated || !this._targetUpdated) {
      return;
    }

    this._sourceUpdated = false;
    this._targetUpdated = false;

    this.redraw();
  }
}
