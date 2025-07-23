import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, inject, signal, viewChild,
  ViewChild
} from '@angular/core';
import {FCanvasComponent, FFlowModule, FReassignConnectionEvent} from '@foblex/flow';

@Component({
  selector: 'drag-to-reassign',
  styleUrls: ['./drag-to-reassign.component.scss'],
  templateUrl: './drag-to-reassign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class DragToReassignComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly reassignableStart = signal(false);
  protected readonly connections = signal([{id: '1', source: '1', target: '3'}]);

  protected onLoaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  public reassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newTargetId && !event.newSourceId) {
      return;
    }
    this.connections.update((x) => {
      const connection = x.find((c) => c.source === event.oldSourceId && c.target === event.oldTargetId);
      if (!connection) {
        throw new Error('Connection not found');
      }
      connection.source = event.newSourceId || connection.source;
      connection.target = event.newTargetId || connection.target;
      return [...x];
    });
  }


  protected onToggleReassignStart(): void {
    this.reassignableStart.update((x) => !x);
  }
}
