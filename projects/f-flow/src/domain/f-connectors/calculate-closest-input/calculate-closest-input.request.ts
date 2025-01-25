import { IPoint } from '@foblex/2d';
import { IConnectorAndRect } from '../index';

export class CalculateClosestInputRequest {

  constructor(
    public position: IPoint,
    public canBeConnectedInputs: IConnectorAndRect[],
  ) {
  }
}
