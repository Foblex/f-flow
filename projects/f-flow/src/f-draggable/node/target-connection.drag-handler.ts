import { FConnectionBase } from '../../f-connection';
import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { IPoint } from '@foblex/2d';

export class TargetConnectionDragHandler extends BaseConnectionDragHandler {

  constructor(fConnection: FConnectionBase) {
    super(fConnection);
  }

  public override setTargetDifference(difference: IPoint) {
    super.setTargetDifference(difference);
    this.redraw();
  }
}
