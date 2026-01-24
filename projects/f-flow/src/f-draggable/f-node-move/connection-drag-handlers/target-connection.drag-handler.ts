import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { IPoint } from '@foblex/2d';
import { Injector } from '@angular/core';
import { FConnectionBase } from '../../../f-connection-v2';

export class TargetConnectionDragHandler extends BaseConnectionDragHandler {
  constructor(injector: Injector, fConnection: FConnectionBase) {
    super(injector, fConnection);
  }

  public override setTargetDifference(difference: IPoint) {
    super.setTargetDifference(difference);
    this.redraw();
  }
}
