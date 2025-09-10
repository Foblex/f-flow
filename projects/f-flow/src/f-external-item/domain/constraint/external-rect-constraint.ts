import { IMinMaxPoint, IPoint } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FComponentsStore } from "../../../f-storage";

export class ExternalRectConstraint {

  private readonly _vCellSize: number;
  private readonly _hCellSize: number;
  private readonly _adjustCellSize: boolean;

  constructor(
    injector: Injector,
    private _onPointerDown: IPoint,
    private readonly _limit: IMinMaxPoint,
  ) {
    const store = injector.get(FComponentsStore);
    this._vCellSize = store.fDraggable!.vCellSize();
    this._hCellSize = store.fDraggable!.hCellSize();
    this._adjustCellSize = store.fDraggable!.fCellSizeWhileDragging();
  }

  public limit(difference: IPoint): IPoint {
    const { min, max } = this._limit;

    const { x, y } = this._cellSizeStrategies[ +this._adjustCellSize ](difference);

    return {
      x: this._clamp(x, min.x, max.x),
      y: this._clamp(y, min.y, max.y),
    };
  }

  private _cellSizeStrategies: Record<number, (difference: IPoint) => IPoint> = {
    0: this._skipCellSize.bind(this),
    1: this._applyCellSize.bind(this),
  };

  private _applyCellSize(difference: IPoint): IPoint {
    return {
      x: this._snapToGrid(this._onPointerDown.x + difference.x, this._hCellSize) - this._onPointerDown.x,
      y: this._snapToGrid(this._onPointerDown.y + difference.y, this._vCellSize) - this._onPointerDown.y,
    };
  }

  private _skipCellSize(difference: IPoint): IPoint {
    return difference;
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private _snapToGrid(value: number, cellSize: number): number {
    return Math.round(value / cellSize) * cellSize;
  }
}
