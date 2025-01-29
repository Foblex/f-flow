import { inject, Injectable } from '@angular/core';
import { CalculateCommonNodeMoveRestrictionsRequest } from './calculate-common-node-move-restrictions.request';
import { IMinMaxPoint, IPoint } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { INodeWithDistanceRestrictions } from '../../i-node-with-distance-restrictions';
import { FComponentsStore } from '../../../../../f-storage';

@Injectable()
@FExecutionRegister(CalculateCommonNodeMoveRestrictionsRequest)
export class CalculateCommonNodeMoveRestrictionsExecution
  implements IExecution<CalculateCommonNodeMoveRestrictionsRequest, IMinMaxPoint> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _vCellSize(): number {
    return this._fComponentsStore.fDraggable!.vCellSize;
  }

  private get _hCellSize(): number {
    return this._fComponentsStore.fDraggable!.hCellSize;
  }

  public handle(request: CalculateCommonNodeMoveRestrictionsRequest): IMinMaxPoint {
    return this._calculateCommonRestrictions(request.restrictions);
  }

  private _calculateCommonRestrictions(restrictions: INodeWithDistanceRestrictions[]): IMinMaxPoint {
    this._snapLimitToGrid(restrictions[0]);
    return restrictions.reduce((result: IMinMaxPoint, x) => {
      this._snapLimitToGrid(x);
      return this._clampRestrictions(result, x);
    }, restrictions[0]);
  }

  private _clampRestrictions(common: IMinMaxPoint, x: INodeWithDistanceRestrictions): IMinMaxPoint {
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

  private _snapLimitToGrid(restriction: INodeWithDistanceRestrictions): void {
    const { min, max, fDraggedNode } = restriction;
    const position = fDraggedNode.position;
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
