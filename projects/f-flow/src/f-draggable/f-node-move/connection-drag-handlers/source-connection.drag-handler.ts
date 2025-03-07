import { BaseConnectionDragHandler } from './base-connection.drag-handler';
import { FConnectionBase } from '../../../f-connection';
import { IPoint } from '@foblex/2d';
import { Injector } from '@angular/core';

export class SourceConnectionDragHandler extends BaseConnectionDragHandler {

  constructor(injector: Injector, fConnection: FConnectionBase) {
    super(injector, fConnection);
  }

  public override setSourceDifference(difference: IPoint) {
    super.setSourceDifference(difference);
    this.redraw();
  }
}
