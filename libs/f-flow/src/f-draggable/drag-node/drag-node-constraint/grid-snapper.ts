import { Signal } from '@angular/core';
import { IPoint } from '@foblex/2d';

export class GridSnapper {
  private readonly _vCellSize: number;
  private readonly _hCellSize: number;
  private readonly _snapWhileDragging: boolean;

  constructor(
    data: {
      vCellSize: Signal<number>;
      hCellSize: Signal<number>;
      fCellSizeWhileDragging: Signal<boolean>;
    },
    private readonly _pointerDown: IPoint,
  ) {
    this._vCellSize = data.vCellSize();
    this._hCellSize = data.hCellSize();
    this._snapWhileDragging = data.fCellSizeWhileDragging();
  }

  public snap(difference: IPoint, adjustCellSize: boolean): IPoint {
    const _adjustCellSize = adjustCellSize || this._snapWhileDragging;

    return this._strategies[+_adjustCellSize](difference);
  }

  private _strategies: Record<number, (difference: IPoint) => IPoint> = {
    0: this._noSnap.bind(this),
    1: this._snapWithCellSize.bind(this),
  };

  private _snapWithCellSize(difference: IPoint): IPoint {
    return {
      x:
        this._snapToGrid(this._pointerDown.x + difference.x, this._hCellSize) - this._pointerDown.x,
      y:
        this._snapToGrid(this._pointerDown.y + difference.y, this._vCellSize) - this._pointerDown.y,
    };
  }

  private _noSnap(difference: IPoint): IPoint {
    return difference;
  }

  private _snapToGrid(value: number, cellSize: number): number {
    return Math.round(value / cellSize) * cellSize;
  }
}
