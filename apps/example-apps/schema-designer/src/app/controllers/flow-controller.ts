import { Injectable, signal } from '@angular/core';
import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { FCanvasComponent, FFlowComponent, FZoomDirective } from '@foblex/flow';

interface IFlowRefs {
  flow: FFlowComponent;
  canvas: FCanvasComponent;
  zoom: FZoomDirective;
}

export interface IContextMenuTarget {
  tableId: string | null;
  columnId: string | null;
  connectionId: string | null;
}

@Injectable()
export class FlowController {
  private readonly _flow = signal<FFlowComponent | null>(null);
  private readonly _canvas = signal<FCanvasComponent | null>(null);
  private readonly _zoom = signal<FZoomDirective | null>(null);
  private readonly _contextMenuPosition = signal<IPoint>(PointExtensions.initialize(0, 0));
  private readonly _contextMenuTarget = signal<IContextMenuTarget>({
    tableId: null,
    columnId: null,
    connectionId: null,
  });

  public readonly contextMenuPosition = this._contextMenuPosition.asReadonly();
  public readonly contextMenuTarget = this._contextMenuTarget.asReadonly();

  public register(refs: IFlowRefs): void {
    this._flow.set(refs.flow);
    this._canvas.set(refs.canvas);
    this._zoom.set(refs.zoom);
  }

  public initializeViewport(): void {
    this._canvas()?.fitToScreen(new Point(140, 140), false);
  }

  public zoomIn(): void {
    this._zoom()?.zoomIn();
  }

  public zoomOut(): void {
    this._zoom()?.zoomOut();
  }

  public fitToScreen(): void {
    this._canvas()?.fitToScreen();
  }

  public resetView(): void {
    this._canvas()?.resetScaleAndCenter();
  }

  public select(nodes: string[], connections: string[]): void {
    this._flow()?.select(nodes, connections);
  }

  public clearSelection(): void {
    this._flow()?.clearSelection();
  }

  public setContextMenuPosition(position: IPoint): void {
    this._contextMenuPosition.set(position);
  }

  public setContextMenuTarget(target: IContextMenuTarget): void {
    this._contextMenuTarget.set(target);
  }

  public clearContextMenuTarget(): void {
    this._contextMenuTarget.set({
      tableId: null,
      columnId: null,
      connectionId: null,
    });
  }

  public getFlowPosition(position: IPoint): IPoint {
    const flow = this._flow();

    if (!flow) {
      return position;
    }

    return flow.getPositionInFlow(position);
  }
}
