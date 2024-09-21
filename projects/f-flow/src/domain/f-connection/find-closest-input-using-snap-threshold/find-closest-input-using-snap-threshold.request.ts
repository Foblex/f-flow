import { IPoint } from '@foblex/2d';
import { IConnectorWithRect } from '../get-connector-with-rect';

export class FindClosestInputUsingSnapThresholdRequest {

  constructor(
    public position: IPoint,
    public canBeConnectedInputs: IConnectorWithRect[],
    public snapThreshold: number
  ) {
  }
}
