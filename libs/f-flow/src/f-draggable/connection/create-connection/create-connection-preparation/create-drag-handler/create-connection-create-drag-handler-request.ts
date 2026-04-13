import { IPoint } from '@foblex/2d';
import { FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';

export class CreateConnectionCreateDragHandlerRequest {
  static readonly fToken = Symbol('CreateConnectionCreateDragHandlerRequest');
  constructor(
    public readonly eventPosition: IPoint,
    public readonly source: FNodeOutputBase | FNodeOutletBase,
  ) {}
}
