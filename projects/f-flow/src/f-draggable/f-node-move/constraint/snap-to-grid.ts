import { Injector } from "@angular/core";
import { FComponentsStore } from "../../../f-storage";
import { IPoint } from "@foblex/2d";

export class SnapToGrid {

  private readonly _store: FComponentsStore;

  private readonly _vCellSize: number;
  private readonly _hCellSize: number;
  private readonly _adjustCellSize: boolean;

  constructor(
    _injector: Injector,
    private _onPointerDown: IPoint,
  ) {
    this._store = _injector.get(FComponentsStore);
    this._vCellSize = this._store.fDraggable!.vCellSize();
    this._hCellSize = this._store.fDraggable!.hCellSize();
    this._adjustCellSize = this._store.fDraggable!.fCellSizeWhileDragging();
  }

  public snap(difference: IPoint, adjustCellSize: boolean): IPoint {
    const _adjustCellSize = adjustCellSize || this._adjustCellSize;

    return this._cellSizeStrategies[+_adjustCellSize](difference);
  }

  private _cellSizeStrategies: Record<number, (difference: IPoint) => IPoint> = {
    0: this._noSnap.bind(this),
    1: this._snapWithCellSize.bind(this),
  };

  private _snapWithCellSize(difference: IPoint): IPoint {
    return {
      x: this._snapToGrid(this._onPointerDown.x + difference.x, this._hCellSize) - this._onPointerDown.x,
      y: this._snapToGrid(this._onPointerDown.y + difference.y, this._vCellSize) - this._onPointerDown.y,
    };
  }

  private _noSnap(difference: IPoint): IPoint {
    return difference;
  }

  private _snapToGrid(value: number, cellSize: number): number {
    return Math.round(value / cellSize) * cellSize;
  }
}
