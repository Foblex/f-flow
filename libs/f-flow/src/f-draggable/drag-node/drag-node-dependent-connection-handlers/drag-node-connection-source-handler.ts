import { DragNodeConnectionHandlerBase } from './drag-node-connection-handler-base';
import { IPoint } from '@foblex/2d';
import { Injectable } from '@angular/core';

@Injectable()
export class DragNodeConnectionSourceHandler extends DragNodeConnectionHandlerBase {
  public override setSourceDelta(delta: IPoint) {
    super.setSourceDelta(delta);
    super.redraw();
  }
}
