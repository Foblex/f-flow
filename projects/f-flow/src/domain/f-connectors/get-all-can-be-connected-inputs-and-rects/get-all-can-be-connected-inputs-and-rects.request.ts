import { FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class GetAllCanBeConnectedInputsAndRectsRequest {
  static readonly fToken = Symbol('GetAllCanBeConnectedInputsAndRectsRequest');
  constructor(
    public readonly sourceConnector: FNodeOutputBase | FNodeOutletBase,
    public readonly pointerPosition: IPoint,
  ) {}
}
