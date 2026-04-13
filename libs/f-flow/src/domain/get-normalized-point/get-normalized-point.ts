import { IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { GetNormalizedPointRequest } from './get-normalized-point-request';
import { FComponentsStore } from '../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { calculatePointerInFlow } from '../../utils';

/**
 * Execution that retrieves the normalized point of a position.
 * It calculates the point based on the position's transformation
 * and the canvas transformation.
 */
@Injectable()
@FExecutionRegister(GetNormalizedPointRequest)
export class GetNormalizedPoint implements IExecution<GetNormalizedPointRequest, IPoint> {
  private readonly _store = inject(FComponentsStore);

  public handle({ position }: GetNormalizedPointRequest): IPoint {
    return calculatePointerInFlow(position, this._store.flowHost, this._store.transform);
  }
}
