import { IPoint } from '@foblex/2d';
import { FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';

export class CreateConnectionDragHandlerPreparationRequest {

  constructor(
    public onPointerDownPosition: IPoint,
    public fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase
  ) {
  }
}
