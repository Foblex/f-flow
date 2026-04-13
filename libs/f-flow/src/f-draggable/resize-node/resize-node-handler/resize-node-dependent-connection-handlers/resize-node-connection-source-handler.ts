import { IRoundedRect } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { ResizeNodeConnectionHandlerBase } from './resize-node-connection-handler-base';

@Injectable()
export class ResizeNodeConnectionSourceHandler extends ResizeNodeConnectionHandlerBase {
  public override setSourceRect(rect: IRoundedRect): void {
    super.setSourceRect(rect);
    super.redraw();
  }
}
