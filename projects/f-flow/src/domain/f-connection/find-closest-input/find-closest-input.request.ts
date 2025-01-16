import { IPoint } from '@foblex/2d';
import { IConnectorWithRect } from '../get-connector-with-rect';

export class FindClosestInputRequest {

  constructor(
    public position: IPoint,
    public canBeConnectedInputs: IConnectorWithRect[],
  ) {
  }
}
