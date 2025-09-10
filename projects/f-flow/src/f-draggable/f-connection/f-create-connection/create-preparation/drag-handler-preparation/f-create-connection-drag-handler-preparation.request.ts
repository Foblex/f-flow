import { IPoint } from '@foblex/2d';
import { FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';

export class FCreateConnectionDragHandlerPreparationRequest {
  static readonly fToken = Symbol('FCreateConnectionDragHandlerPreparationRequest');
  constructor(
    public onPointerDownPosition: IPoint,
    public fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
  ) {
  }
}
