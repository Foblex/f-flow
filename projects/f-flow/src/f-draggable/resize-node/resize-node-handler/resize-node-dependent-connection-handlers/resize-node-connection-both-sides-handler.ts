import { IRoundedRect } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { ResizeNodeConnectionHandlerBase } from './resize-node-connection-handler-base';

@Injectable()
export class ResizeNodeConnectionBothSidesHandler extends ResizeNodeConnectionHandlerBase {
  private _sourceUpdated = false;
  private _targetUpdated = false;

  public override setSourceRect(rect: IRoundedRect): void {
    super.setSourceRect(rect);
    this._sourceUpdated = true;
    this._redrawIfReady();
  }

  public override setTargetRect(rect: IRoundedRect): void {
    super.setTargetRect(rect);
    this._targetUpdated = true;
    this._redrawIfReady();
  }

  private _redrawIfReady(): void {
    if (!this._sourceUpdated || !this._targetUpdated) {
      return;
    }

    this._sourceUpdated = false;
    this._targetUpdated = false;

    super.redraw();
  }
}
