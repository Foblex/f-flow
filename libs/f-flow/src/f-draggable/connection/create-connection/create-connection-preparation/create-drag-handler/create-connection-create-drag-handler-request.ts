import { IPoint } from '@foblex/2d';
import { FSourceConnectorBase } from '../../../../../f-connectors';

export class CreateConnectionCreateDragHandlerRequest {
  static readonly fToken = Symbol('CreateConnectionCreateDragHandlerRequest');
  constructor(
    public readonly eventPosition: IPoint,
    public readonly source: FSourceConnectorBase,
  ) {}
}
