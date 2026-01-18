import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { F_CONNECTION_DRAG_HANDLE_END, FConnectionDragHandleBase } from './models';

@Component({
  selector: 'circle[f-connection-drag-handle-end]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class',
  },
  providers: [
    {
      provide: F_CONNECTION_DRAG_HANDLE_END,
      useExisting: FConnectionDragHandleEnd,
    },
  ],
})
export class FConnectionDragHandleEnd extends FConnectionDragHandleBase {
  public override redraw(penultimatePoint: IPoint, endPoint: IPoint): void {
    this.point = this.calculateCircleCenter(penultimatePoint, endPoint, 8);
    this.hostElement.setAttribute('cx', this.point.x.toString());
    this.hostElement.setAttribute('cy', this.point.y.toString());
  }
}
