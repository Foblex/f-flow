import { IRoundedRect } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { ResizeNodeConnectionHandlerBase } from './resize-node-connection-handler-base';

@Injectable()
export class ResizeNodeConnectionTargetHandler extends ResizeNodeConnectionHandlerBase {
  public override setTargetRect(rect: IRoundedRect): void {
    super.setTargetRect(rect);
    super.redraw();
  }
}
