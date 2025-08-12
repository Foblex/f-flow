import { inject, Injectable } from '@angular/core';
import { CalculateCommonNodeMoveLimitsRequest } from './calculate-common-node-move-limits.request';
import { IPoint } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { INodeMoveLimitsAndPosition } from '../../i-node-move-limits-and-position';
import { INodeMoveLimits } from '../../i-node-move-limits';

@Injectable()
@FExecutionRegister(CalculateCommonNodeMoveLimitsRequest)
export class CalculateCommonNodeMoveLimitsExecution
  implements IExecution<CalculateCommonNodeMoveLimitsRequest, INodeMoveLimits> {

  private readonly _store = inject(FComponentsStore);

  private get _vCellSize(): number {
    return this._store.fDraggable!.vCellSize;
  }

  private get _hCellSize(): number {
    return this._store.fDraggable!.hCellSize;
  }

  public handle(request: CalculateCommonNodeMoveLimitsRequest): INodeMoveLimits {
    return this._calculateCommonLimits(request.limits);
  }

  private _calculateCommonLimits(limits: INodeMoveLimitsAndPosition[]): INodeMoveLimits {
    this._snapLimitToGrid(limits[0]);
    return limits.reduce((result: INodeMoveLimits, x) => {
      this._snapLimitToGrid(x);
      return this._clampRestrictions(result, x);
    }, limits[0]);
  }

  private _clampRestrictions(common: INodeMoveLimits, x: INodeMoveLimitsAndPosition): INodeMoveLimits {
    common.min = this._clampMinRestrictions(common.min, x.min);
    common.max = this._clampMaxRestrictions(common.max, x.max);
    return common;
  }

  private _clampMinRestrictions(common: IPoint, node: IPoint): IPoint {
    return {
      x: Math.max(common.x, node.x),
      y: Math.max(common.y, node.y),
    }
  }

  private _clampMaxRestrictions(common: IPoint, node: IPoint): IPoint {
    return {
      x: Math.min(common.x, node.x),
      y: Math.min(common.y, node.y),
    }
  }

  private _snapLimitToGrid(restriction: INodeMoveLimitsAndPosition): void {
    const { min, max, position } = restriction;
    restriction.min = {
      x: this._snapLimitToGridMinimum(position.x + min.x, this._hCellSize) - position.x,
      y: this._snapLimitToGridMinimum(position.y + min.y, this._vCellSize) - position.y,
    };
    restriction.max = {
      x: this._snapLimitToGridMaximum(position.x + max.x, this._hCellSize) - position.x,
      y: this._snapLimitToGridMaximum(position.y + max.y, this._vCellSize) - position.y,
    };
  }

  private _snapLimitToGridMinimum(value: number, cellSize: number): number {
    return Math.ceil(value / cellSize) * cellSize;
  }

  private _snapLimitToGridMaximum(value: number, cellSize: number): number {
    return Math.floor(value / cellSize) * cellSize;
  }
}
