import { Injectable } from '@angular/core';
import { CalculateCommonNodeMoveRestrictionsRequest } from './calculate-common-node-move-restrictions.request';
import { IMinMaxPoint, IPoint } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { INodeWithDistanceRestrictions } from '../../i-node-with-distance-restrictions';

@Injectable()
@FExecutionRegister(CalculateCommonNodeMoveRestrictionsRequest)
export class CalculateCommonNodeMoveRestrictionsExecution
  implements IExecution<CalculateCommonNodeMoveRestrictionsRequest, IMinMaxPoint> {

  public handle(request: CalculateCommonNodeMoveRestrictionsRequest): IMinMaxPoint {
    return this._calculateCommonRestrictions(request.restrictions);
  }

  private _calculateCommonRestrictions(restrictions: INodeWithDistanceRestrictions[]): IMinMaxPoint {
    return restrictions.reduce((result: IMinMaxPoint, x) =>
      this._clampRestrictions(result, x), restrictions[0]
    );
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
}
