import { FConnectionBase } from '../../../f-connection';
import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { IPoint } from '@foblex/2d';
import { Injector } from '@angular/core';

export class TargetConnectionDragHandler extends BaseConnectionDragHandler {

  constructor(injector: Injector, fConnection: FConnectionBase) {
    super(injector, fConnection);
  }

  public override setTargetDifference(difference: IPoint) {
    super.setTargetDifference(difference);
    this.redraw();
  }
}
