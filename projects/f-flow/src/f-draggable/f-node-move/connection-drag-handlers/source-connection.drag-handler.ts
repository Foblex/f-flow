import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { FConnectionBase } from '../../../f-connection';
import { IPoint } from '@foblex/2d';

export class SourceConnectionDragHandler extends BaseConnectionDragHandler {

  constructor(fConnection: FConnectionBase) {
    super(fConnection);
  }

  public override setSourceDifference(difference: IPoint) {
    super.setSourceDifference(difference);
    this.redraw();
  }
}
