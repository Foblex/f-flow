import { IInputWithRect } from '../get-all-can-be-connected-input-positions';
import { IPoint } from '@foblex/2d';

export class FindClosestInputUsingSnapThresholdRequest {

  constructor(
    public position: IPoint,
    public canBeConnectedInputs: IInputWithRect[],
    public snapThreshold: number
  ) {
  }
}
