import { FNodeInputBase } from '../../../f-connectors';
import { IPoint } from '@foblex/2d';

export class GetAllCanBeConnectedSourceConnectorsAndRectsRequest {
  static readonly fToken = Symbol('GetAllCanBeConnectedSourceConnectorsAndRectsRequest');

  constructor(
    public readonly targetConnector: FNodeInputBase,
    public readonly pointerPosition: IPoint,
  ) {}
}
