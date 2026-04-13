import { Injectable, signal } from '@angular/core';
import { PointExtensions } from '@foblex/2d';
import { FCanvasComponent, FFlowComponent, FZoomDirective } from '@foblex/flow';

@Injectable()
export class BracketController {
  private _flow: FFlowComponent | undefined;
  private _canvas: FCanvasComponent | undefined;
  private _zoom: FZoomDirective | undefined;

  private readonly _scale = signal<number>(1);

  public readonly scale = this._scale.asReadonly();

  public initialize(flow: FFlowComponent, canvas: FCanvasComponent, zoom: FZoomDirective): void {
    this._flow = flow;
    this._canvas = canvas;
    this._zoom = zoom;
  }

  public fitToScreen(): void {
    this._canvas?.fitToScreen(PointExtensions.initialize(80, 80), true);
    this._updateScale();
  }

  public zoomIn(): void {
    this._zoom?.zoomIn();
    this._updateScale();
  }

  public zoomOut(): void {
    this._zoom?.zoomOut();
    this._updateScale();
  }

  public resetZoom(): void {
    this._canvas?.resetScaleAndCenter(true);
    this._updateScale();
  }

  public redraw(): void {
    this._flow?.redraw();
  }

  private _updateScale(): void {
    const state = this._flow?.getState();

    if (state) {
      this._scale.set(state.scale);
    }
  }
}
