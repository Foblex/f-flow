import { IPoint } from '@foblex/2d';
import { FNodeOutletDirective, FNodeOutputDirective } from '../../../../../f-connectors';

export class CreateConnectionDragHandlerRequest {

  constructor(
    public onPointerDownPosition: IPoint,
    public fOutput: FNodeOutputDirective | FNodeOutletDirective
  ) {
  }
}
