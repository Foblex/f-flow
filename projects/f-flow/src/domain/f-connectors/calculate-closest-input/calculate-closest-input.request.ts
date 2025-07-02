import { IPoint } from '@foblex/2d';
import { IConnectorAndRect } from '../index';

export class CalculateClosestInputRequest {
  static readonly fToken = Symbol('CalculateClosestInputRequest');
  constructor(
    public position: IPoint,
    public canBeConnectedInputs: IConnectorAndRect[],
  ) {
  }
}
