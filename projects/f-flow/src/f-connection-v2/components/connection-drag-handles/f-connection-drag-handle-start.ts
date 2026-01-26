import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { F_CONNECTION_DRAG_HANDLE_START, FConnectionDragHandleBase } from './models';

@Component({
  selector: 'circle[f-connection-drag-handle-start]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class',
  },
  providers: [
    {
      provide: F_CONNECTION_DRAG_HANDLE_START,
      useExisting: FConnectionDragHandleStart,
    },
  ],
})
export class FConnectionDragHandleStart extends FConnectionDragHandleBase {
  public override redraw(penultimatePoint: IPoint, startPoint: IPoint): void {
    this.point = this.calculateCircleCenter(penultimatePoint, startPoint, 8);
    this.hostElement.setAttribute('cx', this.point.x.toString());
    this.hostElement.setAttribute('cy', this.point.y.toString());
  }
}
