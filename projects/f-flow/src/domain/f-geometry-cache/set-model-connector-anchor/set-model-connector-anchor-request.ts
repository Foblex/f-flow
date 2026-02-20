import { IPoint } from '@foblex/2d';

export class SetModelConnectorAnchorRequest {
  static readonly fToken = Symbol('SetModelConnectorAnchorRequest');

  constructor(
    public readonly connectorId: string,
    public readonly anchorOffset: IPoint,
  ) {}
}
