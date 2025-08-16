import {IPoint} from '@foblex/2d';
import {SnapToGrid} from "./snap-to-grid";
import {Injector} from "@angular/core";
import {IDragLimits} from "./create-drag-model-from-selection";
import {ILimitResult, LimitBounds} from "./limit-bounds";

export interface IHardSoftLimiterResult {
  softResult: ILimitResult[];
  hard: IPoint;
}

export class HardSoftLimiter {

  private readonly _snapToGrid: SnapToGrid;

  private readonly _hardLimiter: LimitBounds;
  private readonly _softLimiters: LimitBounds[] = [];

  constructor(
    _injector: Injector,
    _onPointerDownPosition: IPoint,
    _limits: IDragLimits
  ) {
    this._snapToGrid = new SnapToGrid(_injector, _onPointerDownPosition);
    this._hardLimiter = new LimitBounds(_limits.hard);
    this._initializeSoftLimiters(_limits);
  }

  private _initializeSoftLimiters(limits: IDragLimits): void {
    for (const softLimits of limits.soft) {
      this._softLimiters.push(new LimitBounds(softLimits.limits));
    }
  }

  public limit(difference: IPoint): IHardSoftLimiterResult {
    const snappedDifference = this._snapToGrid.snap(difference);

    const hardDifference = this._hardLimiter.limit(snappedDifference).value;

    return {
      softResult: this._softLimiters.map((x) => x.limit(hardDifference)),
      hard: hardDifference
    }
  }
}

