import { DragNodeConnectionHandlerBase } from './drag-node-connection-handler-base';
import { IPoint } from '@foblex/2d';
import { Injectable } from '@angular/core';

@Injectable()
export class DragNodeConnectionTargetHandler extends DragNodeConnectionHandlerBase {
  public override setTargetDelta(delta: IPoint) {
    super.setTargetDelta(delta);
    this.redraw();
  }
}
